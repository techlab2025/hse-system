<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'
import DialogSystem from '@/assets/images/DialogSystem.png'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import SystemDialogEmptyState from '@/shared/DataStatues/SystemDialogEmptyState.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import SystemDataHeader from '@/features/Organization/WhereHouseType/Presentation/supcomponents/SystemDataHeader.vue'
import IndexFactoryItemParams from '../../Core/params/indexFactoryItemParams'
import CloneFactoryItemsParams from '../../Core/params/cloneFactoryItemsParams'
import IndexSystemFactoryItemController from '../controllers/indexSystemFactoryItemController'
import CloneFactoryItemsController from '../controllers/cloneFactoryItemsController'

const emit = defineEmits<{
  confirmed: []
}>()

const visible = ref(false)
const selectedIds = ref<number[]>([])
const isSubmitting = ref(false)
const indexSystemFactoryItemController = IndexSystemFactoryItemController.getInstance()
const state = ref(indexSystemFactoryItemController.state.value)

const fetchSystemFactoryItems = async () => {
  await indexSystemFactoryItemController.getData(
    new IndexFactoryItemParams('', 1, 100, 0, undefined, true),
  )
}

watch(
  () => indexSystemFactoryItemController.state.value,
  (newState) => {
    state.value = newState
  },
  { deep: true },
)

watch(visible, (isVisible) => {
  selectedIds.value = []

  if (isVisible) {
    fetchSystemFactoryItems()
  }
})

const toggleItem = (id: number) => {
  const selectedIndex = selectedIds.value.indexOf(id)

  if (selectedIndex === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(selectedIndex, 1)
  }
}

const submitData = async () => {
  if (selectedIds.value.length === 0 || isSubmitting.value) return

  isSubmitting.value = true
  const cloneFactoryItemsController = CloneFactoryItemsController.getInstance()

  try {
    await cloneFactoryItemsController.cloneFactoryItems(
      new CloneFactoryItemsParams({ clonesIds: selectedIds.value }),
    )

    if (cloneFactoryItemsController.isDataSuccess()) {
      emit('confirmed')
      visible.value = false
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <SystemDataHeader @click="visible = true" />

  <Dialog v-model:visible="visible" modal :style="{ width: '60rem' }" @click.stop>
    <template #header>
      <HeaderSection
        :img="DialogSystem"
        title="Add Items from the System"
        subtitle="Click here to open the list and select items directly from the system."
      />
    </template>

    <DataStatus :controller="state">
      <template #success>
        <SystemDialogEmptyState v-if="!state.data?.length" />

        <div v-else class="system-dialog-content-container">
          <div v-for="item in state.data" :key="item.id" class="system-dialog-content">
            <div
              class="row-content"
              :class="{ active: selectedIds.includes(item.id) }"
              @click="toggleItem(item.id)"
            >
              <label :for="`system-factor-item-${item.id}`" class="title item-title">
                <span>{{ item.title }}</span>
                <small v-if="item.factory?.title">{{ item.factory.title }}</small>
              </label>
              <input
                :id="`system-factor-item-${item.id}`"
                type="checkbox"
                :checked="selectedIds.includes(item.id)"
                @click.stop="toggleItem(item.id)"
              />
            </div>
          </div>
        </div>

        <button
          v-if="state.data?.length"
          class="btn btn-primary w-full mt-5 confirm-btn"
          :disabled="selectedIds.length === 0 || isSubmitting"
          @click="submitData"
        >
          {{ $t('confirm') }}
          <span v-if="selectedIds.length">({{ selectedIds.length }})</span>
        </button>
      </template>

      <template #loader>
        <TableLoader :cols="2" :rows="6" />
      </template>

      <template #initial>
        <TableLoader :cols="2" :rows="6" />
      </template>

      <template #empty>
        <SystemDialogEmptyState />
      </template>

      <template #failed>
        <DataFailed :link="''" :withbtn="false" />
      </template>
    </DataStatus>
  </Dialog>
</template>

<style scoped lang="scss">
.item-title {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  cursor: pointer;
}

.item-title span {
  overflow-wrap: anywhere;
}

.item-title small {
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 500;
}

.confirm-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
</style>
