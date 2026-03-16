<script setup lang="ts">
import AddSystemHeaderData from '@/shared/icons/AddSystemHeaderData.vue';

</script>

<template>
  <button class="system-data-add col-span-3">
    <AddSystemHeaderData class="icon" />
    <div class="system-data-content">
      <h2>Add Items from the System</h2>
      <p>Click here to open the list and select items directly from the system.</p>
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
  background-color: #F5F5F5;
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
      color: #202020;
      font-weight: 700;
      font-size: 14px;
      font-family: "Regular";

    }

    p {
      width: 100%;
      color: gray;
      text-align: start;
      color: #3D4C5E;
      font-size: 500;
      font-size: 12px;

    }
  }

}
</style>
