<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import TermForm from '@/features/website/Term/Presentation/components/TermForm.vue'
import type Params from '@/base/core/params/params'
import ShowTermParams from '../../Core/params/showTermParams'
import ShowTermController from '../controllers/showTermController'
import EditTermController from '../controllers/editTermController'

const router = useRouter()
const params = ref<Params | null>(null)

const showTermController = ShowTermController.getInstance()
const state = ref(showTermController.state.value)
const fetchTermDetails = async () => {
  const TermParams = new ShowTermParams(1)

  await showTermController.showTerm(TermParams)
}

onMounted(() => {
  fetchTermDetails()
  // console.log('fetchTermDetails');

})

const EditTerm = async (draft: boolean) => {
  if (draft) {
    await EditTermController.getInstance().editTerm(params.value!, router)
  } else {
    await EditTermController.getInstance().editTerm(params.value!, router)
  }
}

watch(
  () => showTermController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditTerm">
        <TermForm @update:data="setParams" :data="state.data!" />
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
