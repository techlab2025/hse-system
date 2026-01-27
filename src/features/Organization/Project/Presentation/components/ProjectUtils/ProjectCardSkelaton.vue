<template>
  <div class="project-card-container is-loading">
    <div class="project-card-header-container">
      <div class="project-card-header">
        <div class="project-header">
          <div class="skeleton-bar w-16 h-4"></div>
        </div>
        <div class="skeleton-bar w-3-4 h-6 mt-3"></div>
      </div>

      <div class="skeleton-bar w-24 h-4 mt-2"></div>
    </div>

    <div class="project-card-info">
      <div class="skeleton-bar w-20 h-4"></div>
      <div class="skeleton-bar w-20 h-4"></div>
    </div>

    <hr style="height:1px;width:100%;border-width:1px;color:#b7beca2c ;background-color:#F5F6F7">

    <div class="project-card-data">
      <div v-for="i in 5" :key="i" class="data-info">
        <div class="skeleton-bar w-20 h-3"></div>
        <div class="skeleton-bar w-8 h-4 rounded-full"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* The Base Skeleton Look */
.skeleton-bar {
  background-color: #e2e8f0;
  /* Light gray */
  border-radius: 4px;
  display: inline-block;
  position: relative;
  overflow: hidden;
}

/* Custom Width Helpers (if not using Tailwind) */
.w-16 {
  width: 4rem;
}

.w-20 {
  width: 5rem;
}

.w-24 {
  width: 6rem;
}

.w-3-4 {
  width: 75%;
}

.w-8 {
  width: 2rem;
}

.h-3 {
  height: 0.75rem;
}

.h-4 {
  height: 1rem;
}

.h-6 {
  height: 1.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-3 {
  margin-top: 0.75rem;
}

/* The Pulse Animation */
.is-loading .skeleton-bar {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
}

/* Keep your existing spacing layout */
.project-card-info {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.data-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
</style>
