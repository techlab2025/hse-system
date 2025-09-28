<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowSystemBannerController from '../controllers/showSystemBannerController'
import ShowSystemBannerParams from '../../Core/params/showSystemBannerParams'
import EditSystemBannerController from '../controllers/editSystemBannerController'
import SystemBannerForm from './SystemBannerForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showSystemBannerController = ShowSystemBannerController.getInstance()
const state = ref(showSystemBannerController.state.value)
const fetchSystemBannerDetails = async () => {
  const showSystemBannerParams = new ShowSystemBannerParams(Number(id))

  await showSystemBannerController.showSystemBanner(showSystemBannerParams)
}

onMounted(() => {
  fetchSystemBannerDetails()
})

const EditSystemBanner = async (draft: boolean) => {
  if (draft) {
    await EditSystemBannerController.getInstance().editSystemBanner(params.value!, router)
  } else {
    await EditSystemBannerController.getInstance().editSystemBanner(params.value!, router)
  }
}

watch(
  () => showSystemBannerController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditSystemBanner">
        <SystemBannerForm @update:data="setParams" :data="state.data!" />
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
