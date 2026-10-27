<script setup lang="ts">
import { computed, nextTick, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Appearance } from '../appearance'
import {
  addSidebarGroup,
  removeSidebarGroup,
  defaultSidebarLayout,
  sidebarGroups,
  sidebarLabel,
} from '../sidebarLayout'
import IdentityOrderList from './IdentityOrderList.vue'
import IdentitySidebarItems from './IdentitySidebarItems.vue'
import IdentitySidebarDropZone from './IdentitySidebarDropZone.vue'
import { provideSidebarDrag } from '../composables/useSidebarDrag'
import { useDragAutoScroll } from '../composables/useDragAutoScroll'
import { useSidebarPointerDrag } from '../composables/useSidebarPointerDrag'

const model = defineModel<Appearance>({ required: true })
const { t } = useI18n()
const groups = computed(() =>
  sidebarGroups(model.value).map((group) => ({
    key: group.key,
    label: sidebarLabel(
      model.value,
      `group:${group.key}`,
      group.custom ? group.label : t(group.label),
    ),
    custom: group.custom,
  })),
)
const defaultGroupLabel = (key: string) => {
  const group = sidebarGroups(model.value).find((group) => group.key === key)
  return group ? (group.custom ? group.label : t(group.label)) : ''
}
const drag = provideSidebarDrag(model, t)
const autoScroll = useDragAutoScroll()
const openGroups = ref<Record<string, boolean>>({})
const editorRef = ref<HTMLElement | null>(null)
const pointerDrag = useSidebarPointerDrag(editorRef)
const startDrag = (event: DragEvent) => {
  pointerDrag.guardNative(event)
  autoScroll.start(event)
}
const groupNameId = `sidebar-group-name-${useId()}`
const newGroupName = ref('')
const addGroup = async () => {
  const key = addSidebarGroup(model.value, newGroupName.value)
  if (!key) return
  drag.cancel()
  newGroupName.value = ''
  openGroups.value[key] = true
  await nextTick()
  editorRef.value?.querySelector<HTMLInputElement>(`[data-field="${key}"] input`)?.focus()
}
const removeGroup = (key: string) => {
  drag.cancel()
  removeSidebarGroup(model.value, key)
  delete openGroups.value[key]
}
const reset = () => {
  drag.cancel()
  Object.assign(model.value, defaultSidebarLayout())
}
</script>

<template>
  <section
    ref="editorRef"
    class="identity-editor identity-sidebar-editor"
    @pointerdown.capture="pointerDrag.start"
    @dragstart.capture="startDrag"
    @keydown.esc.stop="drag.cancel"
  >
    <Teleport to="body">
      <div
        v-if="pointerDrag.preview.value"
        class="identity-sidebar-drag-preview"
        :style="{
          transform: `translate3d(${pointerDrag.preview.value.x + 14}px, ${pointerDrag.preview.value.y + 14}px, 0)`,
        }"
        aria-hidden="true"
      >
        {{ pointerDrag.preview.value.label }}
      </div>
    </Teleport>
    <div class="identity-editor-heading">
      <div>
        <h2>{{ $t('Sidebar layout') }}</h2>
        <p>
          {{
            $t(
              'Rename tabs and items, arrange their order, and move items between tabs or submenus.',
            )
          }}
        </p>
      </div>
      <button type="button" @click="reset">{{ $t('Restore sidebar defaults') }}</button>
    </div>
    <!-- <p>Drag the handle to move an item between tabs or submenus. Overview stays at the top.</p>
    <p class="identity-sidebar-drag-status" role="status" aria-live="polite">
      {{
        drag.activeId.value
          ? `Moving ${drag.activeLabel.value}. Drop on an item to set its position, or into a highlighted group.`
          : 'You can also click an item’s handle, then click a drop area. Use the arrows to change its order.'
      }}
    </p> -->
    <button
      type="button"
      class="identity-sidebar-cancel"
      :disabled="!drag.activeId.value"
      @click="drag.cancel"
    >
      {{ $t('Cancel move') }}
    </button>
    <div class="identity-sidebar-add-group">
      <label :for="groupNameId">{{ $t('New group name') }}</label>
      <div>
        <input
          dir="auto"
          :id="groupNameId"
          v-model="newGroupName"
          type="text"
          maxlength="120"
          :placeholder="$t('For example, Safety management')"
          @keydown.enter.prevent="addGroup"
          @dragstart.stop.prevent
        />
        <button type="button" :disabled="!newGroupName.trim()" @click="addGroup">
          {{ $t('Add group') }}
        </button>
      </div>
      <small>{{ $t('Drag items into the new group, then save and apply your identity.') }}</small>
    </div>
    <IdentityOrderList
      v-model="model.sidebarOrder"
      :items="groups"
      :locked="['overview']"
      :label="$t('Sidebar group order')"
      @drag-item-start="drag.cancel"
      @drag-item-end="drag.cancel"
      @drag-item-over="(event, key) => drag.over(event, key)"
      @drop-item="(_event, key) => drag.drop(key)"
    >
      <template #label="{ item }">
        <input
          dir="auto"
          v-model="model.sidebarLabels[`group:${item}`]"
          class="identity-sidebar-name"
          type="text"
          maxlength="120"
          :aria-label="$t('uiDynamic.tabName', { p0: defaultGroupLabel(item) })"
          :placeholder="defaultGroupLabel(item)"
          @dragstart.stop.prevent
        />
      </template>
      <template #default="{ item }">
        <button
          v-if="groups.find((group) => group.key === item)?.custom"
          type="button"
          :aria-label="$t('uiDynamic.removeGroup', { p0: defaultGroupLabel(item) })"
          :title="$t('Items return to their original groups')"
          @click="removeGroup(item)"
        >
          {{ $t('Remove group') }}
        </button>
        <small v-if="item === 'overview'" class="identity-sidebar-pinned">{{
          $t('Fixed at top')
        }}</small>
        <IdentitySidebarDropZone
          v-if="item !== 'overview'"
          :container="item"
          :label="
            $t('uiDynamic.dropInto', { p0: groups.find((group) => group.key === item)?.label })
          "
          @entered="openGroups[item] = true"
        />
        <details
          class="identity-sidebar-details"
          :open="openGroups[item]"
          @toggle="openGroups[item] = ($event.target as HTMLDetailsElement).open"
        >
          <summary>
            {{ groups.find((group) => group.key === item)?.label }} {{ $t('menu items') }}
          </summary>
          <IdentitySidebarItems v-model="model" :container="item" />
        </details>
      </template>
    </IdentityOrderList>
  </section>
</template>
