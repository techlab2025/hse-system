<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowHerikalyController from '../controllers/showHerikalyController'
import ShowHerikalyParams from '../../Core/params/showHerikalyParams'
import EditHerikalyController from '../controllers/editHerikalyController'
import HerikalyForm from './HerikalyForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showHerikalyController = ShowHerikalyController.getInstance()
const state = ref(showHerikalyController.state.value)
const fetchHerikalyDetails = async () => {
  const HerikalyParams = new ShowHerikalyParams(Number(id))

  await showHerikalyController.showHerikaly(HerikalyParams)
}

onMounted(() => {
  fetchHerikalyDetails()
})

const EditHerikaly = async (draft: boolean) => {
  if (draft) {
    await EditHerikalyController.getInstance().editHerikaly(params.value!, router)
  } else {
    await EditHerikalyController.getInstance().editHerikaly(params.value!, router)
  }
}

watch(
  () => showHerikalyController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditHerikaly">
        <HerikalyForm @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">{{ $t('edit') }}</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
