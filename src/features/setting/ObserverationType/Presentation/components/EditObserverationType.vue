<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditObserverationTypeController from '@/features/setting/ObserverationType/Presentation/controllers/editObserverationTypeController'
import ShowObserverationTypeParams from '@/features/setting/ObserverationType/Core/params/showObserverationTypeParams'
import ShowObserverationTypeController from '@/features/setting/ObserverationType/Presentation/controllers/showObserverationTypeController.ts'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import ObserverationTypeForm from '@/features/setting/ObserverationType/Presentation/components/ObserverationTypeForm.vue'
import type Params from '@/base/core/params/params'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showObserverationTypeController = ShowObserverationTypeController.getInstance()
const state = ref(showObserverationTypeController.state.value)
const fetchObserverationTypeDetails = async () => {
  const ObserverationTypeParams = new ShowObserverationTypeParams(Number(id))

  await showObserverationTypeController.showObserverationType(ObserverationTypeParams)
}

onMounted(() => {
  fetchObserverationTypeDetails()
})

const EditObserverationType = async (draft: boolean) => {
  if (draft) {
    await EditObserverationTypeController.getInstance().editObserverationType(params.value!, router)
  } else {
    await EditObserverationTypeController.getInstance().editObserverationType(params.value!, router)
  }
}

watch(
  () => showObserverationTypeController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditObserverationType">
        <ObserverationTypeForm @update:data="setParams" :data="state.data!" />
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
