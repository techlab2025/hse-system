<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import SubscriptionTypeForm from './SubscriptionTypeForm.vue'
import AddSubscriptionTypeController from '../controllers/addSubscriptionTypeController'
import type AddSubscriptionTypeParams from '../../Core/params/addSubscriptionTypeParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addSubscriptionTypeController = AddSubscriptionTypeController.getInstance()

const addSubscriptionType = async () => {
  console.log(params.value, 'params')
  await addSubscriptionTypeController.addSubscriptionType(params.value as AddSubscriptionTypeParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8" @submit.prevent="addSubscriptionType">
    <SubscriptionTypeForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary ">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
