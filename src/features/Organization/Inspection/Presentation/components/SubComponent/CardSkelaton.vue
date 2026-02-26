<template>
  <div class="skeleton-card">
    <div class="index-table-card-container">
      <div class="index-table-card skeleton-item" v-for="i in 3" :key="i">

        <!-- card-header-container -->
        <div class="card-header-container show">
          <div class="header-container">

            <!-- card-content (left side) -->
            <div class="card-content">
              <!-- card-header: Serial + Date -->
              <div class="card-header">
                <div class="sk sk-label-primary"></div>
                <div class="sk sk-label-secondary"></div>
              </div>

              <!-- card-details -->
              <div class="card-details">
                <!-- title (observer name) -->
                <div class="sk sk-title"></div>
                <!-- subtitle (title) -->
                <div class="sk sk-subtitle"></div>
                <!-- subtitle (description) -->
                <div class="sk sk-subtitle sk-subtitle--short"></div>
                <!-- project-details: Zone + Machine -->
                <div class="project-details">
                  <div class="sk sk-label-primary"></div>
                  <div class="sk sk-label-primary sk-label-primary--short"></div>
                </div>
              </div>
            </div>

            <!-- card-info (right side: image) -->
            <div class="card-info">
              <div class="sk sk-image"></div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* ── Shimmer keyframe ── */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

$shimmer-base: #ebebeb;
$shimmer-highlight: #f5f5f5;

@mixin shimmer {
  background: linear-gradient(90deg,
      $shimmer-base 25%,
      $shimmer-highlight 50%,
      $shimmer-base 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 4px;
}

/* ── Reuse the real card container/card classes for layout fidelity ── */
.skeleton-card {
  margin-block: 14px;
  width: 100%;
}

/* index-table-card-container lives in global SCSS, but we redeclare
   the minimum needed here so the skeleton is self-contained */
.index-table-card-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.index-table-card {
  border: 1px solid #f6f6f6;
  padding: 12px;
  border-radius: 20px;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.card-header-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-bottom: 12px;
  border-bottom: 2px dashed #e1e4ed;
  width: 100%;
  gap: 10px;

  &.show {
    border-bottom: none;
  }
}

.header-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 8px;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.card-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-details {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.card-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  flex-shrink: 0;
}

/* ── Skeleton placeholder elements ── */
.sk {
  @include shimmer;
}

/* label-item-primary row chip */
.sk-label-primary {
  width: 110px;
  height: 12px;

  &--short {
    width: 80px;
  }
}

/* label-item-secondary row chip */
.sk-label-secondary {
  width: 140px;
  height: 12px;
}

/* observer name title */
.sk-title {
  width: 55%;
  height: 18px;
}

/* subtitle lines */
.sk-subtitle {
  width: 75%;
  height: 12px;

  &--short {
    width: 55%;
  }
}

/* image thumbnail — mirrors the clamp() sizing in the real SCSS */
.sk-image {
  width: clamp(calc(90 * 0.8px), calc(90 * 100vw / 1440), calc(90 * 1.2px));
  height: clamp(calc(65 * 0.8px), calc(65 * 100vw / 1440), calc(65 * 1.2px));
  border-radius: 12px;
  aspect-ratio: 16 / 9;
}
</style>
