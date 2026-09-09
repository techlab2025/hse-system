<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AddHazardController from '../../controllers/addHazardController'
import type AddHazardParams from '../../../Core/params/addHazardParams'
import ObservationForm from './ObservationForm.vue'
import FullObservationFactoryForm from '../FullForm/FullObservationFactoryForm.vue'
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof FullObservationFactoryForm> | null>(null)

const addObservationController = AddHazardController.getInstance()

const addObservation = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  console.log(params.value, 'params')
  await addObservationController.addHazard(params.value as AddHazardParams, router)
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return

  addObservationController.setLoading()
  await addObservationController.addHazard(params.value as AddHazardParams, stayOnPageRouter)
  if (addObservationController.isDataSuccess()) {
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
  <form class="grid grid-cols-1 md:grid-cols-6 gap-4" @submit.prevent="addObservation">
    <!-- <ObservationForm @update:data="setParams" /> -->
    <FullObservationFactoryForm :key="formKey" ref="formRef" @update:data="setParams" />

    <div class="col-span-6 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('submit') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
