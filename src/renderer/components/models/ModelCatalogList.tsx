import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useId, useState } from 'react';

import { type CatalogModel, groupModelsByVendor } from '../../../shared/models/catalog';
import { MODEL_VENDOR_LABELS, ModelVendor } from '../../../shared/models/constants';
import { i18nService } from '../../services/i18n';
import { ModelVendorIcon } from './ModelVendorIcon';

interface Props<T extends CatalogModel> {
  models: readonly T[];
  renderModel: (model: T) => React.ReactNode;
  groupByVendor?: boolean;
  className?: string;
}

export function ModelCatalogList<T extends CatalogModel>({ models, renderModel, groupByVendor = true, className = 'max-h-72' }: Props<T>) {
  const searchId = useId();
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Set<ModelVendor>>(() => new Set());
  const groups = groupModelsByVendor(models, query);
  return (
    <div className="flex min-h-0 flex-col gap-2">
      <div className="relative shrink-0">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-secondary" />
        <input id={searchId} type="search" value={query} onChange={event => setQuery(event.target.value)}
          aria-label={i18nService.t('modelCatalogSearch')} placeholder={i18nService.t('modelCatalogSearch')}
          className="w-full rounded-xl border border-border bg-surface py-2 pl-8 pr-2 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
      </div>
      <div className={`min-h-0 space-y-2 overflow-y-auto overscroll-contain ${className}`}>
        {groups.length === 0 && <p role="status" className="px-3 py-5 text-center text-xs text-secondary">{i18nService.t(models.length ? 'modelCatalogNoResults' : 'noModelsAvailable')}</p>}
        {groupByVendor ? groups.map(group => {
          const expanded = !!query.trim() || !collapsed.has(group.vendor);
          return <div key={group.vendor} className="overflow-hidden rounded-xl border border-border bg-surface">
            <button type="button" aria-expanded={expanded} onClick={() => setCollapsed(previous => {
              const next = new Set(previous);
              if (next.has(group.vendor)) next.delete(group.vendor); else next.add(group.vendor);
              return next;
            })} className="flex w-full items-center gap-2 bg-surface-raised/60 px-2.5 py-2 text-left text-xs font-medium text-foreground hover:bg-surface-hover">
              <ChevronDownIcon className={`h-3.5 w-3.5 shrink-0 transition-transform ${expanded ? '' : '-rotate-90'}`} />
              <ModelVendorIcon vendor={group.vendor} />
              <span className="min-w-0 flex-1 truncate">{group.vendor === ModelVendor.Other ? i18nService.t('modelCatalogOther') : MODEL_VENDOR_LABELS[group.vendor]}</span>
              <span className="rounded-md bg-surface px-1.5 text-[10px] text-secondary">{group.models.length}</span>
            </button>
            {expanded && <div className="divide-y divide-border">{group.models.map(renderModel)}</div>}
          </div>;
        }) : models.filter(model => !query.trim() || `${model.name} ${model.id}`.toLowerCase().includes(query.trim().toLowerCase())).map(renderModel)}
      </div>
    </div>
  );
}
