<script lang="ts" setup>
import type TitleInterface from '@/base/Data/Models/title_interface'
import type InvestegationEmployeeModel from '@/features/Organization/Investigating/Data/models/investigationResult/InvestegationEmployeeModel'
import type EquipmentDetailsModel from '@/features/setting/Equipment/Data/models/equipmentDetailsModel'

const props = defineProps<{
  title?: string
  serial?: string
  victim?: string
  date?: string
  meetingDate?: string
  TeamLeader?: string
  TeamNumbers?: number
  incidantType?: TitleInterface
  place?: string
  equipment?: EquipmentDetailsModel
  incidantDescription?: string
  team?: InvestegationEmployeeModel[]
}>()
</script>
<template>
  <div class="investigating-header-container">
    <div class="investigating-header">
      <p class="title">{{ title }}</p>
      <span>{{ serial }}</span>
      <p class="small-title">
        Place : <span class="place">{{ place }}</span>
      </p>
    </div>
    <div class="investigating-info">
      <p>
        the victim : <span>{{ victim }}</span>
      </p>
      <p>
        Date & Time : <span>{{ date }}</span>
      </p>
    </div>
    <div class="meeting-info-container">
      <div class="metting-info-header-container">
        <p class="metting-info-header">{{ $t('investigation_meeting') }}</p>
        <hr class="meeting-hr" />
      </div>
      <div class="meeting-info">
        <p>
          Date & Time : <span class="meet-date">{{ date }}</span>
        </p>
        <p>
          Investigation team leader : <span class="team-leader">{{ TeamLeader }}</span>
        </p>
        <p>
          Num of team : <span class="team-number">{{ TeamNumbers }}</span>
        </p>
        <p>
          incidant type : <span class="incidant-type">{{ incidantType?.title }}</span>
        </p>
      </div>
    </div>

    <div class="incidant-description">
      <p class="title">{{ $t('incidant_description') }}</p>
      <p class="description">{{ incidantDescription }}</p>
    </div>
    <div class="team-container">
      <p class="title">{{ $t('team') }}</p>
      <div class="team">
        <div class="team-member" v-for="member in team" :key="member.id">
          <img
            :src="
              member?.organizationEmployee?.image ||
              'https://cyber.comolho.com/static/img/avatar.png'
            "
            alt=""
            class="equipemtn-card-image"
          />
          <div class="employee-text">
            <p class="name">{{ member.organizationEmployee?.name }}</p>
            <p class="serial">{{ member.organizationEmployee?.serialName }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="equipment-card" v-if="equipment">
      <img :src="equipment?.image" alt="image" class="equipemtn-card-image" />
      <div class="equipment-text">
        <p class="name">{{ equipment?.title }}</p>
        <p class="serial">{{ equipment?.serial_name }}</p>
      </div>
      <!-- <EquipmentCard :tool="equipment" /> -->
    </div>
  </div>
</template>
<style scoped>
.investigating-header {
  display: flex;
  flex-direction: column;
  align-items: start;
}
.small-title {
  color: #aeaeb2;
  font-size: 11px;
  font-weight: 500;
  .place {
    color: #202020;
    font-weight: 700;
    font-family: 'Bold';
    font-size: 12px !important;
  }
}
.equipment-card {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
  justify-content: start;
  .equipemtn-card-image {
    max-width: 80px;
  }
  .equipment-text {
    display: flex;
    flex-direction: column;
    align-items: start;
    .name {
      color: #202020;
      font-size: 12px;
      font-weight: 700;
      font-family: 'Bold';
    }
    .serial {
      color: #aeaeb2;
      font-size: 11px;
      font-weight: 500;
    }
  }
}
.incidant-description {
  .title {
    color: #aeaeb2;
    font-size: 11px;
    font-weight: 500;
  }
  .description {
    color: #202020;
    font-weight: 700;
    font-family: 'Bold';
    font-size: 12px !important;
  }
}
.team-container {
  .title {
    color: #aeaeb2;
    font-size: 11px;
    font-weight: 500;
  }
  .team {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    .team-member {
      background-color: white !important;
      padding: 10px;
      border-radius: 5px;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      img {
        width: 40px;
        height: 40px;
      }
      .name {
        color: #202020;
        font-size: 12px;
        font-weight: 700;
        font-family: 'Bold';
      }
      .serial {
        color: #aeaeb2;
        font-size: 11px;
        font-weight: 500;
      }
    }
  }
}
</style>
