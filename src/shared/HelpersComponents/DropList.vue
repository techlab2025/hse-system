<script setup lang="ts">

import Popover from 'primevue/popover'
import DeleteDialog from '../../base/presentation/Dialogs/MainDialogs/DeleteDialog.vue'
import { ref, defineProps, computed, nextTick, watch } from 'vue'
// import IconDropList from "@/shared/icons/IconDropList.vue";
import ActionsIcon from '../icons/ActionsIcon.vue'

interface ActionItem {
  text: string
  icon: any
  link?: string
  action?: () => void
}

const emit = defineEmits(['delete'])
defineOptions({ inheritAttrs: false })

const op = ref()
const ActionIconsToggle = ref(false)
const toggle = async (event: Event) => {
  op.value.toggle(event)

  // await nextTick()
  // console.log(op.value.visible)
  // ActionIconsToggle.value = op.value.visible
}

const { actionList = [], showActions = true } = defineProps<{
  actionList: ActionItem[]
  showActions?: boolean
}>()

const actions = showActions ? actionList : []

watch(ActionIconsToggle, (newVal) => {
  ActionIconsToggle.value = newVal
})
</script>

<template>
  <div class="list-trigger" @click="toggle">
    <ActionsIcon />
    <!-- <CloseIcon v-else /> -->
  </div>

  <Popover ref="op">
    <div class="list-body">
      <ul class="border-none">
        <li class="list-item cursor-pointer" v-for="action in actions" :key="action.text">
          <router-link v-if="action.link" :to="action.link" class="flex items-center gap-[5px]">
            <component :is="action.icon" />
            <span>{{ action.text }}</span>
          </router-link>
          <button
            v-if="action.action && action.text != $t('delete')"
            @click="action.action"
            class="flex items-center gap-sm"
          >
            <component :is="action.icon" />
            <span>{{ action.text }}</span>
          </button>
          <DeleteDialog v-if="action.text == $t('delete')" @delete="action.action" />
        </li>
        <slot name="custom"></slot>
      </ul>
    </div>
  </Popover>
</template>

<style scoped></style>
