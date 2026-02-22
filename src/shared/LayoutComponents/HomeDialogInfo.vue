<script lang="ts" setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import HomeInfoIcon from '../icons/HomeInfoIcon.vue';

const visible = ref(false)

// Easily add or edit data here
const modules = ref([
  {
    id: 1,
    title: 'Observation',
    subtitle: 'Report a Potential Risk',
    description: 'Used to report unsafe conditions or behaviors <strong>before</strong> they cause harm.',
    features: [
      'Identify hazards or unsafe behaviors.',
      'Add photos and assess risk level (L/M/H).',
      'Assign corrective & preventive actions.'
    ]
  },
  {
    id: 2,
    title: 'Incident',
    subtitle: 'Report an Event That Happened',
    description: 'Used to record accidents, injuries, or damage that has already occurred.',
    features: [
      'Record root cause and witnesses.',
      'Log injuries or fatalities.',
      'Trigger automatic Investigations.'
    ]
  },
  {
    id: 3,
    title: 'Investigation',
    subtitle: 'Review and Decision Process',
    description: 'Analyzes incidents to determine why they happened and how to prevent recurrence.',
    features: [
      'Review incident details & root causes.',
      'Conduct formal team meetings.',
      'Assign responsibilities and close cases.'
    ]
  },
  {
    id: 4,
    title: 'Inspection',
    subtitle: 'Mandatory Safety Checks',
    description: 'Standardized tasks to ensure safety compliance across assets and personnel.',
    features: [
      'Assign to Machines, Employees, or Zones.',
      'Ad-Hoc (one-time) or Periodic (repeated).',
      'Complete digital checklists on schedule.'
    ]
  }
])
</script>

<template>
  <button @click="visible = true" class="info-trigger">
    <HomeInfoIcon class="info-dialog" />
  </button>

  <Dialog v-model:visible="visible" :modal="true" header="Operations Module: HSE Management" :style="{ width: '70vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div class="hse-container">
      <section class="overview-header">
        <p>
          The <strong>Operations Module</strong> helps you manage workplace safety through reporting, monitoring, and
          corrective actions.
          It consists of four primary pillars designed to maintain a safe and compliant work environment.
        </p>
      </section>

      <hr class="divider" />

      <div class="modules-grid">
        <div v-for="item in modules" :key="item.id" class="module-card">
          <div class="card-header">
            <span class="badge">{{ item.id }}</span>
            <h3>{{ item.title }}</h3>
          </div>

          <p class="subtitle">{{ item.subtitle }}</p>

          <p class="description" v-html="item.description"></p>

          <ul class="info-list">
            <li v-for="(feature, fIndex) in item.features" :key="fIndex">
              {{ feature }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
/* Styles remain the same as your previous version */
.info-trigger {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;
}

.info-trigger:hover {
  opacity: 0.8;
}

.hse-container {
  font-family: 'Inter', sans-serif;
  color: #334155;
  line-height: 1.6;
}

.overview-header p {
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 20px;
}

.divider {
  border: 0;
  border-top: 1px solid #e2e8f0;
  margin: 24px 0;
}

.modules-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.module-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.module-card:hover {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.badge {
  background: #3b82f6;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: bold;
}

.module-card h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1e293b;
  font-weight: 700;
}

.subtitle {
  font-weight: 600;
  color: #3b82f6;
  font-size: 0.9rem;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.description {
  font-size: 0.95rem;
  margin-bottom: 12px;
}

.info-list {
  padding-left: 20px;
  margin: 0;
  font-size: 0.9rem;
  color: #475569;
}

.info-list li {
  margin-bottom: 6px;
}

@media (max-width: 768px) {
  .modules-grid {
    grid-template-columns: 1fr;
  }
}
</style>
