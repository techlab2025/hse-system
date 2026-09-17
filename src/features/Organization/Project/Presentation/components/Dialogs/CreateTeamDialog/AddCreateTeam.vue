<script setup lang="ts">
import Dialog from 'primevue/dialog'
import CreateTeam from '@/assets/images/hrd-manager 1.png'
import { ref } from 'vue'
import HeaderSection from '../../Details/DetailsHeader/HeaderSection.vue'
import CreateTeamForm from './CreateTeamForm.vue'
import PlusIcon from '@/shared/icons/PlusIcon.vue'

const emit = defineEmits(['update:data'])
const { ProjectLocationId, LocationId, isShow, teamId, mode } = defineProps<{
  ProjectLocationId: number | undefined
  LocationId: number | undefined
  isShow?: boolean
  teamId?: number | undefined
  isInCard?: boolean
  mode?: 'leader' | 'employee' | 'both'
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
    type="button"
    @click="visible = true"
    :class="
      isShow ? `btn btn-secondary create-team-trigger` : 'btn btn-primary create-team-trigger'
    "
  >
    <span aria-hidden="true">+</span>{{ $t('create_team') }}
  </button>
  <button class="pluse-icon-container" type="button" v-else @click="visible = true">
    <PlusIcon class="pluse-icon" />
    <span v-if="mode === 'leader'" class="btn-text">{{ $t('change_team_leader') }}</span>
    <span v-else-if="mode === 'employee'" class="btn-text">{{ $t('add_employee') }}</span>
  </button>
  <Dialog
    v-model:visible="visible"
    modal
    :dismissable-mask="true"
    class="create-project-team-dialog"
    :style="{ width: 'min(50rem, calc(100vw - 24px))' }"
  >
    <template #header>
      <div class="add-equipment-header">
        <HeaderSection
          :img="CreateTeam"
          :title="
            mode === 'leader'
              ? $t('change_team_leader')
              : mode === 'employee'
                ? $t('add_employee')
                : $t('create_team')
          "
          :subtitle="$t('select your team type & add your employee from the location')"
        />
      </div>
    </template>
    <div class="equipment-dialog-data">
      <div class="team-dialog-intro">
        <span>01</span>
        <div>
          <strong>{{ $t('Configure the project team') }}</strong>
          <p>{{ $t('Select the team, its members, and the responsible leader') }}</p>
        </div>
      </div>

      <CreateTeamForm
        :ProjectLocationId="ProjectLocationId!"
        :LocationId="LocationId!"
        @update:data="UpdateData"
        :teamId="teamId"
        :mode="mode"
      />
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
.create-team-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  gap: 6px;
  border-radius: 10px;
  font-size: 0.68rem;
}

.create-team-trigger > span {
  font-size: 1rem;
}

.pluse-icon-container {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 34px;
  gap: 8px;
  padding: 6px 8px;
  border: 1px solid var(--main-border);
  border-radius: 10px;
  background: var(--surface-2);
}
.pluse-icon {
  width: 22px;
  height: 22px;
  color: var(--PrimaryColor);
  cursor: pointer;
  background-color: color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
  border-radius: 50%;
  padding: 4px;
}
.btn-text {
  color: var(--text-strong);
  font-size: 0.64rem;
  font-weight: 800;
  cursor: pointer;
}

.equipment-dialog-data {
  padding-top: 4px;
}

.team-dialog-intro {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 14px;
  padding: 13px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 15%, var(--main-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--PrimaryColor) 5%, var(--surface-2));
}

.team-dialog-intro > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  border-radius: 11px;
  background: var(--PrimaryColor);
  color: white;
  font-family: 'Bold';
  font-size: 0.68rem;
}

.team-dialog-intro strong {
  color: var(--text-strong);
  font-size: 0.78rem;
}

.team-dialog-intro p {
  margin: 2px 0 0;
  color: var(--text-soft);
  font-size: 0.67rem;
}
</style>
