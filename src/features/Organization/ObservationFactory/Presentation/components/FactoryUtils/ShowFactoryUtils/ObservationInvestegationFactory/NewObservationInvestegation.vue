<script setup lang="ts">
import InvestegationResultDetailsModel from '@/features/Organization/Investigating/Data/models/investigationResult/InvestegationResulDetailsModel'
import InvestegationIcon from '@/shared/icons/InvestegationIcon.vue'

const props = defineProps<{
  data: InvestegationResultDetailsModel
}>()
</script>
<template>
  <router-link
    :to="`/organization/investigating/add?id=${props.data?.id}`"
    class="investigation-container-new"
  >
    <div class="investigation-start-content flex items-center gap-2">
      <InvestegationIcon />
      <div>
        <p class="investegation-title">{{ $t('investegation') }}</p>
        <p class="investigation-hint">
          {{ $t('new_investigation_hint') }}
        </p>
      </div>
    </div>
    <p class="investegation-status">{{ $t('new') }}</p>
  </router-link>
</template>

<style scoped>
.investigation-start-content {
  min-width: 0;
}

.investigation-hint {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.5;
}
</style>
