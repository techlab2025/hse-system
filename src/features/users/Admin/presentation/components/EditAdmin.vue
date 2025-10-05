<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import ImageUser from '@/components/HelpersComponents/ImageUser.vue'
// import PrimaryButton from '@/components/HelpersComponents/PrimaryButton.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowClientModel from '@/features/users/Admin/Data/models/show_admin_model'
// import { validateRequiredFields } from '@/base/Presentation/utils/validate_required_fields'
// import { validationEnum } from '@/base/Presentation/utils/validation_enum'
// import validationDialogService from '@/base/Presentation/utils/validationService' // Import validation dialog
import ShowAdminController from '../controllers/show_admin_controller'
import ShowAdminParams from '../../Core/Params/show_admin_params'
import EditAdminController from '../controllers/edit_admin_controller'
import AdminForm from './AdminForm.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'

const route = useRoute()
const router = useRouter()
const id = ref(route.params.id)
const params = ref<Params | null>(null)
const AdminDetails = ref<ShowClientModel | null>(null)

const showAdminController = ShowAdminController.getInstance()
const state = ref(showAdminController.state.value)
const fetchAdminDetails = async () => {
  const ClientParams = new ShowAdminParams(id.value as string)

  const response = await showAdminController.showAdmin(ClientParams)
  AdminDetails.value = response.value.data
}

onMounted(() => {
  fetchAdminDetails()
})

const EditClient = async (draft: boolean) => {
  await EditAdminController.getInstance().editAdmin(params.value!, router)
}

watch(
  () => showAdminController.state.value,
  (newState) => {
    if (newState) {
      // console.log(newState)
      state.value = newState
    }
  },
)

const setParams = (data: Params) => {
  // console.log(data)
  params.value = data
}
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <form class="grid grid-cols-2 gap-5" @submit.prevent="EditClient">
        <AdminForm :AdminData="AdminDetails" @update:updateData="setParams" />
        <div class="button-wrapper">
          <button type="submit" class="btn btn-primary">Edit</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
