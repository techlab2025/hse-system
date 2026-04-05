<script setup lang="ts">
import Dialog from 'primevue/dialog'
import CreateTeam from '@/assets/images/hrd-manager 1.png'
import { ref } from 'vue'
import HeaderSection from '../../Details/DetailsHeader/HeaderSection.vue'
import CreateTeamForm from './CreateTeamForm.vue'
import PlusIcon from '@/shared/icons/PlusIcon.vue'

const emit = defineEmits(['update:data'])
const { ProjectLocationId, LocationId, isShow, teamId } = defineProps<{
  ProjectLocationId: number | undefined
  LocationId: number | undefined
  isShow?: boolean
  teamId?: number | undefined
  isInCard?: boolean
}>()
const visible = ref(false)

const UpdateData = () => {
  emit('update:data')
  visible.value = false
}
</script>

<template>
  <button
    v-if="!isInCard"
    @click="visible = true"
    :class="isShow ? `btn btn-secondary` : 'btn btn-primary'"
  >
    {{ $t('create_team') }}
  </button>
  <button class="pluse-icon-container" v-else @click="visible = true">
    <PlusIcon class="pluse-icon" />
  </button>
  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '50rem' }">
    <template #header>
      <div class="add-equipment-header">
        <HeaderSection
          :img="CreateTeam"
          :title="$t('create team')"
          :subtitle="$t('select your team type & add your employee from the location')"
        />
      </div>
    </template>
    <div class="equipment-dialog-data">
      <hr class="add-equipment-hr" />
     
      
      <CreateTeamForm
        :ProjectLocationId="ProjectLocationId!"
        :LocationId="LocationId!"
        @update:data="UpdateData"
        :teamId="teamId"
      />
    </div>
  </Dialog>
</template>

<style scoped>
.pluse-icon-container {
  width: fit-content;
}
.pluse-icon {
  width: 20px;
  height: 20px;
  color: #1d4ed8;
  cursor: pointer;
  background-color: #1d4fd856;
  border-radius: 50%;
  padding: 3px;
}
</style>
