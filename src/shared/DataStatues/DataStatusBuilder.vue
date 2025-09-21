<script lang="ts" setup>
import {
  DataDump,
  DataEmpty,
  DataFailed,
  DataInitial,
  DataLoading,
  type DataState,
  DataSuccess,
  DataValid,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import { computed } from 'vue'
import DataFailedState from './DataFailed.vue'

const props = defineProps({
  status: {
    type: Object as () => DataState<any>,
    default: {},
  },
  controller: {
    type: Object as () => DataState<any>,
    default: DataInitial<any>,
  },
})

const currentState = computed(() => props.controller)
</script>

<template>
  <div v-if="currentState instanceof DataSuccess || currentState instanceof DataDump" >
    <div v-if="$slots.success">
      <slot name="success" />
    </div>
    <div v-else></div>
  </div>
  <div v-else-if="currentState instanceof DataValid">
    <div v-if="$slots.valid">
      <slot name="valid" />
    </div>
    <div v-else></div>
  </div>
  <div v-else-if="currentState instanceof DataEmpty">
    <div v-if="$slots.empty">
      <slot name="empty" />
    </div>
    <div v-else>empty</div>
  </div>
  <div v-else-if="currentState instanceof DataInitial" class="w-full">
    <div v-if="$slots.initial">
      <slot name="initial" />
    </div>
    <div v-else></div>
  </div>
  <div v-else-if="currentState instanceof DataFailed">
    <div v-if="$slots.failed">
      <slot name="failed" />
    </div>
    <div v-else>
      <div class="text-center">
        <!-- <p class="text-danger">{{ $t('error') }}</p> -->
        <DataFailedState />
      </div>
    </div>
  </div>
  <div v-else-if="currentState instanceof DataLoading">
    <div v-if="$slots.loader">
      <slot name="loader" />
    </div>
    <div v-else>loader</div>
  </div>
</template>

<style scoped></style>
