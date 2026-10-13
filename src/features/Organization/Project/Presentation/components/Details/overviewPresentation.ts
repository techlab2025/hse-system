import type { InjectionKey } from 'vue'
/** Presentation opt-in: dialogs reused by other Project routes keep their existing styles. */
export const overviewPresentationKey: InjectionKey<boolean> = Symbol(
  'project-overview-presentation',
)
