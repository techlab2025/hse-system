<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import PartnerForm from './ProjectProgressForm.vue'
import type Params from '@/base/core/params/params'
import AddPartnerController from '../controllers/addPartnerController'
import type AddPartnerParams from '../../Core/params/addPartnerParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addPartnerController = AddPartnerController.getInstance()

const addPartner = async () => {
  await addPartnerController.addPartner(params.value as AddPartnerParams, router)
}

const saveAndNew = async () => {
  addPartnerController.setLoading()
  await addPartnerController.addPartner(params.value as AddPartnerParams, stayOnPageRouter)
  if (addPartnerController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addPartner">
    <PartnerForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
