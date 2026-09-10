<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import HealthConditionsForm from '@/features/setting/HealthConditions/Presentation/components/HealthConditionsForm.vue'
import AddHealthConditionsController from '@/features/setting/HealthConditions/Presentation/controllers/addHealthConditionsController.ts'
import AddHealthConditionsParams from '@/features/setting/HealthConditions/Core/params/addHealthConditionsParams.ts'
import type Params from '@/base/core/params/params'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addHealthConditionsController = AddHealthConditionsController.getInstance()

const addHealthConditions = async () => {
  console.log(params.value, 'params')
  await addHealthConditionsController.addHealthConditions(
    params.value as AddHealthConditionsParams,
    router,
  )
}

const saveAndNew = async () => {
  console.log(params.value, 'params')
  addHealthConditionsController.setLoading()
  await addHealthConditionsController.addHealthConditions(
    params.value as AddHealthConditionsParams,
    stayOnPageRouter,
  )
  if (addHealthConditionsController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addHealthConditions">
    <HealthConditionsForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
