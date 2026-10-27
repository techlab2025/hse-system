<script lang="ts" setup>
import EditorToolbar from '@/shared/localization/EditorToolbar.vue'
import { localizeEditorChrome } from '@/localization/editor'

import { ref } from 'vue'
import CreateCapaResultController from '../../../controllers/CreateCapaResultController'
import CapaParams from '@/features/Organization/ObservationFactory/Core/params/CapaParam'
import CapaArrows from '@/assets/images/CapaArrows.png'
import Editor from 'primevue/editor'
import type CapaModel from '@/features/Organization/ObservationFactory/Data/models/CapaModel'
import { useRoute, useRouter } from 'vue-router'
const props = defineProps<{
  data: CapaModel
}>()
const route = useRoute()
const corrective = ref(props.data?.corrective)
const preventive = ref(props.data?.preventive)
const emit = defineEmits(['close'])
const router = useRouter()
const CreatCapaResult = async () => {
  const createCapaResultController = CreateCapaResultController.getInstance()
  const createCapaResultParams = new CapaParams(
    preventive.value,
    corrective.value,
    Number(route.params?.id) || Number(props.data?.observation_id),
  )
  await createCapaResultController.createCapaResult(createCapaResultParams, route, false, router)
  corrective.value = ''
  preventive.value = ''
  emit('close')
}
</script>
<template>
  <div class="capa-container">
    <div class="capa-header-container">
      <p class="capa-title">{{ $t('Expected Safety Measures') }}</p>
    </div>
    <div class="capa-content-container">
      <p class="capa-content-title">
        {{ $t('Corrective And Preventive Actions') }} <span>{{ $t('(CAPA)') }}</span>
      </p>
      <img :src="CapaArrows" alt="" aria-hidden="true" />
      <div class="capa-actions-container">
        <div class="capa-action" v-if="!data?.corrective">
          <span class="capa-action-title">{{ $t('Corrective') }} </span>
          <Editor
            @load="localizeEditorChrome"
            :key="$i18n.locale"
            data-localized-editor
            v-model="corrective"
            editorStyle="height: 320px"
            :placeholder="$t('enter What action should have been taken immediately')"
            ><template #toolbar><EditorToolbar /></template
          ></Editor>
          <button @click.prevent="CreatCapaResult" class="corrective-button">
            {{ $t('submit') }}
          </button>
        </div>

        <div class="capa-action" v-else>
          <span class="capa-action-title">{{ $t('Corrective') }} </span>
          <p v-html="data?.corrective" class="corrective-text corrective-textarea"></p>
        </div>

        <div class="capa-action preventive" v-if="!data?.preventive">
          <span class="capa-action-title">{{ $t('Preventive') }} </span>
          <Editor
            @load="localizeEditorChrome"
            :key="$i18n.locale"
            data-localized-editor
            v-model="preventive"
            editorStyle="height: 320px"
            :placeholder="$t('enter What action should have been taken immediately')"
            style="max-width: 100% !important"
            ><template #toolbar><EditorToolbar /></template
          ></Editor>
          <button @click.prevent="CreatCapaResult" class="corrective-button">
            {{ $t('submit') }}
          </button>
        </div>

        <div class="capa-action preventive" v-else>
          <span class="capa-action-title">{{ $t('Preventive') }} </span>
          <p v-html="data?.preventive" class="corrective-text corrective-textarea"></p>
        </div>
      </div>
    </div>
  </div>
</template>
