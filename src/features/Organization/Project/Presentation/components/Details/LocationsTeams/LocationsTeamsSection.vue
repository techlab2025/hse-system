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

const CheckProjectLocationEmployeeEmpty = computed(
  () =>
    projectLocations &&
    projectLocations?.map((p) => p.employees?.map((employee) => employee.id)).flat().length > 0,
)
</script>

<template>
  <div class="locations-teams">
    <div class="locations-teams-header">
      <HeaderSection
        :img="LoactionTeams"
        title="teams_by_operational_location"
        subtitle="view_all_working_teams_assigned_to_each_operational_zone"
      />
      <RouterLink :to="`/organization/employee-details/${id}`" class="show-all">{{
        $t('Show all')
      }}</RouterLink>
    </div>

    <div class="locations-sections" v-if="CheckProjectLocationEmployeeEmpty">
      <LocationsSection
        v-for="(location, index) in teamLocations"
        :key="index"
        :location="location"
        :projectLocation="projectLocations"
        :hierarchy="hierarchy"
        :employeesHierarchy="orgganizationEmployeeWithHierarchy"
      />
    </div>
    <div class="empty-teams" v-else>
      <EmptyData
        :img="EmptyFolder"
        title="No Team Members Yet"
        :subtitle="
          $t('You haven’t added any employees to this team. Start building your crew now!')
        "
        :link="`/organization/employee-details/${id}`"
        :linkText="$t('Start building your crew now!')"
      />
    </div>
  </div>
</template>

<style scoped></style>
