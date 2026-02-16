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

const addEquipmentController = AddEquipmentController.getInstance()
const emit = defineEmits(['update:data'])

const addEquipment = async () => {
  console.log(params.value, 'params')
  await addEquipmentController.addEquipment(params.value as AddEquipmentParams, router)
  emit('update:data')
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8" @submit.prevent="addEquipment">
    <FullEquipmentFrom @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <div class="flex items-center gap-2 !mt-4">
        <router-link v-if="route.path.includes('equipment/add')" to="/organization/equipments" @click.prevent=""
          class="btn btn-danger w-30">
          <span>Cancel</span>
        </router-link>

        <button v-else @click="$emit('close:dialog')" class="btn btn-danger w-30">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary w-full">
          <span>Add Equipment</span>
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped></style>
