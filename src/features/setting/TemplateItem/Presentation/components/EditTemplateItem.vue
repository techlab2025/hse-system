<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import EditTemplateItemController from '../controllers/editTemplateItemController'
import ShowTemplateItemParams from '../../Core/params/showTemplateItemParams'
import ShowTemplateItemController from '../controllers/showTemplateItemController'
import TemplateItemForm from './TemplateItemForm.vue'

const route = useRoute()
const router = useRouter()
//id =  template_id / parent_id =tempalte_item_id

const id = route.params.parent_id
const params = ref<Params | null>(null)

const showTemplateItemController = ShowTemplateItemController.getInstance()
const state = ref(showTemplateItemController.state.value)

const fetchTemplateItemDetails = async () => {
  const TemplateItemParams = new ShowTemplateItemParams(Number(id))

  await showTemplateItemController.showTemplateItemType(TemplateItemParams)
}

onMounted(() => {
  fetchTemplateItemDetails()
})

const EditTemplateItem = async (draft: boolean) => {
  if (draft) {
    await EditTemplateItemController.getInstance().editTemplateItem(params.value!, router)
  } else {
    await EditTemplateItemController.getInstance().editTemplateItem(params.value!, router)
  }
}

watch(
  () => showTemplateItemController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditTemplateItem">
        <TemplateItemForm @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary w-full">Edit</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
