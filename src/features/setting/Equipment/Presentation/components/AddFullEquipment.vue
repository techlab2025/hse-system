<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import FullEquipmentFrom from './FullEquipmentFrom.vue'
import AddEquipmentController from '../controllers/addEquipmentController'
import type AddEquipmentParams from '../../Core/params/addEquipmentParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addEquipmentController = AddEquipmentController.getInstance()


const addEquipment = async () => {
  console.log(params.value, 'params')
  await addEquipmentController.addEquipment(params.value as AddEquipmentParams, router)
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
        <router-link to="/organization/equipments" @click.prevent="" class="btn btn-danger w-30">
          <span>Cancel</span>
        </router-link>

        <button  @click="$emit(`update:data`)" type="submit" class="btn btn-primary w-full">
          <span>Add Equipment</span>
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped></style>
