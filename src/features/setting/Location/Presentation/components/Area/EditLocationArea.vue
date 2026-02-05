<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowLocationController from '../../controllers/showLocationController'
import ShowLocationParams from '../../../Core/params/showLocationParams'
import EditLocationController from '../../controllers/editLocationController'
import LocationCountryForm from './LocationAreaForm.vue'
import LocationAreaForm from './LocationAreaForm.vue'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)
const { user } = useUserStore()

const showLocationController = ShowLocationController.getInstance()
const state = ref(showLocationController.state.value)
const fetchLocationDetails = async () => {
  const showLocationParams = new ShowLocationParams(Number(id))

  const state = await showLocationController.showLocation(showLocationParams)

}

onMounted(() => {
  fetchLocationDetails()
})

const EditLocation = async (draft: boolean) => {
  if (draft) {
    await EditLocationController.getInstance().editLocation(params.value!, router)
    if (state?.value && !router.currentRoute.value.fullPath.includes('project-progress')) {
      router.push(`${user?.type == OrganizationTypeEnum.ADMIN ? `/admin` : `/organization`}/areas`)
    }
  } else {
    await EditLocationController.getInstance().editLocation(params.value!, router)
    if (state?.value && !router.currentRoute.value.fullPath.includes('project-progress')) {
      router.push(`${user?.type == OrganizationTypeEnum.ADMIN ? `/admin` : `/organization`}/areas`)
    }
  }
}

watch(
  () => showLocationController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditLocation">
        <LocationAreaForm @update:data="setParams" :data="state.data!" />
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
