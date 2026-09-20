<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import MangementChangeForm from './MangementChangeForm.vue'
import ShowMangementChangeController from '../controllers/showMangementChangeController'
import ShowMangementChangeParams from '../../Core/params/showMangementChangeParams'
import EditMangementChangeController from '../controllers/editMangementChangeController'
import type EditMangementChangeParams from '../../Core/params/editMangementChangeParams'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)
const formRef = ref<InstanceType<typeof MangementChangeForm> | null>(null)

const showMangementChangeController = ShowMangementChangeController.getInstance()
const state = ref(showMangementChangeController.state.value)

const fetchMangementChangeDetails = async () => {
  await showMangementChangeController.showMangementChange(
    new ShowMangementChangeParams(Number(id)),
  )
}

onMounted(() => {
  fetchMangementChangeDetails()
})

const editMangementChange = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await EditMangementChangeController.getInstance().editMangementChange(
    params.value as EditMangementChangeParams,
  )

  if (EditMangementChangeController.getInstance().isDataSuccess()) {
    router.push('/organization/management-of-change')
  }
}

watch(
  () => showMangementChangeController.state.value,
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
      <form
        class="grid grid-cols-1 md:grid-cols-4 gap-4"
        @submit.prevent="editMangementChange"
      >
        <MangementChangeForm
          ref="formRef"
          :data="state.data!"
          @update:data="setParams"
        />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">
            {{ $t('save') }}
          </button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="10" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
