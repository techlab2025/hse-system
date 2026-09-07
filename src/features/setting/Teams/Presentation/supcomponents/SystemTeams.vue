<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'
import DialogSystem from '@/assets/images/DialogSystem.png'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import SystemDialogEmptyState from '@/shared/DataStatues/SystemDialogEmptyState.vue'
import SystemAddIcon from '@/shared/icons/SystemAddIcon.vue'
import SystemDataHeader from '@/features/Organization/WhereHouseType/Presentation/supcomponents/SystemDataHeader.vue'
import IndexSystemTeamParams from '../../Core/params/indexSystemTeamParams'
import AddSystemTeamParams from '../../Core/params/addSystemTeamParams'
import IndexSystemTeamController from '../controllers/indexSystemTeamController'
import AddSystemTeamController from '../controllers/addSystemTeamController'
import DataFailedState from '../../../../../shared/DataStatues/DataFailed.vue'
defineProps<{ isHeaderTap?: boolean }>()

const emit = defineEmits<{
  confirmed: []
}>()

const visible = ref(false)
const selectedIds = ref<number[]>([])
const indexSystemTeamController = IndexSystemTeamController.getInstance()
const state = ref(indexSystemTeamController.state.value)

const fetchSystemTeams = async () => {
  await indexSystemTeamController.getData(new IndexSystemTeamParams(true))
}

watch(
  () => indexSystemTeamController.state.value,
  (newState) => {
    state.value = newState
  },
  { deep: true },
)

watch(visible, (isVisible) => {
  selectedIds.value = []

  if (isVisible) {
    fetchSystemTeams()
  }
})

const toggleTeam = (id: number) => {
  const selectedIndex = selectedIds.value.indexOf(id)

  if (selectedIndex === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(selectedIndex, 1)
  }
}

const submitData = async () => {
  if (selectedIds.value.length === 0) return

  const addSystemTeamController = AddSystemTeamController.getInstance()
  await addSystemTeamController.addSystemTeam(
    new AddSystemTeamParams({ cloneIds: selectedIds.value }),
  )

  if (addSystemTeamController.isDataSuccess()) {
    emit('confirmed')
    visible.value = false
  }
}
</script>

<template>
  <li v-if="!isHeaderTap" class="list-item cursor-pointer" @click="visible = true">
    <button>
      <SystemAddIcon />
      {{ $t('system_data') }}
    </button>
  </li>

  <SystemDataHeader v-else @click="visible = true" />

  <Dialog v-model:visible="visible" modal :style="{ width: '60rem' }" @click.stop>
    <template #header>
      <HeaderSection :img="DialogSystem" title="Add System Teams"
        subtitle="Select the teams you need and add them to your teams" />
    </template>

    <DataStatus :controller="state">
      <template #success>
        <SystemDialogEmptyState v-if="!state.data?.length" />
        <div v-else class="system-dialog-content-container">
          <div v-for="item in state.data" :key="item.id" class="system-dialog-content">
            <div class="row-content" :class="{ active: selectedIds.includes(item.id) }" @click="toggleTeam(item.id)">
              <label :for="`team-${item.id}`" class="title">
                {{ item.title }}
              </label>
              <input :id="`team-${item.id}`" type="checkbox" :checked="selectedIds.includes(item.id)"
                @click.stop="toggleTeam(item.id)" />
            </div>
          </div>
        </div>

        <button v-if="state.data?.length" class="btn btn-primary w-full mt-5 confirm-btn" :disabled="selectedIds.length === 0"
          @click="submitData">
          {{ $t('confirm') }}
        </button>
      </template>
      <template #empty>
        <SystemDialogEmptyState />
      </template>
      <template #failed>
        <DataFailedState :link="''" :withbtn="false" />

      </template>
    </DataStatus>
  </Dialog>
</template>
