<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import OurSystemStepForm from '@/features/website/OurSystemStep/Presentation/components/OurSystemStepForm.vue'
import type Params from '@/base/core/params/params'
import ShowOurSystemStepParams from '../../Core/params/showOurSystemStepParams'
import ShowOurSystemStepController from '../controllers/showOurSystemStepController'
import EditOurSystemStepController from '../controllers/editOurSystemStepController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showOurSystemStepController = ShowOurSystemStepController.getInstance()
const state = ref(showOurSystemStepController.state.value)
const fetchOurSystemStepDetails = async () => {
  const OurSystemStepParams = new ShowOurSystemStepParams(Number(id))

  await showOurSystemStepController.showOurSystemStep(OurSystemStepParams)
}

onMounted(() => {
  fetchOurSystemStepDetails()
})

const EditOurSystemStep = async (draft: boolean) => {
  if (draft) {
    await EditOurSystemStepController.getInstance().editOurSystemStep(params.value!, router)
  } else {
    await EditOurSystemStepController.getInstance().editOurSystemStep(params.value!, router)
  }
}

watch(
  () => showOurSystemStepController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditOurSystemStep">
        <OurSystemStepForm @update:data="setParams" :data="state.data!" />
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
