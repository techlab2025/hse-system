<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowIndustryController from '../controllers/showIndustryController'
import ShowIndustryParams from '../../Core/Params/showIndustryParams'
import IndustryForm from './IndustryForm.vue'
import UpdateIndustryController from '../controllers/updateIndustryController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showIndustryController = ShowIndustryController.getInstance()
const state = ref(showIndustryController.state.value)
const fetchLangDetails = async () => {
  const showIndustryParams = new ShowIndustryParams(Number(id))

  await showIndustryController.ShowIndustry(showIndustryParams, router)
}

onMounted(() => {
  fetchLangDetails()
})

const EditIndustry = async (draft: boolean) => {
  if (draft) {
    await UpdateIndustryController.getInstance().UpdateIndustry(params.value!, router)
  } else {
    await UpdateIndustryController.getInstance().UpdateIndustry(params.value!, router)
  }
}

watch(
  () => showIndustryController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditIndustry">
        <IndustryForm @update:data="setParams" :data="state.data!" />
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
