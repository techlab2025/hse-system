<script lang="ts" setup>
import type InjuryDetailsModel from '@/features/Organization/ObservationFactory/Data/models/InjuryModel'
import acc from '@/assets/images/acc.png'
import Injured from '@/shared/icons/injured.vue'

const props = defineProps<{
  data: InjuryDetailsModel[]
}>()
</script>
<template>
  <!-- <pre>{{ data }}</pre> -->
  <div class="injury-header-container">
    <div class="injury-header">
      <div class="injury-header-info">
        <img :src="acc" alt="acc" />
        <div class="text">
          <p>{{ $t('There are casualties from the accident.') }}</p>
          <h6>{{ props.data?.length }} {{ $t('injured') }}</h6>
        </div>
      </div>
    </div>
    <div class="card_Injured">
      <div class="all_injured" v-for="injury in props.data" :key="injury.id">
        <div class="Injured_title">
          <Injured />
          <div class="title">
            <p>{{ $t('infection type ') }}:</p>
            <h6>{{ injury?.injury_type?.title }}</h6>
          </div>
        </div>
        <div class="user_note">
          <p class="note">{{ injury?.note }}</p>
          <div class="injury-header-employees">
            <img
              :src="
                injury.organization_employee.image ||
                'https://cyber.comolho.com/static/img/avatar.png'
              "
              alt="user"
            />
            <p>{{ injury?.organization_employee?.name || injury?.employee_name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
