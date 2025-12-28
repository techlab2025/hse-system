<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import WhereHouseTypeForm from '@/features/Organization/WhereHouseType/Presentation/components/WhereHouseTypeForm.vue'
import type Params from '@/base/core/params/params'
import ShowWhereHouseTypeteController from '../controllers/showWhereHouseTypeController'
import ShowWhereHouseTypeParams from '../../Core/params/showWhereHouseTypeParams'
import EditWhereHouseTypeController from '../controllers/editWhereHouseTypeController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showWhereHouseTypeController = ShowWhereHouseTypeteController.getInstance()
const state = ref(showWhereHouseTypeController.state.value)
const fetchWhereHouseTypeDetails = async () => {
  const WhereHouseTypeParams = new ShowWhereHouseTypeParams(Number(id))

  await showWhereHouseTypeController.showWhereHouseType(WhereHouseTypeParams)
}

onMounted(() => {
  fetchWhereHouseTypeDetails()
})

const EditWhereHouseType = async (draft: boolean) => {
  if (draft) {
    await EditWhereHouseTypeController.getInstance().editWhereHouseType(params.value!, router)
  } else {
    await EditWhereHouseTypeController.getInstance().editWhereHouseType(params.value!, router)
  }
}

watch(
  () => showWhereHouseTypeController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditWhereHouseType">
        <WhereHouseTypeForm @update:data="setParams" :data="state.data!" />
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
