<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import PartnerForm from './PartnerForm.vue'
import type Params from '@/base/core/params/params'
import AddPartnerController from '../controllers/addPartnerController'
import type AddPartnerParams from '../../Core/params/addPartnerParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addPartnerController = AddPartnerController.getInstance()

const addPartner = async () => {
  await addPartnerController.addPartner(params.value as AddPartnerParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addPartner">
    <PartnerForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
