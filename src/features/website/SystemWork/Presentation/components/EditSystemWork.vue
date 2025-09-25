<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import SystemWorkForm from './SystemWorkForm.vue'
import type Params from '@/base/core/params/params'
import ShowSystemWorkController from '../controllers/showSystemWorkController'
import ShowSystemWorkParams from '../../Core/params/showSystemWorkParams'
import EditSystemWorkController from '../controllers/editSystemWorkController'



const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showSystemWorkController = ShowSystemWorkController.getInstance()
const state = ref(showSystemWorkController.state.value)
const fetchSystemWorkDetails = async () => {
  const SystemWorkParams = new ShowSystemWorkParams(Number(id))

  await showSystemWorkController.showSystemWork(SystemWorkParams)
}

onMounted(() => {
  fetchSystemWorkDetails()
})

const EditSystemWork = async (draft: boolean) => {
  if (draft) {
    await EditSystemWorkController.getInstance().editSystemWork(params.value!, router)
  } else {
    await EditSystemWorkController.getInstance().editSystemWork(params.value!, router)
  }
}

watch(
  () => showSystemWorkController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditSystemWork">
        <SystemWorkForm @update:data="setParams" :data="state.data!" />
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
