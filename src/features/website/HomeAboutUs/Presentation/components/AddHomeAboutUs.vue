<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import HomeAboutUsForm from './HomeAboutUsForm.vue'
import type Params from '@/base/core/params/params'
import AddHomeAboutUsController from '../controllers/addHomeAboutUsController'
import type AddHomeAboutUsParams from '../../Core/params/addHomeAboutUsParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addHomeAboutUsController = AddHomeAboutUsController.getInstance()

const addHomeAboutUs = async () => {
  await addHomeAboutUsController.addHomeAboutUs(params.value as AddHomeAboutUsParams, router)
}

const saveAndNew = async () => {
  addHomeAboutUsController.setLoading()
  await addHomeAboutUsController.addHomeAboutUs(
    params.value as AddHomeAboutUsParams,
    stayOnPageRouter,
  )
  if (addHomeAboutUsController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addHomeAboutUs">
    <HomeAboutUsForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
