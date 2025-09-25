<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import ClientOpinionForm from './ClientOpinionForm.vue'
import type Params from '@/base/core/params/params'
import ShowClientOpinionController from '../controllers/showClientOpinionController'
import ShowClientOpinionParams from '../../Core/params/showClientOpinionParams'
import EditClientOpinionController from '../controllers/editClientOpinionController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showClientOpinionController = ShowClientOpinionController.getInstance()
const state = ref(showClientOpinionController.state.value)
const fetchClientOpinionDetails = async () => {
  const ClientOpinionParams = new ShowClientOpinionParams(Number(id))

  await showClientOpinionController.showClientOpinion(ClientOpinionParams)
}

onMounted(() => {
  fetchClientOpinionDetails()
})

const EditClientOpinion = async (draft: boolean) => {
  if (draft) {
    await EditClientOpinionController.getInstance().editClientOpinion(params.value!, router)
  } else {
    await EditClientOpinionController.getInstance().editClientOpinion(params.value!, router)
  }
}

watch(
  () => showClientOpinionController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditClientOpinion">
        <ClientOpinionForm @update:data="setParams" :data="state.data!" />
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
