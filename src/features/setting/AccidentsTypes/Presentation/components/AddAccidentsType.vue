<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import HazardTypeForm from '@/features/setting/HazardType/Presentation/components/HazardTypeForm.vue'
import AddHazardTypeParams from '@/features/setting/HazardType/Core/params/addHazardTypeParams.ts'
import type Params from '@/base/core/params/params'
import AddAccidentsTypeController from '../controllers/addAccidentsTypeController'
import AccidentsTypeForm from './AccidentsTypeForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)
const emit = defineEmits(['update:data'])
const addAccidentsTypeController = AddAccidentsTypeController.getInstance()

const addAccidentsType = async () => {
  await addAccidentsTypeController.addAccidentsType(params.value as AddHazardTypeParams, router)
  emit(`update:data`)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addAccidentsType">
    <AccidentsTypeForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">{{ $t('add') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
