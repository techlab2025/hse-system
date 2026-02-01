<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowRoleteController from '../controllers/showRoleController'
import ShowRoleParams from '../../Core/params/showRoleParams'
import EditRoleController from '../controllers/editRoleController'
import RoleForm from './RoleForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showRoleController = ShowRoleteController.getInstance()
const state = ref(showRoleController.state.value)
const fetchRoleDetails = async () => {
  const RoleParams = new ShowRoleParams(Number(id))

  await showRoleController.showRole(RoleParams)
}

onMounted(() => {
  fetchRoleDetails()
})

const EditRole = async (draft: boolean) => {
  if (draft) {
    await EditRoleController.getInstance().editRole(params.value!, router)
  } else {
    await EditRoleController.getInstance().editRole(params.value!, router)
  }
}

watch(
  () => showRoleController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState)
      state.value = newState
    }
  },
)

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <!--      <pre>-->
      <!--              {{ state.data?.titles }}-->

      <!--      </pre>-->
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditRole">
        <RoleForm @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">{{ $t('Edit') }}</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
