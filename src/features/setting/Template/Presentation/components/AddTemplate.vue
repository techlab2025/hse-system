<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import TemplateForm from '@/features/setting/Template/Presentation/components/TemplateForm.vue'
import type Params from '@/base/core/params/params'
import AddTemplateController from '../controllers/addTemplateController'
import type AddTemplateParams from '../../Core/params/addTemplateParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addTemplateController = AddTemplateController.getInstance()

const addTemplate = async () => {
  console.log(params.value, 'Add params')
  await addTemplateController.addTemplate(params.value as AddTemplateParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addTemplate">

    <TemplateForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary w-full">{{ $t("add") }}</button>
    </div>
  </form>
</template>

<style scoped></style>
