<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import type Params from '@/base/core/params/params'
import { validateRequiredFields } from '@/base/Presentation/utils/validate_required_fields'
import { validationEnum } from '@/base/Presentation/utils/validation_enum'
import validationDialogService from '@/base/Presentation/utils/validationService' // Import validation dialog
import AddAdminController from '../controllers/add_admin_controller'
import type AddAdminParams from '../../Core/Params/add_admin_params'
import AdminForm from './AdminForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addAdminController = AddAdminController.getInstance()

const addAdmin = async () => {
  const missingFields = validateRequiredFields(params.value)

  if (Object.keys(missingFields).length > 0) {
    const validationMode = validationEnum.BOTH // Choose your mode: "dialog", "inline", or "both"
    validationDialogService.validate(missingFields, validationMode)
    return
  }

  await addAdminController.addAdmin(params.value as AddAdminParams, router)
}
const setParams = (data: Params) => {
  // console.log(data)
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-2 gap-5" @submit.prevent="addAdmin">
    <AdminForm @update:updateData="setParams" />

    <div class="button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
