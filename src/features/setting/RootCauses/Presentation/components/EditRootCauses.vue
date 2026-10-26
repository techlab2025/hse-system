<script lang="ts" setup>
import { setFormValidationScope } from '@/shared/utils/formValidationScope'
import { ref as validationRef } from 'vue'

import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditRootCausesController from '@/features/setting/RootCauses/Presentation/controllers/editRootCausesController'
import ShowRootCausesParams from '@/features/setting/RootCauses/Core/params/showRootCausesParams'
import ShowRootCausesController from '@/features/setting/RootCauses/Presentation/controllers/showRootCausesController.ts'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import RootCausesForm from '@/features/setting/RootCauses/Presentation/components/RootCausesForm.vue'
import type Params from '@/base/core/params/params'

const validationFormRef = validationRef<InstanceType<typeof RootCausesForm> | null>(null)

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showRootCausesController = ShowRootCausesController.getInstance()
const state = ref(showRootCausesController.state.value)
const fetchRootCausesDetails = async () => {
  const RootCausesParams = new ShowRootCausesParams(Number(id))

  await showRootCausesController.showRootCauses(RootCausesParams)
}

onMounted(() => {
  fetchRootCausesDetails()
})

const EditRootCauses = async (draft: boolean) => {
  if (!(await validationFormRef.value?.validateRequiredFields())) return
  setFormValidationScope(params.value, 'RootCausesForm')

  if (draft) {
    await EditRootCausesController.getInstance().editRootCauses(params.value!, router)
  } else {
    await EditRootCausesController.getInstance().editRootCauses(params.value!, router)
  }
}

watch(
  () => showRootCausesController.state.value,
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
      <form novalidate class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditRootCauses">
        <RootCausesForm ref="validationFormRef" @update:data="setParams" :data="state.data!" />
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
