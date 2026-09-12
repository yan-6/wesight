import fs from 'fs';

// Strips // line comments, /* */ block comments, and trailing commas from JSONC text.
// Implemented as a single-pass scanner rather than a regex so that comment-like
// sequences inside string values (e.g. "https://api.example.com") are preserved.
export const stripJsonComments = (input: string): string => {
  let out = '';
  let inString = false;
  let escaped = false;
  let i = 0;

  while (i < input.length) {
    const char = input[i];
    const next = input[i + 1];

    if (inString) {
      out += char;
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      i += 1;
      continue;
    }

    if (char === '"') {
      inString = true;
      out += char;
      i += 1;
      continue;
    }

    if (char === '/' && next === '/') {
      while (i < input.length && input[i] !== '\n') i += 1;
      continue;
    }

    if (char === '/' && next === '*') {
      i += 2;
      while (i < input.length && !(input[i] === '*' && input[i + 1] === '/')) i += 1;
      i += 2;
      continue;
    }

    out += char;
    i += 1;
  }

  // Remove trailing commas before } or ], which JSONC permits but JSON.parse rejects.
  return out.replace(/,(\s*[}\]])/g, '$1');
};

// Parses JSON text, tolerating JSONC comments and trailing commas when the source
// file uses the .jsonc extension. Returns null for anything that is not a plain object.
export const parseJsonObjectText = (raw: string, filePath?: string): Record<string, unknown> | null => {
  try {
    const text = filePath?.endsWith('.jsonc') ? stripJsonComments(raw) : raw;
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
};

// Reads a JSON or JSONC file into a plain object, or null when missing/unparsable.
export const readJsonOrJsoncObject = (filePath: string): Record<string, unknown> | null => {
  try {
    if (!fs.existsSync(filePath)) return null;
    return parseJsonObjectText(fs.readFileSync(filePath, 'utf8'), filePath);
  } catch {
    return null;
  }
};
