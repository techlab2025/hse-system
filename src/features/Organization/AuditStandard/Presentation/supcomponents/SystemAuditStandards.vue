<script setup lang="ts">
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'
import Dialog from 'primevue/dialog'
import DialogSystem from '@/assets/images/DialogSystem.png'
import { ref, watch } from 'vue'
import IndexAuditStandardParams from '../../Core/params/indexAuditStandardParams'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import SystemDialogEmptyState from '@/shared/DataStatues/SystemDialogEmptyState.vue'
import IndexSystemAuditStandardController from '../controllers/indexSystemAuditStandardController'
import AddAuditStandardCloneController from '../controllers/addAuditStandardCloneController'
import AddAuditStandardClonesParams from '../../Core/params/AddAuditStandardClonesParams'
import SystemAddIcon from '@/shared/icons/SystemAddIcon.vue'
import AuditStandardSystemDataHeader from './AuditStandardSystemDataHeader.vue'

defineProps<{
  isHeaderTap?: boolean
}>()

const createPermissions = [
  PermissionsEnum.ORG_AUDIT_STANDARDS_ALL,
  PermissionsEnum.ORG_AUDIT_STANDARDS_CREATE,
]
const visible = ref(false)

const indexAuditStandardController = IndexSystemAuditStandardController.getInstance()
const state = ref(indexAuditStandardController.state.value)
const fetchSystemAuditStandards = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexAuditStandardParams(query, pageNumber, perPage, withPage, false, true)
  await indexAuditStandardController.getData(params)
}

watch(
  () => indexAuditStandardController.state.value,
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
watch(
  () => visible.value,
  () => {
    if (visible.value) {
      fetchSystemAuditStandards()
    }
  },
)

const cloneAuditStandards = async () => {
  const addAuditStandardCloneController = AddAuditStandardCloneController.getInstance()
  const addAuditStandardClonesParams = new AddAuditStandardClonesParams({
    clonesIds: selectedIds.value,
  })
  await addAuditStandardCloneController.addAuditStandardClone(addAuditStandardClonesParams)
  if (addAuditStandardCloneController.isDataSuccess()) {
    selectedIds.value = []
    visible.value = false
  }
}
</script>
<template>
  <PermissionBuilder :code="createPermissions">
    <li v-if="!isHeaderTap" class="list-item cursor-pointer" @click="visible = true">
      <button>
        <SystemAddIcon />
        {{ $t('system_data') }}
      </button>
    </li>
    <AuditStandardSystemDataHeader v-if="isHeaderTap" @click="visible = true" />
    <Dialog v-model:visible="visible" modal :style="{ width: '60rem' }" @click.stop>
      <template #header>
        <HeaderSection
          :img="DialogSystem"
          :title="$t('add_system_audit_standards')"
          :subtitle="$t('select_system_audit_standards')"
        />
      </template>
      <DataStatus :controller="state">
        <template #success>
          <SystemDialogEmptyState v-if="!state.data?.length" />
          <div v-else class="system-dialog-content-container">
            <div class="system-dialog-content" v-for="item in state.data" :key="item.id">
              <div
                class="row-content"
                :class="{ active: selectedIds.includes(item.id) }"
                @click="toggleSelection(item.id)"
              >
                <label :for="`${item.title}-${item.id}`" class="title">
                  {{ item.title }}
                </label>
                <input
                  :id="`${item.title}-${item.id}`"
                  type="checkbox"
                  :checked="selectedIds.includes(item.id)"
                  @click.stop="toggleSelection(item.id)"
                />
              </div>
            </div>
          </div>
          <button
            v-if="state.data?.length"
            class="btn btn-primary w-full mt-5 confirm-btn"
            @click="cloneAuditStandards"
          >
            {{ $t('confirm') }}
          </button>
        </template>
        <template #empty>
          <SystemDialogEmptyState />
        </template>
        <template #loader> </template>
        <template #failed> </template>
      </DataStatus>
    </Dialog>
  </PermissionBuilder>
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
