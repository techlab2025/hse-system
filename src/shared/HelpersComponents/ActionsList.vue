<script setup lang="ts">
import { ref, defineProps, watch, computed, type Component } from 'vue'
import Popover from 'primevue/popover'
import DeleteDialog from '@/base/Presentation/Dialogs/MainDialogs/DeleteDialog.vue'
import ActionsIcon from '../icons/ActionsIcon.vue'
import PermissionHandler from '@/base/Presentation/utils/permission_handler'
import type { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ActionCloseIcon from '../icons/ActionCloseIcon.vue'
import ActionListArrow from '../icons/ActionListArrow.vue'
import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import CloseArrowActios from '../icons/CloseArrowActios.vue'

interface ActionItem {
  text: string
  icon: any
  link?: string
  action?: () => void
  permission?: PermissionsEnum[]
  type?: ActionItemsTypeEnum
  component?: Component
}

const emit = defineEmits(['delete'])
defineOptions({ inheritAttrs: false })

const actions = ref()
const ActionIconsToggle = ref(false)

const toggle = (event: Event) => {
  actions.value.toggle(event);
};

const { actionList = [], showActions = true, actionsNumber = 0 } = defineProps<{
  actionList: ActionItem[]
  showActions?: boolean
  actionsNumber?: number
}>()

// ✅ Filter actions by permission
const permittedActions = computed(() =>
  showActions
    ? actionList.filter((a) =>
      a.permission ? PermissionHandler.Instance.handle(a.permission) : true,
    )
    : [],
)
const isVisible = computed(() => {
  return actions.value?.visible;
});

</script>

<template>
  <div class="action-list-trigger" @click.stop="toggle">
    <button class="action-icon"><span>{{ actionsNumber }}</span>{{ $t('actions_list') }}</button>
    <ActionListArrow v-show="!isVisible" />
    <CloseArrowActios v-show="isVisible" />
  </div>  

  <Popover ref="actions">
    <div class="action-list-body">
      <ul class="border-none">
        <li class="list-item cursor-pointer" :class="String(ActionItemsTypeEnum[action?.type]).toLowerCase()"
          v-for="action in permittedActions" :key="action.text">
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
