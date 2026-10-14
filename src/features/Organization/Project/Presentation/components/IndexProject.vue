<script lang="ts" setup>
import { vProjectPanels } from '../composables/projectPanels'

import { computed, onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import Search from '@/shared/icons/Search.vue'
import IndexProjectController from '../controllers/indexProjectController'
import IndexProjectParams from '../../Core/params/indexProjectParams'
import ProjectIcon from './ProjectUtils/ProjectIcon.vue'
import ProjectCard from './ProjectUtils/ProjectCard.vue'
import { useProjectLabels } from '../composables/useProjectLabels'
import ProjectCardSkelaton from './ProjectUtils/ProjectCardSkelaton.vue'

const { t } = useI18n()

const labels = useProjectLabels()
const viewMode = ref<'grid' | 'list'>('grid')
const statusFilter = ref('')
const projects = computed(() => (Array.isArray(state.value.data) ? state.value.data : []))
const visibleProjects = computed(() =>
  projects.value.filter(
    (item) => !statusFilter.value || String(item.status) === statusFilter.value,
  ),
)
const portfolio = computed(() => ({
  active: projects.value.filter((item) => item.status === 1).length,
  progress: projects.value.length
    ? Math.round(
        projects.value.reduce((sum, item) => sum + (item.projectProgress || 0), 0) /
          projects.value.length,
      )
    : 0,
  pending: projects.value.filter((item) => item.projectStatus !== null && item.projectStatus < 5)
    .length,
}))
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const filterDate = ref('')
const indexProjectController = IndexProjectController.getInstance()
const state = ref(indexProjectController.state.value)
const route = useRoute()

const fetchProject = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteProjectParams = new IndexProjectParams(
    query,
    pageNumber,
    perPage,
    withPage,
    undefined,
    filterDate.value,
  )
  await indexProjectController.getData(deleteProjectParams)
}

onMounted(() => {
  fetchProject()
})

const searchProject = debounce(() => {
  fetchProject(word.value)
})

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchProject(word.value, currentPage.value, countPerPage.value)
}

const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchProject(word.value, currentPage.value, countPerPage.value)
}

const applyFilters = ({ date }: { date: string }) => {
  filterDate.value = date
  currentPage.value = 1
  fetchProject(word.value, 1, countPerPage.value)
}

const resetFilters = () => {
  filterDate.value = ''
  currentPage.value = 1
  fetchProject(word.value, 1, countPerPage.value)
}

watch(
  () => indexProjectController.state.value,
  (newState) => {
    if (newState) {
      // console.log(newState)
      state.value = newState
    }
  },
  {
    deep: true,
  },
)

watch(
  () => route?.params?.id,
  (Newvalue) => {
    fetchProject()
  },
)
</script>

<template>
  <section
    data-hse-project
    v-project-panels
    class="hse-project-root hse-project-page hse-project-portfolio"
  >
    <header class="hse-project-page-head">
      <div>
        <!-- <span class="hse-project-eyebrow"
          ><i class="hse-project-dot" aria-hidden="true"></i>{{ labels('portfolio') }}</span
        > -->
        <h1>{{ labels('projects') }}</h1>
        <p class="hse-project-subtitle">{{ labels('subtitle') }}</p>
      </div>
      <div class="hse-project-page-head__actions">
        <ExportPdf target-selector=".project-cards-grid" filename="projects.pdf" />
        <PermissionBuilder
          :code="[PermissionsEnum.ORGANIZATION_EMPLOYEE, PermissionsEnum.PROJECT_CREATE]"
        >
          <router-link
            to="/organization/project/flow"
            class="hse-project-button hse-project-button--primary"
          >
            <ProjectIcon name="plus" />{{ labels('newProject') }}
          </router-link>
        </PermissionBuilder>
      </div>
    </header>
    <PermissionBuilder
      :code="[
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.PROJECT_ALL,
        PermissionsEnum.PROJECT_FETCH,
      ]"
    >
      <div v-if="projects.length" class="hse-project-portfolio-strip">
        <div class="hse-project-portfolio-strip__lead">
          <span class="hse-project-metric-icon" aria-hidden="true"
            ><ProjectIcon name="pulse"
          /></span>
          <div>
            <strong>{{ labels('pulse') }}</strong
            ><span>{{ labels('pageMetrics') }}</span>
          </div>
        </div>
        <div>
          <span class="hse-project-metric-icon" aria-hidden="true"
            ><ProjectIcon name="folder"
          /></span>
          <div>
            <strong>{{ portfolio.active }}</strong
            ><span>{{ labels('active') }}</span>
          </div>
        </div>
        <div>
          <span class="hse-project-metric-icon hse-project-metric-icon--green" aria-hidden="true"
            ><ProjectIcon name="gauge"
          /></span>
          <div>
            <strong>{{ portfolio.progress }}%</strong><span>{{ labels('progress') }}</span>
          </div>
        </div>
        <div>
          <span class="hse-project-metric-icon hse-project-metric-icon--amber" aria-hidden="true"
            ><ProjectIcon name="clock"
          /></span>
          <div>
            <strong>{{ portfolio.pending }}</strong
            ><span>{{ labels('pending') }}</span>
          </div>
        </div>
      </div>
    </PermissionBuilder>
    <div class="hse-project-toolbar">
      <div class="hse-project-search">
        <button
          type="button"
          class="hse-project-search__clear"
          :aria-label="t('search')"
          @click=";((word = ''), searchProject())"
        >
          <Search />
        </button>
        <input
          class="hse-project-input"
          v-model="word"
          :placeholder="t('search')"
          :aria-label="t('search')"
          type="search"
          @input="searchProject"
        />
      </div>
      <!-- <select
        v-model="statusFilter"
        class="hse-project-input hse-project-filter"
        :aria-label="labels('allStatuses')"
      >
        <option value="">{{ labels('allStatuses') }}</option>
        <option value="1">{{ t('project_status_active') }}</option>
        <option value="2">{{ t('project_status_completed') }}</option>
        <option value="3">{{ t('project_status_on_hold') }}</option>
        <option value="4">{{ t('project_status_cancelled') }}</option>
      </select> -->
      <div class="hse-project-view-toggle" role="group" :aria-label="labels('projects')">
        <button
          type="button"
          :aria-label="labels('grid')"
          :aria-pressed="viewMode === 'grid'"
          @click="viewMode = 'grid'"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <rect x="4" y="4" width="6" height="6" rx="1" />
            <rect x="14" y="4" width="6" height="6" rx="1" />
            <rect x="4" y="14" width="6" height="6" rx="1" />
            <rect x="14" y="14" width="6" height="6" rx="1" />
          </svg>
        </button>
        <button
          type="button"
          :aria-label="labels('list')"
          :aria-pressed="viewMode === 'list'"
          @click="viewMode = 'list'"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
          </svg>
        </button>
      </div>
    </div>
    <PermissionBuilder
      :code="[
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.PROJECT_ALL,
        PermissionsEnum.PROJECT_DELETE,
        PermissionsEnum.PROJECT_FETCH,
        PermissionsEnum.PROJECT_UPDATE,
        PermissionsEnum.PROJECT_CREATE,
      ]"
    >
      <DataStatus :controller="state">
        <template #success>
          <div
            class="project-cards-grid hse-project-grid"
            :class="{ 'hse-project-grid--list': viewMode === 'list' }"
          >
            <ProjectCard studio v-for="item in visibleProjects" :key="item.id" :data="item" />
          </div>
          <p v-if="!visibleProjects.length" class="hse-project-filter-empty" role="status">
            {{ t('No data available') }}
          </p>
          <Pagination
            :pagination="state.pagination"
            @changePage="handleChangePage"
            @countPerPage="handleCountPerPage"
          />
        </template>
        <template #loader>
          <!-- <TableLoader :cols="8" :rows="10" /> -->
          <div
            class="project-cards-grid hse-project-grid"
            :class="{ 'hse-project-grid--list': viewMode === 'list' }"
          >
            <ProjectCardSkelaton v-for="item in 6" :key="item" />
          </div>
        </template>
        <template #initial>
          <TableLoader :cols="8" :rows="10" />
        </template>
        <template #empty>
          <PermissionBuilder
            :code="[PermissionsEnum.ORGANIZATION_EMPLOYEE, PermissionsEnum.PROJECT_CREATE]"
          >
            <DataEmpty
              :link="`/organization/project/flow`"
              addText="Add Project"
              description="You have no Project .. All your joined customers will appear here when you add your customer data"
              title="You have No Project"
            />
          </PermissionBuilder>
        </template>
        <template #failed>
          <PermissionBuilder
            :code="[PermissionsEnum.ORGANIZATION_EMPLOYEE, PermissionsEnum.PROJECT_CREATE]"
          >
            <DataFailed
              :link="`/organization/project/flow`"
              addText="Add Project"
              description="You have no Project .. All your joined customers will appear here when you add your customer data"
              title="You have No Project"
            />
          </PermissionBuilder>
        </template>
      </DataStatus>

      <template #notPermitted>
        <DataFailed
          addText="Have not Permission"
          description="You have no Project .. All your joined customers will appear here when you add your customer data"
        />
      </template>
    </PermissionBuilder>
  </section>
</template>
