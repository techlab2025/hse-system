<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import TermForm from './TermForm.vue'
import type Params from '@/base/core/params/params'
import type AddTermParams from '../../Core/params/addTermParams'
import AddTermController from '../controllers/addTermController'


const router = useRouter()
const params = ref<Params | null>(null)

const addTermController = AddTermController.getInstance()

const addTerm = async () => {
  await addTermController.addTerm(params.value as AddTermParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addTerm">
    <TermForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
