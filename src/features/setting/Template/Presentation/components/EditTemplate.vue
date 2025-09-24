<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import TemplateForm from '@/features/setting/Template/Presentation/components/TemplateForm.vue'
import type Params from '@/base/core/params/params'
import ShowTemplateController from '../controllers/showTemplateController'
import ShowTemplateParams from '../../Core/params/showTemplateParams'
import EditTemplateController from '../controllers/editTemplateController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showTemplateController = ShowTemplateController.getInstance()
const state = ref(showTemplateController.state.value)
const fetchTemplateDetails = async () => {
  const TemplateParams = new ShowTemplateParams(Number(id))

  await showTemplateController.showTemplate(TemplateParams)
}

onMounted(() => {
  fetchTemplateDetails()
})

const EditTemplate = async (draft: boolean) => {
  if (draft) {
    await EditTemplateController.getInstance().editTemplate(params.value!, router)
  } else {
    await EditTemplateController.getInstance().editTemplate(params.value!, router)
  }
}

watch(
  () => showTemplateController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditTemplate">
        <TemplateForm @update:data="setParams" :data="state.data!" />
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
