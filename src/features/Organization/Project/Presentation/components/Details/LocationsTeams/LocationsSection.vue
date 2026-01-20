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
import { onMounted, ref } from 'vue';
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

const route = useRoute()
const id = route.params.id
const props = defineProps<{
  location: TeamLocation
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
  console.log(value);
  OpenAccordion.value = value
}
</script>

<template>
  <!-- <div class="teams-locations" v-if="location?.projectLocationTeams?.length > 0">
    <div class="location">
      <hr class="location-hr">
      <p class="location-title">{{ location?.location_title }}</p>
    </div>

    <div class="teams" v-if="location?.projectLocationTeams?.length > 0">
      <TeamCard v-for="(team, index) in location.projectLocationTeams" :key="index" :team="team" />
    </div>
    <div class="empty-teams" v-else>
      <EmptyData :img="EmptyFolder" title="No Team Members Yet"
        subtitle="You haven’t added any employees to this team. Start building your crew now!"
        :link="`/organization/employee-details/${id}`" linkText=" Start building your crew now!" />
    </div>
  </div> -->


  <Accordion :value="OpenAccordion" multiple @update:value="updatetabValue">
    <AccordionPanel value="0">
      <AccordionHeader>

        <div class="location-container w-full flex items-center gap-2 justify-between">
          <div class="location flex items-start">

            <AccordArrowDown v-if="OpenAccordion.includes('0')" class="arrow-accord" />
            <AccordArrowRight v-else class="arrow-right" />
            <div class="flex flex-col items-start gap-0">
              <p class="location-title">{{ location?.location_title }}</p>
              <div class="location-info-statics flex items-center gap-2">
                <p>{{location?.projectLocationTeams?.map((p) => p?.Employees?.length).reduce((a, b) => a + b, 0)}}
                  <span>Employees</span>
                </p>
                <p>{{ location?.projectLocationTeams?.length }} <span>Teams</span>
                </p>
              </div>
            </div>
          </div>
          <div>
            <!-- <div class="card-actions flex item-center gap-2">
              <AddCreateTeam :isShow="true" :ProjectLocationId="location.id" :LocationId="location.id"
                @update:data="GetProjectLocationsEmployes" />
              <AddEmployeeDialog />
            </div> -->
          </div>
        </div>
      </AccordionHeader>
      <AccordionContent>
        <div class="all-employees" v-if="GetTeamsMembers()?.length > 0">
          <div class="all-employees-header-container">
            <div class="flex items-center gap-2">
              <ProjectEmployeeIcon class="icon" />
              <div class="all-employees-header flex flex-col">
                <p class="employee">employees</p>
                <p class="employee-count">{{ GetTeamsMembers().length }} Employee</p>
              </div>
            </div>
            <router-link :to="`/organization/employee-details/${id}`" class="all-employees-view">View all employees ({{
              GetTeamsMembers().length }})</router-link>
          </div>
          <div class="team-members">
            <TeamMemberCard v-for="(member, index) in GetTeamsMembers()" :key="index" :member="member"
              @update:data="DeleteTeamMember" />
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
        <div class="empty-teams" v-else>
          <EmptyData :img="EmptyFolder" title="No Team Members Yet"
            subtitle="You haven’t added any employees to this team. Start building your crew now!"
            :link="`/organization/employee-details/${id}`" linkText=" Start building your crew now!" />
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>

</template>

<style scoped></style>