<script setup lang="ts">
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue';
import Dialog from 'primevue/dialog';
import DialogSystem from '@/assets/images/DialogSystem.png'
import { onMounted, ref, watch } from "vue";
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import { useRouter } from 'vue-router';

import IndexSystemEquipmentTypeController from '../controllers/indexSystemEquipmentTypeController';
import IndexEquipmentTypeParams from '../../Core/params/indexEquipmentTypeParams';
import AddSystemEquipmentTypeController from '../controllers/addSystemEquipmentTypeController';
import AddSystemEquipmentParams from '../../Core/params/AddSystemEquipmentParams';
import SystemAddIcon from '@/shared/icons/SystemAddIcon.vue';


const visible = ref(false);

const indexSystemEquipmentTypeController = IndexSystemEquipmentTypeController.getInstance()
const state = ref(indexSystemEquipmentTypeController.state.value)
const fetchWhereHouseType = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const deleteSystemEquipmentTypeParams = new IndexEquipmentTypeParams(query, pageNumber, perPage, withPage,undefined,undefined,true)
  await indexSystemEquipmentTypeController.getData(deleteSystemEquipmentTypeParams)
}

watch(
  () => indexSystemEquipmentTypeController.state.value,
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

    fetchWhereHouseType()
  }
})

const router = useRouter()
const SubmitData = async () => {
  const addSystemEquipmentTypeController = AddSystemEquipmentTypeController.getInstance()
  const addSystemEquipmentParams = new AddSystemEquipmentParams({ clonesIds: selectedIds.value })
  const dataState = await addSystemEquipmentTypeController.addSystemEquipmentType(addSystemEquipmentParams, router)
  // visible.value = false
}
</script>
<template>
      <li class="list-item cursor-pointer" @click="visible = true">
    <button>
      <SystemAddIcon />
      {{ $t('system_data')
      }}
    </button>
  </li>
  <!-- <button @click="visible = true" class="btn btn-primary">{{ $t('system_equipment_types') }}</button> -->
  <Dialog v-model:visible="visible" modal :style="{ width: '60rem' }" @click.stop>
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
