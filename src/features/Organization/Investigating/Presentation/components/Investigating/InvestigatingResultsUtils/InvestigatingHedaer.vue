<script lang="ts" setup>
import type TitleInterface from '@/base/Data/Models/title_interface'
import IndexDocumentRefrenceParams from '@/features/Organization/DocumentRefrence/Core/params/IndexADocumentRefrenceParams'
import IndexDocumentRefrenceController from '@/features/Organization/DocumentRefrence/Presentation/controllers/IndexDocumentRefrenceController'
import type InvestegationEmployeeModel from '@/features/Organization/Investigating/Data/models/investigationResult/InvestegationEmployeeModel'
import type EquipmentDetailsModel from '@/features/setting/Equipment/Data/models/equipmentDetailsModel'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import { ref } from 'vue'
import ShiftModel from '../../../../../Shifts/Data/models/ShiftModel'
import AddDocumentRefrence from '@/features/Organization/DocumentRefrence/Presentation/components/AddDocumentRefrence.vue'

const emit = defineEmits(['update:documentRefrences'])

const props = defineProps<{
  title?: string
  serial?: string
  victim?: string
  date?: string
  meetingDate?: string
  TeamLeader?: string
  TeamNumbers?: number
  incidantType?: TitleInterface
  place?: string
  equipment?: EquipmentDetailsModel
  incidantDescription?: string
  team?: InvestegationEmployeeModel[]
  time?: string
  shift?: ShiftModel
}>()

const DocumentRefrenceDialog = ref<boolean>(false)
const DocumentRefrences = ref<TitleInterface[]>([])
const setDocumentRefrences = (data: TitleInterface[]) => {
  DocumentRefrences.value = data
  emit('update:documentRefrences', data)
}
const indexDocumentRefrencesController = IndexDocumentRefrenceController.getInstance()
const indexDocumentRefrencesParams = new IndexDocumentRefrenceParams('', 1, 10, 0)
</script>
<template>
  <div class="investigating-header-container">
    <!-- <div class="investigating-header">
      <p class="small-title serial">
        serial : <span class="place">{{ serial }}</span>
      </p>
      <p class="small-title">
        title : <span class="place title">{{ title }}</span>
      </p>
      <p class="small-title">
        Place : <span class="place">{{ place }}</span>
      </p>



    </div> -->
    <div class="meeting-info-container">
      <div class="meeting-info">
        <p>
          serial : <span class="meet-date">{{ serial }} </span>
        </p>
        <p>
          title : <span class="team-leader">{{ title }}</span>
        </p>
        <p>
          Incident Classification : <span class="incidant-type">{{ incidantType?.title }}</span>
        </p>
        <p>
          date & time & shift :
          <span class="incidant-type">{{ date }} & {{ time }} & {{ shift?.title }}</span>
        </p>
        <p>
          Work Area / Facility : <span class="team-number">{{ place }}</span>
        </p>
        <div class="input-wrapper col-span-2 w-full root-cause-panel">
          <UpdatedCustomInputSelect
            :modelValue="DocumentRefrences"
            class="input"
            :controller="indexDocumentRefrencesController"
            :params="indexDocumentRefrencesParams"
            :label="$t('Regulatory/Legal Compliance Reference')"
            id="DocumentRefrence"
            :placeholder="$t('select your Regulatory/Legal Compliance Reference')"
            @update:modelValue="setDocumentRefrences"
            :type="2"
            @close="DocumentRefrenceDialog = false"
            :isDialog="true"
            v-model:dialogVisible="DocumentRefrenceDialog"
          >
            <template #LabelHeader>
              <span class="add-dialog" @click="DocumentRefrenceDialog = true">{{ $t('New') }}</span>
            </template>
            <template #Dialog>
              <AddDocumentRefrence @close:dialog="DocumentRefrenceDialog = false" />
            </template>
          </UpdatedCustomInputSelect>
        </div>
      </div>
    </div>
    <!-- <div class="meeting-info-container">

      <div class="meeting-info">
        <p>
          Date & Time : <span class="meet-date">{{ date }} &{{ time }}</span>
        </p>
        <p>
          Investigation team leader : <span class="team-leader">{{ TeamLeader }}</span>
        </p>
        <p>
          Num of team : <span class="team-number">{{ TeamNumbers }}</span>
        </p>
      </div>
    </div> -->
    <div class="equipment-card" v-if="equipment">
      <img :src="equipment?.image" alt="image" class="equipemtn-card-image" />
      <div class="equipment-text">
        <p class="name">{{ equipment?.title }}</p>
        <p class="serial">{{ equipment?.serial_name }}</p>
      </div>
      <!-- <EquipmentCard :tool="equipment" /> -->
    </div>

    <!-- <div class="team-container">
      <p class="title">{{ $t('team') }}</p>
      <div class="team">
        <div class="team-member" v-for="member in team" :key="member.id">
          <img
            :src="
              member?.organizationEmployee?.image ||
              'https://cyber.comolho.com/static/img/avatar.png'
            "
            alt=""
            class="equipemtn-card-image"
          />
          <div class="employee-text">
            <p class="name">{{ member.organizationEmployee?.name }}</p>
            <p class="serial">{{ member.organizationEmployee?.serialName }}</p>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
.meeting-info-container {
  width: 100% !important;
  grid-column: span 2 !important;
}
.investigating-header {
  display: flex;
  flex-direction: row !important;
}
.place.title {
  color: black !important;
}
.small-title {
  width: 33% !important;
  height: 100%;
  flex-wrap: wrap;
}
.small-title.serial {
  background: #eff2f9 !important;
  display: flex;
  flex-direction: row !important;
  width: 100%;
  .place {
    color: #1d4ed8 !important;
    max-width: 80%;
  }
}
</style>
