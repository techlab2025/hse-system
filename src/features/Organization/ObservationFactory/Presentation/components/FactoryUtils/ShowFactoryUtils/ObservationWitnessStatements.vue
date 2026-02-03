<script lang="ts" setup>
import type InjuryDetailsModel from '@/features/Organization/ObservationFactory/Data/models/InjuryModel'
import people from '@/assets/images/people.png'

const props = defineProps<{
  data: InjuryDetailsModel[]
}>()
</script>
<template>
  <div class="injury-header-container">
    <div class="injury-header">
      <div class="injury-header-info">
        <img :src="people" alt="people" />
        <div class="text">
          <p>{{ $t('witnesses') }}</p>
          <h6>{{ props.data?.length }} {{ $t('witnesses') }}</h6>
        </div>
      </div>
    </div>
    <div class="witnessStatement-container">
      <div class="flex items-center gap-3 witnessStatement" v-for="witnessStatement in props.data" :key="witnessStatement.id">
        <div class="flex items-center gap-3">
          <div class="flex flex-col items-start">
            <div class="employee-name">
              <img
                :src="
                  witnessStatement.organization_employee.image ||
                  'https://cyber.comolho.com/static/img/avatar.png'
                "
                alt="user"
                width="30"
                height="30"
              />
              <p >
                {{ witnessStatement?.employee_name || witnessStatement?.organization_employee?.name }}
              </p>
            </div>
            <p class="employee-note">{{ witnessStatement.note }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
