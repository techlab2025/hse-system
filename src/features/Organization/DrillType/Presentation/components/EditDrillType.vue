<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import DrillTypeForm from '@/features/Organization/DrillType/Presentation/components/DrillTypeForm.vue'
import type Params from '@/base/core/params/params'
import ShowDrillTypeController from '../controllers/showDrillTypeController'
import ShowDrillTypeParams from '../../Core/params/showDrillTypeParams'
import EditDrillTypeController from '../controllers/editDrillTypeController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof DrillTypeForm> | null>(null)

const showDrillTypeController = ShowDrillTypeController.getInstance()
const state = ref(showDrillTypeController.state.value)
const fetchDrillTypeDetails = async () => {
  const DrillTypeParams = new ShowDrillTypeParams(Number(id))

  await showDrillTypeController.showDrillType(DrillTypeParams)
}

onMounted(() => {
  fetchDrillTypeDetails()
})

const editDrillType = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await EditDrillTypeController.getInstance().editDrillType(params.value!, router)
}

watch(
  () => showDrillTypeController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editDrillType">
        <DrillTypeForm ref="formRef" @update:data="setParams" :data="state.data!" />
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
