<script lang="ts" setup>
import empCardImg from '@/assets/images/employee-card-img.png'
import observationImg from '@/assets/images/observation-img.png'
import incidentImg from '@/assets/images/incident-img.png'
import { empCardEnum } from '@/features/EmployeeInterface/Core/Enum/empIntEnum'
import { InspectionPageType } from '@/features/Organization/ObservationFactory/Core/Enums/InspectionTypeEnum'
import { useProjectSelectStore } from '@/stores/ProjectSelect'

interface CardAction {
  title: string
  route: string
  show: boolean
}

interface EmpCard {
  type: empCardEnum
  title: string
  eyebrow: string
  subtitle: string
  img: string
  actions: CardAction[]
}
const useprojectSelectStore = useProjectSelectStore()

const cards: EmpCard[] = [
  {
    type: empCardEnum.Inspection,
    title: 'Inspection',
    eyebrow: 'Stay proactive',
    subtitle: 'Complete an inspection to verify compliance with safety standards and procedures.',
    img: empCardImg,
    actions: [
      {
        title: 'Daily Inspection',
        route: `/organization/equipment-mangement/inspection?inspectionType=${InspectionPageType.DragInspection}`,
        show: useprojectSelectStore.AllProjects?.length > 0,
      },
      {
        title: 'Inspection logs',
        route: `/organization/equipment-mangement/inspection?inspectionType=${InspectionPageType.Result}`,
        show: true,
      },
    ],
  },
  {
    type: empCardEnum.Observation,
    title: 'Observation',
    eyebrow: 'See it. Share it.',
    subtitle: 'Document safety observations in line with organizational standards.',
    img: observationImg,
    actions: [
      {
        title: 'Add Observation',
        route: '/organization/equipment-mangement/observation/add',
        show: useprojectSelectStore.AllProjects?.length > 0,
      },
      {
        title: 'View Observations',
        route: '/organization/equipment-mangement/observation?isAll=1',
        show: true,
      },
    ],
  },
  {
    type: empCardEnum.Incident,
    title: 'Incident',
    eyebrow: 'Make a difference',
    subtitle: 'Report and review incidents to ensure proper investigation and corrective actions.',
    img: incidentImg,
    actions: [
      {
        title: 'Report Incident',
        route: '/organization/equipment-mangement/incedant/add',
        show: useprojectSelectStore.AllProjects?.length > 0,
      },
      {
        title: 'View Incident',
        route: '/organization/equipment-mangement/incedant?isAll=1',
        show: true,
      },
    ],
  },
]
</script>
<template>
  <div class="employee-interface-wrapper">
    <article
      v-for="(card, cardIndex) in cards"
      :key="card.type"
      class="employee-interface-card"
      :class="card.title"
      :aria-labelledby="`employee-card-${card.type}`"
    >
      <div class="card-text">
        <div class="card-eyebrow">
          <span class="card-number" aria-hidden="true">0{{ cardIndex + 1 }}</span>
          <span>{{ card.eyebrow }}</span>
        </div>
        <div class="info-wrapper">
          <h2 :id="`employee-card-${card.type}`" class="card-title">{{ card.title }}</h2>
          <p class="card-subtitle">{{ card.subtitle }}</p>
        </div>
      </div>

      <div class="card-illustration" aria-hidden="true">
        <span class="illustration-orbit"></span>
        <img :src="card.img" alt="" />
      </div>

      <div class="actions-button">
        <RouterLink
          v-for="(action, index) in card.actions"
          :key="action.route"
          :to="action.route"
          :class="index === 0 ? 'button-main' : 'button-view'"
        >
          <span>{{ action.title }}</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </RouterLink>
      </div>
    </article>
  </div>
</template>
