<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import EmployeeCertificateForm from '@/features/Organization/EmployeeCertificate/Presentation/components/EmployeeCertificateForm.vue'
import type Params from '@/base/core/params/params'
import ShowEmployeeCertificatetController from '../controllers/showEmployeeCertificateController'
import ShowEmployeeCertificateParams from '../../Core/params/showEmployeeCertificateParams'
import EditEmployeeCertificateController from '../controllers/editEmployeeCertificateController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showEmployeeCertificateController = ShowEmployeeCertificatetController.getInstance()
const state = ref(showEmployeeCertificateController.state.value)
const fetchEmployeeCertificateDetails = async () => {
  const EmployeeCertificateParams = new ShowEmployeeCertificateParams(Number(id))

  await showEmployeeCertificateController.showEmployeeCertificate(EmployeeCertificateParams)
}

onMounted(() => {
  fetchEmployeeCertificateDetails()
})

const EditEmployeeCertificate = async (draft: boolean) => {
  if (draft) {
    await EditEmployeeCertificateController.getInstance().editEmployeeCertificate(params.value!, router)
  } else {
    await EditEmployeeCertificateController.getInstance().editEmployeeCertificate(params.value!, router)
  }
}

watch(
  () => showEmployeeCertificateController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditEmployeeCertificate">
        <EmployeeCertificateForm @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">{{ $t('edit') }}</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
