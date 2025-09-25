<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import CategoryForm from '@/features/setting/Category/Presentation/components/CategoryForm.vue'
import type Params from '@/base/core/params/params'
import ShowCategoryParams from '../../Core/params/showCategoryParams'
import ShowCategoryController from '../controllers/showCategoryController'
import EditCategoryController from '../controllers/editCategoryController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showCategoryController = ShowCategoryController.getInstance()
const state = ref(showCategoryController.state.value)
const fetchCategoryDetails = async () => {
  const CategoryParams = new ShowCategoryParams(Number(id))

  await showCategoryController.showCategory(CategoryParams)
}

onMounted(() => {
  fetchCategoryDetails()
})

const EditCategory = async (draft: boolean) => {
  if (draft) {
    await EditCategoryController.getInstance().editCategory(params.value!, router)
  } else {
    await EditCategoryController.getInstance().editCategory(params.value!, router)
  }
}

watch(
  () => showCategoryController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditCategory">
        <CategoryForm @update:data="setParams" :data="state.data!" />
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
