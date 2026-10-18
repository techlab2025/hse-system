<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type ObjectivesDetailsModel from '../../../Data/models/objectivesDetailsModel'
import {
  getObjectiveTargetTypeTitle,
  getObjectiveDirectionTitle,
  getObjectiveFrequencyTitle,
  ObjectiveTargetTypeEnum,
} from '../../../Core/enums/objectivesEnums'
import { targetValue } from '../../Core/utils/objectiveProgress'
const props = defineProps<{ objective: ObjectivesDetailsModel }>()
const { t } = useI18n()
const fields = computed(() => {
  const o = props.objective
  const values: [string, string | number | null | undefined][] = [
    // ['op.number', o.id],
    ['op.year', o.year],
    ['op.project', o.project?.title || t('Company-wide')],
    ['op.targetType', t(getObjectiveTargetTypeTitle(o.targetType))],
    ['op.target', targetValue(o)],
    ['op.department', o.department?.title],
    ['op.followUp', o.followUpEmployee?.title],
    ['progress', o.progress + '%' || 0],
  ]
  if (o.targetType === ObjectiveTargetTypeEnum.PeriodicFrequency)
    values.push(
      ['op.frequency', t(getObjectiveFrequencyTitle(o.frequency))],
      ['op.annualOccurrences', o.annualOccurrences ?? o.frequency],
    )
  else values.push(['op.direction', o.direction ? t(getObjectiveDirectionTitle(o.direction)) : '—'])
  if (o.baseline != null) values.push(['op.baseline', o.baseline])
  if (o.unit) values.push(['op.unit', o.unit])
  return values
})
</script>
<template>
  <dl class="op-facts">
    <div v-for="[label, value] in fields" :key="label">
      <dt>{{ $t(label) }}</dt>
      <dd>{{ value ?? '—' }}</dd>
    </div>
  </dl>
</template>
