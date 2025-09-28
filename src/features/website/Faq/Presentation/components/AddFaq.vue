<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import FaqForm from './FaqForm.vue'
import type Params from '@/base/core/params/params'
import type AddFaqParams from '../../Core/params/addFaqParams'
import AddFaqController from '../controllers/addFaqController'

const router = useRouter()
const params = ref<Params | null>(null)

const addFaqController = AddFaqController.getInstance()

const addFaq = async () => {
  await addFaqController.addFaq(params.value as AddFaqParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addFaq">
    <FaqForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
