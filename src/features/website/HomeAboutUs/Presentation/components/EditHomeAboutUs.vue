<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import HomeAboutUsForm from './HomeAboutUsForm.vue'
import type Params from '@/base/core/params/params'
import ShowHomeAboutUsController from '../controllers/showHomeAboutUsController'
import ShowHomeAboutUsParams from '../../Core/params/showHomeAboutUsParams'
import EditHomeAboutUsController from '../controllers/editHomeAboutUsController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showHomeAboutUsController = ShowHomeAboutUsController.getInstance()
const state = ref(showHomeAboutUsController.state.value)
const fetchHomeAboutUsDetails = async () => {
  const HomeAboutUsParams = new ShowHomeAboutUsParams(Number(id))

  await showHomeAboutUsController.showHomeAboutUs(HomeAboutUsParams)
}

onMounted(() => {
  fetchHomeAboutUsDetails()
})

const EditHomeAboutUs = async (draft: boolean) => {
  if (draft) {
    await EditHomeAboutUsController.getInstance().editHomeAboutUs(params.value!, router)
  } else {
    await EditHomeAboutUsController.getInstance().editHomeAboutUs(params.value!, router)
  }
}

watch(
  () => showHomeAboutUsController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditHomeAboutUs">
        <HomeAboutUsForm @update:data="setParams" :data="state.data!" />
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
