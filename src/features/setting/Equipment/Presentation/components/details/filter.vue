<script setup lang="ts">
import ExcelIcons from '@/shared/icons/ExcelIcons.vue';
import PdfIcons from '@/shared/icons/pdfIcons.vue';
import Search from '@/shared/icons/Search.vue';

</script>

<template>
  <div class="filter">
      <div class="input-search">
        <span class="icon-remove">
          <Search />
        </span>
        <input v-model="word" :placeholder="'search'" class="input" type="text" />
      </div>
      <button class="xls btn">
        <ExcelIcons />
        <span>{{ $t('Export Excel') }}</span>
      </button>
      <button class="pdf btn">
        <PdfIcons />
        <span>{{ $t('Export PDF') }}</span>
      </button>
    </div>
</template>

