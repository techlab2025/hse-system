<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import EquipmentTypeForm from '@/features/setting/EquipmentType/Presentation/components/EquipmentTypeForm.vue'
import AddEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/addEquipmentTypeController.ts'
import AddEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/addEquipmentTypeParams.ts'
import type Params from '@/base/core/params/params'

const router = useRouter()
const params = ref<Params | null>(null)

const addEquipmentTypeController = AddEquipmentTypeController.getInstance()

const addEquipmentType = async () => {
  await addEquipmentTypeController.addEquipmentType(params.value as AddEquipmentTypeParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addEquipmentType">

    <EquipmentTypeForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
