<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import { useRoute } from 'vue-router'
import type RoleDetailsModel from '../../Data/models/RoleDetailsModel'
import { useUserStore } from '@/stores/user'
import type PermissionDetailsModel from '@/features/permission/Data/models/PermissionDetailsModel'
import { getOrganizationPermissionLabel } from '@/features/permission/Presentation/Helpers/organization_permission'
import EditRoleParams from '../../Core/params/editRoleParams'
import AddRoleParams from '../../Core/params/addRoleParams'
import PermissionTabContent from "@/features/permission/Presentation/supcomponents/PermissionTabContent.vue";
import PermissionRolrParamsParams from '../../Core/params/PermissionRoleParams'



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
      true)
    : new AddRoleParams(
      role.value,
      roleName.value,
      AllPermissions,
      true)
  emit('update:data', params)
}

// ---------- Watchers ----------
const permissions = ref<PermissionDetailsModel[]>([])
const setPermission = (val) => {
  allPermission.value = val
  updateData()
}

const role = ref<string>()
const roleName = ref<string>()
</script>

<template>
  <div class="col-span-4 md:col-span-4 input-wrapper">
    <label for="role">{{ $t('role') }}</label>
    <input type="text" id="role" v-model="role" class="input">
  </div>
  <div class="col-span-4 md:col-span-4 input-wrapper">
    <label for="roleName">{{ $t('role_name') }}</label>
    <input type="text" id="roleName" v-model="roleName" class="input">
  </div>
  <div class="permission col-span-4 md:col-span-4">
    <PermissionTabContent @update:permissions="setPermission" :permissions="permissions" />
  </div>
</template>
