<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import DatePicker from 'primevue/datepicker'
import FilterWithProject from './FilterWithProject.vue'
import ProjectCustomLocationController from '@/features/Organization/Project/Presentation/controllers/ProjectCustomLocationController'
import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams'
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum'

const visible = ref(false)
const date = ref(null)

const params = new ProjectCustomLocationParams(37, [ProjectCustomLocationEnum.ZOON], [])
const controller = ProjectCustomLocationController.getInstance()
</script>

<template>
  <div class="card flex justify-center">
    <button class="btn btn-filter" @click="visible = true">
      <span>{{ $t('Filter') }}</span>
      <!-- Add your icon here -->
    </button>

    <Dialog
      v-model:visible="visible"
      modal
      dismissableMask
      :header="$t('Filter')"
      :style="{ width: '45vw' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <div class="flex flex-col gap-3 input-wrapper">
        <label for="date">{{ $t('date') }}</label>
        <DatePicker v-model="date" id="date" :placeholder="$t('today')" />
      </div>

      <div class="h-1 !my-3 w-full bg-slate-100 rounded-lg"></div>

      <FilterWithProject
        :filterTitle="$t('project')"
        :controllerData="controller"
        :pramsData="params"
        @update:data="(selected) => console.log('Selected Filter:', selected)"
      />

      <!-- You can duplicate FilterWithProject if needed, just pass different params -->
    </Dialog>
  </div>
</template>
