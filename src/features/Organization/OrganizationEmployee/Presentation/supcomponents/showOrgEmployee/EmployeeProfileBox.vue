<script setup lang="ts">
import DropList from '@/shared/HelpersComponents/DropList.vue'

const props = defineProps({
  employee: {
    type: Object,
    required: true,
  },
})
const actionList = [
  {
    label: 'Edit',
    icon: 'edit',
    action: () => {
      console.log('Edit')
    },
  },
  {
    label: 'Delete',
    icon: 'delete',
    action: () => {
      console.log('Delete')
    },
  },
]
</script>

<template>
  <div class="employee-profile-box">
    <div class="employee-img">
      <img src="@/assets/images/employee-img.png" alt="" />
    </div>

    <div class="all-info">
      <div class="info-wrapper">
        <div class="employee-info">
          <div class="employee-position">{{ employee?.position || 'Supervisor' }}</div>
          <div class="employee-name">{{ employee?.name || 'Min3m' }}</div>
        </div>
        <DropList :actionList="actionList" />
      </div>
      <div class="all-info-row">
        <div class="all-info-row-item">
          <h4 class="all-info-row-item-label">{{ $t('Phone') }} :</h4>
          <span class="all-info-row-item-value">{{ employee?.phone || '01023456789' }}</span>
        </div>
        <div class="all-info-row-item">
          <h4 class="all-info-row-item-label">{{ $t('Email') }} :</h4>
          <span class="all-info-row-item-value">{{ employee?.email || 'Min3m@mail.com' }}</span>
        </div>
        <div class="all-info-row-item">
          <h4 class="all-info-row-item-label">{{ $t('Start Date') }} :</h4>
          <span class="all-info-row-item-value">{{ employee?.startDate || '2022-01-01' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
