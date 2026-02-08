<template>
  <div class="tool-card skeleton-card w-full">
    <div class="tool-card-header w-full">
      <div class="skeleton-img"></div>

      <div class="tool-card-header-text w-full">
        <div class="flex gap-2 w-full items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="skeleton-pill"></div>
            <div class="skeleton-text-short"></div>
          </div>
          <div class="skeleton-circle"></div>
        </div>

        <div class="skeleton-text-long mt-3"></div>

        <div class="equipment-project-info mt-4">
          <div class="skeleton-icon-square"></div>
          <div class="project-data">
            <div class="skeleton-text-medium mb-2"></div>
            <div class="skeleton-text-short"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton-card {
  border: 1px solid #f1f5f9;
  pointer-events: none;
}

// Keyframe for the shimmer effect
@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.skeleton-img,
.skeleton-pill,
.skeleton-text-short,
.skeleton-text-medium,
.skeleton-text-long,
.skeleton-circle,
.skeleton-icon-square {
  background: #f6f7f8;
  background-image: linear-gradient(90deg,
      #f6f7f8 0%,
      #edeef1 20%,
      #f6f7f8 40%,
      #f6f7f8 100%);
  background-repeat: no-repeat;
  background-size: 800px 100%;
  display: inline-block;
  position: relative;
  animation: shimmer 1.2s infinite linear;
  border-radius: 4px;
}

.skeleton-img {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  flex-shrink: 0;
}

.skeleton-pill {
  width: 60px;
  height: 20px;
  border-radius: 20px;
}

.skeleton-text-short {
  width: 80px;
  height: 14px;
}

.skeleton-text-medium {
  width: 140px;
  height: 16px;
}

.skeleton-text-long {
  width: 200px;
  height: 20px;
}

.skeleton-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.skeleton-icon-square {
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.mt-3 {
  margin-top: 0.75rem;
}

.mt-4 {
  margin-top: 1rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}
</style>
