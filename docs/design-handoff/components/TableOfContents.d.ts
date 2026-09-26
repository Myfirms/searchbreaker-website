export interface TableOfContentsProps { items: { id: string; label: string }[]; title?: string; variant: 'sidebar' | 'collapsible'; }
// Usually rendered by ArticleBody. Sidebar is sticky ≥900px; collapsible <details> below. Tracks the active section with IntersectionObserver (aria-current="location").
