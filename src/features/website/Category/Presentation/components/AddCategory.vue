<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import CategoryForm from './CategoryForm.vue'
import type Params from '@/base/core/params/params'
import type AddCategoryParams from '../../Core/params/addCategoryParams'
import AddCategoryController from '../controllers/addCategoryController'

const router = useRouter()
const params = ref<Params | null>(null)

const addCategoryController = AddCategoryController.getInstance()

const addCategory = async () => {
  await addCategoryController.addCategory(params.value as AddCategoryParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addCategory">

    <CategoryForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
