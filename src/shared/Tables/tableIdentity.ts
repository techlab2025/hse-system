import type { App, ObjectDirective } from 'vue'
import { i18n } from '@/localization/i18n'

/** Header spans describe columns; body row counts and API pagination do not. */
export const tableColumnCount = (table: HTMLTableElement): number => {
  const rows = table.tHead?.rows.length
    ? Array.from(table.tHead.rows)
    : Array.from(table.rows).slice(0, 1)
  return Math.max(
    1,
    ...rows.map((row) => Array.from(row.cells).reduce((sum, cell) => sum + cell.colSpan, 0)),
  )
}

const styleTable = (table: HTMLTableElement) => {
  const columns = tableColumnCount(table)
  const width = `${Math.max(360, columns * 110)}px`
  if (table.style.getPropertyValue('--hse-table-min-width') !== width) {
    table.style.setProperty('--hse-table-min-width', width)
  }
  const firstHeader = table.tHead?.rows[0]?.cells[0]
  table.toggleAttribute(
    'data-hse-index-column',
    firstHeader?.textContent?.trim() === '#' && firstHeader.colSpan === 1,
  )
  table.toggleAttribute(
    'data-hse-actions-column',
    !!table.querySelector('tbody > tr > td:last-child .list-trigger'),
  )
  const scroll = table.parentElement
  if (!scroll?.classList.contains('hse-table-scroll')) return
  // The original table and Vue-owned nodes stay in place. Never move DOM nodes.
  if (!scroll.hasAttribute('tabindex')) scroll.tabIndex = 0
  if (!scroll.hasAttribute('role')) scroll.setAttribute('role', 'region')
  if (!scroll.hasAttribute('aria-label') || scroll.dataset.hseTableLabel === 'auto') {
    const label =
      table.getAttribute('aria-label') ||
      table.caption?.textContent?.trim() ||
      table
        .closest('.hse-register-page')
        ?.querySelector('.hse-register-title')
        ?.textContent?.trim() ||
      (i18n.global.locale.value === 'ar' ? 'جدول البيانات' : 'Data table')
    scroll.setAttribute('aria-label', label)
    scroll.dataset.hseTableLabel = 'auto'
  }
}

export const vTableIdentity: ObjectDirective<HTMLTableElement> = {
  mounted: styleTable,
  updated: styleTable,
}

export const installTableIdentity = (app: App) => app.directive('table-identity', vTableIdentity)
