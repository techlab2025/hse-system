<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import checkActions from '@/assets/images/checkActions.png'
import { ref } from 'vue'
import wrongAction from '@/assets/images/wrongAction.png'
import conrrectAction from '@/assets/images/conrrectAction.png'
const ActionRate = ref<number>()
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
    <HeaderPage :title="`rate the taken action`" :subtitle="`add your rate and notes to the already taken action`"
      :img="checkActions" class="title-header" />

    <div class="rate-of-actions-content">
      <div class="actions-selections">
        <div class="input-wrapper select-type" :class="ActionRate == 1 ? 'active' : ''">
          <label for="wrong">
            <span>{{ $t('wrong_action') }}</span>
            <img :src="wrongAction" alt="wrong" />
          </label>
          <input @change="UpdateData" type="radio" :value="1" v-model="ActionRate" name="rate" id="wrong" />
        </div>
        <div class="input-wrapper select-type" :class="ActionRate == 2 ? 'active' : ''">
          <label for="correct">
            <span>{{ $t('correct_action') }}</span>
            <img :src="conrrectAction" alt="correct" />
          </label>
          <input @change="UpdateData" type="radio" :value="2" v-model="ActionRate" name="rate" id="correct" />
        </div>
      </div>

      <div class="input-wrapper">
        <label for="notes">{{ $t('notes') }}</label>
        <textarea id="notes" class="input" placeholder="add your notes on the taken action" v-model="notes"
          @input="UpdateData"></textarea>
      </div>
    </div>
  </div>
</template>
