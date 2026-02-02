<script setup lang="ts">
import InvestegationResultDetailsModel from '@/features/Organization/Investigating/Data/models/investigationResult/InvestegationResulDetailsModel';
import { InvestegationStatusEnum } from '@/features/Organization/Investigating/Core/Enums/InvestegationStatusEnum';
import InvestegationIcon from '@/shared/icons/InvestegationIcon.vue';

const props = defineProps<{
  data: InvestegationResultDetailsModel
}>()
</script>
<template>
  <router-link :to="`/organization/investigating/add?id=${props.data?.id}`" class="investigation-container-new"
    >
    <div class="flex items-center gap-2">
      <InvestegationIcon />
      <p class="investegation-title">{{ $t('investegation') }}</p>
    </div>
    <p class="investegation-status">{{ $t('new') }}</p>
  </router-link>
</template>
