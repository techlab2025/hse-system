<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import Popover from 'primevue/popover'
import DeleteDialog from '@/base/Presentation/Dialogs/MainDialogs/DeleteDialog.vue'
import PermissionHandler from '@/base/Presentation/utils/permission_handler'
import type { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
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
  primary?: boolean
}

defineOptions({ inheritAttrs: false })

const actions = ref()

const toggle = (event: Event) => {
  actions.value.toggle(event)
}

const {
  actionList = [],
  showActions = true,
  actionsNumber = 0,
  featureName,
} = defineProps<{
  actionList: ActionItem[]
  showActions?: boolean
  actionsNumber?: number
  featureName: string
}>()

// ✅ Filter actions by permission
const permittedActions = computed(() =>
  showActions
    ? actionList.filter((a) =>
        a.permission ? PermissionHandler.Instance.handle(a.permission) : true,
      )
    : [],
)
const primaryActions = computed(() => permittedActions.value.filter((action) => action.primary))
const menuActions = computed(() => permittedActions.value.filter((action) => !action.primary))
const menuActionsNumber = computed(() =>
  Math.max(actionsNumber - actionList.filter((action) => action.primary).length, 0),
)
const isVisible = computed(() => {
  return actions.value?.visible
})
</script>

<template>
  <div class="actions-list-controls">
    <template v-for="action in primaryActions" :key="action.text">
      <router-link
        v-if="action.link"
        :to="action.link"
        class="btn btn-primary primary-action-button"
      >
        <component :is="action.icon" />
        <span>{{ action.text }}</span>
      </router-link>

      <button
        v-else-if="action.action"
        class="btn btn-primary primary-action-button"
        type="button"
        @click="action.action"
      >
        <component :is="action.icon" />
        <span>{{ action.text }}</span>
      </button>
    </template>

    <div class="action-list-trigger" @click.stop="toggle">
      <button class="action-icon" type="button">
        <span>{{ menuActionsNumber }}</span>
        {{ $t('import_feature', { feature: $t(featureName) }) }}
      </button>
      <ActionListArrow v-show="!isVisible" />
      <CloseArrowActios v-show="isVisible" />
    </div>
  </div>

  <Popover ref="actions">
    <div class="action-list-body">
      <ul class="border-none">
        <li
          class="list-item cursor-pointer"
          :class="
            action.type == null ? '' : String(ActionItemsTypeEnum[action.type]).toLowerCase()
          "
          v-for="action in menuActions"
          :key="action.text"
        >
          <router-link v-if="action.link" :to="action.link" class="flex items-center gap-[5px]">
            <component :is="action.icon" />
            <span>{{ action.text }}</span>
          </router-link>

          <button
            v-else-if="action.action && action.text != $t('delete')"
            @click="action.action"
            class="flex items-center gap-sm"
          >
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

<style scoped>
.actions-list-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.primary-action-button {
  min-height: 48px;
  white-space: nowrap;
}

.primary-action-button :deep(svg) {
  flex-shrink: 0;
  filter: brightness(0) invert(1);
}

.primary-action-button:hover :deep(svg) {
  filter: none;
}

.list-item {
  text-align: start !important;
  font-size: 13px !important;
}
</style>
