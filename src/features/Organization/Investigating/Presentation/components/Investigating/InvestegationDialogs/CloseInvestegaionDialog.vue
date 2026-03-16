  <script setup lang="ts">
  import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue';
  import Dialog from 'primevue/dialog';
  import DialogSystem from '@/assets/images/DialogSystem.png'
  import { ref, watch } from "vue";
  import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
  import { useRouter } from 'vue-router';
  import SystemAddIcon from '@/shared/icons/SystemAddIcon.vue';
  import IndexCheckListController from '@/features/Organization/CheckList/Presentation/controllers/indexCheckListController';
  import IndexCheckListParams from '@/features/Organization/CheckList/Core/params/indexCheckListParams';
  import { useI18n } from 'vue-i18n';
  import SystemDataHeader from '@/features/Organization/WhereHouseType/Presentation/supcomponents/SystemDataHeader.vue';

  const props = defineProps<{
    isHeaderTap?: boolean
  }>()

  const visible = ref(false);

  const indexCheckListController = IndexCheckListController.getInstance()
  const state = ref(indexCheckListController.state.value)
  const fetchWhereHouseType = async (
    query: string = '',
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 0,
  ) => {
    const indexCheckListParams = new IndexCheckListParams(query, pageNumber, perPage, withPage)
    await indexCheckListController.getData(indexCheckListParams)
  }

  watch(
    () => indexCheckListController.state.value,
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
    // const addWhereHouseTypeCloneController = AddWhereHouseTypeCloneController.getInstance()
    // const addWarehouseTypeClonesParams = new AddWarehouseTypeClonesParams({ clonesIds: selectedIds.value })
    // const dataState = await addWhereHouseTypeCloneController.addWhereHouseTypeClone(addWarehouseTypeClonesParams, router)
    visible.value = false
  }
  const { locale } = useI18n()
</script>
<template>
  <button class="btn btn-secondary" @click="visible = true">
    {{ $t('close_investegation') }}
  </button>
  <SystemDataHeader v-if="isHeaderTap" @click="visible = true" />
  <Dialog v-model:visible="visible" modal :style="{ width: '60rem' }" @click.stop>
    <template #header>
      <!-- :img="DialogSystem" -->
      <HeaderSection  title="are you sure?"
        subtitle="If you want to close the investigations, then you have completed all the steps shown in the task list." />
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
  background-color: #c4c4c40f;
  counter-reset: #575b71;
  border: none !important;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;

  &:hover {
    background-color: #1d4ed80f;
  }

}
</style>
