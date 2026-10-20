<script setup lang="ts">
import { vProjectPanels } from '../../composables/projectPanels'

import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import Image from 'primevue/image'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import ShowInductionController from '../../controllers/Induction/showInductionController'
import ShowInductionParams from '../../../Core/params/induction/showInductionParams'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import PermissionHandler from '@/base/Presentation/utils/permission_handler'

const route = useRoute()
const id = computed(() => Number(route.params.id))
const controller = ShowInductionController.getInstance()
const state = ref(controller.state.value)
const detailsPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.inductions_ALL,
  PermissionsEnum.inductions_DETAILS,
]

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
  if (!PermissionHandler.Instance.handle(detailsPermissions)) return
  controller.showInduction(new ShowInductionParams(id.value))
})
</script>

<template>
  <PermissionBuilder :code="detailsPermissions">
    <div
      data-hse-project
      v-project-panels
      class="hse-identity hse-project-root hse-project-state-host"
    >
      <DataStatus :controller="state">
        <template #success>
          <section
            data-hse-project
            v-project-panels
            v-if="induction"
            class="hse-identity hse-project-root hse-project-page induction-show"
          >
            <div class="induction-hero">
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

              <div class="induction-metrics" :aria-label="$t('session_details')">
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
            </div>

            <section class="induction-details" :aria-label="$t('induction_identity')">
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

            <div class="induction-sections">
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

                <div v-if="attachments.length" class="induction-attachments">
                  <article
                    v-for="(file, index) in attachments"
                    :key="file + '-' + index"
                    class="attachment-item"
                  >
                    <Image
                      :src="file"
                      :alt="`${$t('evidence_files')} ${index + 1}`"
                      preview
                      image-class="attachment-image"
                    />
                    <span class="attachment-index" aria-hidden="true">{{ index + 1 }}</span>
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
    </div>
    <template #notPermitted>
      <DataFailed
        :title="$t('have_not_permission')"
        :description="$t('permission_denied_description')"
        link=""
        :withbtn="false"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped>
.induction-show {
  display: grid;
  gap: var(--hse-project-space-xl);
  min-width: 0;
  padding: 0;
}

.induction-hero,
.show-panel {
  min-width: 0;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-panel);
  background: white !important;
  box-shadow: var(--hse-project-shadow-panel);
  padding: 10px !important;
}

.induction-show .induction-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.85fr);
  align-items: center;
  gap: var(--hse-project-space-2xl);
  padding: var(--hse-project-space-2xl);
  border-block-start: 3px solid var(--hse-project-blue);
  margin: 0;
}

.induction-hero__main {
  display: flex;
  align-items: flex-start;
  gap: var(--hse-project-space-lg);
  min-width: 0;
}

.induction-hero__icon,
.metric-card__icon,
.detail-card__icon,
.panel-header__icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  color: var(--induction-accent, var(--hse-project-blue));
  background: color-mix(
    in srgb,
    var(--induction-accent, var(--hse-project-blue)) 9%,
    var(--hse-project-surface)
  );
  border-radius: var(--hse-project-radius-control);
}

.induction-hero__icon {
  width: 52px;
  height: 52px;
}

.induction-hero__icon svg {
  width: 26px;
  height: 26px;
}

.induction-hero__copy {
  min-width: 0;
}

.induction-hero__copy p,
.induction-hero__copy h1,
.metric-card p,
.detail-card p,
.panel-header h2,
.panel-header p {
  margin: 0;
}

.induction-hero__copy p {
  color: var(--hse-project-blue);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.induction-show .induction-hero__copy h1 {
  margin-block-start: 8px;
  color: var(--hse-project-ink);
  font-size: clamp(22px, 2.2vw, 30px);
  font-weight: 700;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.induction-hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-block-start: var(--hse-project-space-md);
}

.induction-hero__chips span {
  max-width: 100%;
  padding: 5px 9px;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-small);
  background: var(--hse-project-surface-soft);
  color: var(--hse-project-muted);
  font-size: 11px;
  font-weight: 500;
  overflow-wrap: anywhere;
}

.induction-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--hse-project-space-sm);
}

.metric-card {
  display: grid;
  align-content: start;
  gap: 10px;
  min-width: 0;
  padding: var(--hse-project-space-lg);
  border: 1px solid var(--hse-project-line-soft);
  border-radius: var(--hse-project-radius-control);
  background: var(--hse-project-surface-soft);
}

.metric-card__icon {
  width: 32px;
  height: 32px;
}

[data-tone='green'] {
  --induction-accent: var(--hse-project-green);
}

[data-tone='amber'] {
  --induction-accent: var(--hse-project-amber);
}

[data-tone='slate'] {
  --induction-accent: var(--hse-project-muted);
}

.metric-card strong {
  color: var(--hse-project-ink);
  font-size: 26px;
  font-weight: 700;
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
}

.metric-card p,
.detail-card p {
  color: var(--hse-project-muted);
  font-size: 11px;
  line-height: 1.5;
}

.induction-details {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--hse-project-space-md);
}

.detail-card {
  display: flex;
  align-items: center;
  gap: var(--hse-project-space-md);
  min-width: 0;
  padding: var(--hse-project-space-lg);
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-control);
  background: var(--hse-project-surface);
}

.detail-card__icon,
.panel-header__icon {
  width: 38px;
  height: 38px;
}

.detail-card div {
  min-width: 0;
}

.detail-card strong {
  display: block;
  margin-block-start: 4px;
  color: var(--hse-project-ink);
  font-size: 13px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.induction-sections {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: var(--hse-project-space-xl);
  align-items: start;
}

.show-panel {
  overflow: hidden;
}

.evidence-panel {
  grid-column: 1 / -1;
}

.induction-show .panel-header {
  display: flex;
  align-items: center;
  gap: var(--hse-project-space-md);
  width: 100%;
  margin: 0;
  padding: var(--hse-project-space-lg) var(--hse-project-space-xl);
  border-block-end: 1px solid var(--hse-project-line-soft);
}

.metric-card__icon svg,
.detail-card__icon svg,
.panel-header__icon svg {
  width: 19px;
  height: 19px;
}

.panel-header div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  gap: 10px;
  min-width: 0;
}

.induction-show .panel-header h2 {
  color: var(--hse-project-ink);
  font-size: 15px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.panel-header p {
  display: grid;
  place-items: center;
  min-width: 28px;
  height: 28px;
  padding-inline: 7px;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-small);
  color: var(--hse-project-muted);
  background: var(--hse-project-surface-soft);
  font-size: 11px;
  font-weight: 600;
}

.topic-list,
.attendee-list {
  display: grid;
  gap: var(--hse-project-space-sm);
  padding: var(--hse-project-space-lg);
}

.topic-item,
.attendee-item {
  display: flex;
  align-items: center;
  gap: var(--hse-project-space-md);
  min-width: 0;
  padding: var(--hse-project-space-md);
  border: 1px solid var(--hse-project-line-soft);
  border-radius: var(--hse-project-radius-control);
  background: var(--hse-project-surface-soft);
}

.topic-item span,
.attendee-avatar {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: var(--hse-project-radius-small);
  color: var(--hse-project-blue);
  background: var(--hse-project-ice);
  font-size: 11px;
  font-weight: 700;
}

.topic-item strong,
.attendee-copy strong {
  color: var(--hse-project-ink);
  font-size: 13px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.attendee-copy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.attendee-copy small {
  color: var(--hse-project-muted);
  font-size: 11px;
  overflow-wrap: anywhere;
}

.induction-attachments {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(180px, 100%), 1fr));
  gap: var(--hse-project-space-md);
  padding: var(--hse-project-space-lg);
}

.attachment-item {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-control);
  background: var(--hse-project-surface-soft);
}

.attachment-item :deep(.p-image),
.attachment-item :deep(.attachment-image) {
  display: block;
  width: 100%;
  height: 100%;
}

.attachment-item :deep(.attachment-image) {
  object-fit: cover;
}

.attachment-index {
  position: absolute;
  inset-block-start: 8px;
  inset-inline-start: 8px;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-small);
  background: var(--hse-project-surface);
  color: var(--hse-project-ink);
  font-size: 11px;
  font-weight: 600;
  pointer-events: none;
}

.empty-text {
  margin: var(--hse-project-space-lg);
  padding: var(--hse-project-space-xl);
  border: 1px dashed var(--hse-project-line);
  border-radius: var(--hse-project-radius-control);
  background: var(--hse-project-surface-soft);
  color: var(--hse-project-muted);
  font-size: 12px;
  line-height: 1.6;
  text-align: center;
}

@media (max-width: 1120px) {
  .induction-show .induction-hero {
    grid-template-columns: 1fr;
    gap: var(--hse-project-space-xl);
  }
}

@media (max-width: 860px) {
  .induction-details {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .induction-sections {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 540px) {
  .induction-show .induction-hero {
    padding: var(--hse-project-space-lg);
  }

  .induction-hero__main {
    gap: var(--hse-project-space-md);
  }

  .induction-hero__icon {
    width: 40px;
    height: 40px;
  }

  .induction-hero__icon svg {
    width: 22px;
    height: 22px;
  }

  .induction-details {
    grid-template-columns: 1fr;
  }

  .metric-card {
    padding: 10px;
  }

  .metric-card strong {
    font-size: 22px;
  }
}
</style>
