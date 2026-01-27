<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import EditSubscriptionTypeController from '../controllers/editSubscriptionTypeController'
import ShowSubscriptionTypeParams from '../../Core/params/showSubscriptionTypeParams'
import ShowSubscriptionTypeController from '../controllers/showSubscriptionTypeController'
import SubscriptionTypeForm from './SubscriptionTypeForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showSubscriptionTypeController = ShowSubscriptionTypeController.getInstance()
const state = ref(showSubscriptionTypeController.state.value)

const fetchSubscriptionTypeDetails = async () => {
  const SubscriptionTypeParams = new ShowSubscriptionTypeParams(Number(id))

  await showSubscriptionTypeController.showSubscriptionTypeType(SubscriptionTypeParams)
}

onMounted(() => {
  fetchSubscriptionTypeDetails()
})

const EditSubscriptionType = async (draft: boolean) => {
  if (draft) {
    await EditSubscriptionTypeController.getInstance().editSubscriptionType(params.value!, router)
  } else {
    await EditSubscriptionTypeController.getInstance().editSubscriptionType(params.value!, router)
  }
}

watch(
  () => showSubscriptionTypeController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditSubscriptionType">
        <SubscriptionTypeForm @update:data="setParams" :data="state.data!" />
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
