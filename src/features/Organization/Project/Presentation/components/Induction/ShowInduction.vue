<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import Image from 'primevue/image'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import ShowInductionController from '../../controllers/Induction/showInductionController'
import ShowInductionParams from '../../../Core/params/induction/showInductionParams'

const route = useRoute()
const id = computed(() => Number(route.params.id))
const controller = ShowInductionController.getInstance()
const state = ref(controller.state.value)

const induction = computed(() => state.value.data)
const attachments = computed(() => induction.value?.image ?? [])
const trainingTopicCount = computed(() => induction.value?.trainingTopic.length ?? 0)
const attendeeCount = computed(() => induction.value?.organisationEmployee.length ?? 0)
const evidenceCount = computed(() => attachments.value.length)
const instructorValue = computed(
  () =>
    induction.value?.instructorName ||
    (induction.value?.instractor_id ? '#' + induction.value.instractor_id : '-'),
)

const heroMetrics = computed(() => [
  {
    icon: 'uil:list-ul',
    label: 'training_topics',
    value: trainingTopicCount.value,
    tone: 'blue',
  },
  {
    icon: 'uil:users-alt',
    label: 'attendees',
    value: attendeeCount.value,
    tone: 'green',
  },
  {
    icon: 'uil:image-v',
    label: 'Evidence',
    value: evidenceCount.value,
    tone: 'amber',
  },
])

const detailItems = computed(() => [
  {
    icon: 'uil:user-check',
    label: 'instractor',
    value: instructorValue.value,
    tone: 'blue',
  },
  {
    icon: 'uil:briefcase-alt',
    label: 'project',
    value: induction.value?.projectTitle || '-',
    tone: 'violet',
  },
  {
    icon: 'uil:calendar-alt',
    label: 'date',
    value: induction.value?.date || '-',
    tone: 'green',
  },
  {
    icon: 'uil:map-marker',
    label: 'location',
    value:
      induction.value?.projectLocationTitle ||
      (induction.value?.projectLocationId ? '#' + induction.value.projectLocationId : '-'),
    tone: 'amber',
  },
  {
    icon: 'uil:map-pin-alt',
    label: 'zone',
    value:
      induction.value?.projectZoneTitle ||
      (induction.value?.projectZoonId ? '#' + induction.value.projectZoonId : '-'),
    tone: 'slate',
  },
  {
    icon: 'uil:clock',
    label: 'created_at',
    value: induction.value?.createdAt || '-',
    tone: 'slate',
  },
])

watch(
  () => controller.state.value,
  (value) => {
    if (value) state.value = value
  },
  { deep: true },
)

onMounted(() => {
  controller.showInduction(new ShowInductionParams(id.value))
})
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <section v-if="induction" class="induction-show">
        <header class="induction-hero">
          <div class="induction-hero__main">
            <span class="induction-hero__icon" aria-hidden="true">
              <Icon icon="uil:book-open" />
            </span>
            <div class="induction-hero__copy">
              <p>{{ $t('induction_overview') }}</p>
              <h1>{{ induction.title }}</h1>
              <div class="induction-hero__chips">
                <span>{{ induction.projectTitle || '-' }}</span>
                <span>{{ induction.date || '-' }}</span>
                <span>{{ instructorValue }}</span>
              </div>
            </div>
          </div>

          <div class="metric-grid" :aria-label="$t('session_details')">
            <article
              v-for="metric in heroMetrics"
              :key="metric.label"
              class="metric-card"
              :data-tone="metric.tone"
            >
              <span class="metric-card__icon" aria-hidden="true">
                <Icon :icon="metric.icon" />
              </span>
              <strong>{{ metric.value }}</strong>
              <p>{{ $t(metric.label) }}</p>
            </article>
          </div>
        </header>

        <section class="detail-grid" :aria-label="$t('induction_identity')">
          <article
            v-for="item in detailItems"
            :key="item.label"
            class="detail-card"
            :data-tone="item.tone"
          >
            <span class="detail-card__icon" aria-hidden="true">
              <Icon :icon="item.icon" />
            </span>
            <div>
              <p>{{ $t(item.label) }}</p>
              <strong>{{ item.value }}</strong>
            </div>
          </article>
        </section>

        <div class="show-grid">
          <section class="show-panel topics-panel">
            <header class="panel-header">
              <span class="panel-header__icon" aria-hidden="true">
                <Icon icon="uil:list-ul" />
              </span>
              <div>
                <h2>{{ $t('training_topics') }}</h2>
                <p>{{ trainingTopicCount }}</p>
              </div>
            </header>

            <div v-if="induction.trainingTopic.length" class="topic-list">
              <article
                v-for="(topic, index) in induction.trainingTopic"
                :key="topic.inductionTrainingTopicId || topic.trainingTopicId || index"
                class="topic-item"
              >
                <span>{{ index + 1 }}</span>
                <strong>{{ topic.displayTitle }}</strong>
              </article>
            </div>
            <p v-else class="empty-text">{{ $t('No training topics selected') }}</p>
          </section>

          <section class="show-panel attendees-panel">
            <header class="panel-header">
              <span class="panel-header__icon" aria-hidden="true">
                <Icon icon="uil:users-alt" />
              </span>
              <div>
                <h2>{{ $t('attendees') }}</h2>
                <p>{{ attendeeCount }}</p>
              </div>
            </header>

            <div v-if="induction.organisationEmployee.length" class="attendee-list">
              <article
                v-for="employee in induction.organisationEmployee"
                :key="employee.id + '-' + employee.displayTitle"
                class="attendee-item"
              >
                <span class="attendee-avatar">{{ employee.initials }}</span>
                <div class="attendee-copy">
                  <strong>{{ employee.displayTitle }}</strong>
                  <small>{{ employee.displaySubtitle || $t('external_attendee') }}</small>
                </div>
              </article>
            </div>
            <p v-else class="empty-text">{{ $t('No attendees selected') }}</p>
          </section>

          <section class="show-panel evidence-panel">
            <header class="panel-header">
              <span class="panel-header__icon" aria-hidden="true">
                <Icon icon="uil:image-v" />
              </span>
              <div>
                <h2>{{ $t('evidence_files') }}</h2>
                <p>{{ evidenceCount }}</p>
              </div>
            </header>

            <div v-if="attachments.length" class="attachment-grid">
              <article
                v-for="(file, index) in attachments"
                :key="file + '-' + index"
                class="attachment-item"
              >
                <Image :src="file" alt="Image" preview image-class="attachment-image" />
                <span>{{ index + 1 }}</span>
              </article>
            </div>
            <p v-else class="empty-text">{{ $t('No attachments') }}</p>
          </section>
        </div>
      </section>
    </template>

    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>

    <template #failed>
      <DataFailed :title="$t('no_inductions')" :description="$t('unable_to_load_inductions')" />
    </template>
  </DataStatus>
</template>

<style scoped>
.induction-show {
  display: grid;
  gap: 18px;
  padding: 16px;
}

.induction-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.72fr);
  gap: 16px;
  align-items: stretch;
  min-width: 0;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, var(--main-border));
  border-radius: 16px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--PrimaryColor) 12%, transparent), transparent 42%),
    color-mix(in srgb, var(--surface-1) 96%, #f8fbff);
}

.induction-hero__main {
  display: flex;
  gap: 14px;
  align-items: center;
  min-width: 0;
}

.induction-hero__icon,
.metric-card__icon,
.detail-card__icon,
.panel-header__icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
}

.induction-hero__icon {
  width: 58px;
  height: 58px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--PrimaryColor) 13%, transparent);
  color: var(--PrimaryColor);
}

.induction-hero__icon svg {
  width: 30px;
  height: 30px;
}

.induction-hero__copy {
  min-width: 0;
}

.induction-hero__copy p,
.induction-hero__copy h1,
.induction-hero__chips,
.metric-card p,
.panel-header h2,
.panel-header p {
  margin: 0;
}

.induction-hero__copy p {
  color: var(--text-soft);
  font-size: 0.78rem;
  font-weight: 800;
}

.induction-hero__copy h1 {
  margin-top: 4px;
  overflow: hidden;
  color: var(--text-strong);
  font-size: clamp(1.35rem, 2.4vw, 2rem);
  font-weight: 900;
  line-height: 1.15;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.induction-hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.induction-hero__chips span {
  display: inline-flex;
  align-items: center;
  max-width: 230px;
  min-height: 30px;
  padding: 5px 10px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 14%, var(--main-border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-1) 84%, transparent);
  color: var(--text-soft);
  font-size: 0.78rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.metric-card {
  display: grid;
  gap: 7px;
  align-content: center;
  min-height: 112px;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 13%, var(--main-border));
  border-radius: 14px;
  background: var(--surface-1);
}

.metric-card__icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  color: var(--PrimaryColor);
}

.metric-card[data-tone='green'] .metric-card__icon {
  color: #16805d;
  background: color-mix(in srgb, #16a34a 12%, transparent);
}

.metric-card[data-tone='amber'] .metric-card__icon {
  color: #93610d;
  background: color-mix(in srgb, #f59e0b 14%, transparent);
}

.metric-card strong {
  color: var(--text-strong);
  font-size: 1.55rem;
  font-weight: 900;
  line-height: 1;
}

.metric-card p {
  color: var(--text-soft);
  font-size: 0.76rem;
  font-weight: 800;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.detail-card {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
  min-height: 76px;
  padding: 13px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 11%, var(--main-border));
  border-radius: 14px;
  background: var(--surface-1);
}

.detail-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  color: var(--PrimaryColor);
}

.detail-card[data-tone='green'] .detail-card__icon {
  color: #16805d;
  background: color-mix(in srgb, #16a34a 12%, transparent);
}

.detail-card[data-tone='amber'] .detail-card__icon {
  color: #93610d;
  background: color-mix(in srgb, #f59e0b 14%, transparent);
}

.detail-card[data-tone='violet'] .detail-card__icon {
  color: #6554c0;
  background: color-mix(in srgb, #7c3aed 11%, transparent);
}

.detail-card[data-tone='slate'] .detail-card__icon {
  color: var(--text-soft);
  background: color-mix(in srgb, var(--text-soft) 10%, transparent);
}

.detail-card div {
  min-width: 0;
}

.detail-card p,
.detail-card strong {
  margin: 0;
}

.detail-card p {
  color: var(--text-soft);
  font-size: 0.72rem;
  font-weight: 800;
}

.detail-card strong {
  display: block;
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.92rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.show-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 14px;
}

.show-panel {
  display: grid;
  gap: 13px;
  align-content: start;
  min-width: 0;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 11%, var(--main-border));
  border-radius: 16px;
  background: var(--surface-1);
}

.evidence-panel {
  grid-column: 1 / -1;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.panel-header__icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  color: var(--PrimaryColor);
}

.metric-card__icon svg,
.detail-card__icon svg,
.panel-header__icon svg {
  width: 20px;
  height: 20px;
}

.panel-header div {
  min-width: 0;
}

.panel-header h2 {
  overflow: hidden;
  color: var(--text-strong);
  font-size: 1rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.panel-header p {
  color: var(--text-soft);
  font-size: 0.78rem;
  font-weight: 800;
}

.topic-list,
.attendee-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}
@media (max-width: 600px) {
  .topic-list,
  .attendee-list {
    grid-template-columns: 1fr;
  }
}

.topic-item,
.attendee-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 50px;
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--main-border) 86%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--surface-1) 96%, #eef4ff);
}

.topic-item span,
.attendee-avatar {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  color: var(--PrimaryColor);
  font-weight: 900;
}

.topic-item span {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--PrimaryColor) 11%, transparent);
  font-size: 0.8rem;
}

.topic-item strong {
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.91rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attendee-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--PrimaryColor) 11%, transparent);
  font-size: 0.78rem;
}

.attendee-copy {
  display: grid;
  min-width: 0;
}

.attendee-copy strong,
.attendee-copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attendee-copy strong {
  color: var(--text-strong);
  font-size: 0.92rem;
  font-weight: 900;
}

.attendee-copy small {
  color: var(--text-soft);
  font-size: 0.76rem;
  font-weight: 700;
}

.attachment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(154px, 1fr));
  gap: 12px;
}

.attachment-item {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border: 1px solid color-mix(in srgb, var(--main-border) 84%, transparent);
  border-radius: 14px;
  background: var(--surface-2);
}

.attachment-item :deep(.p-image),
.attachment-item :deep(.p-image img) {
  width: 100%;
  height: 100%;
}

.attachment-item :deep(.attachment-image) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.attachment-item span {
  position: absolute;
  inset-block-start: 8px;
  inset-inline-start: 8px;
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 9px;
  background: color-mix(in srgb, var(--surface-1) 94%, transparent);
  color: var(--PrimaryColor);
  font-size: 0.78rem;
  font-weight: 900;
}

.empty-text {
  margin: 0;
  padding: 16px;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 20%, var(--main-border));
  border-radius: 12px;
  color: var(--text-soft);
  font-size: 0.86rem;
  font-weight: 800;
}

@media (max-width: 1120px) {
  .induction-hero,
  .show-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 860px) {
  .detail-grid,
  .metric-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .induction-show,
  .induction-hero,
  .show-panel {
    padding: 12px;
  }

  .induction-hero__main {
    align-items: flex-start;
  }

  .induction-hero__copy h1,
  .detail-card strong,
  .panel-header h2 {
    white-space: normal;
  }
}
</style>
