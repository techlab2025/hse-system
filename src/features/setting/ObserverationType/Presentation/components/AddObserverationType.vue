<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import ObserverationTypeForm from '@/features/setting/ObserverationType/Presentation/components/ObserverationTypeForm.vue'
import AddObserverationTypeController from '@/features/setting/ObserverationType/Presentation/controllers/addObserverationTypeController.ts'
import AddObserverationTypeParams from '@/features/setting/ObserverationType/Core/params/addObserverationTypeParams.ts'
import type Params from '@/base/core/params/params'

const router = useRouter()
const params = ref<Params | null>(null)

const addObserverationTypeController = AddObserverationTypeController.getInstance()

const addObserverationType = async () => {
  console.log(params.value, 'params')
  await addObserverationTypeController.addObserverationType(
    params.value as AddObserverationTypeParams,
    router,
  )
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addObserverationType">
    <ObserverationTypeForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button @click="$emit(`update:data`)" type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
