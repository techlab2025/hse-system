<script lang="ts" setup>
import { useSubmissionValidation } from '@/composables/useSubmissionValidation'

import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import LangForm from '@/features/setting/languages/Presentation/components/LangForm.vue'
import AddLangController from '@/features/setting/languages/Presentation/controllers/addLangController.ts'
import AddLangParams from '@/features/setting/languages/Core/params/addLangParams.ts'
import type Params from '@/base/core/params/params'

const validateSubmission = useSubmissionValidation('setting/languages/Core/params/addLangParams')

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addLangController = AddLangController.getInstance()

const addLang = async () => {
  if (!(await validateSubmission(params.value))) return

  await addLangController.addLang(params.value as AddLangParams, router)
}

const saveAndNew = async () => {
  if (!(await validateSubmission(params.value))) return

  addLangController.setLoading()
  await addLangController.addLang(params.value as AddLangParams, stayOnPageRouter)
  if (addLangController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form novalidate class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addLang">
    <LangForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
