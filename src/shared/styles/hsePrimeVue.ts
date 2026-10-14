import type { DatePickerPassThroughOptions } from 'primevue/datepicker'

/** Keep date/time/inline calendars on the same identity, including body portals. */
export const hseDatePickerPt: DatePickerPassThroughOptions = {
  root: { class: 'hse-identity hse-date-picker' },
  pcInputText: { root: { class: 'hse-control hse-date-input' } },
  panel: () => ({
    class: 'hse-identity hse-calendar',
    dir: document.documentElement.dir || 'ltr',
  }),
}
