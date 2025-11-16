<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
// import AddEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/addEquipmentTypeParams.ts'
import type Params from '@/base/core/params/params'
import EquipmentForm from './FormData.vue'
import AddEquipmentController from '../controllers/addEquipmentController'
import type AddEquipmentParams from '../../Core/params/addEquipmentParams'
// import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'

const router = useRouter()
const params = ref<Params | null>(null)

// Validation states
const isFormValid = ref(false)
const showValidationErrors = ref(false)
const isSubmitting = ref(false)

const equipmentFormRef = ref<InstanceType<typeof EquipmentForm> | null>(null)

const addEquipmentController = AddEquipmentController.getInstance()

const addEquipment = async () => {
  // Show validation errors
  showValidationErrors.value = true

  // Validate form
  if (equipmentFormRef.value) {
    const isValid = equipmentFormRef.value.validate()

    if (!isValid) {
      console.error('Form validation failed')

      return
    }
  }

  if (!params.value) {
    console.error('Form data is not ready')
    return
  }

  try {
    isSubmitting.value = true
    // console.log(params.value, 'params')

    await addEquipmentController.addEquipment(params.value as AddEquipmentParams, router)
  } catch (error) {
    console.error('Error adding equipment:', error)
  } finally {
    isSubmitting.value = false
  }
}

const setParams = (data: Params) => {
  params.value = data
}

const handleValidation = (valid: boolean) => {
  isFormValid.value = valid
}
</script>

<template>
  <form class="equipment-form" @submit.prevent="addEquipment">
    <EquipmentForm ref="equipmentFormRef" @update:data="setParams" @validate="handleValidation" />

    <div class="flex items-center gap-2">
      <button
        type="submit"
        class="btn btn-primary w-30"
        :disabled="isSubmitting"
        :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
      >
        <span>Cancel</span>
      </button>

      <button
        type="submit"
        class="btn btn-primary w-full"
        :disabled="isSubmitting"
        :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
      >
        <span>Add Equipment</span>
      </button>
    </div>
  </form>
</template>

<style scoped></style>
