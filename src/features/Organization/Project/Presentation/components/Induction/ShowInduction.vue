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

const fetchInductionDetails = async () => {
  await controller.showInduction(new ShowInductionParams(id.value))
}

const personName = (
  item: { id?: number | null; title?: string; name?: string } | null | undefined,
) => {
  if (!item) return '-'
  return item.title || item.name || (item.id ? '#' + item.id : '-')
}

const topicName = (item: { id?: number | null; title?: string } | null | undefined) => {
  if (!item) return '-'
  return item.title || (item.id ? '#' + item.id : '-')
}

const personInitials = (item: { id?: number | null; title?: string; name?: string }) => {
  const name = personName(item)
  if (name === '-') return '-'

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

const attachments = computed(() => induction.value?.image ?? [])
const trainingTopicCount = computed(() => induction.value?.trainingTopic.length ?? 0)
const attendeeCount = computed(() => induction.value?.organisationEmployee.length ?? 0)
const evidenceCount = computed(() => attachments.value.length)
const instructorValue = computed(
  () =>
    induction.value?.instructorName ||
    (induction.value?.instractor_id ? '#' + induction.value.instractor_id : '-'),
)

const summaryItems = computed(() => [
  {
    icon: 'uil:user-check',
    label: 'instractor',
    value: instructorValue.value,
    tone: 'sky',
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
])

watch(
  () => controller.state.value,
  (value) => {
    if (value) state.value = value
  },
  { deep: true },
)

onMounted(fetchInductionDetails)
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <section v-if="induction" class="induction-show">
        <header class="show-hero">
          <div class="show-hero__identity">
            <span class="show-hero__icon" aria-hidden="true">
              <Icon icon="uil:book-open" />
            </span>
            <div class="show-hero__copy">
              <p>{{ $t('Induction') }}</p>
              <h1>{{ induction.title }}</h1>
              <div class="show-hero__meta">
                <span>{{ induction.projectTitle || '-' }}</span>
                <span>{{ induction.date || '-' }}</span>
                <span>{{ instructorValue }}</span>
              </div>
            </div>
          </div>

          <div class="show-hero__metrics" aria-label="Induction summary">
            <div class="metric-pill">
              <strong>{{ trainingTopicCount }}</strong>
              <span>{{ $t('trainingTopic') }}</span>
            </div>
            <div class="metric-pill">
              <strong>{{ attendeeCount }}</strong>
              <span>{{ $t('organisationEmployee') }}</span>
            </div>
            <div class="metric-pill">
              <strong>{{ evidenceCount }}</strong>
              <span>{{ $t('Evidence') }}</span>
            </div>
          </div>
        </header>

        <section class="smart-summary" aria-label="Induction details">
          <article
            v-for="item in summaryItems"
            :key="item.label"
            class="summary-card"
            :data-tone="item.tone"
          >
            <span class="summary-card__icon" aria-hidden="true">
              <Icon :icon="item.icon" />
            </span>
            <div>
              <p>{{ $t(item.label) }}</p>
              <strong>{{ item.value }}</strong>
            </div>
          </article>
        </section>

        <div class="content-grid">
          <!-- <section class="smart-panel topics-panel">
            <header class="panel-header">
              <span class="panel-header__icon" aria-hidden="true">
                <Icon icon="uil:list-ul" />
              </span>
              <h2>{{ $t('trainingTopic') }}</h2>
              <small>{{ trainingTopicCount }}</small>
            </header>

            <div v-if="induction.trainingTopic.length" class="topic-stack">
              <div
                v-for="(topic, index) in induction.trainingTopic"
                :key="topic.id || topic.title"
                class="topic-row"
              >
                <span>{{ index + 1 }}</span>
                <strong>{{ topicName(topic) }}</strong>
              </div>
            </div>
            <p v-else class="empty-text">{{ $t('No training topics selected') }}</p>
          </section> -->

          <!-- <section class="smart-panel people-panel">
            <header class="panel-header">
              <span class="panel-header__icon" aria-hidden="true">
                <Icon icon="uil:users-alt" />
              </span>
              <h2>{{ $t('organisationEmployee') }}</h2>
              <small>{{ attendeeCount }}</small>
            </header>

            <div v-if="induction.organisationEmployee.length" class="people-list">
              <div
                v-for="employee in induction.organisationEmployee"
                :key="employee.id || employee.name"
                class="person-row"
              >
                <span class="person-avatar">{{ personInitials(employee) }}</span>
                <div class="person-row__body">
                  <strong>{{ personName(employee) }}</strong>
                  <small v-if="employee.email">{{ employee.email }}</small>
                  <small v-else-if="employee.id">#{{ employee.id }}</small>
                </div>
              </div>
            </div>
            <p v-else class="empty-text">{{ $t('No attendees selected') }}</p>
          </section> -->

          <section class="smart-panel evidence-panel">
            <header class="panel-header">
              <span class="panel-header__icon" aria-hidden="true">
                <Icon icon="uil:image-v" />
              </span>
              <h2>{{ $t('Evidence') }}</h2>
              <small>{{ evidenceCount }}</small>
            </header>

            <div v-if="attachments.length" class="attachment-grid">
              <div
                v-for="(file, index) in attachments"
                :key="file + '-' + index"
                class="attachment-item"
              >
                <Image :src="file" alt="Image" preview image-class="attachment-image" />
                <span>{{ index + 1 }}</span>
              </div>
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
  gap: 16px;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 14%, var(--main-border));
  border-radius: 16px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--surface-1) 96%, #eef4ff) 0%, var(--surface-1) 42%),
    var(--surface-1);
}

.show-hero {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, var(--main-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-1) 92%, #f8fbff);
}

.show-hero__identity {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.show-hero__icon,
.summary-card__icon,
.panel-header__icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  color: var(--PrimaryColor);
}

.show-hero__icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
}

.show-hero__icon svg {
  width: 27px;
  height: 27px;
}

.show-hero__copy {
  min-width: 0;
}

.show-hero__copy p,
.show-hero__copy h1,
.show-hero__meta {
  margin: 0;
}

.show-hero__copy p {
  color: var(--text-soft);
  font-size: 0.78rem;
  font-weight: 800;
}

.show-hero__copy h1 {
  overflow: hidden;
  color: var(--text-strong);
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.show-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 9px;
}

.show-hero__meta span {
  display: inline-flex;
  align-items: center;
  max-width: 220px;
  min-height: 28px;
  padding: 5px 9px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, var(--main-border));
  border-radius: 999px;
  color: var(--text-soft);
  font-size: 0.78rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.show-hero__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(96px, 1fr));
  gap: 10px;
  min-width: min(100%, 380px);
}

.metric-pill {
  display: grid;
  align-content: center;
  min-height: 76px;
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 14%, var(--main-border));
  border-radius: 12px;
  background: var(--surface-1);
}

.metric-pill strong {
  color: var(--PrimaryColor);
  font-size: 1.35rem;
  font-weight: 900;
  line-height: 1;
}

.metric-pill span {
  margin-top: 6px;
  color: var(--text-soft);
  font-size: 0.73rem;
  font-weight: 800;
}

.smart-summary {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 78px;
  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, var(--main-border));
  border-radius: 12px;
  background: var(--surface-1);
}

.summary-card[data-tone='green'] .summary-card__icon {
  color: #16805d;
  background: color-mix(in srgb, #16a34a 12%, transparent);
}

.summary-card[data-tone='amber'] .summary-card__icon {
  color: #93610d;
  background: color-mix(in srgb, #f59e0b 14%, transparent);
}

.summary-card[data-tone='violet'] .summary-card__icon {
  color: #6554c0;
  background: color-mix(in srgb, #7c3aed 11%, transparent);
}

.summary-card[data-tone='slate'] .summary-card__icon {
  color: var(--text-soft);
  background: color-mix(in srgb, var(--text-soft) 10%, transparent);
}

.summary-card__icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
}

.summary-card__icon svg,
.panel-header__icon svg {
  width: 20px;
  height: 20px;
}

.summary-card div {
  min-width: 0;
}

.summary-card p,
.summary-card strong {
  margin: 0;
}

.summary-card p {
  color: var(--text-soft);
  font-size: 0.72rem;
  font-weight: 800;
}

.summary-card strong {
  display: block;
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.92rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 14px;
}

.smart-panel {
  display: grid;
  gap: 12px;
  align-content: start;
  min-width: 0;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, var(--main-border));
  border-radius: 14px;
  background: var(--surface-1);
}

.evidence-panel {
  grid-column: 1 / -1;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}

.panel-header__icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
}

.panel-header h2 {
  flex: 1;
  margin: 0;
  color: var(--text-strong);
  font-size: 1rem;
  font-weight: 900;
}

.panel-header small {
  display: grid;
  min-width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 999px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  color: var(--PrimaryColor);
  font-size: 0.78rem;
  font-weight: 900;
}

.topic-stack,
.people-list {
  display: grid;
  gap: 9px;
}

.topic-row,
.person-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 48px;
  padding: 9px 10px;
  border: 1px solid color-mix(in srgb, var(--main-border) 84%, transparent);
  border-radius: 11px;
  background: color-mix(in srgb, var(--surface-1) 96%, #eef4ff);
}

.topic-row span {
  display: grid;
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 8px;
  background: color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
  color: var(--PrimaryColor);
  font-size: 0.8rem;
  font-weight: 900;
}

.topic-row strong,
.person-row__body strong {
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.9rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.person-avatar {
  display: grid;
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 10px;
  background: color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
  color: var(--PrimaryColor);
  font-size: 0.78rem;
  font-weight: 900;
}

.person-row__body {
  display: grid;
  min-width: 0;
}

.person-row__body small {
  overflow: hidden;
  color: var(--text-soft);
  font-size: 0.76rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.attachment-item {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border: 1px solid color-mix(in srgb, var(--main-border) 84%, transparent);
  border-radius: 12px;
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
  width: 26px;
  height: 26px;
  place-items: center;
  border-radius: 8px;
  background: color-mix(in srgb, var(--surface-1) 92%, transparent);
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

@media (max-width: 1180px) {
  .show-hero {
    flex-direction: column;
  }

  .show-hero__metrics,
  .smart-summary {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .content-grid,
  .smart-summary {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .induction-show,
  .show-hero,
  .smart-panel {
    padding: 12px;
  }

  .show-hero__identity {
    align-items: flex-start;
  }

  .show-hero__copy h1 {
    white-space: normal;
  }

  .show-hero__metrics {
    grid-template-columns: 1fr;
  }
}
</style>
