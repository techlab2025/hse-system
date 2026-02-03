<script lang="ts" setup>
import type InjuryDetailsModel from '@/features/Organization/ObservationFactory/Data/models/InjuryModel';
import RIP from '@/assets/images/RIP.png'


const props = defineProps<{
  data: InjuryDetailsModel[]
}>()

</script>
<template>

  <div class="injury-header-container" v-if="props.data?.length > 0">
    <div class="injury-header">
      <div class="injury-header-info">
        <img :src="RIP" alt="RIP">
        <p>{{ $t('fatalities from the accident') }}</p>
      </div>
      <div class="death-header-employees flex gap-3" v-for="death in props.data">
        <img src="https://cyber.comolho.com/static/img/avatar.png" alt="" width="40" height="30" />
        <div class="flex flex-col items-start">
          <span class="employee-name">{{ death?.organization_employee?.name || death?.employee_name }}</span>
          <span class="employee-hierarchy">{{ death?.organization_employee?.hierarchy?.[0].title }}</span>
        </div>
      </div>

    </div>
    <div class="death-container w-full justify-between">
      <p class="death-note">{{ death?.note }} </p>
      <img :src="death?.media[0]?.url" alt="">
    </div>
  </div>
</template>
