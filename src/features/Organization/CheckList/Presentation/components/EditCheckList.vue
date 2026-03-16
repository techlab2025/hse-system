<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import CheckListForm from '@/features/Organization/CheckList/Presentation/components/CheckListForm.vue'
import type Params from '@/base/core/params/params'
import ShowCheckListController from '../controllers/showCheckListController'
import ShowCheckListParams from '../../Core/params/showCheckListParams'
import EditCheckListController from '../controllers/editCheckListController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showCheckListController = ShowCheckListController.getInstance()
const state = ref(showCheckListController.state.value)
const fetchCheckListDetails = async () => {
  const CheckListParams = new ShowCheckListParams(Number(id))

  await showCheckListController.showCheckList(CheckListParams)
}

onMounted(() => {
  fetchCheckListDetails()
})

const editCheckList = async (draft: boolean) => {
  if (draft) {
    await EditCheckListController.getInstance().editCheckList(params.value!, router)
  } else {
    await EditCheckListController.getInstance().editCheckList(params.value!, router)
  }
}

watch(
  () => showCheckListController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editCheckList">
        <CheckListForm @update:data="setParams" :data="state.data!" />
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
