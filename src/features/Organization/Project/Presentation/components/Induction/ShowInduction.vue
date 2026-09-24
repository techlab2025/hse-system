<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import ShowInductionController from '../../controllers/Induction/showInductionController'
import ShowInductionParams from '../../../Core/params/induction/showInductionParams'

const route = useRoute()
const id = computed(() => Number(route.params.id))
const controller = ShowInductionController.getInstance()
const state = ref(controller.state.value)

const projectQuery = computed(() => {
  const routeValue = route.query.project_id
  const rawValue = Array.isArray(routeValue) ? routeValue[0] : routeValue
  const parsedValue = Number(rawValue)

  return Number.isFinite(parsedValue) && parsedValue > 0 ? `?project_id=${parsedValue}` : ''
})

const editLink = computed(() => `/organization/induction/${id.value}${projectQuery.value}`)
const induction = computed(() => state.value.data)

const fetchInductionDetails = async () => {
  await controller.showInduction(new ShowInductionParams(id.value))
}

const personName = (item: { id?: number | null; title?: string; name?: string } | null | undefined) => {
  if (!item) return '-'
  return item.title || item.name || (item.id ? `#${item.id}` : '-')
}

const topicName = (item: { id?: number | null; title?: string } | null | undefined) => {
  if (!item) return '-'
  return item.title || (item.id ? `#${item.id}` : '-')
}

const attachments = computed(() => induction.value?.image ?? [])

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
        <header class="induction-show__header">
          <div class="induction-show__title">
            <span class="induction-show__icon" aria-hidden="true">
              <Icon icon="uil:book-open" />
            </span>
            <div>
              <p>{{ $t('Induction') }}</p>
              <h1>{{ induction.title }}</h1>
            </div>
          </div>

          <router-link :to="editLink" class="btn btn-primary induction-show__edit">
            <Icon icon="uil:edit" />
            {{ $t('edit') }}
          </router-link>
        </header>

        <div class="induction-show__summary">
          <div class="summary-item">
            <span>{{ $t('Instructor ID') }}</span>
            <strong>#{{ induction.instractor_id || '-' }}</strong>
          </div>
          <div class="summary-item">
            <span>{{ $t('date') }}</span>
            <strong>{{ induction.date || '-' }}</strong>
          </div>
          <div class="summary-item">
            <span>{{ $t('Location ID') }}</span>
            <strong>{{ induction.projectLocationId ? `#${induction.projectLocationId}` : '-' }}</strong>
          </div>
          <div class="summary-item">
            <span>{{ $t('Zone ID') }}</span>
            <strong>{{ induction.projectZoonId ? `#${induction.projectZoonId}` : '-' }}</strong>
          </div>
        </div>

        <div class="induction-show__grid">
          <section class="induction-show-card">
            <h2>{{ $t('trainingTopic') }}</h2>
            <div v-if="induction.trainingTopic.length" class="chip-list">
              <span v-for="topic in induction.trainingTopic" :key="topic.id || topic.title" class="show-chip">
                {{ topicName(topic) }}
              </span>
            </div>
            <p v-else class="empty-text">{{ $t('No training topics selected') }}</p>
          </section>

          <section class="induction-show-card">
            <h2>{{ $t('organisationEmployee') }}</h2>
            <div v-if="induction.organisationEmployee.length" class="people-list">
              <div
                v-for="employee in induction.organisationEmployee"
                :key="employee.id || employee.name"
                class="person-row"
              >
                <span>{{ personName(employee) }}</span>
                <small v-if="employee.id">#{{ employee.id }}</small>
              </div>
            </div>
            <p v-else class="empty-text">{{ $t('No attendees selected') }}</p>
          </section>

          <section class="induction-show-card induction-show-card--full">
            <h2>{{ $t('Evidence') }}</h2>
            <div v-if="attachments.length" class="attachment-grid">
              <a
                v-for="(file, index) in attachments"
                :key="`${file}-${index}`"
                :href="file"
                target="_blank"
                rel="noopener noreferrer"
                class="attachment-item"
              >
                <img :src="file" :alt="`${$t('Evidence')} ${index + 1}`" />
              </a>
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
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, var(--main-border));
  border-radius: 18px;
  background: var(--surface-1);
}

.induction-show__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.induction-show__title {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.induction-show__icon {
  display: grid;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 14px;
  background: color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
  color: var(--PrimaryColor);
}

.induction-show__icon svg {
  width: 24px;
  height: 24px;
}

.induction-show__title p,
.induction-show__title h1 {
  margin: 0;
}

.induction-show__title p {
  color: var(--text-soft);
  font-size: 0.78rem;
  font-weight: 700;
}

.induction-show__title h1 {
  color: var(--text-strong);
  font-size: 1.25rem;
  font-weight: 800;
}

.induction-show__edit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.induction-show__summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.summary-item,
.induction-show-card {
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, var(--main-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-1) 94%, var(--PrimaryColor));
}

.summary-item {
  display: grid;
  gap: 5px;
  padding: 12px;
}

.summary-item span {
  color: var(--text-soft);
  font-size: 0.76rem;
  font-weight: 700;
}

.summary-item strong {
  color: var(--PrimaryColor);
  font-size: 0.95rem;
  font-weight: 800;
}

.induction-show__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.induction-show-card {
  display: grid;
  gap: 12px;
  align-content: start;
  padding: 14px;
}

.induction-show-card--full {
  grid-column: 1 / -1;
}

.induction-show-card h2 {
  margin: 0;
  color: var(--text-strong);
  font-size: 1rem;
  font-weight: 800;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.show-chip {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 6px 10px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 24%, var(--main-border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--PrimaryColor) 8%, transparent);
  color: var(--PrimaryColor);
  font-size: 0.82rem;
  font-weight: 800;
}

.people-list {
  display: grid;
  gap: 8px;
}

.person-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 40px;
  padding: 9px 10px;
  border: 1px solid color-mix(in srgb, var(--main-border) 84%, transparent);
  border-radius: 10px;
  background: var(--surface-1);
}

.person-row span {
  overflow: hidden;
  color: var(--text-strong);
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.person-row small {
  color: var(--text-soft);
  font-weight: 700;
}

.attachment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.attachment-item {
  display: block;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  border: 1px solid color-mix(in srgb, var(--main-border) 84%, transparent);
  border-radius: 12px;
  background: var(--surface-2);
}

.attachment-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-text {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.86rem;
  font-weight: 700;
}

@media (max-width: 900px) {
  .induction-show__summary,
  .induction-show__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .induction-show__header {
    align-items: stretch;
    flex-direction: column;
  }

  .induction-show__edit {
    justify-content: center;
  }
}
</style>
