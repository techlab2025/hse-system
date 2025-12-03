<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditHealthConditionsController from '@/features/setting/HealthConditions/Presentation/controllers/editHealthConditionsController'
import ShowHealthConditionsParams from '@/features/setting/HealthConditions/Core/params/showHealthConditionsParams'
import ShowHealthConditionsController from '@/features/setting/HealthConditions/Presentation/controllers/showHealthConditionsController.ts'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import HealthConditionsForm from '@/features/setting/HealthConditions/Presentation/components/HealthConditionsForm.vue'
import type Params from '@/base/core/params/params'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showHealthConditionsController = ShowHealthConditionsController.getInstance()
const state = ref(showHealthConditionsController.state.value)
const fetchHealthConditionsDetails = async () => {
  const HealthConditionsParams = new ShowHealthConditionsParams(Number(id))

  await showHealthConditionsController.showHealthConditions(HealthConditionsParams)
}

onMounted(() => {
  fetchHealthConditionsDetails()
})

const EditHealthConditions = async (draft: boolean) => {
  if (draft) {
    await EditHealthConditionsController.getInstance().editHealthConditions(params.value!, router)
  } else {
    await EditHealthConditionsController.getInstance().editHealthConditions(params.value!, router)
  }
}

watch(
  () => showHealthConditionsController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditHealthConditions">
        <HealthConditionsForm @update:data="setParams" :data="state.data!" />
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
