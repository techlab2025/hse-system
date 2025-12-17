<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import type AddLocationParams from '../../../Core/params/addLocationParams'
import AddLocationController from '../../controllers/addLocationController'
import LocationAreaForm from './LocationAreaForm.vue'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

const router = useRouter()
const params = ref<Params | null>(null)
const emit = defineEmits(['update:data'])

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
    <LocationAreaForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary w-full" @click="$emit('update:data')">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
