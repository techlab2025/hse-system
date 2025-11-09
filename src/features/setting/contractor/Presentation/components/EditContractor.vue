<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import EditContractorController from '../controllers/editContractorController'
import ShowContractorParams from '../../Core/params/showContractorParams'
import ShowContractorController from '../controllers/showContractorController'
import ContractorForm from './ContractorForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showContractorController = ShowContractorController.getInstance()
const state = ref(showContractorController.state.value)

const fetchContractorDetails = async () => {
  const ContractorParams = new ShowContractorParams(Number(id))

  await showContractorController.showContractorType(ContractorParams)
}

onMounted(() => {
  fetchContractorDetails()
})

const EditContractor = async (draft: boolean) => {
  if (draft) {
    await EditContractorController.getInstance().editContractor(params.value!, router)
  } else {
    await EditContractorController.getInstance().editContractor(params.value!, router)
  }
}

watch(
  () => showContractorController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditContractor">
        <ContractorForm @update:data="setParams" :data="state.data!" />
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
