<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import checkActions from '@/assets/images/checkActions.png'
import { ref } from 'vue'
import wrongAction from '@/assets/images/wrongAction.png'
import conrrectAction from '@/assets/images/conrrectAction.png'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'
const ActionRate = ref<number>(1)
const notes = ref<string>()

const emit = defineEmits(['update:data'])

const UpdateData = (data) => {
  emit('update:data', {
    notes: notes.value,
    actionRate: ActionRate.value,
  })
}
</script>
<template>
  <div class="rate-of-actions">
    <HeaderPage
      :title="`Immediate Action Effectiveness`"
      :subtitle="``"
      :img="checkActions"
      class="title-header"
    />

    <div class="rate-of-actions-content">
      <div class="actions-selections">
        <div class="input-wrapper select-type" :class="ActionRate == 1 ? 'active' : ''">
          <label for="wrong">
            <span>{{ $t('Not Effective') }}</span>
            <FieldHelpIcon
              text="Choose this when the immediate action did not adequately control or remove the risk."
            />
            <img :src="wrongAction" alt="wrong" />
          </label>
          <input
            @change="UpdateData"
            type="radio"
            :value="1"
            v-model="ActionRate"
            name="rate"
            id="wrong"
          />
        </div>
        <div class="input-wrapper select-type" :class="ActionRate == 2 ? 'active' : ''">
          <label for="correct">
            <span>{{ $t('Effective') }}</span>
            <FieldHelpIcon
              text="Choose this when the immediate action successfully controlled the risk or made the situation safe."
            />
            <img :src="conrrectAction" alt="correct" />
          </label>
          <input
            @change="UpdateData"
            type="radio"
            :value="2"
            v-model="ActionRate"
            name="rate"
            id="correct"
          />
        </div>
      </div>

      <div class="input-wrapper">
        <div class="flex items-center gap-2">
          <label for="notes">{{ $t('notes') }}</label>
          <FieldHelpIcon
            text="Explain why the immediate action was effective or ineffective and note any remaining concerns."
          />
        </div>
        <textarea
          id="notes"
          class="input"
          placeholder="add your notes on the taken action"
          v-model="notes"
          @input="UpdateData"
        ></textarea>
      </div>
    </div>
  </div>
</template>
