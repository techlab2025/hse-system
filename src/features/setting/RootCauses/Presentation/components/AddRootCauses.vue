<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import RootCausesForm from '@/features/setting/RootCauses/Presentation/components/RootCausesForm.vue'
import AddRootCausesController from '@/features/setting/RootCauses/Presentation/controllers/addRootCausesController.ts'
import AddRootCausesParams from '@/features/setting/RootCauses/Core/params/addRootCausesParams.ts'
import type Params from '@/base/core/params/params'

const router = useRouter()
const emit = defineEmits(['close:data'])
const params = ref<Params | null>(null)

const addRootCausesController = AddRootCausesController.getInstance()

const addRootCauses = async () => {
  await addRootCausesController.addRootCauses(params.value as AddRootCausesParams, router)
  emit('close:data')
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addRootCauses">

    <RootCausesForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
