<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import FaqForm from '@/features/website/Faq/Presentation/components/FaqForm.vue'
import type Params from '@/base/core/params/params'
import ShowFaqParams from '../../Core/params/showFaqParams'
import ShowFaqController from '../controllers/showFaqController'
import EditFaqController from '../controllers/editFaqController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showFaqController = ShowFaqController.getInstance()
const state = ref(showFaqController.state.value)
const fetchFaqDetails = async () => {
  const FaqParams = new ShowFaqParams(Number(id))

  await showFaqController.showFaq(FaqParams)
}

onMounted(() => {
  fetchFaqDetails()
})

const EditFaq = async (draft: boolean) => {
  if (draft) {
    await EditFaqController.getInstance().editFaq(params.value!, router)
  } else {
    await EditFaqController.getInstance().editFaq(params.value!, router)
  }
}

watch(
  () => showFaqController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditFaq">
        <FaqForm @update:data="setParams" :data="state.data!" />
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
