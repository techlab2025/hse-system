<script lang="ts" setup>
import HeaderSection from "../DetailsHeader/HeaderSection.vue";
import Equipment from "@/assets/images/Equipment.png"
import EmptyData from "../LocationsTeams/EmptyData.vue";
import EquimentFolderEmpty from "@/assets/images/EquimentFolderEmpty.png"
import type SohwProjectZoonModel from "@/features/Organization/Project/Data/models/ShowProjectZone";
import { useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import AddEquipmentDialog from "../../Dialogs/AddEquipmentDialog.vue";
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import AccordArrowDown from '@/shared/icons/AccordArrowDown.vue';
import AccordArrowRight from '@/shared/icons/AccordArrowRight.vue';
import AddEquipmentIcon from "@/shared/icons/AddEquipmentIcon.vue";
import ProjectEmployeeIcon from "@/shared/icons/ProjectEmployeeIcon.vue";
import EquipmentCard from "@/features/setting/Equipment/Presentation/components/EquipmentUtils/EquipmentCard.vue";
import ProjectEquipmentCard from "./ProjectEquipmentCard.vue";
import EmptyFolder from "@/assets/images/EmptyFolder.png";

const route = useRoute()
const id = route.params.id
const props = defineProps<{
  project_zoons: SohwProjectZoonModel[]
}>()

const ProjectZones = ref(props.project_zoons)
watch(() => props.project_zoons, (newValue) => {
  ProjectZones.value = newValue
})
const OpenAccordion = ref<string[]>([])

const CheckEquipemtnsEmpty = computed(() => props.project_zoons?.map((p) => p?.projectZoonEquipments?.length).reduce((a, b) => a + b, 0) === 0)
const updatetabValue = (value) => {
  OpenAccordion.value = value
}

// const GetEquipmentTotalCount = computed(() => props.project_zoons?.map((p) => p?.projectZoonEquipments?.length).reduce((a, b) => a + b, 0))
</script>


<template>
  <!-- <div class="equipment-section">
    <div class="equipment-section-header">
      <HeaderSection :img="Equipment" title="Equipment , tools & Devices by Site "
        subtitle="View and manage all equipment assigned to each operational zone" />
      <router-link :to="`/organization/project-equipment/project/${id}`" class="show-all">Show all</router-link>
    </div>

    <div class="equipments-sections w-full" v-if="ProjectZones?.length > 0 && !CheckEquipemtnsEmpty">
      <div v-for="(Equipment, index) in ProjectZones" :key="index" class="w-full">
        <EquipmentCard :zones="Equipment" v-if="Equipment?.projectZoonEquipments?.length > 0" />

      </div>
    </div>

    <div class="empty-teams" v-else>

      <AddEquipmentDialog :project_zoons="ProjectZones" />
    </div>



  </div> -->

  <div class="equipment-section">
    <div class="equipment-section-header">
      <HeaderSection :img="Equipment" title="Equipment , tools & Devices by Site "
        subtitle="View and manage all equipment assigned to each operational zone" />
      <router-link :to="`/organization/project-equipment/project/${id}`" class="show-all">{{ $t("Show all") }}</router-link>


    </div>

    <Accordion :value="OpenAccordion" multiple @update:value="updatetabValue">
      <AccordionPanel v-for="(zone, index) in ProjectZones.slice(0, 2)" :key="index" :value="index">
        <AccordionHeader>

          <div class="location-container w-full flex items-center gap-2 justify-between">
            <div class="location flex items-start">

              <AccordArrowDown v-if="OpenAccordion.includes(index)" class="arrow-accord" />
              <AccordArrowRight v-else class="arrow-right" />
              <div class="flex flex-col items-start gap-0">
                <p class="location-title">{{ zone?.zoonTitle }}</p>
                <div class="location-info-statics flex items-center gap-2">
                  <p>{{ zone?.projectZoonEquipments?.length }} <span>{{ $t("Equipment & Devices") }}</span></p>
                </div>
              </div>
              <div>

              </div>
            </div>
            <AddEquipmentDialog :project_zoons="ProjectZones" :ZoonId="zone.projectZoonId" />

            <!-- <div> -->
            <!-- <div class="card-actions flex item-center gap-2">
              <AddCreateTeam :isShow="true" :ProjectLocationId="location.id" :LocationId="location.id"
                @update:data="GetProjectLocationsEmployes" />
              <AddEmployeeDialog />
            </div> -->
            <!-- </div>/ -->
          </div>
          <!-- <AddEquipmentIcon class="add-equipment-icon" /> -->

        </AccordionHeader>
        <AccordionContent>

          <div class="teams-container equipment" v-if="zone?.projectZoonEquipments?.length > 0">
            <!-- <div class="all-employees-header-container">
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
              <TeamCard :isShow="true" v-for="(team, index) in location.projectLocationTeams" :key="index"
                :team="team" />
            </div> -->
            <!-- @delete:data="deleteEquipment" -->
            <div class="project-equipment-card-container  grid grid-cols-2 gap-4">
              <ProjectEquipmentCard v-for="(tool, index) in zone?.projectZoonEquipments.slice(0, 4)" :key="index"
                :tool="tool" />
            </div>

          </div>
          <div class="empty-teams" v-else>
            <AddEquipmentDialog :project_zoons="ProjectZones" :ZoonId="zone.projectZoonId" :isEmpty="true" />

            <!-- <EmptyData :img="EquimentFolderEmpty" title="No Equipment Yet"
              subtitle="You haven’t added any equipment to this project. Start building your crew now!"
              linkText=" Start adding equipment now!" :link="`/organization/project-equipment/project/${id}`" /> -->
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>

</template>
