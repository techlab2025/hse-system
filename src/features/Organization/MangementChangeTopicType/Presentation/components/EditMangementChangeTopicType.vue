<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import MangementChangeTopicTypeForm from './MangementChangeTopicTypeForm.vue'
import type Params from '@/base/core/params/params'
import ShowMangementChangeTopicTypeController from '../controllers/showMangementChangeTopicTypeController'
import ShowMangementChangeTopicTypeParams from '../../Core/params/showMangementChangeTopicTypeParams'
import EditMangementChangeTopicTypeController from '../controllers/editMangementChangeTopicTypeController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof MangementChangeTopicTypeForm> | null>(null)

const showMangementChangeTopicTypeController = ShowMangementChangeTopicTypeController.getInstance()
const state = ref(showMangementChangeTopicTypeController.state.value)
const fetchMangementChangeTopicTypeDetails = async () => {
  const MangementChangeTopicTypeParams = new ShowMangementChangeTopicTypeParams(Number(id))

  await showMangementChangeTopicTypeController.showMangementChangeTopicType(MangementChangeTopicTypeParams)
}

onMounted(() => {
  fetchMangementChangeTopicTypeDetails()
})

const editMangementChangeTopicType = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await EditMangementChangeTopicTypeController.getInstance().editMangementChangeTopicType(params.value!, router)
}

watch(
  () => showMangementChangeTopicTypeController.state.value,
  (newState) => {
    if (newState) {
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editMangementChangeTopicType">
        <MangementChangeTopicTypeForm ref="formRef" @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
