import { ref } from "vue"

// composables/usePrint.ts
export function usePrint() {
  const printArea = ref<HTMLElement | null>(null)

  const print = (): void => {
    if (!printArea.value) return

    const original = document.body.innerHTML
    document.body.innerHTML = printArea.value.outerHTML

    window.print()

    // Restore and force Vue to re-mount
    document.body.innerHTML = original
    window.location.reload() // or use a more graceful restore
  }

  return { printArea, print }
}
