<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import HashtagForm from './HashtagForm.vue'
import type Params from '@/base/core/params/params'
import type AddHashtagParams from '../../Core/params/addHashtagParams'
import AddHashtagController from '../controllers/addHashtagController'

const router = useRouter()
const params = ref<Params | null>(null)

const addHashtagController = AddHashtagController.getInstance()

const addHashtag = async () => {
  await addHashtagController.addHashtag(params.value as AddHashtagParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addHashtag">
    <HashtagForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
