<script lang="ts" setup>
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import IndexFilterDialog from '@/shared/HelpersComponents/IndexFilterDialog.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { InspectionPageType } from '@/features/Organization/ObservationFactory/Core/Enums/InspectionTypeEnum'
import IndexEquipmentMangement from '@/features/Organization/ObservationFactory/Presentation/components/indexEquipmentMangement.vue'
import { useThemeMode } from '@/composables/useThemeMode'
import { useInspectionIndex } from '../composables/useInspectionIndex'
import IndexFilter from './InspectionUtils/IndexFilter.vue'
import IndexInspectionHeader from './InspectionUtils/IndexInspectionHeader.vue'
import InspectionFormPage from './InspectionPages/InspectionFormPage.vue'
import InspectionDragPage from './InspectionPages/InspectionDragPage.vue'
import InspectionsResultsPage from './InspectionPages/InspectionsResultsPage.vue'
import CardSkelaton from './SubComponent/CardSkelaton.vue'
import InspectionEmptyState from './SubComponent/InspectionEmptyState.vue'

const { isDarkMode } = useThemeMode()
const {
  route,
  selectedProject,
  activeAuditTab,
  selectedProjectId,
  selectedZoneIds,
  projects,
  zones,
  filterDate,
  filterInspectionType,
  isAuditPage,
  inspectionType,
  auditProjectId,
  auditCreateRoute,
  inspectionCreateRoute,
  canCreateRecord,
  canViewRecords,
  taskTabs,
  filterFields,
  state,
  allTasksState,
  resultsState,
  selectProject,
  changeTaskTab,
  changeAuditTab,
  applyZones,
  applyFilters,
  resetFilters,
  changePage,
  changePageSize,
} = useInspectionIndex()
</script>
<template>
  <div
    :class="[
      'inspection-index-page hse-operations-page grid grid-cols-12 gap-4',
      {
        'is-dark': isDarkMode,
        'is-audit-page': isAuditPage,
      },
    ]"
  >
    <!-- Equipment sidebar -->
    <IndexEquipmentMangement v-if="!isAuditPage" class="col-span-2" />

    <div class="col-span-12">
      <template v-if="canViewRecords">
        <nav v-if="!isAuditPage" class="task-tabs" :aria-label="$t('Inspection tasks')">
          <button
            v-for="tab in taskTabs"
            :key="tab.type"
            type="button"
            :class="{ active: inspectionType === tab.type }"
            :aria-pressed="inspectionType === tab.type"
            @click="changeTaskTab(tab.type)"
          >
            {{ $t(tab.label) }}
          </button>
        </nav>

        <!-- ========================= -->
        <!-- NORMAL INSPECTION HEADER -->
        <!-- ========================= -->

        <div v-if="!isAuditPage" class="inspection-controls-panel hse-operations-command">
          <IndexInspectionHeader
            :title="`Inspection`"
            :length="
              (inspectionType === InspectionPageType.InspectionForm
                ? allTasksState?.pagination?.total
                : inspectionType === InspectionPageType.DragInspection
                  ? state?.pagination?.total
                  : resultsState?.pagination?.total) || 0
            "
            :projects="projects"
            :selected-project-id="selectedProjectId"
            :isProject="auditProjectId ?? selectedProject.project?.id"
            @update:data="selectProject"
          >
            <template #actions>
              <IndexFilterDialog
                show-date
                :fields="filterFields"
                :initial-date="filterDate"
                :initial-values="{
                  inspectionType: filterInspectionType,
                }"
                @apply="applyFilters"
                @reset="resetFilters"
              />

              <PermissionBuilder
                :code="[
                  PermissionsEnum.ADMIN,
                  PermissionsEnum.ORG_INSPECTION_ALL,
                  PermissionsEnum.ORG_INSPECTION_CREATE,
                ]"
              >
                <router-link :to="inspectionCreateRoute">
                  <button class="btn btn-primary create-inspection-btn">
                    <span class="create-icon">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                      </svg>
                    </span>

                    <span class="create-copy">
                      <small>
                        {{ $t('New inspection') }}
                      </small>

                      <strong>
                        {{ $t('Create Inspection') }}
                      </strong>
                    </span>

                    <span class="create-arrow">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="m9 18 6-6-6-6"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </router-link>
              </PermissionBuilder>
            </template>
          </IndexInspectionHeader>

          <!-- Zones -->

          <div v-if="zones.length" class="inspection-zone-section">
            <div class="inspection-filter-heading">
              <span class="filter-symbol">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 6h16M7 12h10M10 18h4"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </span>

              <div>
                <p>
                  {{ $t('Zone') }}
                </p>

                <span>
                  {{ $t('Select zones to refine the inspection list') }}
                </span>
              </div>
            </div>

            <PermissionBuilder
              :code="[
                PermissionsEnum.ADMIN,
                PermissionsEnum.ORG_INSPECTION_ALL,
                PermissionsEnum.ORG_INSPECTION_CREATE,
              ]"
            >
              <IndexFilter
                class="inspection-zone-filter"
                :SelectdProject="selectedProjectId"
                :filters="zones"
                :selected-zone-ids="selectedZoneIds"
                @update:data="applyZones"
                link=""
                :linkTitle="'Create Inspection'"
              />
            </PermissionBuilder>
          </div>
        </div>

        <!-- ========================= -->
        <!-- AUDIT HEADER -->
        <!-- ========================= -->

        <div v-else class="audit-wrapper">
          <div class="audit-tabs">
            <button
              :class="{
                active: activeAuditTab === 'all',
              }"
              @click="changeAuditTab('all')"
            >
              {{ $t('All Audits') }}
            </button>

            <button
              :class="{
                active: activeAuditTab === 'mine',
              }"
              @click="changeAuditTab('mine')"
            >
              {{ $t('My Audits') }}
            </button>
          </div>

          <div class="audit-create-action">
            <PermissionBuilder
              :code="[
                PermissionsEnum.ADMIN,
                PermissionsEnum.ORG_INSPECTION_ALL,
                PermissionsEnum.ORG_INSPECTION_CREATE,
              ]"
            >
              <router-link :to="auditCreateRoute">
                <button class="btn btn-primary create-inspection-btn">
                  {{ $t('Create Audit') }}
                </button>
              </router-link>
            </PermissionBuilder>
          </div>
        </div>
        <!-- ========================= -->
        <!-- AUDIT: ALL AUDITS -->
        <!-- ========================= -->

        <DataStatus v-if="isAuditPage && activeAuditTab === 'all'" :controller="allTasksState">
          <template #success>
            <div class="table-responsive inspection-table-responsive">
              <div class="index-table-card-container-inspection inspection-list-panel">
                <div class="header-container w-full">
                  <InspectionFormPage
                    :isAuditPage="isAuditPage"
                    class="w-full"
                    :data="allTasksState?.data"
                  />
                </div>
              </div>
            </div>

            <Pagination
              :pagination="allTasksState.pagination"
              @changePage="changePage"
              @countPerPage="changePageSize"
            />
          </template>

          <template #loader>
            <CardSkelaton />
          </template>

          <template #initial>
            <CardSkelaton />
          </template>

          <template #empty>
            <DataFailed
              :withbtn="canCreateRecord"
              :link="auditCreateRoute"
              addText="Create Audit"
              title="You have No Audit"
              description=""
            />
          </template>

          <template #failed>
            <DataFailed
              :withbtn="canCreateRecord"
              :link="auditCreateRoute"
              addText="Create Audit"
              title="You have No Audit"
              description=""
            />
          </template>
        </DataStatus>

        <!-- ========================= -->
        <!-- AUDIT: MY AUDITS -->
        <!-- ========================= -->

        <DataStatus v-if="isAuditPage && activeAuditTab === 'mine'" :controller="state">
          <template #success>
            <div class="table-responsive inspection-table-responsive">
              <div class="index-table-card-container-inspection inspection-list-panel">
                <div class="header-container w-full">
                  <InspectionDragPage class="w-full" :data="state?.data" />
                </div>
              </div>
            </div>

            <Pagination
              :pagination="state.pagination"
              @changePage="changePage"
              @countPerPage="changePageSize"
            />
          </template>

          <template #loader>
            <CardSkelaton />
          </template>

          <template #initial>
            <CardSkelaton />
          </template>

          <template #empty>
            <DataEmpty title="You have No Audit" description="You have no Audit" :withbtn="false" />
          </template>

          <template #failed>
            <DataFailed
              title="You have No Audit"
              description="You have no Audit"
              :withbtn="false"
            />
          </template>
        </DataStatus>

        <!-- ========================= -->
        <!-- NORMAL INSPECTION FORM -->
        <!-- ========================= -->

        <DataStatus
          v-if="!isAuditPage && inspectionType == InspectionPageType.InspectionForm"
          :controller="allTasksState"
        >
          <template #success>
            <InspectionFormPage class="w-full" :data="allTasksState?.data" />

            <Pagination
              :pagination="allTasksState.pagination"
              @changePage="changePage"
              @countPerPage="changePageSize"
            />
          </template>

          <template #empty>
            <InspectionEmptyState
              :filtered="
                Boolean(selectedZoneIds.length || filterDate || filterInspectionType != null)
              "
              :results="String(route.query.inspectionType) === String(InspectionPageType.Result)"
            >
              <template #actions>
                <PermissionBuilder
                  :code="[
                    PermissionsEnum.ADMIN,
                    PermissionsEnum.ORG_INSPECTION_ALL,
                    PermissionsEnum.ORG_INSPECTION_CREATE,
                  ]"
                >
                  <router-link
                    :to="isAuditPage ? auditCreateRoute : inspectionCreateRoute"
                    class="btn btn-primary"
                  >
                    {{ $t(isAuditPage ? 'Create Audit' : 'Create Inspection') }}
                  </router-link>
                </PermissionBuilder>
              </template>
            </InspectionEmptyState>
          </template>

          <template #loader>
            <CardSkelaton />
          </template>
        </DataStatus>

        <!-- ========================= -->
        <!-- NORMAL DRAG INSPECTION -->
        <!-- ========================= -->

        <DataStatus
          v-if="!isAuditPage && inspectionType == InspectionPageType.DragInspection"
          :controller="state"
        >
          <template #success>
            <InspectionDragPage class="w-full" :data="state?.data" />

            <Pagination
              :pagination="state.pagination"
              @changePage="changePage"
              @countPerPage="changePageSize"
            />
          </template>

          <template #empty>
            <InspectionEmptyState
              :filtered="
                Boolean(selectedZoneIds.length || filterDate || filterInspectionType != null)
              "
              :results="String(route.query.inspectionType) === String(InspectionPageType.Result)"
            >
              <template #actions>
                <PermissionBuilder
                  :code="[
                    PermissionsEnum.ADMIN,
                    PermissionsEnum.ORG_INSPECTION_ALL,
                    PermissionsEnum.ORG_INSPECTION_CREATE,
                  ]"
                >
                  <router-link
                    :to="isAuditPage ? auditCreateRoute : inspectionCreateRoute"
                    class="btn btn-primary"
                  >
                    {{ $t(isAuditPage ? 'Create Audit' : 'Create Inspection') }}
                  </router-link>
                </PermissionBuilder>
              </template>
            </InspectionEmptyState>
          </template>

          <template #loader>
            <CardSkelaton />
          </template>
        </DataStatus>

        <!-- ========================= -->
        <!-- NORMAL RESULTS -->
        <!-- ========================= -->

        <DataStatus
          v-if="!isAuditPage && inspectionType == InspectionPageType.Result"
          :controller="resultsState"
        >
          <template #success>
            <InspectionsResultsPage class="w-full" :data="resultsState?.data" />

            <Pagination
              :pagination="resultsState.pagination"
              @changePage="changePage"
              @countPerPage="changePageSize"
            />
          </template>

          <template #empty>
            <InspectionEmptyState
              :filtered="
                Boolean(selectedZoneIds.length || filterDate || filterInspectionType != null)
              "
              :results="String(route.query.inspectionType) === String(InspectionPageType.Result)"
            >
              <template #actions>
                <PermissionBuilder
                  :code="[
                    PermissionsEnum.ADMIN,
                    PermissionsEnum.ORG_INSPECTION_ALL,
                    PermissionsEnum.ORG_INSPECTION_CREATE,
                  ]"
                >
                  <router-link
                    :to="isAuditPage ? auditCreateRoute : inspectionCreateRoute"
                    class="btn btn-primary"
                  >
                    {{ $t(isAuditPage ? 'Create Audit' : 'Create Inspection') }}
                  </router-link>
                </PermissionBuilder>
              </template>
            </InspectionEmptyState>
          </template>

          <template #loader>
            <CardSkelaton />
          </template>
        </DataStatus>
      </template>
      <DataFailed
        v-else
        :title="$t('have_not_permission')"
        :description="$t('permission_denied_description')"
        :withbtn="false"
      />
    </div>
  </div>
</template>

<style scoped src="../styles/inspection-index.css"></style>
