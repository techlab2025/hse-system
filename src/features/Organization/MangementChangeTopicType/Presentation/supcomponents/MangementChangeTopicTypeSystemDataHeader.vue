<script setup lang="ts">
import AddSystemHeaderData from '@/shared/icons/AddSystemHeaderData.vue';

</script>

<template>
  <button class="system-data-add col-span-3">
    <AddSystemHeaderData class="icon" />
    <div class="system-data-content">
      <h2>{{ $t('add_system_ppe_items') }}</h2>
      <p>{{ $t('select_system_ppe_items') }}</p>
    </div>
  </button>
</template>

<style scoped>
.system-data-add {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  width: 100%;
  background-color: var(--surface-1);
  padding: 10px;
  margin-top: 12px;
  border-radius: 12px;
  font-size: "Regular";

  .icon {
    width: 24px;
    height: 24px;

    svg {
      width: 120px;
      height: 120px;
    }
  }

  .system-data-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    h2 {
      text-align: start;
      width: 100%;
      color: var(--text-strong);
      font-weight: 700;
      font-size: 14px;
      font-family: "Regular";

    }

    p {
      width: 100%;
      color: var(--text-muted);
      text-align: start;
      color: var(--brand-primary-700);
      font-size: 500;
      font-size: 12px;

    }
  }

}
</style>
