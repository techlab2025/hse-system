<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import CheckListForm from './CheckListForm.vue'
import AddCheckListController from '../controllers/addCheckListController'
import type AddCheckListParams from '../../Core/params/addCheckListParams'

const router = useRouter()
const params = ref<Params | null>(null)
const emit = defineEmits(['update:data'])

const addCheckListController = AddCheckListController.getInstance()

const addCheckList = async () => {
  await addCheckListController.addCheckList(
    params.value as AddCheckListParams,
    router,
  )
  emit('update:data')
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addCheckList">
    <CheckListForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
