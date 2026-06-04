<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import type AddLocationParams from '../../../Core/params/addLocationParams'
import AddLocationController from '../../controllers/addLocationController'
import LocationAreaForm from './LocationAreaForm.vue'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

const router = useRouter()
const route = useRoute()
const params = ref<Params | null>(null)
const formKey = ref(0)
const emit = defineEmits(['update:data'])

const addLocationController = AddLocationController.getInstance()

const addLocation = async () => {
  const state = await addLocationController.addLocation(params.value as AddLocationParams, router)
  emit('update:data')
  if (
    state?.value &&
    !router.currentRoute.value.fullPath.includes('project-progress') &&
    !router.currentRoute.value.fullPath.includes('project/add')
  ) {
    router.push('/organization/areas')
  }
}

const saveAndAdd = async () => {
  const state = await addLocationController.addLocation(params.value as AddLocationParams, router, true)
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
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addLocation">
    <LocationAreaForm :key="formKey" @update:data="setParams" />

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
    &.w-full { width: 100%; }
    &.w-1\/2 { width: 50%; }
  }
}
</style>
