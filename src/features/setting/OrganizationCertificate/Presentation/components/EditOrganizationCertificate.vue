<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import OrganizationCertificateForm from './OrganizationCertificateForm.vue'
import type Params from '@/base/core/params/params'
import ShowOrganizationCertificateParams from '../../Core/params/showOrganizationCertificateParams'
import ShowOrganizationCertificateController from '../controllers/showOrganizationCertificateController'
import EditOrganizationCertificateController from '../controllers/editOrganizationCertificateController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof OrganizationCertificateForm> | null>(null)

const showOrganizationCertificateController = ShowOrganizationCertificateController.getInstance()
const state = ref(showOrganizationCertificateController.state.value)
const fetchOrganizationCertificateDetails = async () => {
  const organizationCertificateParams = new ShowOrganizationCertificateParams(Number(id))
  await showOrganizationCertificateController.showOrganizationCertificate(
    organizationCertificateParams,
  )
}

onMounted(() => {
  fetchOrganizationCertificateDetails()
})

const editOrganizationCertificate = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await EditOrganizationCertificateController.getInstance().editOrganizationCertificate(
    params.value!,
    router,
  )
}

watch(
  () => showOrganizationCertificateController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState)
      state.value = newState
    }
  },
)

const setParams = (data: Params) => {
  params.value = data
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
        @submit.prevent="editOrganizationCertificate"
      >
        <OrganizationCertificateForm ref="formRef" @update:data="setParams" :data="state.data!" />
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
