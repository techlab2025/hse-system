<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import Popover from 'primevue/popover'
import DeleteDialog from '@/base/Presentation/Dialogs/MainDialogs/DeleteDialog.vue'
import ActionsIcon from '../icons/ActionsIcon.vue'
import type { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ActionCloseIcon from '../icons/ActionCloseIcon.vue'
import { useRouter } from 'vue-router'
import { canPermissionAction, type PermissionAction } from '@/features/permission/Presentation/Helpers/organization_actions'

interface ActionItem extends PermissionAction {
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
const router = useRouter()
const executeAction = (action: ActionItem) => {
  if (!canPermissionAction(action, router)) return
  action.action?.()
}

const isVisible = computed(() => {
  return op.value?.visible
})

const toggle = (event: Event) => {
  if (permittedActions.value.length) op.value.toggle(event)
}
const { actionList = [], showActions = true } = defineProps<{
  actionList: ActionItem[]
  showActions?: boolean
}>()

// ✅ Filter actions by permission
const permittedActions = computed(() =>
  showActions ? actionList.filter((action) => canPermissionAction(action, router)) : [],
)
</script>

<template>
  <div v-if="permittedActions.length" class="list-trigger" @click.stop="toggle">
    <ActionsIcon v-show="!isVisible" />
    <ActionCloseIcon v-show="isVisible" />
  </div>

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
            <span @click="op.hide()">{{ action.text }}</span>
          </router-link>

          <button
            v-else-if="action.action && !action.isDelete && action.text != $t('delete')"
            @click="executeAction(action)"
            class="flex items-center gap-sm"
          >
            <component :is="action.icon" />
            <!-- when click close popover -->
            <span @click="op.hide()">{{ action.text }}</span>
          </button>

          <DeleteDialog
            v-else-if="action.isDelete || action.text == $t('delete')"
            :allowed="() => canPermissionAction(action, router)"
            @delete="executeAction(action)"
          />
        </li>
        <slot name="custom"></slot>
      </ul>
    </div>
  </Popover>
</template>

<style scoped></style>
