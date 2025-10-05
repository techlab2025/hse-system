<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import PermissionForm from './PermissionForm.vue'
import type Params from '@/base/core/params/params'
import ShowPermissionteController from '../controllers/showPermissionController'
import ShowPermissionParams from '../../Core/params/showPermissionParams'
import EditPermissionController from '../controllers/editPermissionController'
import { getOrganizationType } from '../Helpers/organization_type'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showPermissionController = ShowPermissionteController.getInstance()
const state = ref(showPermissionController.state.value)

const baseSegment = `${route.path.split('/')[1]}`
const type = getOrganizationType(baseSegment)

const fetchPermissionDetails = async () => {
  const PermissionParams = new ShowPermissionParams(type, +route.params.id)

  await showPermissionController.showPermission(PermissionParams)
}

onMounted(() => {
  fetchPermissionDetails()
})

const EditPermission = async (draft: boolean) => {
  if (draft) {
    await EditPermissionController.getInstance().editPermission(params.value!, router)
  } else {
    await EditPermissionController.getInstance().editPermission(params.value!, router)
  }
}

watch(
  () => showPermissionController.state.value,
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
      <form @submit.prevent="EditPermission">
        <PermissionForm @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">Edit</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
