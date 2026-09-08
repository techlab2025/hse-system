<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import TeamForm from './TeamForm.vue'
import AddTeamController from '../controllers/addTeamController'
import type AddTeamParams from '../../Core/params/addTeamParams'

const router = useRouter()
const route = useRoute()
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof TeamForm> | null>(null)
const emit = defineEmits(['update:data'])
const addTeamController = AddTeamController.getInstance()

const addTeam = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  console.log(params.value, 'params')
  addTeamController.setLoading()
  await addTeamController.addTeam(params.value as AddTeamParams, router)
  if (addTeamController.isDataSuccess()) emit('update:data')
}

const saveAndAdd = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  addTeamController.setLoading()
  await addTeamController.addTeam(params.value as AddTeamParams, router, true)
  if (addTeamController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8" @submit.prevent="addTeam">
    <TeamForm ref="formRef" :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button
        v-if="route.path.includes('project-progress')"
        type="button"
        @click.prevent="saveAndAdd"
        class="btn btn-primary w-1/2"
      >
        {{ $t('save and add') }}
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :class="route.path.includes('project-progress') ? 'w-1/2' : 'w-full'"
      >
        {{ route.path.includes('project-progress') ? $t('save and next step') : $t('save') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.button-wrapper {
  display: flex;
  gap: 1rem;
  flex-direction: row !important;
  width: 100% !important;
  button {
    &.w-full {
      width: 100%;
    }
    &.w-1\/2 {
      width: 50%;
    }
  }
}
</style>
