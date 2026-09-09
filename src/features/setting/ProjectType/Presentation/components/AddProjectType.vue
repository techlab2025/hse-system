<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import ProjectTypeForm from '@/features/setting/ProjectType/Presentation/components/ProjectTypeForm.vue'
import AddProjectTypeController from '@/features/setting/ProjectType/Presentation/controllers/addProjectTypeController.ts'
import AddProjectTypeParams from '@/features/setting/ProjectType/Core/params/addProjectTypeParams.ts'
import type Params from '@/base/core/params/params'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addProjectTypeController = AddProjectTypeController.getInstance()

const addProjectType = async () => {
  await addProjectTypeController.addProjectType(params.value as AddProjectTypeParams, router)
}

const saveAndNew = async () => {
  addProjectTypeController.setLoading()
  await addProjectTypeController.addProjectType(
    params.value as AddProjectTypeParams,
    stayOnPageRouter,
  )
  if (addProjectTypeController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addProjectType">
    <ProjectTypeForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
