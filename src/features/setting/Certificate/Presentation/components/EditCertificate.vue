<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import CertificateForm from '@/features/setting/Certificate/Presentation/components/CertificateForm.vue'
import type Params from '@/base/core/params/params'
import ShowCertificateParams from '../../Core/params/showCertificateParams'
import ShowCertificateController from '../controllers/showCertificateController'
import EditCertificateController from '../controllers/editCertificateController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showCertificateController = ShowCertificateController.getInstance()
const state = ref(showCertificateController.state.value)
const fetchCertificateDetails = async () => {
  const CertificateParams = new ShowCertificateParams(Number(id))

  await showCertificateController.showCertificate(CertificateParams)
}

onMounted(() => {
  fetchCertificateDetails()
})

const EditCertificate = async (draft: boolean) => {
  if (draft) {
    await EditCertificateController.getInstance().editCertificate(params.value!, router)
  } else {
    await EditCertificateController.getInstance().editCertificate(params.value!, router)
  }
}

watch(
  () => showCertificateController.state.value,
  (newState) => {
    if (newState) {
      // console.log(newState)
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditCertificate">
        <CertificateForm @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">Edit</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
