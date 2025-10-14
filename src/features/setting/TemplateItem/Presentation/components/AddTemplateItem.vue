<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import AddTemplateItemTypeParams from '@/features/setting/TemplateItemType/Core/params/addTemplateItemTypeParams.ts'
import type Params from '@/base/core/params/params'
import TemplateItemForm from './TemplateItemForm.vue'
import AddTemplateItemController from '../controllers/addTemplateItemController'
import type AddTemplateItemParams from '../../Core/params/addTemplateItemParams'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'
import FormHeaderSection from '@/shared/FormHeader/FormHeaderSection.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addTemplateItemController = AddTemplateItemController.getInstance()

const addTemplateItem = async () => {
  console.log(params.value, 'params')
  await addTemplateItemController.addTemplateItem(params.value as AddTemplateItemParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}


</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4" @submit.prevent="addTemplateItem">
    <TemplateItemForm @update:data="setParams" />
    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
