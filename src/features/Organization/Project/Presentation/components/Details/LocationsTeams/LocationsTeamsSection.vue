<script lang="ts" setup>
import LoactionTeams from '@/assets/images/LoactionTeams.png'
import HeaderSection from '../DetailsHeader/HeaderSection.vue'
import LocationsSection from './LocationsSection.vue'
import { ref } from 'vue'
import member from '@/assets/images/member.png'
import EmptyData from './EmptyData.vue'
import EmptyFolder from '@/assets/images/EmptyFolder.png'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
interface LocationInterface {
  location: string
  teams: {
    members: number
    teamMembers: {
      img: string
      name: string
      poistion: string
    }[]
  }[]
}
const Locations = ref<LocationInterface[]>([
  {
    location: 'Cairo',
    teams: [
      {
        members: 10,
        teamMembers: [
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
        ],
      },
      {
        members: 10,
        teamMembers: [
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
        ],
      },
      {
        members: 10,
        teamMembers: [
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
        ],
      },
    ],
  },
  {
    location: 'Alexandria',
    teams: [
      {
        members: 10,
        teamMembers: [
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
        ],
      },
      {
        members: 10,
        teamMembers: [
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
        ],
      },
      {
        members: 10,
        teamMembers: [
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
          {
            img: member,
            name: 'mohab',
            poistion: 'manger',
          },
        ],
      },
    ],
  },
])
</script>

<template>
  <div class="locations-teams">
    <div class="locations-teams-header">
      <HeaderSection
        :img="LoactionTeams"
        title="Teams by Operational location"
        subtitle="View all working teams assigned to each operational zone"
      />
      <RouterLink :to="`/organization/employee-details/${id}`" class="show-all">Show all</RouterLink>
    </div>
    <div class="locations-sections" v-if="Locations.length > 0">
      <LocationsSection v-for="(location, index) in Locations" :key="index" :location="location" />
    </div>

    <EmptyData
      :img="EmptyFolder"
      title="No Team Members Yet"
      subtitle="You haven’t added any employees to this team. Start building your crew now!"
      v-else
    />
  </div>
</template>
