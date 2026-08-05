<script lang="ts" setup>
import LoactionTeams from '@/assets/images/LoactionTeams.png'
import HeaderSection from '../DetailsHeader/HeaderSection.vue'
import LocationsSection from './LocationsSection.vue'
import EmptyData from './EmptyData.vue'
import EmptyFolder from '@/assets/images/EmptyFolder.png'
import { useRoute } from 'vue-router'
import type TeamLocation from '@/features/Organization/Project/Data/models/TeamLocationModel'
import { computed } from 'vue'
import type TitleInterface from '@/base/Data/Models/title_interface'
import type projectLocationModel from '@/features/Organization/Project/Data/models/ProjectLocationModel'
import type OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'

const route = useRoute()
const id = route.params.id

const { teamLocations, projectLocations, hierarchy, orgganizationEmployeeWithHierarchy } =
  defineProps<{
    teamLocations: TeamLocation[] | undefined
    projectLocations: projectLocationModel[] | undefined | null
    hierarchy: TitleInterface[] | undefined | null
    orgganizationEmployeeWithHierarchy: OrganizatoinEmployeeDetailsModel[] | undefined | null
  }>()

const hasOperationalLocations = computed(() => (teamLocations?.length || 0) > 0)
const previewLocations = computed(() => teamLocations?.slice(0, 2) || [])
const remainingLocations = computed(() => Math.max((teamLocations?.length || 0) - 2, 0))

const totalEmployees = computed(
  () =>
    projectLocations?.reduce((total, location) => total + (location.employees?.length || 0), 0) ||
    0,
)

const totalTeams = computed(
  () =>
    teamLocations?.reduce(
      (total, location) => total + (location.projectLocationTeams?.length || 0),
      0,
    ) || 0,
)
</script>

<template>
  <div class="locations-teams">
    <span class="section-accent" aria-hidden="true"></span>
    <div class="locations-teams-header">
      <HeaderSection
        :img="LoactionTeams"
        title="teams_by_operational_location"
        subtitle="view_all_working_teams_assigned_to_each_operational_zone"
      />
      <div class="team-section-actions">
        <!-- <span class="actions-label"><i aria-hidden="true"></i>{{ $t('Workforce overview') }}</span> -->
        <div class="team-action-row">
          <div class="team-summary">
            <span class="summary-item employees-summary">
              <i aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="9" cy="8" r="3" />
                  <path
                    d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 3.5 4.8V20"
                  />
                </svg>
              </i>
              <span
                ><strong>{{ totalEmployees }}</strong
                >{{ $t('Employees') }}</span
              >
            </span>
            <span class="summary-item teams-summary">
              <i aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="8" cy="8" r="3" />
                  <circle cx="17" cy="9" r="2.5" />
                  <path d="M2.5 20v-2a5.5 5.5 0 0 1 11 0v2M14 15a4.5 4.5 0 0 1 6.5 4v1" />
                </svg>
              </i>
              <span
                ><strong>{{ totalTeams }}</strong
                >{{ $t('Teams') }}</span
              >
            </span>
          </div>
          <RouterLink :to="`/organization/employee-details/${id}`" class="show-all">
            <span class="cta-copy">
              <strong>{{ $t('Manage workforce') }}</strong>
              <small>{{ $t('Employees and teams') }}</small>
            </span>
            <i aria-hidden="true">→</i>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- <div class="section-context" v-if="hasOperationalLocations">
      <div>
        <span class="context-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </span>
        <span
          ><strong>{{ $t('Operational locations') }}</strong
          ><small>{{ $t('Expand a location to review its people and teams') }}</small></span
        >
      </div>
      <span class="location-total">{{ teamLocations?.length || 0 }}</span>
    </div> -->

    <div class="locations-sections" v-if="hasOperationalLocations">
      <LocationsSection
        v-for="(location, index) in previewLocations"
        :key="location.locationId || index"
        :location="location"
        :projectLocation="projectLocations"
        :hierarchy="hierarchy"
        :employeesHierarchy="orgganizationEmployeeWithHierarchy"
      />
      <div class="more-locations" v-if="remainingLocations > 0">
        <span>+{{ remainingLocations }}</span>
        <p>
          <strong>{{ $t('More locations available') }}</strong>
          <small>{{ $t('Use Manage workforce to explore all teams and employees.') }}</small>
        </p>
      </div>
    </div>
    <div class="empty-teams" v-else>
      <EmptyData
        :img="EmptyFolder"
        :title="$t('No Team Members Yet')"
        :subtitle="
          $t('You haven’t added any employees to this team. Start building your crew now!')
        "
        :link="`/organization/employee-details/${id}`"
        :linkText="$t('Start building your crew now!')"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.locations-teams {
  position: relative;
  overflow: hidden;
  gap: 18px;
  padding: 20px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 14%, var(--main-border));
  border-radius: 23px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--PrimaryColor) 4%, transparent),
      transparent 42%
    ),
    var(--surface-1);
  box-shadow: 0 16px 38px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}

.section-accent {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--PrimaryColor), var(--status-success));
}

.locations-teams-header,
.team-action-row,
.team-summary,
.show-all {
  display: flex;
  align-items: center;
}

.locations-teams-header {
  justify-content: space-between;
  gap: 16px;
  background: transparent;
}

.team-section-actions {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-2) 62%, var(--surface-1));
}

.actions-label {
  display: inline-flex;
  align-items: center;
  align-self: stretch;
  gap: 6px;
  padding-inline: 3px;
  color: var(--text-soft);
  font-size: 0.55rem;
  font-weight: 850;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.actions-label i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--status-success);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--status-success) 10%, transparent);
}

.team-action-row {
  gap: 7px;
}

.team-summary {
  gap: 6px;
}

.summary-item {
  display: inline-flex;
  align-items: center;
  min-height: 46px;
  gap: 8px;
  padding: 6px 11px 6px 7px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-2) 76%, var(--surface-1));
}

.summary-item > i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
  font-style: normal;
}

.summary-item svg,
.context-icon svg {
  width: 17px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.summary-item > span {
  display: flex;
  flex-direction: column;
  color: var(--text-soft);
  font-size: 0.58rem;
  font-weight: 750;
}

.summary-item strong {
  color: var(--PrimaryColor);
  font-family: 'Bold';
  font-size: 0.82rem;
  line-height: 1.1;
}

.teams-summary > i {
  color: var(--brand-accent-500);
  background: color-mix(in srgb, var(--brand-accent-500) 9%, transparent);
}

.teams-summary strong {
  color: var(--brand-accent-500);
}

.show-all {
  justify-content: center;
  min-width: 154px;
  min-height: 46px;
  gap: 7px;
  padding: 7px 8px 7px 11px;
  border-radius: 11px;
  background: var(--PrimaryColor);
  color: white;
  text-align: start;
  text-decoration: none;
  box-shadow: 0 8px 18px color-mix(in srgb, var(--PrimaryColor) 20%, transparent);
  transition: 0.2s ease;
}

.cta-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  flex: 1;
}

.cta-copy strong {
  color: var(--text-on-brand);
  font-size: 0.65rem;
  font-weight: 900;
}

.cta-copy small {
  color: color-mix(in srgb, var(--text-on-brand) 72%, transparent);
  font-size: 0.52rem;
}

.show-all:hover {
  transform: translateY(-1px);
  box-shadow: 0 11px 22px color-mix(in srgb, var(--PrimaryColor) 27%, transparent);
}

.show-all i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 27px;
  flex: 0 0 27px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--text-on-brand) 16%, transparent);
  font-style: normal;
}

[dir='rtl'] .show-all i {
  transform: rotate(180deg);
}

.locations-sections {
  display: flex;
  flex-direction: column;
  gap: 11px;
  width: 100%;
  background: transparent;
}

.more-locations {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 13px;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 25%, var(--main-border));
  border-radius: 13px;
  background: color-mix(in srgb, var(--PrimaryColor) 4%, transparent);
}

.more-locations > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 30px;
  padding: 0 8px;
  border-radius: 10px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  font-family: 'Bold';
  font-size: 0.7rem;
}

.more-locations p {
  display: flex;
  flex-direction: column;
  margin: 0;
}

.more-locations strong {
  color: var(--text-strong);
  font-size: 0.67rem;
}

.more-locations small {
  color: var(--text-soft);
  font-size: 0.58rem;
}

.section-context {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 17px 0 10px;
  padding: 10px 12px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-2) 58%, transparent);
}

.section-context > div {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 9px;
}

.context-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 10px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
}

.section-context > div > span:last-child {
  display: flex;
  min-width: 0;
  flex-direction: column;
}
.section-context strong {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.72rem;
}
.section-context small {
  color: var(--text-soft);
  font-size: 0.59rem;
}
.location-total {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 29px;
  height: 27px;
  padding: 0 8px;
  border-radius: 999px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
  font-family: 'Bold';
  font-size: 0.66rem;
}

@media (max-width: 760px) {
  .locations-teams {
    padding: 16px;
    border-radius: 19px;
  }

  .locations-teams-header,
  .team-section-actions {
    align-items: flex-start;
    flex-direction: column;
  }

  .team-section-actions,
  .team-action-row,
  .team-summary {
    width: 100%;
  }
  .team-section-actions {
    align-items: stretch;
  }
  .summary-item {
    flex: 1;
  }
  .show-all {
    width: 100%;
  }
}

@media (max-width: 460px) {
  .team-action-row {
    align-items: stretch;
    flex-direction: column;
  }
  .team-summary {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .section-context small {
    display: none;
  }
}
</style>
