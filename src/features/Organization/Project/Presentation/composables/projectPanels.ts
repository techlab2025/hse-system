import type { ObjectDirective } from 'vue'
import '../../styles/project.css'

/* Shared selects do not expose PrimeVue PT. Follow only aria-linked panels from
 * feature-owned controls; no global PrimeVue configuration or style mutation. */
const roots = new Set<HTMLElement>()
const ownedPanels = new Map<HTMLElement, HTMLElement>()
let observer: MutationObserver | undefined
let frame = 0
function syncPanels() {
  frame = 0
  for (const root of roots) {
    if (!root.isConnected) continue
    for (const control of root.querySelectorAll('[aria-controls], [aria-describedby]')) {
      const ids =
        `${control.getAttribute('aria-controls') ?? ''} ${control.getAttribute('aria-describedby') ?? ''}`
          .trim()
          .split(/\s+/)
      for (const id of ids) {
        const node = document.getElementById(id)
        const panel = node?.closest<HTMLElement>(
          '.p-select-overlay, .p-multiselect-overlay, .p-datepicker-panel, .p-popover, .p-tooltip, .field-help__tooltip',
        )
        if (!panel || root.contains(panel) || ownedPanels.has(panel)) continue
        panel.classList.add('hse-project-overlay')
        if (control.closest('.hse-project-planning')) panel.classList.add('hse-project-planning')
        if (control.closest('.hse-project-assurance')) panel.classList.add('hse-project-assurance')
        panel.dir = getComputedStyle(root).direction
        ownedPanels.set(panel, root)
      }
    }
  }
  for (const [panel, root] of ownedPanels) {
    if (!panel.isConnected) ownedPanels.delete(panel)
    else if (!root.isConnected) {
      panel.classList.remove('hse-project-overlay', 'hse-project-planning', 'hse-project-assurance')
      panel.removeAttribute('dir')
      ownedPanels.delete(panel)
    }
  }
}
function scheduleSync() {
  if (!frame) frame = requestAnimationFrame(syncPanels)
}
export const vProjectPanels: ObjectDirective<HTMLElement> = {
  mounted(root) {
    roots.add(root)
    if (!observer) {
      observer = new MutationObserver(scheduleSync)
      observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['aria-controls', 'aria-describedby'],
      })
    }
    scheduleSync()
  },
  unmounted(root) {
    roots.delete(root)
    scheduleSync()
    if (!roots.size) {
      observer?.disconnect()
      observer = undefined
    }
  },
}
