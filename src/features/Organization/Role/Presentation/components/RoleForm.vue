<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type RoleDetailsModel from '../../Data/models/RoleDetailsModel'
import { getOrganizationPermissionLabel } from '@/features/permission/Presentation/Helpers/organization_permission'
import EditRoleParams from '../../Core/params/editRoleParams'
import AddRoleParams from '../../Core/params/addRoleParams'
import PermissionTabContent from "@/features/permission/Presentation/supcomponents/PermissionTabContent.vue";
import PermissionRolrParamsParams from '../../Core/params/PermissionRoleParams'
import CustomCheckbox from "@/shared/HelpersComponents/CustomCheckbox.vue";
import type RolePermissionModel from '../../Data/models/RolePermissionModel'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'


const route = useRoute()
const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: RoleDetailsModel
}>()
const baseSegment = `${route.path.split('/')[1]}`
const allPermission = getOrganizationPermissionLabel(baseSegment)
const id = route.params.parent_id


const updateData = () => {
  const AllPermissions = allPermission.value.map((item) => new PermissionRolrParamsParams(item))
  const params = props.data?.id
    ? new EditRoleParams(props.data.id,
      role.value,
      roleName.value,
      AllPermissions,
      AllowOrganization.value)
    : new AddRoleParams(
      role.value,
      roleName.value,
      AllPermissions,
      AllowOrganization.value)
  emit('update:data', params)
}

// ---------- Watchers ----------
const permissions = ref<RolePermissionModel[]>([])
const setPermission = (val) => {
  allPermission.value = val
  updateData()
}

const role = ref<string>(props?.data?.title || '')
const roleName = ref<string>(props?.data?.displayName || '')
const AllowOrganization = ref<boolean>(props.data?.allowForOrganizations === 1 ? true : false)

onMounted(() => {

  if (props.data) {
    permissions.value = props.data?.permissions || []
    updateData()
  }
})

watch(() => props.data, (newVal) => {
  if (props.data) {
    updateData()
  }
})
const { user } = useUserStore()
</script>

<template>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="role">{{ $t('role') }}</label>
    <input type="text" id="role" v-model="role" class="input" @input="updateData">
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="roleName">{{ $t('role_name') }}</label>
    <input type="text" id="roleName" v-model="roleName" class="input" @input="updateData">
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper" v-if="user?.type == OrganizationTypeEnum?.ADMIN">
    <CustomCheckbox :title="`Allow For Organization`" :checked="AllowOrganization"
      @update:checked="AllowOrganization = $event" />
  </div>
  <div class="permission col-span-4 md:col-span-4">
    <PermissionTabContent @update:permissions="setPermission" :permissions="permissions" />
  </div>
</template>
