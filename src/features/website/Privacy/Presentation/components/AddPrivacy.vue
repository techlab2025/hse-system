<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import PrivacyForm from './PrivacyForm.vue'
import type Params from '@/base/core/params/params'
import type AddPrivacyParams from '../../Core/params/addPrivacyParams'
import AddPrivacyController from '../controllers/addPrivacyController'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addPrivacyController = AddPrivacyController.getInstance()

const addPrivacy = async () => {
  await addPrivacyController.addPrivacy(params.value as AddPrivacyParams, router)
}

const saveAndNew = async () => {
  addPrivacyController.setLoading()
  await addPrivacyController.addPrivacy(params.value as AddPrivacyParams, stayOnPageRouter)
  if (addPrivacyController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addPrivacy">
    <PrivacyForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
