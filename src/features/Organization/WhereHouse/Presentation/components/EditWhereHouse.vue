<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import WhereHouseForm from '@/features/Organization/WhereHouse/Presentation/components/WhereHouseForm.vue'
import type Params from '@/base/core/params/params'
import ShowWhereHouseteController from '../controllers/showWhereHouseController'
import ShowWhereHouseParams from '../../Core/params/showWhereHouseParams'
import EditWhereHouseController from '../controllers/editWhereHouseController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showWhereHouseController = ShowWhereHouseteController.getInstance()
const state = ref(showWhereHouseController.state.value)
const fetchWhereHouseDetails = async () => {
  const WhereHouseParams = new ShowWhereHouseParams(Number(id))

  await showWhereHouseController.showWhereHouse(WhereHouseParams)
}

onMounted(() => {
  fetchWhereHouseDetails()
})

const EditWhereHouse = async (draft: boolean) => {
  if (draft) {
    await EditWhereHouseController.getInstance().editWhereHouse(params.value!, router)
  } else {
    await EditWhereHouseController.getInstance().editWhereHouse(params.value!, router)
  }
}

watch(
  () => showWhereHouseController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState , "new satattatata")
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditWhereHouse">
        <WhereHouseForm @update:data="setParams" :data="state.data!" />
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
