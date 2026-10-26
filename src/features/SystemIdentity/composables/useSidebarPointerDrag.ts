import { onScopeDispose, shallowRef, type Ref } from 'vue'

type DragSession = {
  pointerId: number
  source: HTMLElement
  root: HTMLElement
  data: DataTransfer
  startX: number
  startY: number
  x: number
  y: number
  moved: boolean
}

// Pointer dragging keeps the browser out of native drag mode, which can swallow wheel input.
// Dispatch the existing drag events so sorting, drop validation and auto-scroll share one path.
export function useSidebarPointerDrag(root: Ref<HTMLElement | null>) {
  const preview = shallowRef<{ label: string; x: number; y: number } | null>(null)
  let session: DragSession | null = null
  let scrollFrame: number | undefined
  let blockClick = false
  let clickTimer: ReturnType<typeof setTimeout> | undefined

  function event(type: string, current: DragSession) {
    return new DragEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: current.x,
      clientY: current.y,
      dataTransfer: current.data,
    })
  }
  function hover() {
    if (!session?.moved) return
    document.elementFromPoint(session.x, session.y)?.dispatchEvent(event('dragover', session))
  }
  function scrolled() {
    if (scrollFrame === undefined && session?.moved) {
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = undefined
        hover()
      })
    }
  }
  function suppressClick(e: MouseEvent) {
    if (!blockClick) return
    e.preventDefault()
    e.stopImmediatePropagation()
  }
  function cleanup() {
    if (scrollFrame !== undefined) cancelAnimationFrame(scrollFrame)
    scrollFrame = undefined
    document.removeEventListener('pointermove', move, true)
    document.removeEventListener('pointerup', finish, true)
    document.removeEventListener('pointercancel', cancel, true)
    document.removeEventListener('keydown', keydown, true)
    document.removeEventListener('scroll', scrolled, true)
    window.removeEventListener('blur', cancel)
  }
  function end(drop: boolean) {
    const current = session
    session = null
    cleanup()
    if (current?.moved) {
      const destination = document.elementFromPoint(current.x, current.y)
      if (drop && destination && current.root.contains(destination)) {
        destination.dispatchEvent(event('dragover', current))
        destination.dispatchEvent(event('drop', current))
      }
      current.source.dispatchEvent(event('dragend', current))
      if (!current.root.contains(current.source))
        current.root.dispatchEvent(event('dragend', current))
      if (current.root.hasPointerCapture(current.pointerId))
        current.root.releasePointerCapture(current.pointerId)
      // The pointerup click must not pick up the item we just dropped.
      blockClick = true
      clickTimer = setTimeout(() => {
        blockClick = false
        document.removeEventListener('click', suppressClick, true)
      }, 0)
    } else {
      document.removeEventListener('click', suppressClick, true)
    }
    preview.value = null
  }
  function cancel() {
    end(false)
  }
  function keydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault()
      cancel()
    }
  }
  function finish(e: PointerEvent) {
    if (e.pointerId !== session?.pointerId) return
    session.x = e.clientX
    session.y = e.clientY
    end(true)
  }
  function move(e: PointerEvent) {
    if (!session || e.pointerId !== session.pointerId) return
    session.x = e.clientX
    session.y = e.clientY
    if (!session.moved) {
      if (Math.hypot(e.clientX - session.startX, e.clientY - session.startY) < 6) return
      session.moved = true
      session.root.setPointerCapture(e.pointerId)
      blockClick = true
      if (!session.source.dispatchEvent(event('dragstart', session))) {
        cancel()
        return
      }
    }
    e.preventDefault()
    const label = session.source
      .closest('li')
      ?.querySelector<HTMLInputElement>(':scope > strong input')
    preview.value = {
      label: label?.value || label?.placeholder || 'Move group',
      x: session.x,
      y: session.y,
    }
    hover()
  }
  function start(e: PointerEvent) {
    if (e.button !== 0 || !e.isPrimary || !(e.target instanceof Element) || !root.value) return
    const handle = e.target.closest<HTMLElement>(
      '.identity-sidebar-drag-handle, .identity-order-drag-handle',
    )
    if (!handle || !root.value.contains(handle) || !handle.closest('li[draggable="true"]')) return
    cancel()
    if (clickTimer) clearTimeout(clickTimer)
    blockClick = false
    e.preventDefault()
    session = {
      pointerId: e.pointerId,
      source: handle,
      root: root.value,
      data: new DataTransfer(),
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      moved: false,
    }
    document.addEventListener('pointermove', move, { capture: true, passive: false })
    document.addEventListener('pointerup', finish, true)
    document.addEventListener('pointercancel', cancel, true)
    document.addEventListener('keydown', keydown, true)
    document.addEventListener('scroll', scrolled, true)
    document.addEventListener('click', suppressClick, true)
    window.addEventListener('blur', cancel)
  }
  function guardNative(e: DragEvent) {
    if (e.isTrusted) e.preventDefault()
  }
  onScopeDispose(() => {
    cancel()
    if (clickTimer) clearTimeout(clickTimer)
    document.removeEventListener('click', suppressClick, true)
  })
  return { preview, start, guardNative }
}
