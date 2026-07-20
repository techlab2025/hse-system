<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import { ref, watch } from 'vue'
import RIP from '@/assets/images/RIP.png'
import DethsTimeLine from './DethsTimeLine.vue'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'

const emit = defineEmits(['update:data'])
const isAnotherMeeting = ref(0)
const updateData = () => {
  emit('update:data', {
    isAnotherMeeting: isAnotherMeeting.value,
    DethsData: DethsData.value,
  })
}

const DethsData = ref()
const UpdateDethsData = (data: any) => {
  DethsData.value = data
  console.log(DethsData.value, 'DethsData.value')
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
      DethsData.value = []
    }
  },
)
</script>
<template>
  <div class="another-meeting">
    <div class="another-meeting-header">
      <!-- <div class="section-title-with-help"> -->
        <HeaderPage
          title="incident_fatalities_question"
          subtitle="incident_fatalities_description"
          :img="RIP"
          class="title-header"
        />
        <!-- <FieldHelpIcon text="Choose Yes if the incident resulted in one or more fatalities." /> -->
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
      <DethsTimeLine @update:data="UpdateDethsData" />
    </div>
  </div>
</template>
<style scoped>
.another-meeting,
.another-meeting-contect {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.another-meeting-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  position: relative;
  gap: 14px;
  width: 100%;

  .title-header {
    flex: 1;
    min-width: 0;
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
    left: 20%;
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
    gap: 10px;

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

  :deep(.title-header) {
    padding: 8px;
    border-radius: 14px;
  }

  :deep(.title-header .section-header-page) {
    flex-wrap: nowrap;
    justify-content: flex-start;
    min-width: 0;
    padding: 8px;
  }

  :deep(.title-header .section-img-page) {
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
  }

  :deep(.title-header .header-text-page) {
    min-width: 0;
  }

  :deep(.title-header .title-page),
  :deep(.title-header .subtitle-page) {
    text-align: start;
    overflow-wrap: anywhere;
  }
}

@media (max-width: 420px) {
  .another-meeting-header .meeting-status button {
    min-height: 42px;
    padding: 8px 12px;
  }
}
</style>
