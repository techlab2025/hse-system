<script setup lang="ts">
import { ref, defineProps, watch, computed } from 'vue'
import Popover from 'primevue/popover'
import DeleteDialog from '@/base/Presentation/Dialogs/MainDialogs/DeleteDialog.vue'
import ActionsIcon from '../icons/ActionsIcon.vue'
import PermissionHandler from '@/base/Presentation/utils/permission_handler'
import type { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ActionCloseIcon from '../icons/ActionCloseIcon.vue'

interface ActionItem {
  text: string
  icon: any
  link?: string
  action?: () => void
  permission?: PermissionsEnum[]
}

const emit = defineEmits(['delete'])
defineOptions({ inheritAttrs: false })

const op = ref()
const ActionIconsToggle = ref(false)


// We can create a computed property to check if the popover is actually visible
const isVisible = computed(() => {
  return op.value?.visible;
});

const toggle = (event: Event) => {
  // Use currentTarget to ensure we anchor to the div, not the icon inside it
  op.value.toggle(event);
};
const { actionList = [], showActions = true } = defineProps<{
  actionList: ActionItem[]
  showActions?: boolean
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
  <div class="list-trigger" @click.stop="toggle">
    <ActionsIcon v-show="!isVisible" />
    <ActionCloseIcon v-show="isVisible" />
  </div>

  <Popover ref="op">
    <div class="list-body">
      <ul class="border-none">
        <li class="list-item cursor-pointer" v-for="action in permittedActions" :key="action.text">
          <router-link v-if="action.link" :to="action.link" class="flex items-center gap-[5px]">
            <component :is="action.icon" />
            <span>{{ action.text }}</span>
          </router-link>

          <button v-else-if="action.action && action.text != $t('delete')" @click="action.action"
            class="flex items-center gap-sm">
            <component :is="action.icon" />
            <span>{{ action.text }}</span>
          </button>

          <DeleteDialog v-else-if="action.text == $t('delete')" @delete="action.action" />
        </li>
        <slot name="custom"></slot>
      </ul>
    </div>
  </Popover>
</template>

<style scoped></style>
