<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import FullEquipmentFrom from './FullEquipmentFrom.vue'
import AddEquipmentController from '../controllers/addEquipmentController'
import type AddEquipmentParams from '../../Core/params/addEquipmentParams'
import EmployeeInterfaceCard from '@/features/EmployeeInterface/Presentation/supcomponents/Card/EmployeeInterfaceCard.vue'

const router = useRouter()
const route = useRoute()
const params = ref<Params | null>(null)
const formKey = ref(0)

const addEquipmentController = AddEquipmentController.getInstance()
const emit = defineEmits(['update:data', 'close:dialog'])

const addEquipment = async () => {
  console.log(params.value, 'params')
  await addEquipmentController.addEquipment(params.value as AddEquipmentParams, router)
  emit('update:data')
}

const saveAndAdd = async () => {
  const state = await addEquipmentController.addEquipment(params.value as AddEquipmentParams, router, true)
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
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8" @submit.prevent="addEquipment">
    <FullEquipmentFrom :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <div class="flex items-center gap-2 !mt-4">
        <router-link v-if="route.path.includes('equipment/add')" to="/organization/equipments" @click.prevent=""
          class="btn btn-danger w-30">
          <span>Cancel</span>
        </router-link>
        <button
          type="submit"
          class="btn btn-primary"
          :class="route.path.includes('project-progress') ? 'w-1/2' : 'w-full'"
        >
          <span>{{ $t('save') }}</span>
        </button>
        <button
          v-if="route.path.includes('project-progress')"
          @click.prevent="saveAndAdd"
          class="btn btn-primary w-1/2"
        >
          {{ $t('save and add') }}
        </button>
      </div>
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
