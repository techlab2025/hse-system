<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowMethodsController from '../controllers/showMethodsController'
import ShowMethodsParams from '../../Core/params/showMethodsParams'
import EditMethodsController from '../controllers/editMethodsController'
import MethodsForm from './MethodsForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showMethodsController = ShowMethodsController.getInstance()
const state = ref(showMethodsController.state.value)
const fetchMethodsDetails = async () => {
  const MethodsParams = new ShowMethodsParams(Number(id))

  await showMethodsController.showMethods(MethodsParams)
}

onMounted(() => {
  fetchMethodsDetails()
})

const EditMethods = async (draft: boolean) => {
  if (draft) {
    await EditMethodsController.getInstance().editMethods(params.value!, router)
  } else {
    await EditMethodsController.getInstance().editMethods(params.value!, router)
  }
}

watch(
  () => showMethodsController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditMethods">
        <MethodsForm @update:data="setParams" :data="state.data!" />
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
