<script setup lang="ts">
import EmployeeIcon from '@/assets/images/EmployeeIcon.png'
import HeaderSection from '../Details/DetailsHeader/HeaderSection.vue'
import TeamMemberCard from '../Details/LocationsTeams/TeamMemberCard.vue'
import { onMounted, ref, watch } from 'vue'
import TeamCard from '../Details/LocationsTeams/TeamCard.vue'
import AddCreateTeam from '../Dialogs/CreateTeamDialog/AddCreateTeam.vue'
import { useRoute } from 'vue-router'
import FetchProjectLocationsEmployeeController from '../../controllers/FetchProjectLocationsEmployeeController'
import FetchProjectLocationsEmployee from '../../../Core/params/FetchProjectLocationsEmployeeParams'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from "@/shared/DataStatues/TableLoader.vue";
import DataEmpty from "@/shared/DataStatues/DataEmpty.vue";
import FetchProjectLocationsTeamsEmployeeController from '../../controllers/Teams/FetchProjectLocationsTeamsEmployeeController'
import FetchProjectLocationTeamEmployee from '../../../Core/params/TeamEmployee/FetchProjectLocationTeamEmployeeParams'

const router = useRoute()
const id = router.params.project_id
const fetchProjectLocationsTeamsEmployeeController = FetchProjectLocationsTeamsEmployeeController.getInstance()
const state = ref(fetchProjectLocationsTeamsEmployeeController.state.value)
interface TeamMemberInterface {
  img: string
  name: string
  poistion: string
}
const TeamsMembers = ref<TeamMemberInterface[]>([
  {
    img: EmployeeIcon,
    name: 'mohab',
    poistion: 'manger',
  },
  {
    img: EmployeeIcon,
    name: 'mohab',
    poistion: 'manger',
  },
  {
    img: EmployeeIcon,
    name: 'mohab',
    poistion: 'manger',
  },
  {
    img: EmployeeIcon,
    name: 'mohab',
    poistion: 'manger',
  },
])

interface TeamInterface {
  members: number
  teamMembers: {
    img: string
    name: string
    poistion: string
  }[]
}

const TeamsData = ref<TeamInterface[]>([
  {
    members: 10,
    teamMembers: [
      {
        img: EmployeeIcon,
        name: 'mohab',
        poistion: 'manger',
      },
      {
        img: EmployeeIcon,
        name: 'mohab',
        poistion: 'manger',
      },
      {
        img: EmployeeIcon,
        name: 'mohab',
        poistion: 'manger',
      },
    ],
  },
])


const GetProjectLocationsEmployes = async () => {
  const fetchProjectLocationTeamEmployee = new FetchProjectLocationTeamEmployee(id)
  const response = await fetchProjectLocationsTeamsEmployeeController.FetchProjectLocationsTeamsEmployee(fetchProjectLocationTeamEmployee)
  console.log(response, "response");
}

onMounted(() => {
  GetProjectLocationsEmployes();
})
watch(() => fetchProjectLocationsTeamsEmployeeController.state.value, (newState) => {
  state.value = newState
})

</script>
<template>
  <!-- <DataStatus :controller="state"> -->
    <!-- <template #success> -->
      <div class="emoloyees-details" v-for="(locationTeam, index) in TeamsData" :key="index">
        <div class="card-header">
          <HeaderSection :img="EmployeeIcon" :title="`locationTeam.locationTitle`"
            :subtitle="`locationTeam.projectLocationEmployees.length`" />
          <div class="card-actions">
            <RouterLink :to="`/organization/project-hierarchy/project/${id}`" class="edit-btn">
              Edit Hierarchy
            </RouterLink>
            <AddCreateTeam />
            <RouterLink :to="`/organization/project-employee/project/${id}`" class="add-btn">
              Add employee
            </RouterLink>
          </div>
        </div>
        <hr class="employee-hr" />
        <div class="employees-section">
          <TeamMemberCard class="employee-card" v-for="(member, index) in TeamsMembers" :key="index" :member="member" />
        </div>
        <div>
          <TeamCard class="employee-card" v-for="(team, index) in TeamsData" :key="index" :team="team" />
        </div>
      </div>
    <!-- </template>
    <template #loader>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #initial>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #empty>
      <DataEmpty :link="`/add-project`"
        description="Sorry .. You have no project types .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Projects" addText="Add Projects" />
    </template>
    <template #failed>
      <DataFailed />
    </template>
  </DataStatus> -->




</template>
