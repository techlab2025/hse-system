<script lang="ts" setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
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
    await indexController.getData(
      new IndexTraningTopicParams('', 1, 10, 1, false, true),
    )
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
    <button v-if="isHeaderTap" class="btn btn-primary" @click="internalVisible = true">
      {{ $t('add_system_traning_topics') }}
    </button>

    <Dialog
      v-model:visible="internalVisible"
      modal
      :header="$t('add_system_traning_topics')"
    >
      <TraningTopicSystemDataHeader />

      <DataStatus :controller="state">
        <template #success>
          <div
            v-for="item in state.data"
            :key="item.id"
            class="flex cursor-pointer items-center gap-2 py-2"
            @click="toggle(item.id)"
          >
            <input
              type="checkbox"
              :checked="selectedIds.includes(item.id)"
              @click.stop="toggle(item.id)"
            />
            <span>{{ item.title }}</span>
          </div>

          <button
            class="btn btn-primary mt-4"
            :disabled="!selectedIds.length"
            @click="cloneSelected"
          >
            {{ $t('clone') }}
          </button>
        </template>

        <template #loader>
          <TraningTopicTableSkeleton />
        </template>

        <template #initial>
          <TraningTopicTableSkeleton />
        </template>

        <template #empty>
          <DataEmpty
            :title="$t('no_traning_topics')"
            :description="$t('no_traning_topics_description')"
          />
        </template>

        <template #failed>
          <DataFailed
            :title="$t('no_traning_topics')"
            :description="$t('no_traning_topics_description')"
            link=""
          />
        </template>
      </DataStatus>
    </Dialog>
  </PermissionBuilder>
</template>
