<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/editEquipmentTypeController'
import ShowEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/showEquipmentTypeParams'
import ShowEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/showEquipmentTypeController.ts'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import EquipmentTypeForm from '@/features/setting/EquipmentType/Presentation/components/EquipmentTypeForm.vue'
import type Params from '@/base/core/params/params'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showEquipmentTypeController = ShowEquipmentTypeController.getInstance()
const state = ref(showEquipmentTypeController.state.value)
const fetchEquipmentTypeDetails = async () => {
  const EquipmentTypeParams = new ShowEquipmentTypeParams(Number(id))

  await showEquipmentTypeController.showEquipmentType(EquipmentTypeParams)
}

onMounted(() => {
  fetchEquipmentTypeDetails()
})

const EditEquipmentType = async (draft: boolean) => {
  if (draft) {
    await EditEquipmentTypeController.getInstance().editEquipmentType(params.value!, router)
  } else {
    await EditEquipmentTypeController.getInstance().editEquipmentType(params.value!, router)
  }
}

watch(
  () => showEquipmentTypeController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditEquipmentType">
        <EquipmentTypeForm @update:data="setParams" :data="state.data!" />
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
