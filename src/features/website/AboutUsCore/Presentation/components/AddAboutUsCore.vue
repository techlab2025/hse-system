<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import AboutUsCoreForm from './AboutUsCoreForm.vue'
import type Params from '@/base/core/params/params'
import AddAboutUsCoreController from '../controllers/addAboutUsCoreController'
import type AddAboutUsCoreParams from '../../Core/params/addAboutUsCoreParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addAboutUsCoreController = AddAboutUsCoreController.getInstance()

const addAboutUsCore = async () => {
  await addAboutUsCoreController.addAboutUsCore(params.value as AddAboutUsCoreParams, router)
}

const saveAndNew = async () => {
  addAboutUsCoreController.setLoading()
  await addAboutUsCoreController.addAboutUsCore(
    params.value as AddAboutUsCoreParams,
    stayOnPageRouter,
  )
  if (addAboutUsCoreController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addAboutUsCore">
    <AboutUsCoreForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
