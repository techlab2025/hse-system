<script lang="ts" setup>
import { setFormValidationScope } from '@/shared/utils/formValidationScope'
import { ref as validationRef } from 'vue'

import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditHazardTypeController from '@/features/setting/HazardType/Presentation/controllers/editHazardTypeController'
import ShowHazardTypeParams from '@/features/setting/HazardType/Core/params/showHazardTypeParams'
import ShowHazardTypeController from '@/features/setting/HazardType/Presentation/controllers/showHazardTypeController.ts'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import HazardTypeForm from '@/features/setting/HazardType/Presentation/components/HazardTypeForm.vue'
import type Params from '@/base/core/params/params'

const validationFormRef = validationRef<InstanceType<typeof HazardTypeForm> | null>(null)

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showHazardTypeController = ShowHazardTypeController.getInstance()
const state = ref(showHazardTypeController.state.value)
const fetchHazardTypeDetails = async () => {
  const HazardTypeParams = new ShowHazardTypeParams(Number(id))

  await showHazardTypeController.showHazardType(HazardTypeParams)
}

onMounted(() => {
  fetchHazardTypeDetails()
})

const EditHazardType = async (draft: boolean) => {
  if (!(await validationFormRef.value?.validateRequiredFields())) return
  setFormValidationScope(params.value, 'HazardTypeForm')

  if (draft) {
    await EditHazardTypeController.getInstance().editHazardType(params.value!, router)
  } else {
    await EditHazardTypeController.getInstance().editHazardType(params.value!, router)
  }
}

watch(
  () => showHazardTypeController.state.value,
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
      <form novalidate class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditHazardType">
        <HazardTypeForm ref="validationFormRef" @update:data="setParams" :data="state.data!" />
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
