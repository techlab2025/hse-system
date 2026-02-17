<script setup lang="ts">
import PagesHeader from '@/shared/HelpersComponents/PagesHeader.vue'
import AddSerialForm from './AddSerialForm.vue'
</script>

<template>
  <div>
    <PagesHeader :title="$t('Serial Number Management')" />
    <div>
      <AddSerialForm @update:data="$emit('update:data')" @close:dialog="$emit('close:dialog')" />
    </div>
  </div>
</template>
