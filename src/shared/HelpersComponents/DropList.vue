<script setup lang="ts">
import { isDeleteAction } from './actionItems'
import { translateMessage } from '@/localization/messages'
import { ref, computed, type Component } from 'vue'
import Popover from 'primevue/popover'
import DeleteDialog from '@/base/Presentation/Dialogs/MainDialogs/DeleteDialog.vue'
import PermissionHandler from '@/base/Presentation/utils/permission_handler'
import type { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

interface ActionItem {
  text: string
  icon: Component
  link?: string
  action?: () => void
  permission?: PermissionsEnum[]
  class?: string
  isDelete?: boolean
}

defineEmits(['delete'])
defineOptions({ inheritAttrs: false })

const op = ref()

const isVisible = computed(() => {
  return op.value?.visible
})

const toggle = (event: Event) => {
  op.value.toggle(event)
}
const {
  actionList = [],
  showActions = true,
  actionLabel,
} = defineProps<{
  actionList: ActionItem[]
  showActions?: boolean
  actionLabel?: string
}>()

// ✅ Filter actions by permission
const permittedActions = computed(() =>
  showActions
    ? actionList.filter((a) =>
        a.permission ? PermissionHandler.Instance.handle(a.permission) : true,
      )
    : [],
)
</script>

<template>
  <button
    type="button"
    class="list-trigger hse-table-action"
    :aria-label="actionLabel || translateMessage('Actions')"
    aria-haspopup="dialog"
    :aria-expanded="isVisible || false"
    @click.stop="toggle"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  </button>

  <Popover ref="op">
    <div class="list-body">
      <ul class="border-none">
        <li
          :class="action.class"
          class="list-item cursor-pointer"
          v-for="action in permittedActions"
          :key="action.text"
        >
          <router-link v-if="action.link" :to="action.link" class="flex items-center gap-[5px]">
            <component :is="action.icon" />
            <span @click="op.hide()">{{ translateMessage(action.text) }}</span>
          </router-link>

          <button
            v-else-if="action.action && !isDeleteAction(action)"
            @click="action.action"
            class="flex items-center gap-sm"
          >
            <component :is="action.icon" />
            <!-- when click close popover -->
            <span @click="op.hide()">{{ translateMessage(action.text) }}</span>
          </button>

          <DeleteDialog v-else-if="isDeleteAction(action)" @delete="action.action" />
        </li>
        <slot name="custom"></slot>
      </ul>
    </div>
  </Popover>
</template>

<style scoped></style>
