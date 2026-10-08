<script lang="ts" setup>
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import PPEActivityForm from '@/features/Organization/PPEActivity/Presentation/components/PPEActivityForm.vue'
import type Params from '@/base/core/params/params'
import ShowPPEActivityController from '../controllers/showPPEActivityController'
import ShowPPEActivityParams from '../../Core/params/showPPEActivityParams'
import EditPPEActivityController from '../controllers/editPPEActivityController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof PPEActivityForm> | null>(null)

const showPPEActivityController = ShowPPEActivityController.getInstance()
const state = ref(showPPEActivityController.state.value)
const fetchPPEActivityDetails = async () => {
  const PPEActivityParams = new ShowPPEActivityParams(Number(id))

  await showPPEActivityController.showPPEActivity(PPEActivityParams)
}

onMounted(() => {
  fetchPPEActivityDetails()
})

const editPPEActivity = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await EditPPEActivityController.getInstance().editPPEActivity(params.value!, router)
}

watch(
  () => showPPEActivityController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
)

const setParams = (data: Params) => {
  params.value = data
}

const allowedPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.PPE_ACTIVITY_ALL,
  PermissionsEnum.PPE_ACTIVITY_DETAILS,
  PermissionsEnum.PPE_ACTIVITY_UPDATE,
  PermissionsEnum.ORG_PPE_ACTIVITY_ALL,
  PermissionsEnum.ORG_PPE_ACTIVITY_DETAILS,
  PermissionsEnum.ORG_PPE_ACTIVITY_UPDATE,
]
</script>

<template>
  <PermissionBuilder :code="allowedPermissions">
    <DataStatus :controller="state">
      <template #success>
        <!--      <pre>-->
        <!--              {{ state.data?.titles }}-->

        <!--      </pre>-->
        <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editPPEActivity">
          <PPEActivityForm ref="formRef" @update:data="setParams" :data="state.data!" />
          <div class="col-span-4 button-wrapper">
            <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
          </div>
        </form>
      </template>
      <template #loader>
        <FormLoader :inputsCount="5" />
      </template>
    </DataStatus>
  </PermissionBuilder>
</template>

<style scoped></style>
