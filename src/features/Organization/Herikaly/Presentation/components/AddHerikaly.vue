<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import AddHerikalyController from '../controllers/addHerikalyController'
import type AddHerikalyParams from '../../Core/params/addHerikalyParams'
import HerikalyForm from './HerikalyForm.vue'

const props = withDefaults(
  defineProps<{
    showCertificateSelectAll?: boolean
  }>(),
  {
    showCertificateSelectAll: true,
  },
)

const emit = defineEmits(['update:data'])
const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const route = useRoute()
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof HerikalyForm> | null>(null)

const addHerikalyController = AddHerikalyController.getInstance()

const addHerikaly = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  console.log(params.value, 'params')
  addHerikalyController.setLoading()
  await addHerikalyController.addHerikaly(params.value as AddHerikalyParams, router)
  if (addHerikalyController.isDataSuccess()) emit('update:data')
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  addHerikalyController.setLoading()
  await addHerikalyController.addHerikaly(params.value as AddHerikalyParams, stayOnPageRouter, true)
  if (addHerikalyController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addHerikaly">
    <HerikalyForm
      ref="formRef"
      :key="formKey"
      :show-certificate-select-all="props.showCertificateSelectAll"
      @update:data="setParams"
    />
    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" @click.prevent="saveAndNew" class="btn btn-secondary">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">
        {{ route.path.includes('project-progress') ? $t('save and next step') : $t('save') }}
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :class="route.path.includes('project-progress') ? 'w-1/2' : 'w-full'"
      >
        {{ route.path.includes('project-progress') ? $t('save and next step') : $t('save') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.button-wrapper {
  display: flex;
  gap: 1rem;
  flex-direction: row !important;
  width: 100% !important;
  button {
    &.w-full {
      width: 100%;
    }
    &.w-1\/2 {
      width: 50%;
    }
  }
}
</style>
