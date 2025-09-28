<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import AboutUsFeatureForm from './AboutUsFeatureForm.vue'
import type Params from '@/base/core/params/params'
import ShowAboutUsFeatureController from '../controllers/showAboutUsFeatureController'
import ShowAboutUsFeatureParams from '../../Core/params/showAboutUsFeatureParams'
import EditAboutUsFeatureController from '../controllers/editAboutUsFeatureController'



const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showAboutUsFeatureController = ShowAboutUsFeatureController.getInstance()
const state = ref(showAboutUsFeatureController.state.value)
const fetchAboutUsFeatureDetails = async () => {
  const AboutUsFeatureParams = new ShowAboutUsFeatureParams(Number(id))

  await showAboutUsFeatureController.showAboutUsFeature(AboutUsFeatureParams)
}

onMounted(() => {
  fetchAboutUsFeatureDetails()
})

const EditAboutUsFeature = async (draft: boolean) => {
  if (draft) {
    await EditAboutUsFeatureController.getInstance().editAboutUsFeature(params.value!, router)
  } else {
    await EditAboutUsFeatureController.getInstance().editAboutUsFeature(params.value!, router)
  }
}

watch(
  () => showAboutUsFeatureController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditAboutUsFeature">
        <AboutUsFeatureForm @update:data="setParams" :data="state.data!" />
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
