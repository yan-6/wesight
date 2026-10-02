import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useEffect, useId, useRef, useState } from 'react';

import type { CatalogModel } from '../../../shared/models/catalog';
import { i18nService } from '../../services/i18n';
import { ModelCatalogList } from './ModelCatalogList';

export function ModelCatalogSelect({ models, value, onChange }: { models: readonly CatalogModel[]; value: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const listId = useId();
  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return <div ref={container} className="relative min-w-0 flex-1" onKeyDown={event => {
    if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); button.current?.focus(); }
  }}>
    <button ref={button} type="button" disabled={!models.length} aria-expanded={open} aria-controls={listId}
      aria-label={i18nService.t('modelCatalogDefault')} onClick={() => setOpen(previous => !previous)}
      className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-left text-xs text-foreground hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-50">
      <span className="truncate">{models.find(model => model.id === value)?.name || value || i18nService.t('modelCatalogSelect')}</span>
      <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 text-secondary" />
    </button>
    {open && <div id={listId} className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-border bg-surface p-2 shadow-popover">
      <ModelCatalogList models={models} renderModel={model => <button key={model.id} type="button" onClick={() => { onChange(model.id); setOpen(false); button.current?.focus(); }}
        aria-pressed={model.id === value} className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs hover:bg-surface-hover ${model.id === value ? 'bg-primary-muted text-primary' : 'text-foreground'}`}>
        <span className="min-w-0"><span className="block truncate">{model.name}</span><span className="mt-0.5 block truncate text-[10px] text-secondary">{model.id}</span></span>
        {model.id === value && <CheckIcon className="h-4 w-4 shrink-0 text-primary" />}
      </button>} />
    </div>}
  </div>;
}
