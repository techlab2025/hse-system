<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { useRoute, useRouter } from 'vue-router'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import CardSkelaton from '@/features/Organization/Inspection/Presentation/components/SubComponent/CardSkelaton.vue'
import IndexCapaParams from '../../Core/params/indexCapaParams'
import IndexCapaController from '../controllers/indexCapaController'
import FetchMyProjectsParams from '@/features/Organization/ObservationFactory/Core/params/fetchMyProjectsParams'
import FetchMyProjectsController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyProjectsController'
import type MyZonesModel from '@/features/Organization/ObservationFactory/Data/models/MyZonesModel'
import FetchMyZonesController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyZonesController'
import FetchMyZonesParams from '@/features/Organization/ObservationFactory/Core/params/FetchMyZonesParams'
import { Observation } from '@/features/Organization/ObservationFactory/Core/Enums/ObservationTypeEnum'
import IndexHazardHeader from '@/features/Organization/ObservationFactory/Presentation/components/Hazard/HazardUtils/IndexHazardHeader.vue'
import IndexFilter from '@/features/Organization/ObservationFactory/Presentation/components/Hazard/HazardUtils/IndexFilter.vue'
import Observdetails from '@/shared/icons/observdetails.vue'
import type CapaModel from '@/features/Organization/ObservationFactory/Data/models/CapaModel'
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel.ts'

const currentPage = ref(1)
const countPerPage = ref(10)
const indexCapaController = IndexCapaController.getInstance()
const state = ref(indexCapaController.state.value)
const route = useRoute()
const router = useRouter()
const Projects = ref<ProjectModel[]>([])
const selectedProjctesFilters = ref<number>()
const Filters = ref<MyZonesModel[]>()
const SelectedZonesFilter = ref<number[]>([])
const fetchMyZonesController = FetchMyZonesController.getInstance()

const fetchCapa = async (
  query = '',
  pageNumber = 1,
  perPage = 10,
  withPage = 1,
  projectZoneLozationId?: number[],
  projectLocationIds?: number[],
  zoonIds?: number[],
  projectIds?: number,
) => {
  const params = new IndexCapaParams({
    word: query,
    pageNumber: pageNumber,
    perPage: perPage,
    withPage: withPage,
    type: [Observation.ObservationType, Observation.HazardType],
    projectId:
      route.query.hazard || route.query.risk_level
        ? undefined
        : projectIds !== undefined
          ? [projectIds!]
          : [],
    zoonIds: zoonIds,
    projectLocationIds: projectLocationIds?.length ? projectLocationIds : undefined,
    projectZoonIds: projectZoneLozationId,
    rootCauseId: undefined,
    hazardTypeId: route.query.hazard ? Number(route.query.hazard) : undefined,
    riskLevel: route.query.risk_level ? [Number(route.query.risk_level)] : undefined,
    capaStatus: 2,
  })
  await indexCapaController.getData(params)
}

onMounted(() => {
  fetchCapa()
  FetchMyProjects()
})

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchCapa('', currentPage.value, countPerPage.value)
}

const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchCapa('', currentPage.value, countPerPage.value)
}

const FetchMyProjects = async () => {
  const fetchMyProjectsParams = new FetchMyProjectsParams(true)
  const fetchMyProjectsController = FetchMyProjectsController.getInstance()
  const res = await fetchMyProjectsController.getData(fetchMyProjectsParams)
  if (res.value.data) {
    Projects.value = res.value.data
  }
}

const FetchMyZones = async () => {
  const fetchMyZonesParams = new FetchMyZonesParams(selectedProjctesFilters.value)
  const response = await fetchMyZonesController.FetchMyZones(fetchMyZonesParams, router)
  if (response.value.data) {
    Filters.value = response.value.data
  }
}

const ApplayFilter = (data: number[]) => {
  SelectedZonesFilter.value = data
  fetchCapa('', 1, 10, 1, [], [], SelectedZonesFilter.value, selectedProjctesFilters.value)
}

const setSelectedProjectFilter = (data: any) => {
  selectedProjctesFilters.value = data
  if (data) {
    fetchCapa('', 1, 10, 1, [], [], [], data)
    FetchMyZones()
  }
}

const GetObservationType = (type: number) => {
  switch (type) {
    case Observation.ObservationType:
      return 'Observation'
      case Observation.AccidentsType:
        return 'incident'
    case Observation.HazardType:
      return 'Observation'
  }
}

const GetCapaStataus = (capa: CapaModel) => {
  if (String(capa?.corrective)?.length > 0 && String(capa?.preventive)?.length > 0) {
    return 'Preventive And Corrective'
  }
  if (String(capa?.corrective)?.length > 0 && String(capa?.preventive)?.length == 0) {
    return 'Corrective'
  }
  if (String(capa?.corrective)?.length == 0 && String(capa?.preventive)?.length > 0) {
    return 'Preventive'
  }
}

const getPlainText = (value?: string) => {
  if (!value) return 'Not added yet'

  return (
    value
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() || 'Not added yet'
  )
}
watch(
  () => indexCapaController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState)
      state.value = newState
    }
  },
  {
    deep: true,
  },
)
</script>

<template>
  <div class="capa-index-page grid grid-cols-12 gap-4">
    <div :class="route?.query?.isAll ? 'col-span-12' : 'col-span-12'">
      <PermissionBuilder
        :code="[
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.ORG_OBSERVATION_ALL,
          PermissionsEnum.ORG_OBSERVATION_DELETE,
          PermissionsEnum.ORG_OBSERVATION_FETCH,
          PermissionsEnum.ORG_OBSERVATION_UPDATE,
          PermissionsEnum.ORG_OBSERVATION_CREATE,
        ]"
      >
        <div>
          <!-- <IndexHazardHeader
            :title="`CAPA`"
            :length="state?.data?.length || 0"
            :projects="Projects"
            @update:data="setSelectedProjectFilter"
          /> -->
          <IndexHazardHeader
            :title="`CAPA`"
            :length="state?.pagination?.total || 0"
            @update:data="setSelectedProjectFilter"
          />

          <div class="flex items-center justify-between" v-if="Filters && Filters?.length > 0">
            <PermissionBuilder
              :code="[
                PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                PermissionsEnum?.ORG_OBSERVATION_CREATE,
              ]"
            >
              <!-- <IndexFilter :filters="Filters!" @update:data="ApplayFilter" /> -->
            </PermissionBuilder>
          </div>
        </div>
        <DataStatus :controller="state">
          <template #success>
            <div class="table-responsive">
              <div class="index-table-card-container capa-card-list">
                <article
                  class="index-table-card capa-card"
                  v-for="(item, index) in state.data"
                  :key="item?.capa?.capaId || index"
                >
                  <header class="capa-card-header">
                    <div class="capa-title-group">
                      <span class="capa-mark" aria-hidden="true">C</span>
                      <div>
                        <span class="capa-eyebrow">{{ $t('Action plan') }}</span>
                        <h3>{{ item.title || $t('Corrective and preventive action') }}</h3>
                      </div>
                    </div>

                    <div class="capa-header-badges">
                      <!-- <span class="capa-type-badge">{{
                        GetObservationType(item.type) || 'CAPA'
                      }}</span> -->
                      <!-- <span class="capa-status-badge">
                        <i aria-hidden="true"></i>
                        {{ GetCapaStataus(item.capa) || $t('Action required') }}
                      </span> -->
                    </div>
                  </header>

                  <div class="capa-card-body">
                    <div class="capa-meta-grid">
                      <div class="capa-meta-item">
                        <span class="capa-meta-icon" aria-hidden="true">#</span>
                        <div>
                          <span>{{ $t('CAPA Serial') }}</span>
                          <strong>{{ item?.capa?.serial_name || '—' }}</strong>
                        </div>
                      </div>

                      <div class="capa-meta-item">
                        <span class="capa-meta-icon date-symbol" aria-hidden="true"></span>
                        <div>
                          <span>{{ $t('CAPA Date & Time') }}</span>
                          <strong
                            >{{ item.capa?.date || '—' }} · {{ item.capa?.time || '—' }}</strong
                          >
                        </div>
                      </div>

                      <div class="capa-meta-item">
                        <span class="capa-meta-icon" aria-hidden="true">S</span>
                        <div>
                          <span>{{ $t(`${GetObservationType(item.type)} Serial`) }}</span>
                          <strong>{{ item?.serialName || '—' }}</strong>
                        </div>
                      </div>

                      <!-- <div class="capa-meta-item">
                        <span class="capa-meta-icon person-symbol" aria-hidden="true"></span>
                        <div>
                          <span>{{ $t('Observer') }}</span>
                          <strong>{{ item?.observer?.name || '—' }}</strong>
                        </div>
                      </div> -->
<!-- 
                      <div class="capa-meta-item">
                        <span class="capa-meta-icon zone-symbol" aria-hidden="true"></span>
                        <div>
                          <span>{{ $t('Zone') }}</span>
                          <strong>{{ item.zoon?.title || '—' }}</strong>
                        </div>
                      </div> -->

                      <!-- <div class="capa-meta-item">
                        <span class="capa-meta-icon" aria-hidden="true">M</span>
                        <div>
                          <span>{{ $t('Machine') }}</span>
                          <strong>{{ item.equipment?.title || '—' }}</strong>
                        </div>
                      </div> -->
                    </div>

                    <!-- <section class="capa-context">
                      <span>{{ $t('Source description') }}</span>
                      <p>{{ item.description || '—' }}</p>
                    </section> -->

                    <!-- <div class="capa-actions-preview">
                      <article class="action-preview corrective-preview">
                        <div class="preview-heading">
                          <span class="preview-symbol" aria-hidden="true">✓</span>
                          <div>
                            <small>{{ $t('Response') }}</small>
                            <strong>{{ $t('Corrective Action') }}</strong>
                          </div>
                        </div>
                        <p>{{ getPlainText(item.capa?.corrective) }}</p>
                      </article>

                      <article class="action-preview preventive-preview">
                        <div class="preview-heading">
                          <span class="preview-symbol" aria-hidden="true">◇</span>
                          <div>
                            <small>{{ $t('Prevention') }}</small>
                            <strong>{{ $t('Preventive Action') }}</strong>
                          </div>
                        </div>
                        <p>{{ getPlainText(item.capa?.preventive) }}</p>
                      </article>
                    </div> -->
                  </div>

                  <footer class="capa-card-footer">
                    <span class="capa-footer-note">
                      <!-- <i aria-hidden="true"></i>
                      {{ $t('CAPA record ready for review') }} -->
                    </span>

                    <div class="capa-card-actions">
                      <router-link
                        :to="`/organization/equipment-mangement/incedant/show/${item.capa?.observationId}`"
                        class="source-details-btn"
                      >
                      <!-- observation type -->
                        <span>{{ $t(`${GetObservationType(item.type)} Details`) }}</span>
                        <span class="button-arrow" aria-hidden="true">↗</span>
                      </router-link>

                      <router-link
                        :to="`/organization/capa/${item?.capa?.capaId}`"
                        class="capa-details-btn"
                      >
                        <!-- <Observdetails /> -->
                        <span>{{ $t('View CAPA Details') }}</span>
                        <span class="button-arrow" aria-hidden="true">→</span>
                      </router-link>
                    </div>
                  </footer>
                </article>
              </div>
            </div>
            <Pagination
              :pagination="state.pagination"
              @changePage="handleChangePage"
              @countPerPage="handleCountPerPage"
            />
          </template>
          <template #loader>
            <CardSkelaton />
          </template>
          <template #initial>
            <CardSkelaton />
          </template>
          <template #empty>
            <PermissionBuilder
              :code="[
                PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                PermissionsEnum?.ORG_OBSERVATION_CREATE,
              ]"
            >
              <DataEmpty
                description="Sorry .. You have no CAPA .. All your joined customers will appear here when you add your customer data"
                :link="`/organization`"
                title="..ops! You have No CAPA"
              />
            </PermissionBuilder>
          </template>
          <template #failed>
            <PermissionBuilder
              :code="[
                PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                PermissionsEnum?.ORG_OBSERVATION_CREATE,
              ]"
            >
              <DataFailed
                description="Sorry .. You have no CAPA .. All your joined customers will appear here when you add your customer data"
                :link="`/organization`"
                title="..ops! You have No CAPA"
              />
            </PermissionBuilder>
          </template>
        </DataStatus>
        <template #notPermitted>
          <DataFailed
            addText="Have not  Permission"
            description="Sorry .. You have no Observation .. All your joined customers will appear here when you add your customer data"
          />
        </template>
      </PermissionBuilder>
    </div>
  </div>
</template>

<style scoped lang="scss">
.btn-investegation-observation {
  width: 100%;
  display: flex;
  // align-items: left;
  justify-content: right;
  gap: 10px;
}

.card-content {
  &.new-btn {
    margin-left: auto !important;
    justify-content: start !important;
    align-items: end !important;
  }
  .sup-title {
    margin-bottom: 1rem;

    p {
      font-family: 'Regular';
      font-weight: 600;
      font-size: 15px;
      color: var(--text-soft);

      &.description {
        font-family: 'Light';
        font-weight: 400;
        font-size: 14px;
      }
    }
  }

  .card-details {
    background-color: color-mix(in srgb, var(--brand-primary-600) 3.92%, transparent);
    padding: 0.7rem;
    border-radius: 20px;
    width: 100%;

    .location-observation {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
    }

    .location {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      margin: 0.5rem 0;

      p {
        color: var(--text-soft);
        font-weight: 600;
        font-size: 14px;

        span {
          color: var(--text-soft);
        }
      }
    }
  }

  .observation-details {
    background-color: color-mix(in srgb, var(--brand-primary-400) 10%, transparent);
    padding: 0.6rem 0.8rem;
    border-radius: 20px;

    border-bottom: 2px solid var(--brand-primary-600);

    &:hover {
      cursor: pointer;
    }

    p {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
      font-family: 'bold';
      font-weight: 700;
      font-size: 16px;
      color: var(--brand-primary-600);
    }
  }

  // .observation-details {
  //   p {
  //     display: flex;
  //     flex-direction: row;
  //     align-items: center;
  //     gap: .5rem;
  //     font-family: 'bold';
  //     font-weight: 700;
  //     font-size: 16px;
  //     color: var(--brand-primary-600);

  //     span {
  //       display: flex;
  //       flex-direction: row;
  //       align-items: center;
  //       gap: .5rem;
  //     }
  //   }
  // }
}

.label-item-secondary {
  font-family: 'regular';
  &.incidant {
    span {
      font-size: 10px;
    }
  }

  span {
    font-family: 'bold';
  }
}

.label-item-primary {
  font-family: 'regular';

  span {
    font-family: 'bold';
  }
}

.export-fillter {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 15px;
  width: 100%;
  margin: 1rem 0;

  input[type='radio'] {
    display: none;
  }
}

.fillter-radio-btn {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: var(--surface-1);
  padding: 0.4rem 1rem;
  border-radius: 40px;

  .active {
    background-color: var(--brand-primary-50);
    border: 1px solid color-mix(in srgb, var(--brand-primary-600) 20%, transparent);
    padding: 0.5rem 1rem;
    color: var(--brand-primary-600);
    font-weight: 700;
    border-radius: 40px;
    font-family: 'bold';
    font-size: 15px;
  }

  .radio-btn {
    display: flex;
    align-items: center;
    gap: 5px;

    label {
      margin-bottom: 0;
      cursor: pointer;
    }

    input[type='radio'] {
      cursor: pointer;
      width: 16px;
      height: 16px;
    }
  }
}

.capa-card-list {
  gap: 20px;
  padding-block: 8px 16px;
}

.capa-card {
  --capa-accent: var(--PrimaryColor);
  --capa-accent-soft: color-mix(in srgb, var(--PrimaryColor) 8%, transparent);
  position: relative;
  isolation: isolate;
  display: block;
  overflow: hidden;
  width: 100%;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--capa-accent) 20%, var(--main-border));
  border-radius: 24px;
  background:
    radial-gradient(circle at 100% 0%, var(--capa-accent-soft), transparent 30%), var(--surface-1);
  box-shadow: 0 16px 42px color-mix(in srgb, var(--brand-primary-900) 9%, transparent);
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.capa-card::before {
  content: '';
  position: absolute;
  z-index: 3;
  inset-block: 0;
  inset-inline-start: 0;
  width: 5px;
  background: linear-gradient(180deg, var(--capa-accent), var(--status-success));
}

.capa-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--capa-accent) 38%, var(--main-border));
  box-shadow: 0 22px 50px color-mix(in srgb, var(--brand-primary-900) 13%, transparent);
}

.capa-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 22px 18px 26px;
  border-bottom: 1px solid var(--main-border);
  background: color-mix(in srgb, var(--surface-2) 70%, transparent);
}

.capa-title-group {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 14px;
}

.capa-title-group > div {
  min-width: 0;
}

.capa-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  flex: 0 0 50px;
  border-radius: 16px;
  background: linear-gradient(145deg, var(--capa-accent), var(--brand-primary-700));
  box-shadow: 0 10px 22px color-mix(in srgb, var(--capa-accent) 25%, transparent);
  color: white;
  font-family: 'Bold';
  font-size: 1.05rem;
  font-weight: 900;
}

.capa-eyebrow {
  display: block;
  margin-bottom: 4px;
  color: var(--capa-accent);
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.capa-title-group h3 {
  overflow: hidden;
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: clamp(1.08rem, 1.7vw, 1.32rem);
  font-weight: 900;
  line-height: 1.35;
  text-overflow: ellipsis;
}

.capa-header-badges {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.capa-type-badge,
.capa-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 32px;
  padding: 6px 11px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 900;
  white-space: nowrap;
}

.capa-type-badge {
  border: 1px solid var(--main-border);
  background: var(--surface-1);
  color: var(--text-soft);
}

.capa-status-badge {
  border: 1px solid color-mix(in srgb, var(--status-success) 25%, transparent);
  background: color-mix(in srgb, var(--status-success) 9%, transparent);
  color: var(--status-success);
}

.capa-status-badge i,
.capa-footer-note i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 4px color-mix(in srgb, currentColor 12%, transparent);
}

.capa-card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 22px 22px 26px;
}

.capa-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.capa-meta-item {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 70px;
  gap: 10px;
  padding: 11px 12px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-2) 74%, transparent);
  transition:
    border-color 0.18s ease,
    background 0.18s ease;
}

.capa-meta-item:hover {
  border-color: color-mix(in srgb, var(--capa-accent) 25%, var(--main-border));
  background: var(--capa-accent-soft);
}

.capa-meta-item > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}

.capa-meta-item div > span,
.capa-context > span {
  color: var(--text-soft);
  font-size: 0.64rem;
  font-weight: 850;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.capa-meta-item strong {
  overflow: hidden;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.8rem;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.capa-meta-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border: 1px solid color-mix(in srgb, var(--capa-accent) 18%, transparent);
  border-radius: 12px;
  background: var(--capa-accent-soft);
  color: var(--capa-accent);
  font-family: 'Bold';
  font-size: 0.72rem;
  font-weight: 900;
}

.date-symbol::before {
  content: '';
  width: 17px;
  height: 15px;
  border: 2px solid currentColor;
  border-radius: 4px;
}

.date-symbol::after {
  content: '';
  position: absolute;
  top: 12px;
  width: 11px;
  border-top: 2px solid currentColor;
}

.person-symbol::before {
  content: '';
  width: 9px;
  height: 9px;
  margin-bottom: 8px;
  border: 2px solid currentColor;
  border-radius: 50%;
}

.person-symbol::after {
  content: '';
  position: absolute;
  bottom: 7px;
  width: 17px;
  height: 8px;
  border: 2px solid currentColor;
  border-bottom: 0;
  border-radius: 10px 10px 0 0;
}

.zone-symbol::before {
  content: '';
  width: 13px;
  height: 13px;
  border: 2px solid currentColor;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
}

.zone-symbol::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

.capa-context {
  position: relative;
  padding: 14px 16px 14px 20px;
  border: 1px solid color-mix(in srgb, var(--capa-accent) 14%, var(--main-border));
  border-radius: 14px;
  background: var(--capa-accent-soft);
}

.capa-context::before {
  content: '';
  position: absolute;
  inset-block: 14px;
  inset-inline-start: 0;
  width: 3px;
  border-radius: 999px;
  background: var(--capa-accent);
}

.capa-context p {
  display: -webkit-box;
  overflow: hidden;
  margin: 6px 0 0;
  color: var(--text-strong);
  font-size: 0.82rem;
  font-weight: 650;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.capa-actions-preview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.action-preview {
  position: relative;
  overflow: hidden;
  min-height: 130px;
  padding: 14px;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--surface-1);
}

.action-preview::before {
  content: '';
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 3px;
}

.corrective-preview::before {
  background: linear-gradient(90deg, var(--brand-accent-500), var(--status-danger));
}

.preventive-preview::before {
  background: linear-gradient(90deg, var(--status-success), var(--PrimaryColor));
}

.preview-heading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-symbol {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  border-radius: 11px;
  font-family: 'Bold';
  font-size: 0.85rem;
}

.corrective-preview .preview-symbol {
  background: color-mix(in srgb, var(--brand-accent-500) 11%, transparent);
  color: var(--brand-accent-600);
}

.preventive-preview .preview-symbol {
  background: color-mix(in srgb, var(--status-success) 10%, transparent);
  color: var(--status-success);
}

.preview-heading > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.preview-heading small {
  color: var(--text-soft);
  font-size: 0.61rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.preview-heading strong {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.82rem;
}

.action-preview > p {
  display: -webkit-box;
  overflow: hidden;
  margin: 11px 0 0;
  color: var(--text-soft);
  font-size: 0.76rem;
  line-height: 1.6;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.capa-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-height: 68px;
  padding: 12px 22px 12px 26px;
  border-top: 1px solid var(--main-border);
  background: color-mix(in srgb, var(--surface-2) 72%, transparent);
}

.capa-footer-note {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--status-success);
  font-size: 0.7rem;
  font-weight: 800;
}

.capa-card-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 9px;
}

.source-details-btn,
.capa-details-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  gap: 8px;
  padding: 8px 10px 8px 14px;
  border-radius: 12px;
  font-size: 0.74rem;
  font-weight: 900;
  text-decoration: none;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.source-details-btn {
  border: 1px solid color-mix(in srgb, var(--capa-accent) 22%, var(--main-border));
  background: var(--surface-1);
  color: var(--capa-accent);
}

.capa-details-btn {
  border: 1px solid var(--capa-accent);
  background: var(--capa-accent);
  box-shadow: 0 9px 20px color-mix(in srgb, var(--capa-accent) 23%, transparent);
  color: white;
}

.capa-details-btn :deep(svg) {
  width: 17px;
  height: 17px;
}

.source-details-btn:hover,
.capa-details-btn:hover {
  transform: translateY(-2px);
}

.source-details-btn:hover {
  border-color: var(--capa-accent);
}

.capa-details-btn:hover {
  box-shadow: 0 12px 25px color-mix(in srgb, var(--capa-accent) 30%, transparent);
}

.button-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 10%, transparent);
  font-size: 0.9rem;
}

.capa-details-btn .button-arrow {
  background: color-mix(in srgb, white 18%, transparent);
}

[dir='rtl'] .capa-details-btn .button-arrow {
  transform: rotate(180deg);
}

@media (max-width: 900px) {
  .capa-meta-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .capa-card-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .capa-card-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 620px) {
  .capa-card {
    border-radius: 18px;
  }

  .capa-card-header,
  .capa-card-body,
  .capa-card-footer {
    padding-inline: 19px 15px;
  }

  .capa-card-header {
    flex-direction: column;
  }

  .capa-header-badges {
    justify-content: flex-start;
  }

  .capa-meta-grid,
  .capa-actions-preview {
    grid-template-columns: 1fr;
  }

  .capa-card-actions,
  .source-details-btn,
  .capa-details-btn {
    width: 100%;
  }
}
</style>
