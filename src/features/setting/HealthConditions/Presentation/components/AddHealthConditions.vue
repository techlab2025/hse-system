<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import HealthConditionsForm from '@/features/setting/HealthConditions/Presentation/components/HealthConditionsForm.vue'
import AddHealthConditionsController from '@/features/setting/HealthConditions/Presentation/controllers/addHealthConditionsController.ts'
import AddHealthConditionsParams from '@/features/setting/HealthConditions/Core/params/addHealthConditionsParams.ts'
import type Params from '@/base/core/params/params'

const router = useRouter()
const params = ref<Params | null>(null)

const addHealthConditionsController = AddHealthConditionsController.getInstance()

const addHealthConditions = async () => {
  console.log(params.value, 'params')
  await addHealthConditionsController.addHealthConditions(params.value as AddHealthConditionsParams, router)
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addHealthConditions">

    <HealthConditionsForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
