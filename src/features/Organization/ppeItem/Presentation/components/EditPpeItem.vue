<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import PpeItemForm from '@/features/Organization/ppeItem/Presentation/components/PpeItemForm.vue'
import type Params from '@/base/core/params/params'
import ShowPpeItemController from '../controllers/showPpeItemController'
import ShowPpeItemParams from '../../Core/params/showPpeItemParams'
import EditPpeItemController from '../controllers/editPpeItemController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof PpeItemForm> | null>(null)

const showPpeItemController = ShowPpeItemController.getInstance()
const state = ref(showPpeItemController.state.value)
const fetchPpeItemDetails = async () => {
  const PpeItemParams = new ShowPpeItemParams(Number(id))

  await showPpeItemController.showPpeItem(PpeItemParams)
}

onMounted(() => {
  fetchPpeItemDetails()
})

const editPpeItem = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await EditPpeItemController.getInstance().editPpeItem(params.value!, router)
}

watch(
  () => showPpeItemController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editPpeItem">
        <PpeItemForm ref="formRef" @update:data="setParams" :data="state.data!" />
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
