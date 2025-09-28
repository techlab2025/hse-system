<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowSystemComponentParams from '../../Core/params/showSystemComponentParams'
import ShowSystemComponentController from '../controllers/showSystemComponentController'
import EditSystemComponentController from '../controllers/editSystemComponentController'
import SystemComponentForm from './SystemComponentForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showSystemComponentController = ShowSystemComponentController.getInstance()
const state = ref(showSystemComponentController.state.value)
const fetchSystemComponentDetails = async () => {
  const showSystemComponentParams = new ShowSystemComponentParams(Number(id))

  await showSystemComponentController.showSystemComponent(showSystemComponentParams)
}

onMounted(() => {
  fetchSystemComponentDetails()
})

const EditSystemComponent = async (draft: boolean) => {
  if (draft) {
    await EditSystemComponentController.getInstance().editSystemComponent(params.value!, router)
  } else {
    await EditSystemComponentController.getInstance().editSystemComponent(params.value!, router)
  }
}

watch(
  () => showSystemComponentController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditSystemComponent">
        <SystemComponentForm @update:data="setParams" :data="state.data!" />
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
