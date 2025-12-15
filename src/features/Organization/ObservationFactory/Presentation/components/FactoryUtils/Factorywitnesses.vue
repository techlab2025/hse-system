<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import { computed, ref } from 'vue'
import WitnessesTimeLine from './WitnessesTimeLine.vue'
import people from '@/assets/images/people.png'
import RadioButton from 'primevue/radiobutton'

const emit = defineEmits(['update:data'])

const isAnotherMeeting = ref(1)
const updateData = () => {
  emit('update:data', {
    AllWitnessesData: AllWitnessesData.value,
    preventive_action: preventive_action.value,
    takeAction:takeAction.value,
    solved:solved.value,
  })
}

const AllWitnessesData = ref()
const UpdateWitnessesData = (data: any) => {
  AllWitnessesData.value = data
  updateData()
}
const preventive_action = ref<string>()
const takeAction = ref<'yes' | 'no' | null>()
const showSolvedAndDescription = computed(() => takeAction.value === 'yes')
const solved = ref<'yes' | 'no' | null>()

</script>
<template>
  <div class="another-meeting">
    <div class="another-meeting-header">
      <HeaderPage
        :title="`Are there witnesses?`"
        :subtitle="`Were there any witnesses present at this incident?`"
        :img="people"
        class="title-header"
      />
      <div class="meeting-status">
        <button
          class="meeting-status-yes"
          @click.prevent="isAnotherMeeting = 1"
          :class="isAnotherMeeting == 1 ? 'active' : ''"
        >
          Yes
        </button>
        <button
          class="meeting-status-on"
          @click.prevent="isAnotherMeeting = 0"
          :class="isAnotherMeeting == 0 ? 'active' : ''"
        >
          No
        </button>
      </div>
    </div>

    <div class="another-meeting-contect" v-if="isAnotherMeeting == 1">
      <WitnessesTimeLine @update:data="UpdateWitnessesData" />
      <div class="hazard-type-container incedant col-span-6 md:col-span-6">
        <div class="input-wrapper radio-container incedant col-span-6 md:col-span-6">
          <div class="col-span-12 md:col-span-6">
            <label class="radio-title">{{ $t('take action') }}</label>
            <div class="radio-answers flex">
              <div class="radio-selection" :class="{ selected: takeAction === 'yes' }">
                <RadioButton v-model="takeAction" name="takeAction" value="yes" @update:model-value="updateData" />
                <label>Yes</label>
              </div>

              <div class="radio-selection" :class="{ selected: takeAction === 'no' }">
                <RadioButton v-model="takeAction" name="takeAction" value="no" @update:model-value="updateData" />
                <label>No</label>
              </div>
            </div>
          </div>

          <div class="col-span-12 md:col-span-6" v-show="showSolvedAndDescription">
            <label class="radio-title">{{ $t('solved') }}</label>
            <div class="radio-answers flex">
              <div class="radio-selection" :class="{ selected: solved === 'yes' }">
                <RadioButton v-model="solved" name="solved" value="yes"  @update:model-value="updateData"/>
                <label>Yes</label>
              </div>

              <div class="radio-selection" :class="{ selected: solved === 'no' }">
                <RadioButton v-model="solved" name="solved" value="no" @update:model-value="updateData" />
                <label>No</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="input-wrapper col-span-6 md:col-span-6">
        <label for="action">{{ $t('preventive_action') }}</label>
        <textarea
          id="action"
          class="input"
          v-model="preventive_action"
          @input="updateData"
          placeholder="add your descripe"
        ></textarea>
      </div>
    </div>
  </div>
</template>
