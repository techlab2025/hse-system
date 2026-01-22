<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import ShowHazardParams from '../../../Core/params/showHazardParams';
import ShowHazardController from '../../controllers/showHazardController';
import { onMounted, ref, watch } from 'vue';
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum';
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue';
import HazardImage from '@/assets/images/alert 2.png'
import ObservationCard from '../FactoryUtils/ObservationCard.vue';
import { Observation } from '../../../Core/Enums/ObservationTypeEnum';
import acc from '@/assets/images/acc.png'
import people from '@/assets/images/people.png'
import RIP from '@/assets/images/RIP.png'
import Image from 'primevue/image'
import { LikelihoodEnum } from '../../../Core/Enums/LikelihoodEnum';
import { SeverityEnum } from '../../../Core/Enums/SeverityEnum';
import { RiskLevelEnum } from '../../../Core/Enums/risk_level_enum';
import WarningIcon from '@/shared/icons/WarningIcon.vue';
import ViewIcon from '@/shared/icons/ViewIcon.vue';
import TakeActionIcon from '@/shared/icons/TakeActionIcon.vue';
import CapaArrows from '@/assets/images/CapaArrows.png'
import Editor from 'primevue/editor'
import CreateCapaResultController from '../../controllers/CreateCapaResultController';
import CapaParams from '../../../Core/params/CapaParam';

const route = useRoute()
const id = route.params?.id

const showHazardController = ShowHazardController.getInstance()
const state = ref(showHazardController.state.value)

const ShowData = async () => {
  const showHazardParams = new ShowHazardParams(id, true)
  await showHazardController.showHazard(showHazardParams)
}

onMounted(() => {
  ShowData()
})

watch(() => showHazardController.state.value, (newVal) => {
  state.value = newVal
})
const GetHeader = (value: number) => {
  return Observation[value] == 'ObservationType'
    ? 'Observation'
    : Observation[value] == 'HazardType'
      ? 'Hazard'
      : 'incident'
}

const GetLikelyHood = (value: number) => {
  return LikelihoodEnum[value]
}

const GetSeverity = (value: number) => {
  return SeverityEnum[value]
}

const GetRiskLevel = (riskLevel: RiskLevelEnum) => {
  switch (riskLevel) {
    case RiskLevelEnum.Low:
      return 'Low'
    case RiskLevelEnum.Medium:
      return 'Medium'
    case RiskLevelEnum.High:
      return 'High'
    default:
      return 'Unknown'
  }
}

const corrective = ref('')
const preventive = ref('')
const router = useRouter()
const CreatCapaResult = async () => {
  const createCapaResultController = CreateCapaResultController.getInstance()
  const createCapaResultParams = new CapaParams(preventive.value, corrective.value, Number(route.params?.id))
  await createCapaResultController.createCapaResult(createCapaResultParams, router)
  corrective.value = ''
  preventive.value = ''
}
</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="show-observation-container">
        <HeaderPage :title="`${GetHeader(state.data?.type)}`"
          :subtitle="'Identify and report potential Incedants before they cause harm'" :img="HazardImage" />
        <ObservationCard :data="state.data" />

        <div class="observation-type-container">

          <p class="observation-type-title">{{ GetHeader(state.data?.type) }} Type</p>

          <div class="observation-genral-info-conatiner">

            <div class="observation-genral-info">

              <p class="like_lihood-container flex flex-col" v-if="state.data?.type == Observation.HazardType">
                <span class="like_lihood-title">likelihood</span>
                <span class="like_lihood">{{ GetLikelyHood(state.data?.like_lihood) }}</span>
              </p>

              <p class="severity-container flex flex-col">
                <span class="severity-title">severity</span>

              <p class="severity" v-if="state.data?.type == Observation.HazardType">{{
                GetSeverity(state.data?.severity) }}</p>
              </p>

              <span v-if="state.data?.riskLevel && state.data?.type == Observation.HazardType"
                class="observation-risk-level flex items-center gap-2" :class="GetRiskLevel(state.data?.riskLevel)">
                <WarningIcon v-if="state.data?.riskLevel == RiskLevelEnum.High" />
                {{ GetRiskLevel(state.data?.riskLevel) }} Level
              </span>

              <div class="flex flex-col gap-2">
                <p class="observation-type" v-if="state.data?.type != Observation.HazardType">
                  {{ GetHeader(state.data?.type) }} type :
                  <span>{{
                    state.data?.typeModel?.title }}</span>
                </p>

                <div class="root-causes" v-if="state.data?.rootCauses && state.data?.rootCauses.length > 0">
                  <span class="root-causes-title">
                    root causes
                  </span>
                  <div class="root-causes-content">
                    <p v-for="(root, index) in state.data?.rootCauses" :key="index" class="root-title">
                      {{ root?.title }}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Image v-if="state?.data?.media[0]?.url" :src="state?.data?.media[0]?.url" alt="Image" preview>
                  <template #previewicon>
                    <div class="perview">
                      <span>view</span>
                      <ViewIcon />
                    </div>
                  </template>
                </Image>
              </div>

            </div>

            <div class="hazard-info flex items-center gap-2">
              <p class="severity-container flex flex-col">
                <span class="severity-title">Hazard Type</span>

              <p class="severity" v-if="state.data?.type == Observation.HazardType">{{
                state.data?.typeModel?.title }}</p>
              </p>
              <p class="severity-container flex flex-col">
                <span class="severity-title">Hazard </span>

                <!-- <p class="severity" v-if="state.data?.type == Observation.HazardType">{{
                state.data?.typeModel?.title }}</p> -->
              </p>
            </div>
          </div>

          <div class="take-action-container" v-if="state?.data?.action">
            <div class="action-container flex items-center gap-2">
              <TakeActionIcon />
              <div class="flex flex-col">
                <p class="emp-text">Emp take an action</p>
                <p class="action-text">{{ state?.data?.action }}</p>
              </div>
            </div>

          </div>
        </div>

        <!--  -->
        <div class="observation-inspection-card" v-if="state?.data?.taskResultItemAnswer">
          <div class="observation-inspection-card-header">
            <p class="inspection-name">{{ state?.data?.taskResultItemAnswer?.templateTitle }}</p>
            <p class="inspection-auto">inspection Auto obervation</p>
          </div>
          <div class="observation-inspection-card-content">
            <p class="question-title">{{ state?.data?.taskResultItemAnswer?.templateItemTitle }}</p>

            <div class="answers-choose">
              <span class="choose" v-for="(answer, index) in state.data?.taskResultItemAnswer?.answers">{{ answer?.title
                }}</span>
            </div>
            <div class="text-area">
              <span class="typing-text">typing text</span>
              <span class="text">{{ state?.data?.taskResultItemAnswer?.taskResultItemAnswerTextReply }}</span>
            </div>
          </div>
        </div>

        <div class="capa-header-container" v-if="state?.data?.capa">
          <p class="capa-title">Expected Safety Measures</p>
        </div>
        <div class="capa-content-container" v-if="state?.data?.capa">
          <p class="capa-content-title">Corrective And Preventive Actions <span>(CAPA)</span></p>
          <img :src="CapaArrows" alt="capa_arrows">
          <div class="capa-actions-container">
            <div class="capa-action" v-if="!state.data?.capa?.corrective">
              <span class="capa-action-title">Corrective </span>
              <Editor v-model="corrective" editorStyle="height: 320px"
                :placeholder="'enter What action should have been taken immediately'" />
              <button @click.prevent="CreatCapaResult" class="corrective-button">submit</button>
            </div>
            <div class="capa-action" v-else>
              <span class="capa-action-title ">Corrective </span>
              <p v-html="state.data?.capa?.corrective" class="corrective-text corrective-textarea"></p>
            </div>
            <div class="capa-action preventive" v-if="!state.data?.capa?.preventive">
              <span class="capa-action-title">Preventive </span>
              <Editor v-model="preventive" editorStyle="height: 320px"
                :placeholder="'enter What action should have been taken immediately'" />
              <button @click.prevent="CreatCapaResult" class="corrective-button">submit</button>
            </div>
            <div class="capa-action preventive" v-else>
              <span class="capa-action-title ">Preventive </span>
              <p v-html="state.data?.capa?.preventive" class="corrective-text corrective-textarea"></p>
            </div>
          </div>
        </div>

        <div class="injury-header-container" v-if="state.data?.injuries?.length > 0"
          v-for="injury in state.data?.injuries">
          <div class="injury-header">
            <div class="injury-header-info">
              <img :src="acc" alt="acc">
              <p>There are
                casualties from the accident.</p>
            </div>
            <div class="injury-header-employees">
              {{ injury?.organization_employee?.name || injury?.employee_name }}
            </div>
          </div>
          <p class="note">{{ injury?.note }}</p>
        </div>

        <div class="injury-header-container" v-if="state.data?.witnessStatements?.length > 0">
          <div class="injury-header">
            <div class="injury-header-info">
              <img :src="people" alt="people">
              <p>witnesses</p>
            </div>

          </div>
          <div class="witnessStatement-container">
            <div class="flex items-center gap-3 witnessStatement "
              v-for="witnessStatement in state.data?.witnessStatements">
              <div class="flex items-center gap-3">
                <img src="https://cyber.comolho.com/static/img/avatar.png" alt="" width="30" height="30" />
                <div class="flex flex-col items-start">
                  <p class="employee-name">{{ witnessStatement?.employee_name ||
                    witnessStatement?.organization_employee?.name }}
                  </p>
                  <p class="employee-note">{{ witnessStatement.note }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="injury-header-container" v-if="state.data?.deaths?.length > 0" v-for="death in state.data?.deaths">
          <div class="injury-header">
            <div class="injury-header-info">
              <img :src="RIP" alt="RIP">
              <p>fatalities
                from the accident</p>
            </div>
            <div class="death-header-employees flex gap-3">
              <img src="https://cyber.comolho.com/static/img/avatar.png" alt="" width="40" height="30" />
              <div class="flex flex-col items-start">
                <span class="employee-name">{{ death?.organization_employee?.name || death?.employee_name }}</span>
                <span class="employee-hierarchy">{{ death?.organization_employee?.hierarchy[0].title }}</span>
              </div>
            </div>

          </div>
          <div class="death-container w-full justify-between">
            <p class="death-note">{{ death?.note }} </p>
            <img :src="death?.media[0]?.url" alt="">
          </div>
        </div>


      </div>
    </template>
    <template #loader>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #initial>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #empty>
      <PermissionBuilder :code="[
        PermissionsEnum?.ORGANIZATION_EMPLOYEE,
        PermissionsEnum?.ORG_OBSERVATION_CREATE,
      ]">
        <DataEmpty :link="`/organization/equipment-mangement/observation/add`" addText="Add Observation"
          description="Sorry .. You have no Observation .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Observation" />
      </PermissionBuilder>
    </template>
    <template #failed>
      <PermissionBuilder :code="[
        PermissionsEnum?.ORGANIZATION_EMPLOYEE,
        PermissionsEnum?.ORG_OBSERVATION_CREATE,
      ]">
        <DataFailed :link="`/organization/equipment-mangement/observation/add`" addText="Add Observation"
          description="Sorry .. You have no Observation .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Observation" />
      </PermissionBuilder>
    </template>
  </DataStatus>
</template>

<style scoped>
.index-table-card-container {
  margin-top: 20px;
}
</style>
