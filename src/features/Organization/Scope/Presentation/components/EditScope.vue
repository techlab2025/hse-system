<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowScopeteController from '../controllers/showScopeController'
import ShowScopeParams from '../../Core/params/showScopeParams'
import EditScopeController from '../controllers/editScopeController'
import ScopeForm from './ScopeForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showScopeController = ShowScopeteController.getInstance()
const state = ref(showScopeController.state.value)
const fetchScopeDetails = async () => {
  const ScopeParams = new ShowScopeParams(Number(id))

  await showScopeController.showScope(ScopeParams)
}

onMounted(() => {
  fetchScopeDetails()
})

const EditScope = async (draft: boolean) => {
  if (draft) {
    await EditScopeController.getInstance().editScope(params.value!, router)
  } else {
    await EditScopeController.getInstance().editScope(params.value!, router)
  }
}

watch(
  () => showScopeController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditScope">
        <ScopeForm @update:data="setParams" :data="state.data!" />
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
