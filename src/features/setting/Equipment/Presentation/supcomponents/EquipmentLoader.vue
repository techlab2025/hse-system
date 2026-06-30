<template>
  <div class="equipment-cards-grid equipment-loader-grid grid grid-cols-1 xl:grid-cols-2 gap-4">
    <div class="tool-card equipment-card equipment-skeleton-card w-full" v-for="item in 4" :key="item">
      <div class="tool-card-header w-full">
        <div class="tool-card-media">
          <div class="skeleton-block skeleton-img"></div>
          <div class="skeleton-block skeleton-status"></div>
        </div>

        <div class="tool-card-header-text w-full">
          <div class="flex gap-2 w-full items-center justify-between card-type">
            <div class="flex items-center gap-2 min-w-0">
              <div class="skeleton-block skeleton-pill"></div>
              <div class="skeleton-block skeleton-text-short"></div>
            </div>
            <div class="skeleton-block skeleton-circle"></div>
          </div>

          <div class="skeleton-block skeleton-title"></div>

          <div class="equipment-meta">
            <div class="meta-item" v-for="meta in 3" :key="meta">
              <div class="skeleton-block skeleton-label"></div>
              <div class="skeleton-block skeleton-value"></div>
            </div>
          </div>

          <div class="skeleton-block skeleton-rent"></div>

          <div class="equipment-project-info">
            <div class="skeleton-block skeleton-icon-square"></div>
            <div class="project-data">
              <div class="skeleton-block skeleton-text-medium"></div>
              <div class="skeleton-block skeleton-text-short"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.equipment-skeleton-card {
  pointer-events: none;
}

@keyframes equipment-shimmer {
  0% {
    background-position: 180% 0;
  }

  100% {
    background-position: -180% 0;
  }
}

.skeleton-block {
  display: block;
  border-radius: 10px;
  background: linear-gradient(90deg, #eef2f7 25%, #f8fafc 50%, #eef2f7 75%);
  background-size: 220% 100%;
  animation: equipment-shimmer 1.2s linear infinite;
}

.skeleton-img {
  width: 100px;
  height: 118px;
  max-height: 118px;
  border-radius: 16px;
}

.skeleton-status {
  width: 62px;
  height: 24px;
  border-radius: 999px;
}

.skeleton-pill {
  width: 84px;
  height: 18px;
  border-radius: 999px;
}

.skeleton-text-short {
  width: 96px;
  height: 14px;
}

.skeleton-text-medium {
  width: 150px;
  height: 15px;
}

.skeleton-title {
  width: min(260px, 75%);
  height: 22px;
}

.skeleton-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex: 0 0 auto;
}

.skeleton-label {
  width: 62px;
  height: 10px;
  margin-bottom: 8px;
}

.skeleton-value {
  width: 88px;
  height: 14px;
}

.skeleton-rent {
  width: min(260px, 70%);
  height: 30px;
  border-radius: 999px;
}

.skeleton-icon-square {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  flex: 0 0 auto;
}

@media (max-width: 640px) {
  .skeleton-img {
    width: 100%;
    height: 150px;
    max-height: 150px;
  }

  .skeleton-title,
  .skeleton-rent {
    width: 100%;
  }
}
</style>
