<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  displayName,
  type Resource,
  type ProjectSnapshot,
} from '../../../data/Model/OrganizationDashboardModel'
import DashboardPanel from './DashboardPanel.vue'
import DashboardIcon from './DashboardIcon.vue'
const props = defineProps<{
  resource: Resource<ProjectSnapshot>
  canOpen: boolean
  showIncidents: boolean
  showEquipment: boolean
  showInspections: boolean
}>()
defineEmits<{ retry: []; page: [number] }>()
const { t, locale } = useI18n()
const number = (value: number | null | undefined) =>
  value == null ? '—' : new Intl.NumberFormat(locale.value).format(value)
const statusKeys: Record<number, string> = {
  1: 'activeProject',
  2: 'completed',
  3: 'onHold',
  4: 'canceled',
}
const status = (value: number | null) =>
  value && statusKeys[value] ? t(`command.${statusKeys[value]}`) : t('command.notProvided')
const projects = computed(() =>
  (props.resource.data?.rows ?? []).map((project) => ({
    ...project,
    name: displayName(project, locale.value) || t('command.unnamedProject'),
  })),
)
</script>
<template>
  <DashboardPanel
    :title="$t('command.projectsTitle')"
    :subtitle="$t('command.projectsSubtitle')"
    :status="resource.status"
    :link="resource.status === 'forbidden' ? '' : '/organization/projects'"
    :link-label="$t('command.allProjects')"
    @retry="$emit('retry')"
  >
    <div
      class="command-table-wrap hse-table-scroll"
      tabindex="0"
      role="region"
      :aria-label="$t('command.projectsTitle')"
    >
      <table v-table-identity class="command-project-table hse-data-table">
        <thead>
          <tr>
            <th scope="col">{{ $t('command.project') }}</th>
            <th v-if="showIncidents" scope="col">{{ $t('command.incidents') }}</th>
            <th v-if="showInspections" scope="col">{{ $t('command.inspections') }}</th>
            <th v-if="showEquipment" scope="col">{{ $t('command.equipment') }}</th>
            <th scope="col">{{ $t('command.setupProgress') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <th scope="row">
              <div class="command-project-name">
                <span class="command-project-symbol"><DashboardIcon name="project" /></span>
                <div>
                  <RouterLink v-if="canOpen" :to="`/organization/project-summary/${project.id}`"
                    ><bdi dir="auto">{{ project.name }}</bdi></RouterLink
                  ><strong v-else
                    ><bdi dir="auto">{{ project.name }}</bdi></strong
                  ><small
                    ><bdi v-if="project.serial" dir="auto">{{ project.serial }}</bdi
                    ><span :class="`command-project-status-${project.status}`">{{
                      status(project.status)
                    }}</span></small
                  >
                </div>
              </div>
            </th>
            <td v-if="showIncidents">
              <bdi>{{ number(project.incidents) }}</bdi>
            </td>
            <td v-if="showInspections">
              <bdi>{{ number(project.inspections) }}</bdi>
            </td>
            <td v-if="showEquipment">
              <bdi>{{ number(project.equipment) }}</bdi>
            </td>
            <td>
              <div class="command-project-progress">
                <span
                  ><bdi>{{
                    project.setupProgress === null
                      ? '—'
                      : new Intl.NumberFormat(locale, {
                          style: 'percent',
                          maximumFractionDigits: 0,
                        }).format(project.setupProgress / 100)
                  }}</bdi></span
                ><i v-if="project.setupProgress !== null" aria-hidden="true"
                  ><em :style="{ width: `${project.setupProgress}%` }"></em
                ></i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="command-project-pagination">
      <span>{{
        $t('command.projectsReturned', {
          count: number(projects.length),
          total: number(resource.data?.total),
        })
      }}</span>
      <nav :aria-label="$t('command.projectPagination')">
        <button
          type="button"
          :disabled="(resource.data?.page ?? 1) <= 1"
          :aria-label="$t('previous')"
          @click="$emit('page', resource.data!.page - 1)"
        >
          <DashboardIcon name="arrow" class="command-prev locale-directional-icon" /></button
        ><span>{{
          $t('command.pageNumber', {
            page: number(resource.data?.page),
            total: number(resource.data?.lastPage),
          })
        }}</span
        ><button
          type="button"
          :disabled="(resource.data?.page ?? 1) >= (resource.data?.lastPage ?? 1)"
          :aria-label="$t('next')"
          @click="$emit('page', resource.data!.page + 1)"
        >
          <DashboardIcon name="arrow" class="locale-directional-icon" />
        </button>
      </nav>
    </div>
    <slot />
    <template #footer
      ><p>{{ $t('command.projectSetupNote') }}</p></template
    >
  </DashboardPanel>
</template>
