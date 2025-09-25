<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import PowerFullForm from './PowerFullForm.vue'
import type Params from '@/base/core/params/params'
import ShowPowerFullController from '../controllers/showPowerFullController'
import ShowPowerFullParams from '../../Core/params/showPowerFullParams'
import EditPowerFullController from '../controllers/editPowerFullController'


const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showPowerFullController = ShowPowerFullController.getInstance()
const state = ref(showPowerFullController.state.value)
const fetchPowerFullDetails = async () => {
  const PowerFullParams = new ShowPowerFullParams(Number(id))

  await showPowerFullController.showPowerFull(PowerFullParams)
}

onMounted(() => {
  fetchPowerFullDetails()
})

const EditPowerFull = async (draft: boolean) => {
  if (draft) {
    await EditPowerFullController.getInstance().editPowerFull(params.value!, router)
  } else {
    await EditPowerFullController.getInstance().editPowerFull(params.value!, router)
  }
}

watch(
  () => showPowerFullController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditPowerFull">
        <PowerFullForm @update:data="setParams" :data="state.data!" />
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
