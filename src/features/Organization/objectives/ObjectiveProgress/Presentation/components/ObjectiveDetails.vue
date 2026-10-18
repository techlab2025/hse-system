<script setup lang="ts">
import { computed } from 'vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import { useObjectiveProgress } from '../composables/useObjectiveProgress'
import ObjectiveInformation from './ObjectiveInformation.vue'
import ObjectiveProgressHistory from './ObjectiveProgressHistory.vue'
import ObjectiveProgressIndicator from './ObjectiveProgressIndicator.vue'
import { latestProgress } from '../../Data/models/objectiveProgressHistoryModel'
import { actualUnit, generatePeriods } from '../../Core/utils/objectiveProgress'
import { objectiveProgressContract } from '../../Data/apiServices/objectiveProgressContract'
import { useI18n } from 'vue-i18n'
import '../styles/objective-progress.css'
const { locale } = useI18n()
const { objective, loading, error, history, records, canUpdate, load, loadHistory } =
  useObjectiveProgress()
const latest = computed(() => latestProgress(records.value))
const latestPeriod = computed(() =>
  objective.value && latest.value
    ? (generatePeriods(
        objective.value,
        locale.value,
        new Date(),
        objectiveProgressContract.reportingFrequency,
      ).find((p) => p.value === latest.value?.period)?.label ?? latest.value.period)
    : '—',
)
</script>
<template>
  <main class="op-page">
    <header class="op-header">
      <div>
        <p class="op-eyebrow">{{ $t('Objectives') }}</p>
        <h1>{{ $t('op.details') }}</h1>
        <p v-if="objective" class="op-objective-title">
          {{ objective.objective }}
        </p>
      </div>
      <div class="op-actions">
        <RouterLink class="op-button" :to="{ name: 'Objectives' }">{{ $t('op.back') }}</RouterLink
        ><RouterLink
          v-if="objective && canUpdate"
          class="op-button op-primary"
          :to="{
            name: 'organization-objectives-update-progress',
            params: { objectiveId: objective.id },
          }"
          >{{ $t('op.update') }}</RouterLink
        >
      </div>
    </header>
    <TableLoader v-if="loading" :cols="3" :rows="4" />
    <div v-else-if="error" class="op-card" role="alert">
      <p>{{ $t(error) }}</p>
      <button v-if="error === 'op.loadFailed'" class="op-button" type="button" @click="load">
        {{ $t('op.retry') }}
      </button>
    </div>
    <template v-else-if="objective">
      <section class="op-card">
        <h2>{{ $t('op.information') }}</h2>
        <ObjectiveInformation :objective="objective" />
      </section>
      <section class="op-performance">
        <div class="op-card">
          <h2>{{ $t('op.latestActual') }}</h2>
          <strong class="op-metric"
            >{{ latest?.actualResult ?? '—' }}
            <small>{{ latest?.actualResult != null ? actualUnit(objective) : '' }}</small></strong
          >
        </div>
        <!-- <div class="op-card">
          <h2>{{ $t('op.indicator') }}</h2>
          <ObjectiveProgressIndicator
            :objective="objective"
            :actual="latest?.actualResult ?? null"
            :backend-indicator="latest?.indicator"
          />
        </div> -->
        <div class="op-card">
          <h2>{{ $t('op.latestPeriod') }}</h2>
          <strong>{{ latestPeriod }}</strong>
        </div>
      </section>
      <ObjectiveProgressHistory
        :objective="objective"
        :state="history"
        :can-update="canUpdate"
        @retry="loadHistory"
      />
    </template>
  </main>
</template>
