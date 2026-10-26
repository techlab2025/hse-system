import { onScopeDispose } from 'vue'

const EDGE_SIZE = 96
const MAX_SPEED = 1100 // Pixels per second when the pointer reaches an edge.

export function useDragAutoScroll() {
  let active = false
  let pointerY: number | null = null
  let frame: number | undefined
  let previousTime: number | undefined
  let containers: HTMLElement[] = []
  let manualScrollUntil = 0
  const expectedPositions = new WeakMap<HTMLElement, number>()

  function pause() {
    if (frame !== undefined) cancelAnimationFrame(frame)
    frame = undefined
    pointerY = null
    previousTime = undefined
  }

  function stop() {
    active = false
    pause()
    document.removeEventListener('dragover', track, true)
    document.removeEventListener('wheel', wheel, true)
    document.removeEventListener('scroll', observeScroll, true)
    document.removeEventListener('drop', stop, true)
    document.removeEventListener('dragend', stop, true)
    document.removeEventListener('dragleave', leave, true)
    document.removeEventListener('keydown', keydown, true)
    document.removeEventListener('visibilitychange', visibilityChanged)
    window.removeEventListener('blur', stop)
    containers = []
    manualScrollUntil = 0
  }

  function scroll(time: number) {
    frame = undefined
    if (!active || pointerY === null) return
    const elapsed = previousTime === undefined ? 1 / 60 : Math.min(time - previousTime, 32) / 1000
    previousTime = time
    for (const container of performance.now() < manualScrollUntil ? [] : containers) {
      const isPage = container === document.scrollingElement
      const bounds = container.getBoundingClientRect()
      const top = isPage ? 0 : Math.max(0, bounds.top)
      const bottom = isPage ? window.innerHeight : Math.min(window.innerHeight, bounds.bottom)
      if (bottom <= top) continue
      const edge = Math.min(EDGE_SIZE, (bottom - top) / 3)
      const direction =
        pointerY < top + edge
          ? -Math.min(1, (top + edge - pointerY) / edge)
          : pointerY > bottom - edge
            ? Math.min(1, (pointerY - bottom + edge) / edge)
            : 0
      const limit = container.scrollHeight - container.clientHeight
      if (!direction || (direction < 0 ? container.scrollTop <= 0 : container.scrollTop >= limit))
        continue
      container.scrollBy({ top: direction * MAX_SPEED * elapsed, behavior: 'instant' })
      expectedPositions.set(container, container.scrollTop)
      break
    }
    frame = requestAnimationFrame(scroll)
  }

  function observeScroll(event: Event) {
    const container = event.target === document ? document.scrollingElement : event.target
    if (!(container instanceof HTMLElement) || !containers.includes(container)) return
    // Native drag mode can scroll the wheel without delivering a DOM wheel event.
    // Let that manual scroll finish instead of immediately pulling it back to an edge.
    if (
      Math.abs(container.scrollTop - (expectedPositions.get(container) ?? container.scrollTop)) > 1
    ) {
      manualScrollUntil = performance.now() + 800
    }
    expectedPositions.set(container, container.scrollTop)
  }

  function wheel(event: WheelEvent) {
    if (!active || !event.deltaY || event.ctrlKey) return
    const delta =
      event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1)
    for (const container of containers) {
      const limit = container.scrollHeight - container.clientHeight
      if (delta < 0 ? container.scrollTop <= 0 : container.scrollTop >= limit) continue
      event.preventDefault()
      manualScrollUntil = performance.now() + 800
      container.scrollBy({ top: delta, behavior: 'instant' })
      expectedPositions.set(container, container.scrollTop)
      break
    }
  }

  function track(event: DragEvent) {
    if (!active) return
    pointerY = event.clientY
    if (frame === undefined) frame = requestAnimationFrame(scroll)
  }

  function leave(event: DragEvent) {
    if (
      !event.relatedTarget &&
      (event.target === document || event.target === document.documentElement)
    )
      pause()
  }

  function keydown(event: KeyboardEvent) {
    if (event.key === 'Escape') stop()
  }

  function visibilityChanged() {
    if (document.hidden) stop()
  }

  function start(event: DragEvent) {
    if (!(event.target instanceof Element) || !event.target.closest('[draggable="true"]')) return
    stop()
    active = true
    let element = event.currentTarget as HTMLElement | null
    while (element) {
      if (/(auto|scroll)/.test(getComputedStyle(element).overflowY)) containers.push(element)
      element = element.parentElement
    }
    const page = document.scrollingElement as HTMLElement | null
    if (page && !containers.includes(page)) containers.push(page)
    for (const container of containers) expectedPositions.set(container, container.scrollTop)
    document.addEventListener('dragover', track, true)
    document.addEventListener('wheel', wheel, { capture: true, passive: false })
    document.addEventListener('scroll', observeScroll, true)
    document.addEventListener('drop', stop, true)
    document.addEventListener('dragend', stop, true)
    document.addEventListener('dragleave', leave, true)
    document.addEventListener('keydown', keydown, true)
    document.addEventListener('visibilitychange', visibilityChanged)
    window.addEventListener('blur', stop)
    // Inputs can cancel a bubbling dragstart after this capture handler has run.
    queueMicrotask(() => {
      if (event.defaultPrevented) stop()
    })
  }

  onScopeDispose(stop)
  return { start }
}
