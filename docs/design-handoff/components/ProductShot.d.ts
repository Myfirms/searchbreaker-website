export interface ProductShotProps {
  state: 'live' | 'preview' | 'concept' | 'illustrative';
  src?: string;                    // real capture only; omitted → labeled slot
  alt: string;                     // describe what the screen shows
  label?: string;                  // frame title, e.g. "Application pipeline"
  caption?: string;
  aspect?: string;                 // CSS aspect-ratio, default "16 / 10"
  stateNote?: string;              // override automatic state note ('' to hide; not allowed for concept/illustrative)
}
// live = solid frame, no note. concept/preview = note under frame. illustrative = dashed frame + "Illustrative data".
