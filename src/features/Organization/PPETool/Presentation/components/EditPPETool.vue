<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import PPEToolForm from '@/features/Organization/PPETool/Presentation/components/PPEToolForm.vue'
import type Params from '@/base/core/params/params'
import ShowPPEToolController from '../controllers/showPPEToolController'
import ShowPPEToolParams from '../../Core/params/showPPEToolParams'
import EditPPEToolController from '../controllers/editPPEToolController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof PPEToolForm> | null>(null)

const showPPEToolController = ShowPPEToolController.getInstance()
const state = ref(showPPEToolController.state.value)
const fetchPPEToolDetails = async () => {
  const PPEToolParams = new ShowPPEToolParams(Number(id))

  await showPPEToolController.showPPETool(PPEToolParams)
}

onMounted(() => {
  fetchPPEToolDetails()
})

const editPPETool = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await EditPPEToolController.getInstance().editPPETool(params.value!, router)
}

watch(
  () => showPPEToolController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editPPETool">
        <PPEToolForm ref="formRef" @update:data="setParams" :data="state.data!" />
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
