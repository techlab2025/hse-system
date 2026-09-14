<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import MeetingTypeForm from './MeetingTypeForm.vue'
import AddMeetingTypeController from '../controllers/addMeetingTypeController'
import type AddMeetingTypeParams from '../../Core/params/addMeetingTypeParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof MeetingTypeForm> | null>(null)
const emit = defineEmits(['update:data'])

const addMeetingTypeController = AddMeetingTypeController.getInstance()

const addMeetingType = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await addMeetingTypeController.addMeetingType(
    params.value as AddMeetingTypeParams,
    router,
  )
  emit('update:data')
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  addMeetingTypeController.setLoading()
  await addMeetingTypeController.addMeetingType(
    params.value as AddMeetingTypeParams,
    stayOnPageRouter,
  )
  if (addMeetingTypeController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addMeetingType">
    <MeetingTypeForm :key="formKey" ref="formRef" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
