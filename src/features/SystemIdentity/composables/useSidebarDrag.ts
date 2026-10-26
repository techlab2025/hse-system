import { computed, inject, provide, ref, type InjectionKey, type Ref } from 'vue'
import type { Appearance } from '../appearance'
import { canMoveSidebarNode, moveSidebarNode, sidebarLabel, sidebarNodes } from '../sidebarLayout'

function createSidebarDrag(model: Ref<Appearance>, translate: (key: string) => string) {
  const activeId = ref<string | null>(null)
  const target = ref<{ container: string; siblingId?: string; edge: 'before' | 'after' } | null>(
    null,
  )
  const activeNode = computed(() => sidebarNodes.find((node) => node.id === activeId.value))
  const activeLabel = computed(() =>
    activeNode.value
      ? sidebarLabel(model.value, activeNode.value.id, translate(activeNode.value.route.name))
      : '',
  )
  const canDrop = (container: string) =>
    Boolean(activeNode.value && canMoveSidebarNode(activeNode.value, container, model.value))
  function cancel() {
    activeId.value = null
    target.value = null
  }
  function pickUp(id: string) {
    const node = sidebarNodes.find((node) => node.id === id)
    if (!node || node.locked) return
    if (activeId.value === id) return cancel()
    activeId.value = id
    target.value = null
  }
  function start(event: DragEvent, id: string) {
    if (activeId.value !== id) pickUp(id)
    if (event.dataTransfer && activeId.value) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('application/x-hse-sidebar-item', id)
      event.dataTransfer.setData('text/plain', id)
    }
  }
  function over(event: DragEvent, container: string, siblingId?: string) {
    if (!activeId.value) return
    if (!canDrop(container) || activeId.value === siblingId) {
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'none'
      target.value = null
      return
    }
    const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect()
    target.value = {
      container,
      siblingId,
      edge: event.clientY > bounds.top + bounds.height / 2 ? 'after' : 'before',
    }
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  }
  function drop(container: string, siblingId?: string) {
    if (!activeId.value || !canDrop(container)) return
    moveSidebarNode(
      model.value,
      activeId.value,
      container,
      siblingId,
      target.value?.container === container && target.value.siblingId === siblingId
        ? target.value.edge
        : 'before',
    )
    cancel()
  }
  return { activeId, activeLabel, target, canDrop, pickUp, start, over, drop, cancel }
}
const sidebarDragKey: InjectionKey<ReturnType<typeof createSidebarDrag>> = Symbol('sidebar-drag')
export function provideSidebarDrag(model: Ref<Appearance>, translate: (key: string) => string) {
  const drag = createSidebarDrag(model, translate)
  provide(sidebarDragKey, drag)
  return drag
}
export function useSidebarDrag() {
  const drag = inject(sidebarDragKey)
  if (!drag) throw new Error('Sidebar drag controls must be inside IdentitySidebarEditor')
  return drag
}
