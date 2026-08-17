<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { formatTime } from '@/base/Presentation/utils/time_format'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { InvestegationStatusEnum } from '@/features/Organization/Investigating/Core/Enums/InvestegationStatusEnum'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import ExportReportPdf from '@/features/Organization/TaskReports/Presentation/subComponents/ExportReportPdf.vue'
import Search from '@/shared/icons/Search.vue'
import IndexHazardController from '../../controllers/indexHazardController'
import IndexHazardParams from '../../../Core/params/indexHazardParams'
import { Observation } from '../../../Core/Enums/ObservationTypeEnum'

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexHazardController = IndexHazardController.getInstance()
const state = ref(indexHazardController.state.value)

const fetchIncidents = async (query = '', page = 1, limit = 10) => {
  await indexHazardController.getData(
    new IndexHazardParams(query, page, limit, 1, [Observation.AccidentsType], []),
  )
}

const searchIncidents = debounce(() => {
  currentPage.value = 1
  fetchIncidents(word.value, 1, countPerPage.value)
})

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchIncidents(word.value, page, countPerPage.value)
}

const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  currentPage.value = 1
  fetchIncidents(word.value, 1, count)
}

const getStatusTitle = (status?: number) => {
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

const getStatusClass = (status?: number) => getStatusTitle(status).toLowerCase().replace(/\s+/g, '-')

const getDateTime = (date?: string, time?: string) => {
  if (!date) return '--'
  return `${formatJoinDate(date)}${time || date.includes('T') ? ` · ${formatTime(time || date)}` : ''}`
}

const getEquipmentPlate = (equipment: unknown) => {
  const value = equipment as
    | {
        license_plate_number?: string
        licensePlateNumber?: string
        license_number?: string
        licenseNumber?: string
      }
    | undefined

  return (
    value?.license_plate_number ||
    value?.licensePlateNumber ||
    value?.license_number ||
    value?.licenseNumber ||
    ''
  )
}

watch(
  () => indexHazardController.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
  { deep: true },
)

onMounted(() => fetchIncidents('', 1, countPerPage.value))
</script>

<template>
  <PermissionBuilder
    :code="[
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_INCEDANT_ALL,
      PermissionsEnum.ORG_INCEDANT_FETCH,
    ]"
  >
    <section class="incident-report-page">
      <header class="report-page-header">
        <div>
          <p class="report-eyebrow">{{ $t('incident_report') }}</p>
          <h1>{{ $t('incident_report') }}</h1>
          <span>{{ state.pagination?.total || 0 }} {{ $t('incident_report') }}</span>
        </div>

        <ExportReportPdf
          v-if="state.data?.length"
          target-selector=".incident-report-board"
          file-name="incident-report"
          orientation="landscape"
        />
      </header>

      <div class="report-toolbar">
        <div class="input-search">
          <span class="icon-remove" @click="((word = ''), searchIncidents())">
            <Search />
          </span>
          <input
            v-model="word"
            class="input"
            type="text"
            :placeholder="$t('search')"
            @input="searchIncidents"
          />
        </div>
      </div>

      <DataStatus :controller="state">
        <template #success>
          <div class="table-responsive incident-report-board">
            <table class="main-table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{{ $t('Serial') }}</th>
                  <th scope="col">{{ $t('title') }}</th>
                  <th scope="col">{{ $t('observer') }}</th>
                  <th scope="col">{{ $t('project') }}</th>
                  <th scope="col">{{ $t('Date & Time') }}</th>
                  <th scope="col">{{ $t('Location') }} / {{ $t('Zone') }}</th>
                  <th scope="col">{{ $t('Machine') }}</th>
                  <th scope="col">{{ $t('description') }}</th>
                  <th scope="col">{{ $t('status') }}</th>
                  <th scope="col">{{ $t('Attachment') }}</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in state.data" :key="item.id">
                  <td>{{ (currentPage - 1) * countPerPage + index + 1 }}</td>
                  <td>{{ item.serialName || '--' }}</td>
                  <td>{{ item.title || '--' }}</td>
                  <td>{{ item.observer?.name || '--' }}</td>
                  <td>{{ item.project?.title || '--' }}</td>
                  <td>{{ getDateTime(item.updatedAt || item.date, item.time) }}</td>
                  <td>
                    <span class="location-zone">
                      <span>{{ item.location?.title || '--' }}</span>
                      <small>{{ item.zoon?.title || '--' }}</small>
                    </span>
                  </td>
                  <td>
                    <span class="machine-details">
                      <span>{{ item.equipment?.title || '--' }}</span>
                      <small v-if="getEquipmentPlate(item.equipment)">
                        {{ getEquipmentPlate(item.equipment) }}
                      </small>
                    </span>
                  </td>
                  <td class="description-cell">{{ item.description || '--' }}</td>
                  <td>
                    <span class="report-status" :class="getStatusClass(item.investigationStatus)">
                      {{ getStatusTitle(item.investigationStatus) }}
                    </span>
                  </td>
                  <td>{{ item.media?.[0]?.url ? $t('Available') : '--' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Pagination
            :pagination="state.pagination"
            @changePage="handleChangePage"
            @countPerPage="handleCountPerPage"
          />
        </template>

        <template #loader><TableLoader :cols="11" :rows="10" /></template>
        <template #initial><TableLoader :cols="11" :rows="10" /></template>
        <template #empty>
          <DataFailed :withbtn="false" title="No incident reports" />
        </template>
        <template #failed>
          <DataFailed :withbtn="false" title="Unable to load incident reports" />
        </template>
      </DataStatus>
    </section>
  </PermissionBuilder>
</template>

<style scoped lang="scss">
.incident-report-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.report-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--BgWhite);
}

.report-page-header h1 {
  margin: 2px 0;
  color: var(--text-strong);
  font-size: 1.5rem;
  font-weight: 800;
}

.report-page-header span,
.report-eyebrow {
  color: var(--text-soft);
}

.report-eyebrow {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.report-toolbar {
  display: flex;
  justify-content: flex-end;
}

.report-toolbar .input-search {
  width: min(100%, 420px);
}

.incident-report-board {
  overflow-x: auto;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--BgWhite);
}

.incident-report-board .main-table {
  min-width: 1500px;
}

.location-zone,
.machine-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.location-zone small,
.machine-details small {
  color: var(--text-soft);
}

.description-cell {
  min-width: 220px;
  white-space: normal;
}

.report-status {
  display: inline-flex;
  min-width: 90px;
  justify-content: center;
  padding: 6px 10px;
  border: 1px solid var(--main-border);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
}

.report-status.new,
.report-status.open {
  background: color-mix(in srgb, var(--PrimaryColor) 8%, transparent);
  color: var(--PrimaryColor);
}

.report-status.in-progress,
.report-status.hold {
  background: color-mix(in srgb, var(--status-warning) 10%, transparent);
  color: var(--status-warning);
}

.report-status.closed,
.report-status.completed {
  background: color-mix(in srgb, var(--status-success) 10%, transparent);
  color: var(--status-success);
}

@media (max-width: 640px) {
  .report-page-header {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
