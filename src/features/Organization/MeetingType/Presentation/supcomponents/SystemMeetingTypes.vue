  <script setup lang="ts">
  import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue';
  import Dialog from 'primevue/dialog';
  import DialogSystem from '@/assets/images/DialogSystem.png'
  import { ref, watch } from "vue";
  import IndexMeetingTypeParams from '../../Core/params/indexMeetingTypeParams';
  import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
  import SystemDialogEmptyState from '@/shared/DataStatues/SystemDialogEmptyState.vue'
  import IndexSystemMeetingTypeController from '../controllers/indexSystemMeetingTypeController';
  import AddMeetingTypeCloneController from '../controllers/addMeetingTypeCloneController';
  import AddMeetingTypeClonesParams from '../../Core/params/AddMeetingTypeClonesParams';
  import SystemAddIcon from '@/shared/icons/SystemAddIcon.vue';
  import MeetingTypeSystemDataHeader from './MeetingTypeSystemDataHeader.vue';

  defineProps<{
    isHeaderTap?: boolean
  }>()

  const visible = ref(false);

  const indexMeetingTypeController = IndexSystemMeetingTypeController.getInstance()
  const state = ref(indexMeetingTypeController.state.value)
  const fetchSystemMeetingTypes = async (
    query: string = '',
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 0,
  ) => {
    const params = new IndexMeetingTypeParams(query, pageNumber, perPage, withPage, false, true)
    await indexMeetingTypeController.getData(params)
  }

  watch(
    () => indexMeetingTypeController.state.value,
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

      fetchSystemMeetingTypes()
    }
  })


  const cloneMeetingTypes = async () => {
    const addMeetingTypeCloneController = AddMeetingTypeCloneController.getInstance()
    const addMeetingTypeClonesParams = new AddMeetingTypeClonesParams({ clonesIds: selectedIds.value })
    await addMeetingTypeCloneController.addMeetingTypeClone(addMeetingTypeClonesParams)
    if (addMeetingTypeCloneController.isDataSuccess()) {
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
  <MeetingTypeSystemDataHeader v-if="isHeaderTap" @click="visible = true" />
  <Dialog v-model:visible="visible" modal :style="{ width: '60rem' }" @click.stop>
    <template #header>
      
      <HeaderSection :img="DialogSystem" :title="$t('add_system_meeting_types')"
        :subtitle="$t('select_system_meeting_types')" />
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
        <button v-if="state.data?.length" class="btn btn-primary w-full mt-5 confirm-btn" @click="cloneMeetingTypes">{{ $t('confirm') }}</button>
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
