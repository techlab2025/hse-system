<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import HazardTypeForm from '@/features/setting/HazardType/Presentation/components/HazardTypeForm.vue'
import AddHazardTypeController from '@/features/setting/HazardType/Presentation/controllers/addHazardTypeController.ts'
import AddHazardTypeParams from '@/features/setting/HazardType/Core/params/addHazardTypeParams.ts'
import type Params from '@/base/core/params/params'

const router = useRouter()
const route = useRoute()
const params = ref<Params | null>(null)

const addHazardTypeController = AddHazardTypeController.getInstance()

const addHazardType = async () => {
  // console.log(params.value, 'params')
  await addHazardTypeController.addHazardType(params.value as AddHazardTypeParams, router)
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addHazardType">

    <HazardTypeForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
