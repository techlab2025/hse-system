<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import HeaderForm from './HeaderForm.vue'
import type Params from '@/base/core/params/params'
import ShowHeaderController from '../controllers/showHeaderController'
import ShowHeaderParams from '../../Core/params/showHeaderParams'
import EditHeaderController from '../controllers/editHeaderController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showHeaderController = ShowHeaderController.getInstance()
const state = ref(showHeaderController.state.value)
const fetchHeaderDetails = async () => {
  const HeaderParams = new ShowHeaderParams(Number(id))

  await showHeaderController.showHeader(HeaderParams)
}

onMounted(() => {
  fetchHeaderDetails()
})

const EditHeader = async (draft: boolean) => {
  if (draft) {
    await EditHeaderController.getInstance().editHeader(params.value!, router)
  } else {
    await EditHeaderController.getInstance().editHeader(params.value!, router)
  }
}

watch(
  () => showHeaderController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditHeader">
        <HeaderForm @update:data="setParams" :data="state.data!" />
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
