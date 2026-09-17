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

const UpdateData = () => {
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
      <div
        class="actions-selections"
        role="radiogroup"
        :aria-label="$t('Immediate Action Effectiveness')"
      >
        <label
          class="input-wrapper select-type action-choice not-effective"
          :class="{ active: ActionRate === 1 }"
          for="wrong"
        >
          <input
            @change="UpdateData"
            type="radio"
            :value="1"
            v-model="ActionRate"
            name="rate"
            id="wrong"
            class="action-choice-input"
          />

          <span class="action-choice-copy">
            <span class="action-choice-heading">
              <span class="action-choice-title">{{ $t('Not Effective') }}</span>
              <FieldHelpIcon
                text="Choose this when the immediate action did not adequately control or remove the risk."
              />
            </span>
            <span class="action-choice-description">
              {{ $t('The risk was not adequately controlled') }}
            </span>
          </span>

          <span class="action-choice-visual">
            <img :src="wrongAction" alt="" />
            <span class="action-radio-indicator" aria-hidden="true"><i></i></span>
          </span>
        </label>

        <label
          class="input-wrapper select-type action-choice effective"
          :class="{ active: ActionRate === 2 }"
          for="correct"
        >
          <input
            @change="UpdateData"
            type="radio"
            :value="2"
            v-model="ActionRate"
            name="rate"
            id="correct"
            class="action-choice-input"
          />

          <span class="action-choice-copy">
            <span class="action-choice-heading">
              <span class="action-choice-title">{{ $t('Effective') }}</span>
              <FieldHelpIcon
                text="Choose this when the immediate action successfully controlled the risk or made the situation safe."
              />
            </span>
            <span class="action-choice-description">
              {{ $t('The risk was successfully controlled') }}
            </span>
          </span>

          <span class="action-choice-visual">
            <img :src="conrrectAction" alt="" />
            <span class="action-radio-indicator" aria-hidden="true"><i></i></span>
          </span>
        </label>
      </div>

      <div class="input-wrapper action-notes">
        <div class="action-notes-header">
          <label for="notes">{{ $t('notes') }}</label>
          <FieldHelpIcon
            text="Explain why the immediate action was effective or ineffective and note any remaining concerns."
          />
        </div>
        <textarea
          id="notes"
          class="input"
          :placeholder="$t('add your notes on the taken action')"
          v-model="notes"
          @input="UpdateData"
        ></textarea>
      </div>
    </div>
  </div>
</template>
