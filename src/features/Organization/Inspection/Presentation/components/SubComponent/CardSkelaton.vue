<template>
  <div class="skeleton-card">
    <div class="skeleton-item" v-for="i in 3" :key="i">
      <div class="skeleton-header">
        <div class="skeleton-text title-pulse"></div>
        <div class="skeleton-text date-pulse"></div>
      </div>

      <div class="skeleton-info-row">
        <div class="skeleton-box"></div>
        <div class="skeleton-arrow"></div>
        <div class="skeleton-box"></div>
        <div class="skeleton-duration"></div>
      </div>

      <div class="skeleton-tool-box"></div>

      <div class="skeleton-button"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-item {
  padding: 16px;
  border: 1px solid #eef3fe;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
  position: relative;
}

.skeleton-text {
  height: 12px;
  background: #f0f0f0;
  border-radius: 4px;
}

.title-pulse { width: 40%; height: 18px; margin-bottom: 8px; }
.date-pulse { width: 20%; height: 12px; margin-left: auto; }

.skeleton-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed #efefef;
  padding-bottom: 12px;
  margin-bottom: 12px;
}

.skeleton-info-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.skeleton-box { flex: 1; height: 40px; background: #f8f9fa; border-radius: 6px; }
.skeleton-arrow { width: 30px; height: 10px; background: #f0f0f0; }
.skeleton-duration { flex: 1; height: 40px; background: #f8f9fa; border-radius: 6px; }

.skeleton-tool-box {
  width: 100%;
  height: 80px;
  background: #fcfcfd;
  border-radius: 8px;
  margin-bottom: 12px;
}

.skeleton-button {
  width: 100%;
  height: 45px;
  background: #1f41bb0d;
  border-radius: 8px;
}

/* Shimmer Animation */
.skeleton-item > div, .skeleton-box, .skeleton-text, .skeleton-button {
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
