<script lang="ts" setup>
import LikeIcon from '@/shared/icons/LikeIcon.vue';
import AvtiveTimeLineIcon from '@/shared/icons/AvtiveTimeLineIcon.vue';
import { ref, watch } from 'vue';
import type ProjectProgressItemModel from '../../Data/models/ProjectProgressItemModel';
import { ProjectProgressEnum } from '../../Core/Enum/ProjectProgressEnum';
import LinkIcon from '@/shared/icons/LinkIcon.vue';

const emit = defineEmits(['update:ActiveItem'])
const props = defineProps<{
  sidebarItems: ProjectProgressItemModel[]
}>()

const ActiveItem = ref(props.sidebarItems.find((el) => !el.progress)?.id)

watch(() => ActiveItem.value, (newVal) => {
  emit("update:ActiveItem", newVal)
}, { immediate: true })
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const AllPagesToView = ref([
  {
    id: ProjectProgressEnum.codingSystem,
    title: "Coding System",
    description: "Define Coding System structure and assign serial Number",
    link: "/organization/serial-number"
  },
  {
    id: ProjectProgressEnum.Certificate,
    title: "Functional Certificate",
    description: "Define certificate structure and assign related project roles",
    link: "/organization/certificate?type=1"
  },
  {
    id: ProjectProgressEnum.Tempalte,
    title: "Functional Template",
    description: "Define templates structure and assign related project roles",
    link: "/organization/template?type=1"
  },
  {
    id: ProjectProgressEnum.Employee,
    title: "Functional Employee",
    description: "Define employees structure and assign roles within the organization",
    link: "/organization/organization-employee?type=3"
  },
  {
    id: ProjectProgressEnum.Heirarchy,
    title: "Functional Hierarchy",
    description: "Define the hierarchy and assign roles for your project team",
    link: "/organization/herikaly?type=3"
  },
  {
    id: ProjectProgressEnum.Country,
    title: "Functional Country",
    description: "Define country structure and assign roles across locations",
    link: "/organization/countries?type=4"
  },
  {
    id: ProjectProgressEnum.State,
    title: "Functional State",
    description: "Define state structure and assign roles within each country",
    link: "/organization/states?type=4"
  },
  {
    id: ProjectProgressEnum.City,
    title: "Functional City",
    description: "Define city structure and assign roles within each state",
    link: "/organization/cities?type=4"
  },
  {
    id: ProjectProgressEnum.Locatio,
    title: "Functional Location",
    description: "Define location structure and assign roles within each city",
    link: "/organization/areas?type=4"
  },
  {
    id: ProjectProgressEnum.Zone,
    title: "Functional Zone",
    description: "Define zone structure and assign roles within each location",
    link: "/organization/project-zone?type=4"
  },
  {
    id: ProjectProgressEnum.ObservationType,
    title: "Functional Observation Type",
    description: "Define observation types and assign related project roles",
    link: "/organization/observation-type?type=2"
  },
  {
    id: ProjectProgressEnum.IncidantType,
    title: "Functional Incident Type",
    description: "Define incident types and assign related project roles",
    link: "/organization/accidents-type?type=1"
  },
  {
    id: ProjectProgressEnum.HazardType,
    title: "Functional Hazard Type",
    description: "Define hazard types and assign related project roles",
    link: "/organization/hazard-type?type=2"
  },
  {
    id: ProjectProgressEnum.Hazard,
    title: "Functional Hazard",
    description: "Define hazards and assign roles for risk management",
    link: "/organization/hazard?type=2"
  },
  {
    id: ProjectProgressEnum.EquipmentType,
    title: "Functional Equipment Type",
    description: "Define equipment types and assign roles for asset management",
    link: "/organization/equipment-types"
  },
]);



</script>
<template>
  <!--  :class="ActiveItem == item?.id && !item.progress ? `` : `not-active`" -->
  <div class="timeline-container">
    <div class="timeline-wrapper">
      <div class="timeline-line"></div>

      <div class="timeline-item" v-for="(item, index) in sidebarItems" :key="index"
        :class="{ active: ActiveItem == item?.id || item.progress }" :style="{ animationDelay: `${index * 0.15}s` }"
        @click="ActiveItem = item?.id; scrollToTop()">


        <!-- active but not done  -->
        <div class="timeline-marker" v-if="ActiveItem == item?.id && !item.progress">

          <AvtiveTimeLineIcon />
        </div>


        <!-- not active and not done  -->
        <div class="timeline-marker " v-if="ActiveItem != item?.id && !item.progress">
          <div class="timeline-dot">
            <div class="timeline-dot-inner"></div>
            <div class="timeline-pulse"></div>
          </div>

          <div class="timeline-icon">
          </div>
        </div>

        <!-- done  -->
        <div class="timeline-marker" v-if="item.progress">
          <div class="timeline-dot">
            <div class="timeline-dot-inner"></div>
            <div class="timeline-pulse"></div>
          </div>

          <div class="timeline-icon">
            <LikeIcon />
          </div>
        </div>
        <div class="timeline-content" v-if="!item.progress">
          <div class="timeline-content-header">
            <p class="time-line-title"> {{ item.title }}</p>
            <router-link :to="AllPagesToView.find((el) => el.id == item.id)?.link">
              <LinkIcon />
            </router-link>
          </div>
          <p class="time-line-description"> {{AllPagesToView.find((el) => el.id == item.id)?.description}}</p>
        </div>
        <div class="timeline-content" v-else>
          <div class="timeline-content-header">
            <p class="first-item-title"> {{ item.title }}</p>
            <router-link :to="AllPagesToView.find((el) => el.id == item.id)?.link">
              <LinkIcon />
            </router-link>
          </div>
          <p class="first-item-description"> {{AllPagesToView.find((el) => el.id == item.id)?.description}}</p>
        </div>

      </div>
    </div>
  </div>
</template>
