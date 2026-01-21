<script setup lang="ts">
import type TeamLocation from '@/features/Organization/Project/Data/models/TeamLocationModel';
import TeamCard from './TeamCard.vue';
import EmptyData from './EmptyData.vue';
import EmptyFolder from '@/assets/images/EmptyFolder.png'
import { useRoute } from 'vue-router';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import AccordArrowDown from '@/shared/icons/AccordArrowDown.vue';
import AccordArrowRight from '@/shared/icons/AccordArrowRight.vue';
import { computed, onMounted, ref } from 'vue';
import AddCreateTeam from '../../Dialogs/CreateTeamDialog/AddCreateTeam.vue';
import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams';
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum';
import ProjectCustomLocationController from '../../../controllers/ProjectCustomLocationController';
import type ProjectCustomLocationModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectCustomLocationModel';
import TeamMemberCard from './TeamMemberCard.vue';
import DeleteProjectlocationTeamEmployeeParams from '@/features/Organization/Project/Core/params/deleteProjectlocationTeamEmployeeParams';
import DeleteProjectLocationTeamEmployeeController from '../../../controllers/DeleteProjectLocationTeamEmployeeController';
import ProjectEmployeeIcon from '@/shared/icons/ProjectEmployeeIcon.vue';
import TeamsIcon from '@/shared/icons/TeamsIcon.vue';
import AddEmployeeDialog from './AddEmployeeDialog.vue';
import type OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel';
import type projectLocationModel from '@/features/Organization/Project/Data/models/ProjectLocationModel';
import type TitleInterface from '@/base/Data/Models/title_interface';

const route = useRoute()
const id = route.params.id
const props = defineProps<{
  location: TeamLocation
  projectLocation: projectLocationModel[]
  hierarchy: TitleInterface[]
}>()

const projectCustomLocationController = ProjectCustomLocationController.getInstance()
const OpenAccordion = ref<string[]>([])

const GetProjectLocationsEmployes = async () => {
  const projectCustomLocationParams = new ProjectCustomLocationParams(id, [
    ProjectCustomLocationEnum.TEAM_EMPLOYEE,
    ProjectCustomLocationEnum.EMPLOYEE,
  ])
  const response = await projectCustomLocationController.getData(
    projectCustomLocationParams
  )

}

const GetTeamsMembers = () => {
  const AllEmployees = ref<ProjectCustomLocationModel[]>([])
  props.location.projectLocationTeams?.map((team) => {
    team.Employees?.map((employee) => {
      AllEmployees.value.push(employee)
    })
  })
  return AllEmployees.value
}

onMounted(() => {
  GetTeamsMembers();
})

const DeleteTeamMember = async (id: number) => {
  const deleteProjectLocationTeamEmployeeparams = new DeleteProjectlocationTeamEmployeeParams(id)
  const deleteProjectLocationTeamEmployeeController = DeleteProjectLocationTeamEmployeeController.getInstance();
  await deleteProjectLocationTeamEmployeeController.deleteProjectLocationTeamEmployee(deleteProjectLocationTeamEmployeeparams, route)
  if (route.path.includes("employee-details")) {
    GetProjectLocationsEmployes()
  }
}

const updatetabValue = (value) => {
  OpenAccordion.value = value
}

const GetSelectedLocation = (locationId: number) => {
  return props.projectLocation?.find((p) => p.locationId === locationId)
}
</script>

<template>
  <Accordion :value="OpenAccordion" multiple @update:value="updatetabValue">
    <AccordionPanel value="0">
      <AccordionHeader>
        <div class="location-container w-full flex items-center gap-2 justify-between">
          <div class="location flex items-start">

            <AccordArrowDown v-if="OpenAccordion.includes('0')" class="arrow-accord" />
            <AccordArrowRight v-else class="arrow-right" />
            <div class="flex flex-col items-start gap-0">

              <!-- <p class="location-title">{{ location?.location_title }}</p> -->
              <p class="location-title">{{ GetSelectedLocation(location.locationId)?.locationTitle }}</p>
              <div class="location-info-statics flex items-center gap-2">
                <p>{{ GetSelectedLocation(location.locationId)?.employees?.length || 0 }}
                  <span>Employees</span>
                </p>
                <p>{{ location?.projectLocationTeams?.length || 0 }} <span>Teams</span>
                </p>
              </div>
            </div>
          </div>
          <div>
          </div>
          <div class="card-actions flex items-center gap-2">
            <RouterLink :to="`/organization/project-hierarchy/project/${id}?locationId=${location.locationId}`"
              class="btn btn-secondary">
              Edit Hierarchy
            </RouterLink>
            <AddCreateTeam :ProjectLocationId="route.params.id" :LocationId="location.locationId"
              @update:data="GetProjectLocationsEmployes" />
            <!-- <RouterLink :to="`/organization/project-employee/project/${id}?locationId=${location.locationId}`"
              class="add-btn">
              Add employee
            </RouterLink> -->
            <AddEmployeeDialog :hierarchy="hierarchy" :ProjectLocation="location.projectLocationId"/>
          </div>
        </div>
      </AccordionHeader>
      <AccordionContent>
        <div class="all-employees" v-if="GetSelectedLocation(location.locationId)?.employees?.length > 0">
          <div class="all-employees-header-container">
            <div class="flex items-center gap-2">
              <ProjectEmployeeIcon class="icon" />
              <div class="all-employees-header flex flex-col">
                <p class="employee">employees</p>
                <p class="employee-count">{{ GetSelectedLocation(location.locationId)?.employees?.length || 0 }}
                  Employee</p>
              </div>
            </div>
            <router-link :to="`/organization/employee-details/${id}`" class="all-employees-view">View all employees ({{
              GetSelectedLocation(location.locationId)?.employees?.length || 0 }})</router-link>
          </div>
          <div class="team-members">
            <TeamMemberCard v-for="(member, index) in GetSelectedLocation(location.locationId)?.employees" :key="index"
              :member="member" @update:data="DeleteTeamMember" />
          </div>
        </div>
        <div class="teams-container" v-if="location?.projectLocationTeams?.length > 0">
          <div class="all-employees-header-container">
            <div class="flex items-center gap-2">
              <TeamsIcon class="icon" />
              <div class="all-employees-header flex flex-col">
                <p class="employee">team</p>
                <p class="employee-count">{{ location?.projectLocationTeams?.length }} team</p>
              </div>
            </div>
            <router-link :to="`/organization/employee-details/${id}`" class="all-employees-view">View all teams ({{
              location?.projectLocationTeams?.length }})</router-link>
          </div>
          <div class="teams">
            <TeamCard :isShow="true" v-for="(team, index) in location.projectLocationTeams" :key="index" :team="team" />
          </div>
        </div>
        <div class="empty-teams" v-if="GetSelectedLocation(location.locationId)?.employees?.length < 1">
          <EmptyData :img="EmptyFolder" title="No Teams Or Employees Yet"
            subtitle="You haven’t added any employees to this team. Start building your crew now!"
            :link="`/organization/project-employee/project/${id}?locationId=${location.locationId}`"
            linkText=" Start building your crew now!" />
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>

</template>

<style scoped></style>
