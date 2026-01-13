<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import InjuryForm from '@/features/Organization/Injury/Presentation/components/InjuryForm.vue'
import type Params from '@/base/core/params/params'
import ShowInjurytController from '../controllers/showEmployeeCertificateController'
import ShowInjuryParams from '../../Core/params/showEmployeeCertificateParams'
import EditInjuryController from '../controllers/editEmployeeCertificateController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showInjuryController = ShowInjurytController.getInstance()
const state = ref(showInjuryController.state.value)
const fetchInjuryDetails = async () => {
  const InjuryParams = new ShowInjuryParams(Number(id))

  await showInjuryController.showInjury(InjuryParams)
}

onMounted(() => {
  fetchInjuryDetails()
})

const EditInjury = async (draft: boolean) => {
  if (draft) {
    await EditInjuryController.getInstance().editInjury(params.value!, router)
  } else {
    await EditInjuryController.getInstance().editInjury(params.value!, router)
  }
}

watch(
  () => showInjuryController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditInjury">
        <InjuryForm @update:data="setParams" :data="state.data!" />
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
