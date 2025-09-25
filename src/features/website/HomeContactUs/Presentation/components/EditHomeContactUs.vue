<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import HomeContactUsForm from './HomeContactUsForm.vue'
import type Params from '@/base/core/params/params'
import ShowHomeContactUsParams from '../../Core/params/showHomeContactUsParams'
import ShowHomeContactUsController from '../controllers/showHomeContactUsController'
import EditHomeContactUsController from '../controllers/editHomeContactUsController'


const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showHomeContactUsController = ShowHomeContactUsController.getInstance()
const state = ref(showHomeContactUsController.state.value)
const fetchHomeContactUsDetails = async () => {
  const HomeContactUsParams = new ShowHomeContactUsParams(Number(id))

  await showHomeContactUsController.showHomeContactUs(HomeContactUsParams)
}

onMounted(() => {
  fetchHomeContactUsDetails()
})

const EditHomeContactUs = async (draft: boolean) => {
  if (draft) {
    await EditHomeContactUsController.getInstance().editHomeContactUs(params.value!, router)
  } else {
    await EditHomeContactUsController.getInstance().editHomeContactUs(params.value!, router)
  }
}

watch(
  () => showHomeContactUsController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditHomeContactUs">
        <HomeContactUsForm @update:data="setParams" :data="state.data!" />
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
