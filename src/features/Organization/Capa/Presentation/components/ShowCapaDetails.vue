<script lang="ts" setup>
import { useRoute } from 'vue-router'
import ShowCapaDetailsParams from '../../Core/params/ShowCapaDetailsParams'
import ShowCapaDetailsController from '../controllers/ShowCapaDetailsController'
import { computed, onMounted, ref } from 'vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
// import Editor from 'primevue/editor'
// import CapaActionPlan from './CapaActionPlan.vue'
import CapaActionPlanDetails from './CapaActionPlanDetails.vue'
import VerificationOfEffectiveness from '../supcomponents/VerificationOfEffectiveness.vue'

const showCapaDetailsController = ShowCapaDetailsController.getInstance()
const state = computed(() => showCapaDetailsController.state.value)
const route = useRoute()

const lessonLearnt = ref('')
const capaActionPlan = ref()
const verificationOfEffectiveness = ref()

const ShowCapaDetails = () => {
  const showCapaSetailsParams = new ShowCapaDetailsParams({
    observationcapaId: Number(route.params.id),
  })
  showCapaDetailsController.getData(showCapaSetailsParams)
}

const setCapaActionPlan = (data: any) => {
  capaActionPlan.value = data
}

const setVerificationOfEffectiveness = (data: any) => {
  verificationOfEffectiveness.value = data
}

const summaryCards = computed(() => [
  {
    label: 'CAPA serial',
    value: state.value.data?.serialName || 'N/A',
  },
  {
    label: 'Observation ID',
    value: state.value.data?.observationId || 'N/A',
    path: `/organization/equipment-mangement/incedant/show/${state.value.data?.observation?.id}`,
  },
  {
    label: 'CAPA ID',
    value: state.value.data?.observationCapaId || 'N/A',
  },
  {
    label: 'Investigation ID',
    value: state.value.data?.investigation?.Investegationid || 'N/A',
    path: `/organization/Investigating-result-answer/${state.value.data?.investigation?.Investegationid}`,
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
          <router-link
            :to="card.path ? card.path : '#'"
            v-for="card in summaryCards"
            :key="card.label"
            class="summary-card"
          >
            <span>{{ card.label }}</span>
            <strong>{{ card.value }}</strong>
          </router-link>
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

        <!-- <CapaActionPlan @update:data="setCapaActionPlan" /> -->
        <CapaActionPlanDetails
          :correctiveTasks="state.data?.investigation?.correctiveTask ?? []"
          :preventiveTasks="state.data?.investigation?.preventiveTask ?? []"
        />

        <section class="lesson-section">
          <!-- <div class="section-heading">
            <span>Lesson learnt</span>
            <h2>Capture the learning before it fades</h2>
          </div>
          <Editor
            id="lesson_learnt"
            v-model="lessonLearnt"
            editorStyle="height: 280px"
            placeholder="Write the lesson learnt, what changed, and what should be shared with other teams."
          /> -->

          <div class="saved-lesson">
            <span>Saved lesson learnt</span>
            <div
              v-if="state.data?.investigation?.lessonLearnt"
              class="saved-lesson-content"
              v-html="state.data.investigation?.lessonLearnt"
            ></div>
            <p v-else>No lesson learnt has been added yet.</p>
          </div>
        </section>
      </main>
      <VerificationOfEffectiveness :obsrvationId="Number(state.data?.observationCapaId)" />
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
  background:
    linear-gradient(135deg, var(--BgWhite), var(--Gray-1)),
    linear-gradient(135deg, var(--primary-dark), transparent);
  color: var(--header-page-color);
  padding: clamp(1.4rem, 3vw, 2.4rem);
  box-shadow: 0 16px 32px color-mix(in srgb, var(--Black) 10%, transparent);
}

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
    color: var(--header-page-color);
  }

  p {
    max-width: 720px;
    margin: 0;
    color: var(--GrayText-1);
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
  color: var(--PrimaryColor);
}

.hero-meta {
  display: flex;
  align-self: flex-start;
  flex-direction: column;
  min-width: 150px;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  // background: var(--primary-dark);
  backdrop-filter: blur(10px);
  padding: 1rem;

  span {
    color: var(--GrayText-1);
    font-size: 0.82rem;
  }

  strong {
    margin-top: 0.25rem;
    color: var(--PrimaryColor);
    font-size: 1.3rem;
  }
}

.summary-grid,
.details-grid {
  display: grid;
  gap: 1rem;
}

.summary-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.summary-card,
.insight-card,
.lesson-section {
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background: var(--BgWhite);
  box-shadow: 0 8px 16px color-mix(in srgb, var(--Black) 10%, transparent);
}

.summary-card {
  padding: 1rem;

  span {
    color: var(--GrayText-1);
  }

  strong {
    display: block;
    margin-top: 0.45rem;
    color: var(--header-page-color);
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
    color: var(--GrayText-1);
  }

  p {
    margin: 0.8rem 0 0;
    color: var(--header-page-color);
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
  background: var(--danger-color);
}

.insight-card.preventive::before {
  background: var(--green);
}

.lesson-section {
  padding: 1.25rem;
}

.saved-lesson {
  margin-top: 1rem;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--Gray-1);
  padding: 1rem;

  > span {
    display: block;
    color: var(--PrimaryColor);
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  p {
    margin: 0.75rem 0 0;
    color: var(--GrayText-1);
    font-weight: 700;
  }
}

.saved-lesson-content {
  margin-top: 0.75rem;
  color: var(--header-page-color);
  line-height: 1.7;

  :deep(p) {
    margin: 0 0 0.75rem;
  }

  :deep(ul),
  :deep(ol) {
    padding-inline-start: 1.25rem;
  }
}

.section-heading {
  margin-bottom: 1rem;

  span {
    color: var(--PrimaryColor);
  }

  h2 {
    margin: 0.25rem 0 0;
    color: var(--header-page-color);
    font-size: 1.35rem;
    font-weight: 900;
  }
}

:deep(.p-editor-container) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.p-editor-toolbar) {
  border-color: var(--main-border);
  background: var(--Gray-1);
}

:deep(.p-editor-content) {
  border-color: var(--main-border);
}

@media (max-width: 1100px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 780px) {
  .capa-details-page {
    padding: 0.5rem;
  }

  .capa-hero,
  .details-grid,
  .summary-grid {
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
