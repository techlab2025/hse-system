<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import AddLangController from '@/features/setting/languages/Presentation/controllers/addLangController.ts'
import AddLangParams from '@/features/setting/languages/Core/params/addLangParams.ts'
import type Params from '@/base/core/params/params'
import IndustryForm from '@/features/setting/Industries/Presentation/components/IndustryForm.vue'
import CreateIndustryController from '../controllers/createIndustryController'

const router = useRouter()
const params = ref<Params | null>(null)

const createIndustryController = CreateIndustryController.getInstance()

const addLang = async () => {
  await createIndustryController.CreateIndustry(params.value as AddLangParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addLang">
    <IndustryForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
