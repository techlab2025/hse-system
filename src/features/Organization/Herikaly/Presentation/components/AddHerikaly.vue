<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import AddHerikalyController from '../controllers/addHerikalyController'
import type AddHerikalyParams from '../../Core/params/addHerikalyParams'
import HerikalyForm from './HerikalyForm.vue'

defineProps<{
  showCertificateSelectAll?: boolean
}>()

const emit = defineEmits(['update:data'])
const router = useRouter()
const route = useRoute()
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof HerikalyForm> | null>(null)

const addHerikalyController = AddHerikalyController.getInstance()

const addHerikaly = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  console.log(params.value, 'params')
  await addHerikalyController.addHerikaly(params.value as AddHerikalyParams, router)
  emit('update:data')
}

const saveAndAdd = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  const state = await addHerikalyController.addHerikaly(
    params.value as AddHerikalyParams,
    router,
    true,
  )
  if (!state.value.error) {
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
      :show-certificate-select-all="showCertificateSelectAll"
      @update:data="setParams"
    />
    <div class="col-span-4 button-wrapper">
      <button
        type="submit"
        class="btn btn-primary"
        :class="route.path.includes('project-progress') ? 'w-1/2' : 'w-full'"
      >
        {{ $t('save') }}
      </button>
      <button
        v-if="route.path.includes('project-progress')"
        @click.prevent="saveAndAdd"
        class="btn btn-primary w-1/2"
      >
        {{ $t('save and add') }}
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
