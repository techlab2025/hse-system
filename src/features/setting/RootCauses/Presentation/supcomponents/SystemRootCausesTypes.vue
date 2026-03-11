<script setup lang="ts">
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue';
import Dialog from 'primevue/dialog';
import DialogSystem from '@/assets/images/DialogSystem.png'
import { onMounted, ref, watch } from "vue";
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import { useRouter } from 'vue-router';

import IndexSystemRootCausesController from '../controllers/indexSystemRootCausesController';
import IndexRootCausesParams from '../../Core/params/indexRootCausesParams';
import AddSystemRootCausesController from '../controllers/addSystemRootCausesController';
import AddSystemRootCausesParams from '../../Core/params/AddStstemRootCausesParams';
import SystemAddIcon from '@/shared/icons/SystemAddIcon.vue';


const visible = ref(false);

const indexSystemRootCausesController = IndexSystemRootCausesController.getInstance()
const state = ref(indexSystemRootCausesController.state.value)
const fetchWhereHouseType = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const deleteRootCausesParams = new IndexRootCausesParams(query, pageNumber, perPage, withPage, undefined, undefined, true)
  await indexSystemRootCausesController.getData(deleteRootCausesParams)
}

watch(
  () => indexSystemRootCausesController.state.value,
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
  const addSystemRootCausesController = AddSystemRootCausesController.getInstance()
  const addSystemRootCausesParams = new AddSystemRootCausesParams({ clonesIds: selectedIds.value })
  const dataState = await addSystemRootCausesController.addSystemRootCauses(addSystemRootCausesParams, router)
  visible.value = false
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
