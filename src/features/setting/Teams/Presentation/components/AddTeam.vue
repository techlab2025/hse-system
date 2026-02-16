<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import type Params from '@/base/core/params/params'
import TeamForm from './TeamForm.vue'
import AddTeamController from '../controllers/addTeamController'
import type AddTeamParams from '../../Core/params/addTeamParams'

const router = useRouter()
const params = ref<Params | null>(null)
const emit = defineEmits(['update:data'])
const addTeamController = AddTeamController.getInstance()

const addTeam = async () => {
  console.log(params.value, 'params')
  await addTeamController.addTeam(params.value as AddTeamParams, router)
  emit('update:data')
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8" @submit.prevent="addTeam">
    <TeamForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
