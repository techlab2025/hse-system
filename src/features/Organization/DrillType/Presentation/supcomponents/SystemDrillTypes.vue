  <script setup lang="ts">
  import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue';
  import Dialog from 'primevue/dialog';
  import DialogSystem from '@/assets/images/DialogSystem.png'
  import { ref, watch } from "vue";
  import IndexDrillTypeParams from '../../Core/params/indexDrillTypeParams';
  import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
  import SystemDialogEmptyState from '@/shared/DataStatues/SystemDialogEmptyState.vue'
  import IndexSystemDrillTypeController from '../controllers/indexSystemDrillTypeController';
  import AddDrillTypeCloneController from '../controllers/addDrillTypeCloneController';
  import AddDrillTypeClonesParams from '../../Core/params/AddDrillTypeClonesParams';
  import SystemAddIcon from '@/shared/icons/SystemAddIcon.vue';
  import DrillTypeSystemDataHeader from './DrillTypeSystemDataHeader.vue';

  defineProps<{
    isHeaderTap?: boolean
  }>()

  const visible = ref(false);

  const indexDrillTypeController = IndexSystemDrillTypeController.getInstance()
  const state = ref(indexDrillTypeController.state.value)
  const fetchSystemDrillTypes = async (
    query: string = '',
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 0,
  ) => {
    const params = new IndexDrillTypeParams(query, pageNumber, perPage, withPage, false, true)
    await indexDrillTypeController.getData(params)
  }

  watch(
    () => indexDrillTypeController.state.value,
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

  const toggleSelection = (id: number) => {
    const index = selectedIds.value.indexOf(id)

    if (index !== -1) {
      selectedIds.value.splice(index, 1)
    } else {
      selectedIds.value.push(id)
    }
  }
  watch(() => visible.value, () => {
    if (visible.value) {

      fetchSystemDrillTypes()
    }
  })


  const cloneDrillTypes = async () => {
    const addDrillTypeCloneController = AddDrillTypeCloneController.getInstance()
    const addDrillTypeClonesParams = new AddDrillTypeClonesParams({ clonesIds: selectedIds.value })
    await addDrillTypeCloneController.addDrillTypeClone(addDrillTypeClonesParams)
    if (addDrillTypeCloneController.isDataSuccess()) {
      selectedIds.value = []
      visible.value = false
    }
  }
</script>
<template>
  <li v-if="!isHeaderTap" class="list-item cursor-pointer" @click="visible = true">
    <button>
      <SystemAddIcon />
      {{ $t('system_data')
      }}
    </button>
  </li>
  <DrillTypeSystemDataHeader v-if="isHeaderTap" @click="visible = true" />
  <Dialog v-model:visible="visible" modal :style="{ width: '60rem' }" @click.stop>
    <template #header>
      <HeaderSection :img="DialogSystem" :title="$t('add_system_drill_types')"
        :subtitle="$t('select_system_drill_types')" />
    </template>
    <DataStatus :controller="state">
      <template #success>
        <SystemDialogEmptyState v-if="!state.data?.length" />
        <div v-else class="system-dialog-content-container">

          <div class="system-dialog-content" v-for="item in state.data" :key="item.id">
            <div class="row-content" :class="{ active: selectedIds.includes(item.id) }" @click="toggleSelection(item.id)">
              <label :for="`${item.title}-${item.id}`" class="title">
                {{ item.title }}
              </label>
              <input :id="`${item.title}-${item.id}`" type="checkbox" :checked="selectedIds.includes(item.id)"
                @click.stop="toggleSelection(item.id)" />
            </div>
          </div>
        </div>
        <button v-if="state.data?.length" class="btn btn-primary w-full mt-5 confirm-btn" @click="cloneDrillTypes">{{ $t('confirm') }}</button>
      </template>
      <template #empty>
        <SystemDialogEmptyState />
      </template>
      <template #loader>
      </template>
      <template #failed>
      </template>
    </DataStatus>


  </Dialog>
</template>
<style scoped>
.export-pdf-btn {
  font-family: 'Regular';
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 5px;
  margin-top: 5px;
  transition: linear all 0.3s;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 5px;
  background-color: color-mix(in srgb, var(--main-border) 5.88%, transparent);
  counter-reset: var(--text-soft);
  border: none !important;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;

  &:hover {
    background-color: color-mix(in srgb, var(--brand-primary-500) 5.88%, transparent);
  }

}
</style>
