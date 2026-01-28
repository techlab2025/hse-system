<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import EditSubscriptionController from '../controllers/editSubscriptionController'
import ShowSubscriptionParams from '../../Core/params/showSubscriptionParams'
import ShowSubscriptionController from '../controllers/showSubscriptionController'
import SubscriptionForm from './SubscriptionForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showSubscriptionController = ShowSubscriptionController.getInstance()
const state = ref(showSubscriptionController.state.value)

const fetchSubscriptionDetails = async () => {
  const SubscriptionParams = new ShowSubscriptionParams(Number(id))

  await showSubscriptionController.showSubscriptionType(SubscriptionParams)
}

onMounted(() => {
  fetchSubscriptionDetails()
})

const EditSubscription = async (draft: boolean) => {
  if (draft) {
    await EditSubscriptionController.getInstance().editSubscription(params.value!, router)
  } else {
    await EditSubscriptionController.getInstance().editSubscription(params.value!, router)
  }
}

watch(
  () => showSubscriptionController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditSubscription">
        <SubscriptionForm @update:data="setParams" :data="state.data!" />
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
