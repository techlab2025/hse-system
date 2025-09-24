<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import LocationCountryForm from './LocationStateForm.vue'
import type AddLocationParams from '../../../Core/params/addLocationParams'
import AddLocationController from '../../controllers/addLocationController'
import LocationStateForm from './LocationStateForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addLocationController = AddLocationController.getInstance()

const addLocation = async () => {
  await addLocationController.addLocation(params.value as AddLocationParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addLocation">
    <LocationStateForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
