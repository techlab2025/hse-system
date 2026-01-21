<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import AddProjectZoneController from '../controllers/addProjectZoneController'
import type AddProjectZoneParams from '../../Core/params/addProjectZoneParams'
import ProjectZoneForm from './ProjectZoneForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)
const emit = defineEmits(['update:data'])

const addProjectZoneController = AddProjectZoneController.getInstance()

const addProjectZone = async () => {
  console.log(params.value, 'params')
  await addProjectZoneController.addProjectZone(params.value as AddProjectZoneParams, router)
  emit('update:data')
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addProjectZone">
    <ProjectZoneForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary w-full">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
