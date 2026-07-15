<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import { ref, watch } from 'vue'
import acc from '@/assets/images/acc.png'
import InjuresTimeLine from './InjuresTimeLine.vue'
import type InjuryDetailsModel from '../../../Data/models/InjuryModel.ts'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'

const emit = defineEmits(['update:data'])
const { isOpen, injuries, incidentTypeId } = defineProps<{
  isOpen?: boolean
  injuries?: InjuryDetailsModel[]
  incidentTypeId?: number | null
}>()
const isAnotherMeeting = ref(isOpen ? isOpen : 0)
const updateData = () => {
  emit('update:data', {
    isAnotherMeeting: isAnotherMeeting.value,
    accidentsData: accidentsData.value,
  })
}

const accidentsData = ref()
const UpdateAccidentsData = (data: any) => {
  accidentsData.value = data
  console.log(accidentsData.value, 'accidentsData.value')
  updateData()
}

watch(
  () => isAnotherMeeting.value,
  (newVal) => {
    if (newVal == 1) {
      updateData()
    } else {
      emit('update:data', {
        isAnotherMeeting: isAnotherMeeting.value,
      })
      accidentsData.value = []
    }
  },
)
</script>
<template>
  <div class="another-meeting">
    <div class="another-meeting-header" v-if="!isOpen">
      <!-- <div class="section-title-with-help"> -->
      <HeaderPage
        :title="`Are there Injuries?`"
        :subtitle="`Did this incident result in any physical injuries`"
        :img="acc"
        class="title-header"
      />
      <!-- <FieldHelpIcon
          text="Choose Yes if the incident caused any physical injury, even if it appears minor."
        /> -->
      <!-- </div> -->
      <div class="meeting-status">
        <button
          class="meeting-status-yes"
          @click.prevent="isAnotherMeeting = 1"
          :class="isAnotherMeeting == 1 ? 'active' : ''"
        >
          {{ $t('Yes') }}
        </button>
        <button
          class="meeting-status-on"
          @click.prevent="isAnotherMeeting = 0"
          :class="isAnotherMeeting == 0 ? 'active' : ''"
        >
          {{ $t('No') }}
        </button>
      </div>
    </div>

    <div class="another-meeting-contect" v-if="isAnotherMeeting == 1">
      <InjuresTimeLine
        :injuries="injuries"
        :isOpen="isOpen"
        :incident-type-id="incidentTypeId"
        @update:data="UpdateAccidentsData"
      />
    </div>
  </div>
</template>
<style scoped>
.another-meeting-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  position: relative;
  gap: 14px;
  width: 100%;

  .title-header {
    background-color: transparent !important;
  }

  .meeting-status {
    display: flex !important;
    justify-content: flex-end !important;
    align-items: center !important;
    flex-shrink: 0;
    gap: 6px;
    padding: 4px;
    border: 1px solid var(--brand-primary-100);
    border-radius: 8px;
    background: var(--surface-1);
    box-shadow: 0 8px 20px color-mix(in srgb, var(--brand-primary-900) 5%, transparent);
    width: fit-content;
    position: absolute;
    top: 75%;
    left: 100%;
    transform: translate(-120%, -100%);
    display: flex;

    button {
      min-width: 82px;
      min-height: 38px;
      padding: 9px 18px;
      border-radius: 6px;
      font-family: 'Bold';
      font-size: 14px;
      font-weight: 700;
      transition:
        background 0.2s ease,
        color 0.2s ease,
        box-shadow 0.2s ease;
    }

    .meeting-status-yes {
      background: transparent;
      color: var(--status-success);

      &.active {
        color: var(--text-on-brand);
        background: var(--status-success);
        box-shadow: 0 8px 18px color-mix(in srgb, var(--status-success) 22%, transparent);
      }
    }

    .meeting-status-on {
      background: transparent;
      color: var(--status-danger);

      &.active {
        color: var(--text-on-brand);
        background: var(--status-danger);
        box-shadow: 0 8px 18px color-mix(in srgb, var(--status-danger) 22%, transparent);
      }
    }
  }
}

.section-title-with-help {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 768px) {
  .another-meeting-header {
    align-items: stretch !important;
    flex-direction: column;

    .meeting-status {
      position: static;
      width: 100%;
      transform: none;

      button {
        flex: 1;
        min-width: 0;
      }
    }
  }
}

@media (max-width: 480px) {
  .another-meeting-header .meeting-status {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}
</style>
