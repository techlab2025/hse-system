<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import OrganizationLocationForm from '@/features/Organization/OrganizationLocation/Presentation/components/OrganizationLocationForm.vue'
import type Params from '@/base/core/params/params'
import ShowOrganizationLocationteController from '../controllers/showOrganizationLocationController'
import ShowOrganizationLocationParams from '../../Core/params/showOrganizationLocationParams'
import EditOrganizationLocationController from '../controllers/editOrganizationLocationController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showOrganizationLocationController = ShowOrganizationLocationteController.getInstance()
const state = ref(showOrganizationLocationController.state.value)
const fetchOrganizationLocationDetails = async () => {
  const OrganizationLocationParams = new ShowOrganizationLocationParams(Number(id))

  await showOrganizationLocationController.showOrganizationLocation(OrganizationLocationParams)
}

onMounted(() => {
  fetchOrganizationLocationDetails()
})

const EditOrganizationLocation = async (draft: boolean) => {
  if (draft) {
    await EditOrganizationLocationController.getInstance().editOrganizationLocation(params.value!, router)
  } else {
    await EditOrganizationLocationController.getInstance().editOrganizationLocation(params.value!, router)
  }
}

watch(
  () => showOrganizationLocationController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditOrganizationLocation">
        <OrganizationLocationForm @update:data="setParams" :data="state.data!" />
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
