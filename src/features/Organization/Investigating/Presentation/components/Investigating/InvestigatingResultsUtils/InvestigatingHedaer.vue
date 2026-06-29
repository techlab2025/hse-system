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
  time?: string
}>()
</script>
<template>
  <div class="investigating-header-container">
    <div class="investigating-header">
      <p class="title">{{ title }}</p>
      <span class="serial-badge">{{ serial }}</span>
      <p class="small-title">
        Place : <span class="place">{{ place }}</span>
      </p>
    </div>
    <div class="investigating-info">
      <p>
        the victim : <span>{{ victim }}</span>
      </p>
      <!-- <p>
        Date & Time : <span>{{ date }}</span>
      </p> -->
    </div>
    <div class="meeting-info-container">
      <div class="metting-info-header-container">
        <p class="metting-info-header">{{ $t('investigation_meeting') }}</p>
        <hr class="meeting-hr" />
      </div>
      <div class="meeting-info">
        <p>
          Date & Time : <span class="meet-date">{{ date }} &{{ time }}</span>
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
