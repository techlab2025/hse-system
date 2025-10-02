<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'

import TranslationsParams from '@/base/core/params/translations_params.ts'

import type PermissionDetailsModel from '../../Data/models/PermissionDetailsModel'
import EditPermissionParams from '../../Core/params/editPermissionParams'
import AddPermissionParams from '../../Core/params/addPermissionParams'
import PermissionTabsType from '../supcomponents/PermissionTabsType.vue'
import PermissionTabContent from '../supcomponents/PermissionTabContent.vue'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: PermissionDetailsModel
}>()

// ---------- Emit update ----------
const updateData = () => {
  const translationsParams = new TranslationsParams()

  const params = props.data?.id
    ? new EditPermissionParams(+route.params.id, translationsParams)
    : new AddPermissionParams(translationsParams)

  // console.log(params, 'params')

  emit('update:data', params)
}

// ---------- Watchers ----------
// Init from props (edit mode) or defaults (create mode)
watch(
  [() => props.data],
  ([newData]) => {
    // titles

    updateData()
  },
  { immediate: true },
)
</script>

<template>
  <div class="permission">
    <PermissionTabsType @update:type="updateData" />
    <PermissionTabContent />
  </div>
</template>
