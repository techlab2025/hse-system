<script lang="ts" setup>
import type InjuryDetailsModel from '@/features/Organization/ObservationFactory/Data/models/InjuryModel';
import acc from '@/assets/images/acc.png'

const props = defineProps<{
  data: InjuryDetailsModel[]
}>()
</script>
<template>
  <div class="injury-header-container" v-for="injury in props.data">
    <div class="injury-header">
      <div class="injury-header-info">
        <img :src="acc" alt="acc">
        <p>There are
          casualties from the accident.</p>
      </div>
      <div class="injury-header-employees">
        {{ injury?.organization_employee?.name || injury?.employee_name }}
      </div>
    </div>
    <p class="note">{{ injury?.note }}</p>
  </div>
</template>
