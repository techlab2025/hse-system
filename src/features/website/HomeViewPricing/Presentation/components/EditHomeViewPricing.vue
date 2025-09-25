<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import HomeViewPricingForm from './HomeViewPricingForm.vue'
import type Params from '@/base/core/params/params'
import ShowHomeViewPricingController from '../controllers/showHomeViewPricingController'
import ShowHomeViewPricingParams from '../../Core/params/showHomeViewPricingParams'
import EditHomeViewPricingController from '../controllers/editHomeViewPricingController'



const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showHomeViewPricingController = ShowHomeViewPricingController.getInstance()
const state = ref(showHomeViewPricingController.state.value)
const fetchHomeViewPricingDetails = async () => {
  const HomeViewPricingParams = new ShowHomeViewPricingParams(Number(id))

  await showHomeViewPricingController.showHomeViewPricing(HomeViewPricingParams)
}

onMounted(() => {
  fetchHomeViewPricingDetails()
})

const EditHomeViewPricing = async (draft: boolean) => {
  if (draft) {
    await EditHomeViewPricingController.getInstance().editHomeViewPricing(params.value!, router)
  } else {
    await EditHomeViewPricingController.getInstance().editHomeViewPricing(params.value!, router)
  }
}

watch(
  () => showHomeViewPricingController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditHomeViewPricing">
        <HomeViewPricingForm @update:data="setParams" :data="state.data!" />
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
