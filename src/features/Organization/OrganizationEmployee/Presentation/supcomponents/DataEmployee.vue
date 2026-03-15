<script setup lang="ts">
import AddSystemHeaderData from '@/shared/icons/AddSystemHeaderData.vue';
import Handemployee from '@/shared/icons/handemployee.vue';

</script>

<template>
  <button class="system-data-add col-span-3">
    <Handemployee class="icon" />
    <div class="system-data-content">
      <h2>Add Employee to the Hierarchy</h2>
      <p>Assign the employee to the UI team and define their role in the organizational structure.</p>
    </div>
  </button>
</template>

<style scoped>
.system-data-add {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 5px;
  width: 100%;
  background-color: #F7F9FC;
  padding: 16px;
  margin: 12px 0;
  border-radius: 12px;
  font-size: "Regular";

  .icon {
    width: 34px;
    height: 34px;

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
