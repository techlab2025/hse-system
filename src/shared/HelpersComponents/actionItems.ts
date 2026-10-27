import en from '@/locales/en.json'
import ar from '@/locales/ar.json'

/** Explicit metadata is preferred. Recognize legacy action labels independent of active locale. */
export const isDeleteAction = (action: { text: string; isDelete?: boolean }) =>
  action.isDelete ?? ['delete', en.delete, ar.delete].includes(action.text)
