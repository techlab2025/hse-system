<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import PrivacyForm from './PrivacyForm.vue'
import type Params from '@/base/core/params/params'
import type AddPrivacyParams from '../../Core/params/addPrivacyParams'
import AddPrivacyController from '../controllers/addPrivacyController'

const router = useRouter()
const params = ref<Params | null>(null)

const addPrivacyController = AddPrivacyController.getInstance()

const addPrivacy = async () => {
  await addPrivacyController.addPrivacy(params.value as AddPrivacyParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addPrivacy">
    <PrivacyForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
