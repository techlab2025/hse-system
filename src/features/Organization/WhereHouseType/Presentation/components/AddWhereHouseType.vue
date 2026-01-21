<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import WhereHouseTypeForm from './WhereHouseTypeForm.vue'
import AddWhereHouseTypeController from '../controllers/addWhereHouseTypeController'
import type AddWhereHouseTypeParams from '../../Core/params/addWhereHouseTypeParams'

const router = useRouter()
const params = ref<Params | null>(null)

const addWhereHouseTypeController = AddWhereHouseTypeController.getInstance()

const addWhereHouseType = async () => {
  await addWhereHouseTypeController.addWhereHouseType(
    params.value as AddWhereHouseTypeParams,
    router,
  )
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addWhereHouseType">
    <WhereHouseTypeForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">{{ $t('add') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
