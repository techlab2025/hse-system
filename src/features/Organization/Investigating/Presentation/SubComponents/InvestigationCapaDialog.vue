<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { computed, ref } from 'vue'
import CapaParams from '@/features/Organization/ObservationFactory/Core/params/CapaParam'
import CapaArrows from '@/assets/images/CapaArrows.png'
import Editor from 'primevue/editor'
import { useRoute, useRouter } from 'vue-router'
import CreateCapaResultController from '@/features/Organization/ObservationFactory/Presentation/controllers/CreateCapaResultController'
const props = defineProps<{
  observationId: number
  visible: boolean
}>()
const route = useRoute()
const corrective = ref('')
const preventive = ref('')
const emit = defineEmits(['close', 'update:visible'])
const router = useRouter()
const CreatCapaResult = async () => {
  const createCapaResultController = CreateCapaResultController.getInstance()
  const createCapaResultParams = new CapaParams(
    preventive.value,
    corrective.value,
    String(props?.observationId),
  )
  await createCapaResultController.createCapaResult(createCapaResultParams, route, false, router)
  corrective.value = ''
  preventive.value = ''
  emit('close')
}

const DialogVisable = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  },
})
</script>

<template>
  <Dialog v-model:visible="DialogVisable" modal :style="{ width: '50rem' }">
    <div class="show-observation-container">
      <div class="capa-container">
        <div class="capa-header-container">
          <p class="capa-title">{{ $t('Expected Safety Measures') }}</p>
        </div>
        <div class="capa-content-container">
          <p class="capa-content-title">
            {{ $t('Corrective And Preventive Actions') }} <span>(CAPA)</span>
          </p>
          <img :src="CapaArrows" alt="capa_arrows" />
          <div class="capa-actions-container">
            <div class="capa-action">
              <span class="capa-action-title">{{ $t('Corrective') }} </span>
              <Editor
                v-model="corrective"
                editorStyle="height: 320px"
                :placeholder="'enter What action should have been taken immediately'"
              />
              <button @click.prevent="CreatCapaResult" class="corrective-button">
                {{ $t('submit') }}
              </button>
            </div>

            <div class="capa-action preventive">
              <span class="capa-action-title">{{ $t('Preventive') }} </span>
              <Editor
                v-model="preventive"
                editorStyle="height: 320px"
                :placeholder="'enter What action should have been taken immediately'"
                style="max-width: 100% !important"
              />
              <button @click.prevent="CreatCapaResult" class="corrective-button">
                {{ $t('submit') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>
