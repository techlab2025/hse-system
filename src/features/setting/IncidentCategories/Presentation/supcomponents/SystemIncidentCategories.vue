<script setup lang="ts">
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue';
import Dialog from 'primevue/dialog';
import DialogSystem from '@/assets/images/DialogSystem.png'
import { onMounted, ref, watch } from "vue";
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import { useRoute, useRouter } from 'vue-router';
import IndexIncidentCategoryParams from '../../Core/params/indexIncidentCategoryParams'
import AddSystemIncidentCategoryController from '../controllers/addSystemIncidentCategoryController';
import AddSystemIncidentCategoryParams from '../../Core/params/addSystemIncidentCategoryParams';
import IndexIncidentCategoryController from '../controllers/indexIncidentCategoryController';
import SystemAddIcon from '@/shared/icons/SystemAddIcon.vue';
import IndexSystemIncidentCategoryController from '../controllers/indexSystemIncidentCategoryController';
import SystemDataHeader from '@/features/Organization/WhereHouseType/Presentation/supcomponents/SystemDataHeader.vue';

const visible = ref(false);
const route = useRoute()

const indexIncidentCategoryController = IndexSystemIncidentCategoryController.getInstance()
const state = ref(indexIncidentCategoryController.state.value)
const fetchIncidentCategory = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1
) => {
  const indexIncidentCategoryParams = new IndexIncidentCategoryParams(
    query,
    pageNumber,
    perPage,
    withPage,
    null,
    true
  )
  await indexIncidentCategoryController.getData(indexIncidentCategoryParams)
}

watch(
  () => indexIncidentCategoryController.state.value,
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

    fetchIncidentCategory()
  }
})

const router = useRouter()
const SubmitData = async () => {
  const addSystemIncidentCategoryController = AddSystemIncidentCategoryController.getInstance()
  const addSystemIncidentCategoryParams = new AddSystemIncidentCategoryParams({ cloneIds: selectedIds.value })
  const dataState = await addSystemIncidentCategoryController.addSystemIncidentCategory(addSystemIncidentCategoryParams, router)
  visible.value = false
}
const props = defineProps<{ isHeaderTap?: boolean }>()
</script>
<template>
  <!-- <button @click="visible = true" class="btn btn-primary">{{ $t('system_incident_categorys') }}</button> -->
  <li v-if="!isHeaderTap" class="list-item cursor-pointer" @click="visible = true">
    <button>
      <SystemAddIcon />
      {{ $t('system_incident_categorys')
      }}
    </button>
  </li>
  <SystemDataHeader v-if="isHeaderTap" @click="visible = true" />

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
