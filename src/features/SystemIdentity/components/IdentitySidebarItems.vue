<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Appearance } from '../appearance'
import { sidebarContainerNodes, sidebarLabel, sidebarOrderKey } from '../sidebarLayout'
import IdentityOrderList from './IdentityOrderList.vue'
import IdentitySidebarDropZone from './IdentitySidebarDropZone.vue'
import { useSidebarDrag } from '../composables/useSidebarDrag'

const model = defineModel<Appearance>({ required: true })
const props = defineProps<{ container: string }>()
const { t } = useI18n()
const nodes = computed(() => sidebarContainerNodes(model.value, props.container))
const nodesByKey = computed(() =>
  Object.fromEntries(nodes.value.map((node) => [sidebarOrderKey(node, props.container), node])),
)
const items = computed(() =>
  nodes.value.map((node) => ({
    key: sidebarOrderKey(node, props.container),
    label: sidebarLabel(model.value, node.id, t(node.route.name)),
  })),
)
const order = computed({
  get: () => items.value.map((item) => item.key),
  set: (value: string[]) => {
    model.value.sidebarItemOrder[props.container] = value
  },
})
const drag = useSidebarDrag()
const openMenus = ref<Record<string, boolean>>({})
const draggingKey = computed(() => nodes.value.find((node) => node.id === drag.activeId.value))
const dropKey = computed(() => {
  if (drag.target.value?.container !== props.container) return undefined
  const node = nodes.value.find((node) => node.id === drag.target.value?.siblingId)
  return node ? sidebarOrderKey(node, props.container) : undefined
})
</script>

<template>
  <IdentityOrderList
    v-model="order"
    :items="items"
    :label="`${container} menu order`"
    external-drag
    :dragging-key="draggingKey ? sidebarOrderKey(draggingKey, container) : undefined"
    :drop-before="drag.target.value?.edge === 'before' ? dropKey : undefined"
    :drop-after="drag.target.value?.edge === 'after' ? dropKey : undefined"
    @drag-item-start="(event, key) => drag.start(event, nodesByKey[key].id)"
    @drag-item-end="drag.cancel"
    @drag-item-over="(event, key) => drag.over(event, container, nodesByKey[key].id)"
    @drop-item="(_event, key) => drag.drop(container, nodesByKey[key].id)"
    :locked="nodes.filter((node) => node.locked).map((node) => sidebarOrderKey(node, container))"
  >
    <template #handle="{ item }">
      <button
        v-if="!nodesByKey[item].locked"
        type="button"
        class="identity-sidebar-drag-handle"
        :data-drag-item="nodesByKey[item].id"
        draggable="true"
        :aria-label="`Pick up ${t(nodesByKey[item].route.name)} to move`"
        :aria-pressed="drag.activeId.value === nodesByKey[item].id"
        title="Drag to move, or click to pick up"
        @click="drag.pickUp(nodesByKey[item].id)"
      >
        ⠿
      </button>
      <span v-else aria-hidden="true">⠿</span>
    </template>
    <template #label="{ item }">
      <input
        v-model="model.sidebarLabels[nodesByKey[item].id]"
        class="identity-sidebar-name"
        type="text"
        maxlength="120"
        :data-sidebar-item="nodesByKey[item].id"
        :aria-label="`Name for ${t(nodesByKey[item].route.name)}`"
        :placeholder="t(nodesByKey[item].route.name)"
        @dragstart.stop.prevent
      />
    </template>
    <template #default="{ item }">
      <small v-if="nodesByKey[item].locked" class="identity-sidebar-pinned"
        >Fixed in Overview</small
      >
      <IdentitySidebarDropZone
        v-if="nodesByKey[item].isMenu"
        :container="nodesByKey[item].id"
        :label="`Drop into ${items.find((entry) => entry.key === item)?.label} submenu`"
        @entered="openMenus[nodesByKey[item].id] = true"
      />
      <details
        v-if="nodesByKey[item].isMenu"
        class="identity-sidebar-details"
        :open="openMenus[nodesByKey[item].id]"
        @toggle="openMenus[nodesByKey[item].id] = ($event.target as HTMLDetailsElement).open"
      >
        <summary>Submenu items</summary>
        <IdentitySidebarItems v-model="model" :container="nodesByKey[item].id" />
      </details>
    </template>
  </IdentityOrderList>
  <IdentitySidebarDropZone
    v-if="container !== 'overview'"
    :container="container"
    label="Drop here to add at the end"
  />
</template>
