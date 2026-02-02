<script lang="ts" setup>
import type InjuryDetailsModel from '@/features/Organization/ObservationFactory/Data/models/InjuryModel';
import people from '@/assets/images/people.png'

const props = defineProps<{
  data: InjuryDetailsModel[]
}>()

</script>
<template>
  <div class="injury-header-container">
    <div class="injury-header">
      <div class="injury-header-info">
        <img :src="people" alt="people">
        <p>{{ $t('witnesses') }}</p>
      </div>

    </div>
    <div class="witnessStatement-container">
      <div class="flex items-center gap-3 witnessStatement " v-for="witnessStatement in props.data">
        <div class="flex items-center gap-3">
          <img src="https://cyber.comolho.com/static/img/avatar.png" alt="" width="30" height="30" />
          <div class="flex flex-col items-start">
            <p class="employee-name">{{ witnessStatement?.employee_name ||
              witnessStatement?.organization_employee?.name }}
            </p>
            <p class="employee-note">{{ witnessStatement.note }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
