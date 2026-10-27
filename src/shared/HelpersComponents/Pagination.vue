<script lang="ts" setup>
import { formatDisplayNumber } from '@/localization/formatters'
import type PaginationModel from '@/base/core/Models/pagination_model'
import IconArrowDown from '@/shared/icons/IconArrowDown.vue'

import Popover from 'primevue/popover'
import { computed, ref } from 'vue'

const emit = defineEmits(['changePage', 'countPerPage'])

const op = ref()
const toggle = (event: Event) => {
  op.value.toggle(event)
}
const props = defineProps<{
  pagination: PaginationModel | null
}>()

const numberOfPages = computed(() => {
  return Array.from({ length: props.pagination?.last! }, (_, i) => i + 1)
})
</script>

<template>
  <div v-if="pagination && pagination.last > 1" class="pagination-wrapper">
    <span class="show-results">
      {{
        $t('pagination_results', {
          from: formatDisplayNumber(pagination?.prev ?? 0),
          to: formatDisplayNumber(pagination?.next ?? 0),
          total: formatDisplayNumber(pagination?.total ?? 0),
        })
      }}
    </span>

    <nav class="pagination" :aria-label="$t('Pagination')">
      <button
        class="pagination-btn"
        type="button"
        :disabled="pagination.current! <= 1"
        @click="emit('changePage', pagination?.current! > 1 ? pagination?.current! - 1 : 1)"
      >
        {{ $t('previous') }}
      </button>
      <button
        type="button"
        v-for="item in numberOfPages.slice(
          pagination?.current! > 2 ? pagination?.current! - 2 : 0,
          pagination?.current! + 2,
        )"
        :key="item"
        :aria-current="item === pagination?.current ? 'page' : undefined"
        :class="['pagination-item', { active: item === pagination?.current }]"
        @click="emit('changePage', item)"
      >
        {{ formatDisplayNumber(item) }}
      </button>
      <button
        class="pagination-btn"
        type="button"
        :disabled="pagination.current! >= pagination.last!"
        @click="
          emit(
            'changePage',
            pagination?.current! < pagination?.last! ? pagination?.current! + 1 : pagination?.last!,
          )
        "
      >
        {{ $t('next') }}
      </button>
    </nav>

    <div class="count-per-page">
      <span>{{ $t('show') }}</span>
      <button class="pagination-btn" @click="toggle">
        {{ formatDisplayNumber(pagination?.count ?? 0) }} <span><IconArrowDown /></span>
      </button>
      <Popover ref="op">
        <div class="per-page">
          <span
            role="button"
            tabindex="0"
            @keydown.enter="emit('countPerPage', 10)"
            @keydown.space.prevent="emit('countPerPage', 10)"
            @click="emit('countPerPage', 10)"
            >{{ formatDisplayNumber(10) }}</span
          >
          <span
            role="button"
            tabindex="0"
            @keydown.enter="emit('countPerPage', 20)"
            @keydown.space.prevent="emit('countPerPage', 20)"
            @click="emit('countPerPage', 20)"
            >{{ formatDisplayNumber(20) }}</span
          >
          <span
            role="button"
            tabindex="0"
            @keydown.enter="emit('countPerPage', 30)"
            @keydown.space.prevent="emit('countPerPage', 30)"
            @click="emit('countPerPage', 30)"
            >{{ formatDisplayNumber(30) }}</span
          >
        </div>
      </Popover>
      <span>{{ $t('per_page') }}</span>
    </div>
  </div>
</template>

<style scoped></style>
