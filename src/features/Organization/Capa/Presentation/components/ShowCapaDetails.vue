<script lang="ts" setup>
import { useRoute } from 'vue-router'
import ShowCapaDetailsParams from '../../Core/params/ShowCapaDetailsParams'
import ShowCapaDetailsController from '../controllers/ShowCapaDetailsController'
import { computed, onMounted, ref } from 'vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import Editor from 'primevue/editor'
import CapaActionPlan from './CapaActionPlan.vue'

const showCapaDetailsController = ShowCapaDetailsController.getInstance()
const state = computed(() => showCapaDetailsController.state.value)
const route = useRoute()

const lessonLearnt = ref('')
const capaActionPlan = ref()

const ShowCapaDetails = () => {
  const showCapaSetailsParams = new ShowCapaDetailsParams({
    observationcapaId: Number(route.params.id),
  })
  showCapaDetailsController.getData(showCapaSetailsParams)
}

const setCapaActionPlan = (data: any) => {
  capaActionPlan.value = data
}

const summaryCards = computed(() => [
  {
    label: 'CAPA serial',
    value: state.value.data?.serialName || 'N/A',
  },
  {
    label: 'Observation ID',
    value: state.value.data?.observationId || 'N/A',
  },
  {
    label: 'CAPA ID',
    value: state.value.data?.observationCapaId || 'N/A',
  },
  {
    label: 'Investigation ID',
    value: state.value.data?.investigation?.Investegationid || 'N/A',
  },
])

onMounted(() => {
  ShowCapaDetails()
})
</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <main class="capa-details-page">
        <section class="capa-hero">
          <div class="hero-content">
            <span class="hero-eyebrow">CAPA details</span>
            <h1>{{ state.data?.observation?.title || 'Corrective and preventive action' }}</h1>
            <p>
              {{
                state.data?.observation?.description ||
                'Build the action plan, verify the impact, and capture what the team learned.'
              }}
            </p>
          </div>

          <div class="hero-meta">
            <span>{{ state.data?.date || 'N/A' }}</span>
            <strong>{{ state.data?.time || 'N/A' }}</strong>
          </div>
        </section>

        <section class="summary-grid">
          <article v-for="card in summaryCards" :key="card.label" class="summary-card">
            <span>{{ card.label }}</span>
            <strong>{{ card.value }}</strong>
          </article>
        </section>

        <section class="details-grid">
          <article class="insight-card corrective">
            <span>Corrective action</span>
            <p v-html="state.data?.corrective || 'No corrective action has been added yet.'"></p>
          </article>

          <article class="insight-card preventive">
            <span>Preventive action</span>
            <p v-html="state.data?.preventive || 'No preventive action has been added yet.'"></p>
          </article>
        </section>

        <CapaActionPlan @update:data="setCapaActionPlan" />

        <section class="verification-section">
          <div class="section-heading">
            <span>Verification of effectiveness</span>
            <h2>Make sure actions actually changed the risk</h2>
          </div>
          <div class="verification-grid">
            <article>
              <span class="step-number">01</span>
              <h3>Evidence review</h3>
              <p>
                Check closure evidence, assigned owners, due dates, and any supporting
                documentation.
              </p>
            </article>
            <article>
              <span class="step-number">02</span>
              <h3>Field validation</h3>
              <p>Confirm the corrective and preventive controls are visible in the workplace.</p>
            </article>
            <article>
              <span class="step-number">03</span>
              <h3>Follow-up result</h3>
              <p>Record whether the issue stayed closed or needs another action cycle.</p>
            </article>
          </div>
        </section>

        <section class="lesson-section">
          <div class="section-heading">
            <span>Lesson learnt</span>
            <h2>Capture the learning before it fades</h2>
          </div>
          <Editor
            id="lesson_learnt"
            v-model="lessonLearnt"
            editorStyle="height: 280px"
            placeholder="Write the lesson learnt, what changed, and what should be shared with other teams."
          />
        </section>
      </main>
    </template>

    <template #loader>
      <TableLoader :cols="3" :rows="10" />
    </template>

    <template #initial>
      <TableLoader :cols="3" :rows="10" />
    </template>

    <template #empty>
      <DataEmpty
        title="No CAPA details found"
        description="There is no CAPA details data for this record yet."
      />
    </template>

    <template #failed>
      <DataFailed
        title="Could not load CAPA details"
        description="Something went wrong while loading this CAPA details page."
      />
    </template>
  </DataStatus>
</template>

<style scoped lang="scss">
.capa-details-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1rem;
}

.capa-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 2rem;
  border-radius: 20px;
  background: white;
  color: #ffffff;
  padding: clamp(1.4rem, 3vw, 2.4rem);
  box-shadow: 0 22px 50px rgba(15, 23, 42, 0.18);
}

// .capa-hero::after {
//   content: '';
//   position: absolute;
//   inset: auto -12% -35% auto;
//   width: 360px;
//   height: 360px;
//   border-radius: 999px;
//   background: rgba(20, 184, 166, 0.28);
//   filter: blur(8px);
// }

.hero-content,
.hero-meta {
  position: relative;
  z-index: 1;
}

.hero-content {
  max-width: 760px;

  h1 {
    margin: 0.4rem 0 0.75rem;
    font-size: 22px;
    font-weight: 900;
    line-height: 1.05;
    color: black;
  }

  p {
    max-width: 720px;
    margin: 0;
    color: black;
    // color: rgba(255, 255, 255, 0.78);
    font-size: 12px;
    line-height: 1.7;
  }
}

.hero-eyebrow,
.section-heading span,
.summary-card span,
.insight-card span {
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-eyebrow {
  color: #1d4ed8;
}

.hero-meta {
  display: flex;
  align-self: flex-start;
  flex-direction: column;
  min-width: 150px;
  border: 1px solid black;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  padding: 1rem;

  span {
    color: black;
    font-size: 0.82rem;
  }

  strong {
    margin-top: 0.25rem;
    color: black;
    font-size: 1.3rem;
  }
}

.summary-grid,
.details-grid,
.verification-grid {
  display: grid;
  gap: 1rem;
}

.summary-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.summary-card,
.insight-card,
.verification-section,
.lesson-section {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.06);
}

.summary-card {
  padding: 1rem;

  span {
    color: #64748b;
  }

  strong {
    display: block;
    margin-top: 0.45rem;
    color: #0f172a;
    font-size: 1.15rem;
    word-break: break-word;
  }
}

.details-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.insight-card {
  position: relative;
  overflow: hidden;
  min-height: 150px;
  padding: 1.2rem;

  span {
    color: #475569;
  }

  p {
    margin: 0.8rem 0 0;
    color: #0f172a;
    font-size: 1rem;
    line-height: 1.7;
  }
}

.insight-card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 5px;
}

.insight-card.corrective::before {
  background: #ef4444;
}

.insight-card.preventive::before {
  background: #14b8a6;
}

.verification-section,
.lesson-section {
  padding: 1.25rem;
}

.section-heading {
  margin-bottom: 1rem;

  span {
    color: #0f766e;
  }

  h2 {
    margin: 0.25rem 0 0;
    color: #0f172a;
    font-size: 1.35rem;
    font-weight: 900;
  }
}

.verification-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));

  article {
    border-radius: 16px;
    background: #f8fafc;
    padding: 1rem;
  }

  h3 {
    margin: 0.75rem 0 0.4rem;
    color: #0f172a;
    font-size: 1rem;
    font-weight: 800;
  }

  p {
    margin: 0;
    color: #64748b;
    line-height: 1.6;
  }
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: #ccfbf1;
  color: #0f766e;
  font-weight: 900;
}

:deep(.p-editor-container) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.p-editor-toolbar) {
  border-color: rgba(15, 23, 42, 0.08);
  background: #f8fafc;
}

:deep(.p-editor-content) {
  border-color: rgba(15, 23, 42, 0.08);
}

@media (max-width: 1100px) {
  .summary-grid,
  .verification-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 780px) {
  .capa-details-page {
    padding: 0.5rem;
  }

  .capa-hero,
  .details-grid,
  .summary-grid,
  .verification-grid {
    grid-template-columns: 1fr;
  }

  .capa-hero {
    flex-direction: column;
  }

  .hero-meta {
    width: 100%;
  }
}
</style>
