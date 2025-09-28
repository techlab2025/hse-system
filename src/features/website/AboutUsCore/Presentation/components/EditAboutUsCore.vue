<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import AboutUsCoreForm from './AboutUsCoreForm.vue'
import type Params from '@/base/core/params/params'
import ShowAboutUsCoreController from '../controllers/showAboutUsCoreController'
import ShowAboutUsCoreParams from '../../Core/params/showAboutUsCoreParams'
import EditAboutUsCoreController from '../controllers/editAboutUsCoreController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showAboutUsCoreController = ShowAboutUsCoreController.getInstance()
const state = ref(showAboutUsCoreController.state.value)
const fetchAboutUsCoreDetails = async () => {
  const AboutUsCoreParams = new ShowAboutUsCoreParams(Number(id))

  await showAboutUsCoreController.showAboutUsCore(AboutUsCoreParams)
}

onMounted(() => {
  fetchAboutUsCoreDetails()
})

const EditAboutUsCore = async (draft: boolean) => {
  if (draft) {
    await EditAboutUsCoreController.getInstance().editAboutUsCore(params.value!, router)
  } else {
    await EditAboutUsCoreController.getInstance().editAboutUsCore(params.value!, router)
  }
}

watch(
  () => showAboutUsCoreController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditAboutUsCore">
        <AboutUsCoreForm @update:data="setParams" :data="state.data!" />
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
