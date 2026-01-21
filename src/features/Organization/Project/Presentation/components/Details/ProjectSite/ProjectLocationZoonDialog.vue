<script setup lang="ts">
import { ref } from "vue";
import HeaderSection from '../DetailsHeader/HeaderSection.vue';
import ZoneDialog from '@/assets/images/ZoneDialog.png'
import Dialog from 'primevue/dialog';
import CustomSelectInput from "@/shared/FormInputs/CustomSelectInput.vue";
import type TitleInterface from "@/base/Data/Models/title_interface";
import IndexProjectLocationZonesController from "../../../controllers/fetchLocationZonesController";
import IndexProjectLocationZonesParams from "@/features/Organization/Project/Core/params/fetchProjectLocationsZonesParams";
import FetchProjectZoneController from "@/features/Organization/Inspection/Presentation/controllers/FetchProjectZoneController";
import FetchProjectZonesParams from "@/features/Organization/Inspection/Core/params/FetchProjectZonesParams";
import CreateProjectZoonController from "../../../controllers/CreateProjectZoonController";
import CreateProjectZoneParams from "@/features/Organization/Project/Core/params/CreateProjectZoneParams";
import { useRoute, useRouter } from "vue-router";
import IndexLocationController from "@/features/setting/Location/Presentation/controllers/indexLocationController";
import IndexLocationParams from "@/features/setting/Location/Core/params/indexLocationParams";
import { LocationEnum } from "@/features/setting/Location/Core/Enum/LocationEnum";
import IndexProjectZoneController from "@/features/Organization/ProjectZone/Presentation/controllers/indexProjectZoneController";
import IndexProjectZoneParams from "@/features/Organization/ProjectZone/Core/params/indexProjectZoneParams";
const visible = ref(false);
const props = defineProps<{
  LocationId: number
  projectId: number
}>()
const router = useRouter()
const route = useRoute()
const emit = defineEmits(['update:data'])
const SelectedProjectZone = ref<TitleInterface>()

const setProjectLocationZoon = (data: TitleInterface) => {
  SelectedProjectZone.value = data
}


const indexProjectZoneController = IndexProjectZoneController.getInstance()
const indexProjectZoneParams = new IndexProjectZoneParams("", 1, 10, 0, props.LocationId)


const CreatProjectZoon = async () => {
  const createProjectZoonController = CreateProjectZoonController.getInstance()
  const createProjectZoonParams = new CreateProjectZoneParams(props.projectId, props.LocationId, SelectedProjectZone?.value?.id);
  const state = await createProjectZoonController.CreateProjectZoon(createProjectZoonParams, route)
  emit("update:data")

}

</script>
<template>
  <button class="add-zone" @click="visible = true">{{ $t('add Zone') }}</button>
  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '50rem' }">
    <template #header>
      <HeaderSection :img="ZoneDialog" title="Select Zones" subtitle="At least 1 zone required for every location" />
    </template>

    <div class="input-wrapper">
      <CustomSelectInput :required="false" :modelValue="SelectedProjectZone" :controller="indexProjectZoneController"
        :params="indexProjectZoneParams" label="Zoon" id="Equipment" placeholder="Select Zoon"
        @update:modelValue="setProjectLocationZoon" />
    </div>
    <button class="btn btn-primary w-full" @click="CreatProjectZoon">Confirm</button>
  </Dialog>
</template>

<style scoped>
.btn-primary {
  margin-top: 10px;
}
</style>
