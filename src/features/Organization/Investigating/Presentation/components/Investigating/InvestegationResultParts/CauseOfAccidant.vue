<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import factor from '@/assets/images/factor.png'
import FactorInvestigating from '../FactorInvestigating.vue'
import { ref } from 'vue'

const descripe = ref<string>('')

const emit = defineEmits(['update:data'])

const UpdateData = (data) => {
  emit('update:data', {
    description: descripe.value,
  })
}
</script>
<template>
  <div class="cause-of-accidant">
    <HeaderPage
      :title="`Causes of the accident`"
      :subtitle="`Choose the reasons for the incident and write how to prevent it from happening again`"
      :img="factor"
      class="title-header"
    />

    <div class="cause-of-accidant-content">
      <FactorInvestigating />

      <div class="input-wrapper">
        <label for="corrective_action">{{ $t('corrective_action') }}</label>
        <textarea
          id="corrective_action"
          class="input"
          placeholder="add your descripe"
          v-model="descripe"
          @input="UpdateData"
        ></textarea>
      </div>
    </div>
  </div>
</template>
