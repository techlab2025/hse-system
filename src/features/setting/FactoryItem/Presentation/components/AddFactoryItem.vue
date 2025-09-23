<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'

import AddFactoryItemController from '@/features/setting/FactoryItem/Presentation/controllers/addFactoryItemController'
import type AddFactoryItemParams from '@/features/setting/FactoryItem/Core/params/addFactoryItemParams.ts'
import FactoryItemForm from './FactoryItemForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addFactoryController = AddFactoryItemController.getInstance()

const addFactory = async () => {
  await addFactoryController.addFactory(params.value as AddFactoryItemParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addFactory">
    <FactoryItemForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
