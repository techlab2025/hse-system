<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import type EditOrganizatoinEmployeeParams from '../../Core/params/editOrganizatoinEmployeeParams'
import ShowOrganizatoinEmployeeController from '../controllers/showOrganizatoinEmployeeController'
import ShowOrganizatoinEmployeeParams from '../../Core/params/showOrganizatoinEmployeeParams'
import EditOrganizatoinEmployeeController from '../controllers/editOrganizatoinEmployeeController'
import OrganizatoinEmployeeForm from './OrganizatoinEmployeeForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<EditOrganizatoinEmployeeParams | null>(null)
const formRef = ref<InstanceType<typeof OrganizatoinEmployeeForm> | null>(null)

const showOrganizatoinEmployeeController = ShowOrganizatoinEmployeeController.getInstance()
const state = ref(showOrganizatoinEmployeeController.state.value)
const fetchOrganizatoinEmployeeDetails = async () => {
  const OrganizatoinEmployeeParams = new ShowOrganizatoinEmployeeParams(Number(id), false)

  await showOrganizatoinEmployeeController.showOrganizatoinEmployee(OrganizatoinEmployeeParams)
}

onMounted(() => {
  fetchOrganizatoinEmployeeDetails()
})

const EditOrganizatoinEmployee = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await EditOrganizatoinEmployeeController.getInstance().editOrganizatoinEmployee(
    params.value!,
    router,
  )
}

watch(
  () => showOrganizatoinEmployeeController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
)

const setParams = (data: Params) => {
  params.value = data as EditOrganizatoinEmployeeParams
}
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <!--      <pre>-->
      <!--              {{ state.data?.titles }}-->

      <!--      </pre>-->
      <form
        class="grid grid-cols-1 md:grid-cols-4 gap-4"
        @submit.prevent="EditOrganizatoinEmployee"
      >
        <OrganizatoinEmployeeForm ref="formRef" @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
