<template>
  <div class="skeleton-wrapper">
    <div class="project-progress-header-container skeleton-header">
      <div class="project-progress-info">
        <div class="skeleton-circle"></div>
        <div class="project-progress-info-text">
          <div class="skeleton-line title-line"></div>
          <div class="skeleton-line desc-line"></div>
        </div>
      </div>
      <div class="skeleton-progress-circle"></div>
    </div>

    <div class="project-progress-body-container">
      <div class="project-progress-body-sidebar">
        <div v-for="i in 6" :key="i" class="skeleton-sidebar-item">
          <div class="skeleton-dot"></div>
          <div class="skeleton-text-group">
            <div class="skeleton-line sidebar-title"></div>
            <div class="skeleton-line sidebar-desc"></div>
          </div>
        </div>
      </div>

      <div class="project-progress-body-content">
        <div class="content-header">
          <div class="skeleton-line main-title"></div>
          <div class="skeleton-line main-desc"></div>
        </div>
        <div class="full-content skeleton-card">
          <div class="skeleton-line form-label"></div>
          <div class="skeleton-input"></div>
          <div class="skeleton-line form-label"></div>
          <div class="skeleton-input"></div>
          <div class="skeleton-button"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Shimmer Animation
@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.skeleton-line,
.skeleton-circle,
.skeleton-input,
.skeleton-button,
.skeleton-dot,
.skeleton-progress-circle {
  background: #f6f7f8;
  background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
  background-repeat: no-repeat;
  background-size: 800px 100%;
  display: inline-block;
  position: relative;
  animation: shimmer 1.5s infinite linear forwards;
  border-radius: 4px;
}

.skeleton-header {
  height: 100px;
  margin-bottom: 20px;
}

.skeleton-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.skeleton-progress-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.title-line {
  width: 150px;
  height: 20px;
}

.desc-line {
  width: 250px;
  height: 15px;
  margin-top: 8px;
}

.skeleton-sidebar-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;

  .skeleton-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: 5px;
  }

  .sidebar-title {
    width: 100px;
    height: 14px;
  }

  .sidebar-desc {
    width: 140px;
    height: 10px;
    margin-top: 8px;
  }
}

.main-title {
  width: 300px;
  height: 35px;
  margin-bottom: 15px;
}

.main-desc {
  width: 500px;
  height: 18px;
}

.skeleton-card {
  height: 400px;

  .form-label {
    width: 100px;
    height: 15px;
    margin-bottom: 10px;
  }

  .skeleton-input {
    width: 100%;
    height: 45px;
    margin-bottom: 20px;
    border-radius: 8px;
  }

  .skeleton-button {
    width: 120px;
    height: 40px;
    float: right;
    border-radius: 8px;
  }
}
</style>