<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import AddHerikalyController from '../controllers/addHerikalyController'
import type AddHerikalyParams from '../../Core/params/addHerikalyParams'
import HerikalyForm from './HerikalyForm.vue'
const emit = defineEmits(['update:data'])

const router = useRouter()
const params = ref<Params | null>(null)

const addHerikalyController = AddHerikalyController.getInstance()

const addHerikaly = async () => {
  console.log(params.value, 'params')
  const state = await addHerikalyController.addHerikaly(params.value as AddHerikalyParams, router)
  emit('update:data')
}
const setParams = (data: Params) => {
  // console.log(data, 'data')
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addHerikaly">
    <HerikalyForm @update:data="setParams" />
    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary w-full"">{{ $t('add') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
