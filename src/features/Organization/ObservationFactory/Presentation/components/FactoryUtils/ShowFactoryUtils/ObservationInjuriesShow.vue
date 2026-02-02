<script lang="ts" setup>
import type InjuryDetailsModel from '@/features/Organization/ObservationFactory/Data/models/InjuryModel';
import acc from '@/assets/images/acc.png'

const props = defineProps<{
  data: InjuryDetailsModel[]
}>()
</script>
<template>
  <!-- <pre>{{ data }}</pre> -->
  <div class="injury-header-container">
    <div class="injury-header">
      <div class="injury-header-info">
        <img :src="acc" alt="acc">
        <p>{{ $t('There are casualties from the accident.') }}</p>
      </div>
    </div>
    <div v-for="injury in props.data" class="w-full flex items-center justify-between">
      <p class="note">{{ injury?.note }}</p>
      <div class="injury-header-employees">
        {{ injury?.organization_employee?.name || injury?.employee_name }}
      </div>
    </div>
  </div>
</template>
