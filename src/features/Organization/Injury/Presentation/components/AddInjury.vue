<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import InjuryForm from './InjuryForm.vue'
import type Params from '@/base/core/params/params'
import AddInjuryController from '../controllers/addInjuryController'
import type AddInjuryParams from '../../Core/params/addInjuryParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const emit = defineEmits(['close:dialog'])
const addInjuryController = AddInjuryController.getInstance()

const addInjury = async () => {
  await addInjuryController.addInjury(params.value as AddInjuryParams, router)
  emit('close:dialog')
}

const saveAndNew = async () => {
  addInjuryController.setLoading()
  await addInjuryController.addInjury(params.value as AddInjuryParams, stayOnPageRouter)
  if (addInjuryController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addInjury">
    <InjuryForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
