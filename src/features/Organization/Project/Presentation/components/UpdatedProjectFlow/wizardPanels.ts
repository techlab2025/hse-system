import type { Directive } from 'vue'
const observers = new WeakMap<HTMLElement, MutationObserver>()
/** Only panels linked to controls owned by this wizard receive its typography. */
export const vWizardPanels: Directive<HTMLElement> = {
  mounted(root) {
    const sync = () => {
      root.querySelectorAll('[aria-controls], [aria-describedby]').forEach((control) => {
        const ids = `${control.getAttribute('aria-controls') ?? ''} ${control.getAttribute('aria-describedby') ?? ''}`
        ids
          .split(/\s+/)
          .filter(Boolean)
          .forEach((id) => {
            const panel = document.getElementById(id)
            if (panel && !root.contains(panel)) {
              panel.classList.add('hse-wizard-overlay')
              panel.dir = getComputedStyle(root).direction
            }
          })
      })
    }
    const observer = new MutationObserver(sync)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-controls', 'aria-describedby'],
    })
    observers.set(root, observer)
    sync()
  },
  unmounted(root) {
    observers.get(root)?.disconnect()
    observers.delete(root)
  },
}
