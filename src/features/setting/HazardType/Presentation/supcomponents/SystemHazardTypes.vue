<script setup lang="ts">
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue';
import Dialog from 'primevue/dialog';
import DialogSystem from '@/assets/images/DialogSystem.png'
import { onMounted, ref, watch } from "vue";
import IndexWhereHouseTypeController from '../controllers/indexWhereHouseTypeController';
import IndexWhereHouseTypeParams from '../../Core/params/indexWhereHouseTypeParams';
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import wordSlice from '@/base/Presentation/utils/word_slice';
import IndexSystemWhereHouseTypeController from '../controllers/indexSystemWhereHouseTypeController';
import AddWhereHouseTypeCloneController from '../controllers/addWhereHouseTypeCloneController';
import AddWarehouseTypeClonesParams from '../../Core/params/AddWarehouseTypeClonesParams';
import { useRoute, useRouter } from 'vue-router';
import IndexHazardTypeController from '../controllers/indexHazardTypeController';
import { HazardTypeParentEnum } from '../../Core/Enums/HazardTypeEnum';
import IndexHazardTypeParams from '../../Core/params/indexHazardTypeParams';
import AddSystemHazardTypeController from '../controllers/addSystemHazardTypeController';
import AddSystemHazardParams from '../../Core/params/addSystemHazardParams';


const visible = ref(false);
const route = useRoute()

const indexHazardTypeController = IndexHazardTypeController.getInstance()
const state = ref(indexHazardTypeController.state.value)
const fetchHazardType = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
  parent_type?: HazardTypeParentEnum.Parent,
) => {
  const deleteHazardTypeParams = new IndexHazardTypeParams(query, pageNumber, perPage, withPage, null, parent_type, true)
  await indexHazardTypeController.getData(deleteHazardTypeParams)
}
watch(
  () => indexHazardTypeController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
  {
    deep: true,
  },
)

const selectedIds = ref<number[]>([])

const ChangeStatus = (id: number) => {
  const index = selectedIds.value.indexOf(id)

  if (index !== -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}
watch(() => visible.value, (newVal) => {
  if (visible.value) {

    fetchHazardType()
  }
})

const router = useRouter()
const SubmitData = async () => {
  const addSystemHazardTypeController = AddSystemHazardTypeController.getInstance()
  const addSystemHazardParams = new AddSystemHazardParams({ cloneIds: selectedIds.value })
  const dataState = await addSystemHazardTypeController.addSystemHazardType(addSystemHazardParams, router)
  // visible.value = false
}
</script>
<template>
  <button @click="visible = true" class="btn btn-primary">{{ $t('system_hazard_types') }}</button>
  <Dialog v-model:visible="visible" modal :style="{ width: '60rem' }">
    <template #header>
      <HeaderSection :img="DialogSystem" title="add system types"
        subtitle="select the types you need and add it to your types" />
    </template>
    <DataStatus :controller="state">
      <template #success>
        <div class="system-dialog-content-container">

          <div class="system-dialog-content" v-for="item in state.data" :key="item.id">
            <div class="row-content" :class="{ active: selectedIds.includes(item.id) }" @click="ChangeStatus(item.id)">
              <label :for="`${item.title}-${item.id}`" class="title">
                {{ item.title }}
              </label>
              <input :id="`${item.title}-${item.id}`" type="checkbox" :checked="selectedIds.includes(item.id)"
                @click.stop="ChangeStatus(item.id)" />
            </div>
          </div>
        </div>
        <button class="btn btn-primary w-full mt-5 confirm-btn" @click="SubmitData">{{ $t('confirm') }}</button>
      </template>
      <template #loader>
      </template>
      <template #failed>
      </template>
    </DataStatus>


  </Dialog>
</template>
