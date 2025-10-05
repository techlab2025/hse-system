<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'

// import TranslationsParams from '@/base/core/params/translations_params.ts'

import PermissionDetailsModel from '../../Data/models/PermissionDetailsModel'
// import EditPermissionParams from '../../Core/params/editPermissionParams'
// import AddPermissionParams from '../../Core/params/addPermissionParams'
// import PermissionTabsType from '../supcomponents/PermissionTabsType.vue'
import PermissionTabContent from '../supcomponents/PermissionTabContent.vue'
import AddPermissionParams from '../../Core/params/addPermissionParams'
import { useRoute } from 'vue-router'
import { getOrganizationPermissionLabel } from '../Helpers/organization_permission'
import { getOrganizationType } from '../Helpers/organization_type'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: PermissionDetailsModel
}>()

const route = useRoute()

const baseSegment = `${route.path.split('/')[1]}`

const allPermission = getOrganizationPermissionLabel(baseSegment)

const permissions = ref<PermissionDetailsModel[]>([])

const setPermission = (val) => {
  allPermission.value = val
  updateData()
}

const type = getOrganizationType(baseSegment)

// ---------- Emit update ----------
const updateData = () => {
  // const translationsParams = new TranslationsParams()
  const params = new AddPermissionParams(type, +route.params.id, allPermission.value)
  // console.log(params)
  emit('update:data', params)
}

onMounted(() => {
  if (props.data) {
    permissions.value = props.data?.permission || []
    updateData()
  }
})
</script>

<template>
  <div class="permission">
    <!-- <PermissionTabsType @update:type="updateData" />-->
    <PermissionTabContent @update:permissions="setPermission" :permissions="permissions" />
  </div>
</template>
