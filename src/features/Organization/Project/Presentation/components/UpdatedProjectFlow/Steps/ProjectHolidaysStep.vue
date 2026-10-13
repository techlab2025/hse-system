<script setup lang="ts">
import { vProjectPanels } from '../../../composables/projectPanels'

import DatePicker from 'primevue/datepicker'
import { HolidayDaysEnum } from '../../../../Core/Enums/UpdatedProjectFlow/HolidayDaysEnum'
import type { ProjectHolidaysForm } from '../../../../Core/params/UpdatedProjectFlow/ProjectHolidaysFormParams'

const holidays = defineModel<ProjectHolidaysForm>('holidays', { required: true })

const dayOptions = [
  ['Sunday', HolidayDaysEnum.SUNDAY],
  ['Monday', HolidayDaysEnum.MONDAY],
  ['Tuesday', HolidayDaysEnum.TUESDAY],
  ['Wednesday', HolidayDaysEnum.WEDNESDAY],
  ['Thursday', HolidayDaysEnum.THURSDAY],
  ['Friday', HolidayDaysEnum.FRIDAY],
  ['Saturday', HolidayDaysEnum.SATURDAY],
] as const

const addCustomHoliday = () => holidays.value.custom.push({ holiday_title: '', holidays_dates: [] })
</script>

<template>
  <div data-hse-project v-project-panels class="hse-project-root form-grid">
    <div class="section-title full">
      <span>02</span>
      <div>
        <h2>Project holidays</h2>
        <p>Select weekly days off and add exceptional dates.</p>
      </div>
    </div>
    <div class="full weekday-grid">
      <label v-for="day in dayOptions" :key="day[1]" class="hse-project-field-label day-pill">
        <input v-model="holidays.basicDays" type="checkbox" :value="day[1]" />
        <span>{{ day[0].slice(0, 3) }}</span>
      </label>
    </div>
    <label class="hse-project-field-label switch-row full">
      <input v-model="holidays.hasCustom" type="checkbox" />
      <span>
        <strong>Custom holidays</strong>
        <small>Add named holidays with one or more dates.</small>
      </span>
    </label>
    <template v-if="holidays.hasCustom">
      <div v-for="(holiday, index) in holidays.custom" :key="index" class="repeat-card full">
        <label class="hse-project-field-label"
          >Holiday name<input class="hse-project-input" v-model="holiday.holiday_title"
        /></label>
        <label class="hse-project-field-label">
          Holiday dates
          <DatePicker
            panel-class="hse-project-overlay"
            v-model="holiday.holidays_dates"
            selection-mode="multiple"
            date-format="yy-mm-dd"
            show-icon
            fluid
            placeholder="Select one or more dates"
          />
        </label>
        <button
          :aria-label="$t('delete')"
          type="button"
          class="hse-project-button--icon hse-project-button hse-project-button--danger icon-button danger"
          @click="holidays.custom.splice(index, 1)"
        >
          ×
        </button>
      </div>
      <button type="button" class="add-row full" @click="addCustomHoliday">
        + Add custom holiday
      </button>
    </template>
  </div>
</template>

<style scoped src="../ProjectFlowStepStyles.css"></style>
