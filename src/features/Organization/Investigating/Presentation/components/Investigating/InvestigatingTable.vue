<script setup lang="ts">
import { InvestegationStatusEnum } from '../../../Core/Enums/InvestegationStatusEnum'
import { Observation } from '../../../Core/Enums/ObservationTypeEnum'

interface InvestigatingTableItem {
  Investegationid: number
  title?: string
  date?: string
  status: number
  LatestInvestigatingMeetingId: number
  hasResults: boolean
  SerialName?: string
  project?: { title?: string } | null
  location?: { title?: string }
  zoon?: { title?: string }
  observation?: {
    id: number
    type: number
    title?: string
    time?: string
    serialName?: string
    project?: { title?: string }
    location?: { title?: string }
    zoon?: { title?: string }
  }
}

const props = withDefaults(
  defineProps<{
    items?: InvestigatingTableItem[] | null
    startIndex?: number
  }>(),
  {
    items: () => [],
    startIndex: 0,
  },
)

const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim().length > 0

const getObservationType = (type?: number) => {
  switch (type) {
    case Observation.AccidentsType:
      return 'Incident'
    case Observation.ObservationType:
      return 'Observation'
    case Observation.HazardType:
      return 'Hazard'
    default:
      return 'Investigation'
  }
}

const getStatusTitle = (status: number) => {
  switch (status) {
    case InvestegationStatusEnum.NEW:
      return 'New'
    case InvestegationStatusEnum.IN_PROGRESS:
      return 'In Progress'
    case InvestegationStatusEnum.CLOSED:
      return 'Closed'
    case InvestegationStatusEnum.COMPLETED:
      return 'Completed'
    case InvestegationStatusEnum.HOLD:
      return 'Hold'
    case InvestegationStatusEnum.OPEN:
      return 'Open'
    default:
      return 'Unknown'
  }
}

const getStatusClass = (status: number) => getStatusTitle(status).toLowerCase().replace(/\s+/g, '-')

const getObservationLink = (item: InvestigatingTableItem) =>
  item.observation?.type === Observation.AccidentsType
    ? `/organization/equipment-mangement/incedant/show/${item.observation?.id}`
    : `/organization/equipment-mangement/observation/show/${item.observation?.id}`

const getReportReference = (item: InvestigatingTableItem) => {
  const reference = item.observation?.serialName || item.SerialName
  return reference
    ? `${getObservationType(item.observation?.type)} Report - ${reference}`
    : `${getObservationType(item.observation?.type)} Report`
}

const getDateTime = (item: InvestigatingTableItem) =>
  [item.date, item.observation?.time].filter(hasValue).join(' , ') || '--'

const getProjectTitle = (item: InvestigatingTableItem) =>
  item.project?.title || item.observation?.project?.title || '--'

const getLocationTitle = (item: InvestigatingTableItem) =>
  item.location?.title || item.observation?.location?.title || '--'

const getZoneTitle = (item: InvestigatingTableItem) =>
  item.observation?.zoon?.title || item.zoon?.title || '--'
</script>

<template>
  <div class="table-responsive report-board investigating-report-table">
    <table class="main-table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">{{ $t('report') }}</th>
          <th scope="col">{{ $t('title') }}</th>
          <th scope="col">{{ $t('project') }}</th>
          <th scope="col">{{ $t('Date & Time') }}</th>
          <th scope="col">{{ $t('Location') }} / {{ $t('Zone') }}</th>
          <th scope="col">{{ $t('status') }}</th>
          <th scope="col" data-pdf-exclude>{{ $t('actions') }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in props.items || []" :key="item.Investegationid">
          <td data-label="#">{{ startIndex + index + 1 }}</td>
          <td data-label="Report">
            <router-link :to="getObservationLink(item)" class="report-reference">
              {{ getReportReference(item) }}
            </router-link>
          </td>
          <td data-label="Title">
            {{ item.observation?.title || item.title || '--' }}
          </td>
          <td data-label="Project">{{ getProjectTitle(item) }}</td>
          <td data-label="Date & Time">{{ getDateTime(item) }}</td>
          <td data-label="Location / Zone">
            <span class="location-zone">
              <span>{{ getLocationTitle(item) }}</span>
              <small>{{ getZoneTitle(item) }}</small>
            </span>
          </td>
          <td data-label="Status">
            <span class="investigation-status" :class="getStatusClass(item.status)">
              {{ getStatusTitle(item.status) }}
            </span>
          </td>
          <td data-label="Actions" data-pdf-exclude>
            <div class="table-actions">
              <router-link
                v-if="item.status === InvestegationStatusEnum.NEW"
                :to="`/organization/investigating/add?id=${item.Investegationid}`"
                class="table-action-link"
              >
                {{ $t('assign_investigation_team') }}
              </router-link>

              <router-link
                v-if="item.status === InvestegationStatusEnum.IN_PROGRESS"
                :to="`/organization/Investigating-result/${item.LatestInvestigatingMeetingId}?investigating_id=${item.Investegationid}`"
                class="table-action-link"
              >
                {{ $t('add_investigation_result') }}
              </router-link>

              <router-link
                v-if="
                  item.hasResults ||
                  item.status === InvestegationStatusEnum.CLOSED ||
                  item.status === InvestegationStatusEnum.COMPLETED
                "
                :to="`/organization/Investigating-result-answer/${item.Investegationid}`"
                class="table-action-link secondary"
              >
                {{ $t('view_results') }}
              </router-link>

              <span
                v-if="
                  item.status !== InvestegationStatusEnum.NEW &&
                  item.status !== InvestegationStatusEnum.IN_PROGRESS &&
                  !item.hasResults &&
                  item.status !== InvestegationStatusEnum.CLOSED &&
                  item.status !== InvestegationStatusEnum.COMPLETED
                "
              >
                --
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.investigating-report-table {
  overflow-x: auto;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--BgWhite);
}

.investigating-report-table .main-table {
  min-width: 1080px;
}

.report-reference {
  color: var(--PrimaryColor);
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.location-zone {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.location-zone small {
  color: var(--text-soft);
}

.investigation-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 92px;
  padding: 6px 10px;
  border: 1px solid var(--main-border);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
}

.investigation-status.new,
.investigation-status.open {
  border-color: color-mix(in srgb, var(--PrimaryColor) 35%, transparent);
  background: color-mix(in srgb, var(--PrimaryColor) 8%, transparent);
  color: var(--PrimaryColor);
}

.investigation-status.in-progress,
.investigation-status.hold {
  border-color: color-mix(in srgb, var(--status-warning) 35%, transparent);
  background: color-mix(in srgb, var(--status-warning) 10%, transparent);
  color: var(--status-warning);
}

.investigation-status.closed,
.investigation-status.completed {
  border-color: color-mix(in srgb, var(--status-success) 35%, transparent);
  background: color-mix(in srgb, var(--status-success) 10%, transparent);
  color: var(--status-success);
}

.table-actions {
  display: flex;
  min-width: 180px;
  flex-wrap: wrap;
  gap: 6px;
}

.table-action-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 9px;
  border-radius: 8px;
  background: var(--PrimaryColor);
  color: var(--text-on-brand) !important;
  font-size: 0.72rem;
  font-weight: 800;
}

.table-action-link.secondary {
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 28%, var(--main-border));
  background: color-mix(in srgb, var(--PrimaryColor) 8%, var(--BgWhite));
  color: var(--PrimaryColor) !important;
}
</style>
