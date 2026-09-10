<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import type AddLocationParams from '../../../Core/params/addLocationParams'
import AddLocationController from '../../controllers/addLocationController'
import LocationCityForm from './LocationCityForm.vue'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const route = useRoute()
const params = ref<Params | null>(null)
const formKey = ref(0)
const emit = defineEmits(['update:data'])
const addLocationController = AddLocationController.getInstance()

const addLocation = async () => {
  const isSuccess = await addLocationController.addLocation(
    params.value as AddLocationParams,
    router,
  )
  if (isSuccess) emit('update:data')
}

const saveAndNew = async () => {
  addLocationController.setLoading()
  const isSuccess = await addLocationController.addLocation(
    params.value as AddLocationParams,
    stayOnPageRouter,
    true,
  )
  if (isSuccess) {
    params.value = null
    formKey.value++
  }
}

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addLocation">
    <LocationCityForm :key="formKey" @update:data="setParams" />

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
