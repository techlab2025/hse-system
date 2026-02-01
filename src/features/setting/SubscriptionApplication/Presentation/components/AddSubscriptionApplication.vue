<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import SubscriptionForm from './SubscriptionApplicationForm.vue'
import AddSubscriptionController from '../controllers/ApproveSubscriptionApplicationController'
import type AddSubscriptionParams from '../../Core/params/ApproveSubscriptionApplication'
import SubscriptionApplicationForm from './SubscriptionApplicationForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const addSubscriptionController = AddSubscriptionController.getInstance()

const addSubscription = async () => {
  console.log(params.value, 'params')
  await addSubscriptionController.addSubscription(params.value as AddSubscriptionParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8" @submit.prevent="addSubscription">
    <SubscriptionApplicationForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary ">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
