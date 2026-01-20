<script setup lang="ts">
import Dialog from 'primevue/dialog'
import CreateTeam from '@/assets/images/hrd-manager 1.png'
import { ref } from 'vue'

import HeaderSection from '../../Details/DetailsHeader/HeaderSection.vue'
import CreateTeamForm from './CreateTeamForm.vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  ProjectLocationId: number,
  LocationId: number,
  isShow: boolean
}>()
const visible = ref(false)

const UpdateData = () => {
  emit('update:data')
  visible.value = false
}
</script>

<template>
  <button @click="visible = true" :class="isShow ? `btn btn-secondary` : 'btn btn-primary'">{{ $t('create_team')
    }}</button>
  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '50rem' }">
    <template #header>
      <div class="add-equipment-header">
        <HeaderSection :img="CreateTeam" title="create team"
          subtitle="select your team type & add your employee from the location" />
      </div>
    </template>
    <div class="equipment-dialog-data">
      <hr class="add-equipment-hr" />
      <CreateTeamForm :ProjectLocationId="ProjectLocationId" :LocationId="LocationId" @update:data="UpdateData" />
    </div>
  </Dialog>
</template>
