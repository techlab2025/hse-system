<script lang="ts" setup>
import { ref } from 'vue'
import CreateCapaResultController from '../../../controllers/CreateCapaResultController'
import CapaParams from '@/features/Organization/ObservationFactory/Core/params/CapaParam'
import CapaArrows from '@/assets/images/CapaArrows.png'
import Editor from 'primevue/editor'
import type CapaModel from '@/features/Organization/ObservationFactory/Data/models/CapaModel'
import { useRoute } from 'vue-router'
const props = defineProps<{
  data: CapaModel
}>()
const route = useRoute()
const corrective = ref(props.data?.corrective)
const preventive = ref(props.data?.preventive)
const CreatCapaResult = async () => {
  const createCapaResultController = CreateCapaResultController.getInstance()
  const createCapaResultParams = new CapaParams(
    preventive.value,
    corrective.value,
    Number(route.params?.id),
  )
  await createCapaResultController.createCapaResult(createCapaResultParams, route)
  corrective.value = ''
  preventive.value = ''
}
</script>
<template>
  <div class="capa-container">
    <div class="capa-header-container">
      <p class="capa-title">Expected Safety Measures</p>
    </div>
    <div class="capa-content-container">
      <p class="capa-content-title">Corrective And Preventive Actions <span>(CAPA)</span></p>
      <img :src="CapaArrows" alt="capa_arrows" />
      <div class="capa-actions-container">
        <div class="capa-action" v-if="!data?.corrective">
          <span class="capa-action-title">Corrective </span>
          <Editor
            v-model="corrective"
            editorStyle="height: 320px"
            :placeholder="'enter What action should have been taken immediately'"
          />
          <button @click.prevent="CreatCapaResult" class="corrective-button">submit</button>
        </div>

        <div class="capa-action" v-else>
          <span class="capa-action-title">Corrective </span>
          <p v-html="data?.corrective" class="corrective-text corrective-textarea"></p>
        </div>

        <div class="capa-action preventive" v-if="!data?.preventive">
          <span class="capa-action-title">Preventive </span>
          <Editor
            v-model="preventive"
            editorStyle="height: 320px"
            :placeholder="'enter What action should have been taken immediately'"
            style="max-width: 100% !important"
          />
          <button @click.prevent="CreatCapaResult" class="corrective-button">submit</button>
        </div>

        <div class="capa-action preventive" v-else>
          <span class="capa-action-title">Preventive </span>
          <p v-html="data?.preventive" class="corrective-text corrective-textarea"></p>
        </div>
      </div>
    </div>
  </div>
</template>
