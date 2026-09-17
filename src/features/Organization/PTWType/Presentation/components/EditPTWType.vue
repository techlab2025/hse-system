<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import PTWTypeForm from '@/features/Organization/PTWType/Presentation/components/PTWTypeForm.vue'
import type Params from '@/base/core/params/params'
import ShowPTWTypeController from '../controllers/showPTWTypeController'
import ShowPTWTypeParams from '../../Core/params/showPTWTypeParams'
import EditPTWTypeController from '../controllers/editPTWTypeController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof PTWTypeForm> | null>(null)

const showPTWTypeController = ShowPTWTypeController.getInstance()
const state = ref(showPTWTypeController.state.value)
const fetchPTWTypeDetails = async () => {
  const PTWTypeParams = new ShowPTWTypeParams(Number(id))

  await showPTWTypeController.showPTWType(PTWTypeParams)
}

onMounted(() => {
  fetchPTWTypeDetails()
})

const editPTWType = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await EditPTWTypeController.getInstance().editPTWType(params.value!, router)
}

watch(
  () => showPTWTypeController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editPTWType">
        <PTWTypeForm ref="formRef" @update:data="setParams" :data="state.data!" />
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
