<script lang="ts" setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import DialogSystem from '@/assets/images/DialogSystem.png'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import SystemDialogEmptyState from '@/shared/DataStatues/SystemDialogEmptyState.vue'
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'
import SystemAddIcon from '@/shared/icons/SystemAddIcon.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IndexSystemTraningTopicController from '../controllers/indexSystemTraningTopicController'
import AddTraningTopicCloneController from '../controllers/addTraningTopicCloneController'
import IndexTraningTopicParams from '../../Core/params/indexTraningTopicParams'
import AddTraningTopicClonesParams from '../../Core/params/AddTraningTopicClonesParams'
import TraningTopicSystemDataHeader from './TraningTopicSystemDataHeader.vue'
import TraningTopicTableSkeleton from './TraningTopicTableSkeleton.vue'

const props = defineProps<{
  visible?: boolean
  isHeaderTap?: boolean
}>()

const emit = defineEmits<{
  'update:visible': [boolean]
  cloned: []
  confirmed: []
}>()

const internalVisible = ref(Boolean(props.visible))
const indexController = IndexSystemTraningTopicController.getInstance()
const state = ref(indexController.state.value)
const selectedIds = ref<number[]>([])

const createPermissions = [
  PermissionsEnum.ORGANIZATION_EMPLOYEE,
  PermissionsEnum.ORG_TRANING_TOPIC_ALL,
  PermissionsEnum.ORG_TRANING_TOPIC_CREATE,
]

watch(
  () => props.visible,
  (value) => {
    internalVisible.value = Boolean(value)
  },
)

watch(
  () => indexController.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
  { deep: true },
)

watch(internalVisible, async (visible) => {
  emit('update:visible', visible)

  if (visible) {
    await indexController.getData(new IndexTraningTopicParams('', 1, 10, 1, false, true))
  }
})

const toggle = (id: number) => {
  selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter((item) => item !== id)
    : [...selectedIds.value, id]
}

const cloneSelected = async () => {
  if (!selectedIds.value.length) return

  await AddTraningTopicCloneController.getInstance().addTraningTopicClone(
    new AddTraningTopicClonesParams({ clonesIds: selectedIds.value }),
  )

  selectedIds.value = []
  internalVisible.value = false
  emit('cloned')
  emit('confirmed')
}
</script>

<template>
  <PermissionBuilder :code="createPermissions">
    <li v-if="!isHeaderTap" class="list-item cursor-pointer" @click="internalVisible = true">
      <button>
        <SystemAddIcon />
        {{ $t('system_data') }}
      </button>
    </li>
    <TraningTopicSystemDataHeader v-if="isHeaderTap" @click="internalVisible = true" />

    <Dialog v-model:visible="internalVisible" modal :style="{ width: '60rem' }" @click.stop>
      <template #header>
        <HeaderSection
          :img="DialogSystem"
          :title="$t('add_system_traning_topics')"
          :subtitle="$t('select_system_traning_topics')"
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
                @click="toggle(item.id)"
              >
                <label :for="`${item.title}-${item.id}`" class="title">
                  {{ item.title }}
                </label>
                <input
                  :id="`${item.title}-${item.id}`"
                  type="checkbox"
                  :checked="selectedIds.includes(item.id)"
                  @click.stop="toggle(item.id)"
                />
              </div>
            </div>
          </div>

          <button
            v-if="state.data?.length"
            class="btn btn-primary w-full mt-5 confirm-btn"
            :disabled="!selectedIds.length"
            @click="cloneSelected"
          >
            {{ $t('confirm') }}
          </button>
        </template>

        <template #loader>
          <TraningTopicTableSkeleton />
        </template>

        <template #initial>
          <TraningTopicTableSkeleton />
        </template>

        <template #empty>
          <SystemDialogEmptyState />
        </template>

        <template #failed>
          <SystemDialogEmptyState />
        </template>
      </DataStatus>
    </Dialog>
  </PermissionBuilder>
</template>
