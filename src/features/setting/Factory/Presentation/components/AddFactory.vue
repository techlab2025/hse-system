<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import AddFactoryController from '../controllers/addFactoryController'
import type AddFactoryParams from '../../Core/params/addFactoryParams'
import FactoryForm from './FactoryForm.vue'

const router = useRouter()
const route = useRoute()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)
const emit = defineEmits<{ 'update:data': [] }>()

const addFactoryController = AddFactoryController.getInstance()

const addFactory = async () => {
  await addFactoryController.addFactory(params.value as AddFactoryParams, router)
  if (addFactoryController.isDataSuccess()) emit('update:data')
}

const saveAndNew = async () => {
  addFactoryController.setLoading()
  await addFactoryController.addFactory(params.value as AddFactoryParams, stayOnPageRouter)
  if (addFactoryController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addFactory">
    <FactoryForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">
        {{ route.path.includes('project-progress') ? $t('save and next step') : $t('save') }}
      </button>
    </div>
  </form>
</template>

<style scoped></style>
