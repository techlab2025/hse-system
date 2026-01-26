<script lang="ts" setup>
import empCardImg from '@/assets/images/employee-card-img.png'
import observationImg from '@/assets/images/observation-img.png'
import incidentImg from '@/assets/images/incident-img.png'
import { empCardEnum } from '@/features/EmployeeInterface/Core/Enum/empIntEnum'

interface CardAction {
  title: string
  route: string
}

interface EmpCard {
  type: empCardEnum
  title: string
  subtitle: string
  img: string
  actions: CardAction[]
}

const cards: EmpCard[] = [
  {
    type: empCardEnum.Inspection,
    title: 'Inspection',
    subtitle: 'Complete an inspection to verify compliance with safety standards and procedures.',
    img: empCardImg,
    actions: [
      {
        title: 'Daily Inspection',
        route: '/organization/inspection/daily',
      },
      {
        title: 'Inspection Results',
        route: '/organization/inspection/results',
      },
    ],
  },
  {
    type: empCardEnum.Observation,
    title: 'Observation',
    subtitle: 'Document safety observations in line with organizational standards.',
    img: observationImg,
    actions: [
      {
        title: 'Add Observation',
        route: '/organization/observation/add',
      },
      {
        title: 'View Observations',
        route: '/organization/observation/list',
      },
    ],
  },
  {
    type: empCardEnum.Incident,
    title: 'Incident',
    subtitle: 'Report and review incidents to ensure proper investigation and corrective actions.',
    img: incidentImg,
    actions: [
      {
        title: 'Report Incident',
        route: '/organization/incident/report',
      },
      {
        title: 'View Incident',
        route: '/organization/incident/history',
      },
    ],
  },
]

const buttons = [{ title: 'Daily Inspection' }, { title: 'View Results' }]
</script>
<template>
  <div class="employee-interface-wrapper">
    <div v-for="card in cards" :key="card.type" class="employee-interface-card" :class="card.title">
      <div class="card-text">
        <div class="info-sub-wrapper">
          <div class="info-wrapper">
            <p class="card-title">{{ card.title }}</p>
            <p class="card-subtitle">{{ card.subtitle }}</p>
          </div>
          <div>
            <img :src="card.img" alt="card image" />
          </div>
        </div>

        <div class="actions-button">
          <button
            v-for="(action, index) in card.actions"
            :key="index"
            :class="index === 0 ? 'button-main' : 'button-view'"
            @click="$router.push(action.route)"
          >
            {{ action.title }}
          </button>
        </div>
      </div>

      <!-- Desktop image -->
      <div class="lotty-card-img">
        <img :src="card.img" alt="card image" />
      </div>
    </div>
  </div>
</template>
