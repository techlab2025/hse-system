<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import PartnerForm from '@/features/Organization/Partner/Presentation/components/PartnerForm.vue'
import type Params from '@/base/core/params/params'
import ShowPartnerteController from '../controllers/showPartnerController'
import ShowPartnerParams from '../../Core/params/showPartnerParams'
import EditPartnerController from '../controllers/editPartnerController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showPartnerController = ShowPartnerteController.getInstance()
const state = ref(showPartnerController.state.value)
const fetchPartnerDetails = async () => {
  const PartnerParams = new ShowPartnerParams(Number(id))

  await showPartnerController.showPartner(PartnerParams)
}

onMounted(() => {
  fetchPartnerDetails()
})

const EditPartner = async (draft: boolean) => {
  if (draft) {
    await EditPartnerController.getInstance().editPartner(params.value!, router)
  } else {
    await EditPartnerController.getInstance().editPartner(params.value!, router)
  }
}

watch(
  () => showPartnerController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditPartner">
        <PartnerForm @update:data="setParams" :data="state.data!" />
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
