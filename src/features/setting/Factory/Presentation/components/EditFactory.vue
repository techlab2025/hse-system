<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowFactoryController from '../controllers/showFactoryController'
import ShowFactoryParams from '../../Core/params/showFactoryParams'
import EditFactoryController from '../controllers/editFactoryController'
import FactoryForm from './FactoryForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showFactoryController = ShowFactoryController.getInstance()
const state = ref(showFactoryController.state.value)
const fetchFactoryDetails = async () => {
  const FactoryParams = new ShowFactoryParams(Number(id))

  await showFactoryController.showFactory(FactoryParams)
}

onMounted(() => {
  fetchFactoryDetails()
})

const EditFactory = async (draft: boolean) => {
  if (draft) {
    await EditFactoryController.getInstance().editFactory(params.value!, router)
  } else {
    await EditFactoryController.getInstance().editFactory(params.value!, router)
  }
}

watch(
  () => showFactoryController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditFactory">
        <FactoryForm @update:data="setParams" :data="state.data!" />
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
