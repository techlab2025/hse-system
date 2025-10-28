<script setup lang="ts">
import EmployeeIcon from '@/assets/images/EmployeeIcon.png'
import HeaderSection from '../Details/DetailsHeader/HeaderSection.vue'
import TeamMemberCard from '../Details/LocationsTeams/TeamMemberCard.vue'
import { ref } from 'vue'
import TeamCard from '../Details/LocationsTeams/TeamCard.vue'
import AddCreateTeam from '../Dialogs/CreateTeamDialog/AddCreateTeam.vue'

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
</script>
<template>
  <div class="emoloyees-details">
    <div class="card-header">
      <HeaderSection :img="EmployeeIcon" title="cairo" subtitle="100 employee" />
      <div class="card-actions">
        <button class="edit-btn">Edit Hierarchy</button>
        <AddCreateTeam />
        <button class="add-btn">add employee</button>
      </div>
    </div>
    <hr class="employee-hr" />
    <div class="employees-section">
      <TeamMemberCard
        class="employee-card"
        v-for="(member, index) in TeamsMembers"
        :key="index"
        :member="member"
      />
    </div>
    <div>
      <TeamCard
        class="employee-card"
        v-for="(team, index) in TeamsData"
        :key="index"
        :team="team"
      />
    </div>
  </div>
</template>
