export interface BreadcrumbsProps { items: { label: string; href?: string }[]; tone?: 'default' | 'muted'; }
// Last item is the current page (aria-current="page"). Below 640px with 3+ items → single "← Parent" link.
