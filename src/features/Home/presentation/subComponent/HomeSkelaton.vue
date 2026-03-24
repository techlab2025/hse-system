<script setup lang="ts"></script>
<template>
  <div class="skeleton-wrapper">
    <!-- Progress bar skeleton -->
    <div class="sk" style="height: 120px; margin-bottom: 20px; border-radius: 12px"></div>

    <!-- ProjectsStatistics skeleton -->
    <div class="projects-stats-sk">
      <div class="sk-card" v-for="i in 4" :key="i">
        <div class="sk" style="height: 12px; width: 60%; margin-bottom: 10px"></div>
        <div class="sk" style="height: 28px; width: 40%"></div>
      </div>
    </div>

    <!-- Total incidents row -->
    <div class="incidents-sk">
      <div class="sk-card" v-for="i in 4" :key="i">
        <div class="sk" style="height: 11px; width: 55%; margin-bottom: 14px"></div>
        <div v-for="j in 3" :key="j" class="incident-row-sk">
          <div class="sk" style="height: 32px; width: 40px; flex-shrink: 0"></div>
          <div class="sk" style="height: 10px; flex: 1"></div>
        </div>
      </div>
    </div>

    <!-- Equipment + machines row -->
    <div class="equipment-sk">
      <div class="sk-card" style="flex: 2">
        <div class="sk" style="height: 11px; width: 40%; margin-bottom: 16px"></div>
        <div class="bar-chart-sk">
          <div
            class="sk bar"
            v-for="(h, i) in [60, 90, 50, 75, 40, 85, 65, 100]"
            :key="i"
            :style="{ height: h + '%' }"
          ></div>
        </div>
      </div>
      <div class="sk-card" style="flex: 1">
        <div class="sk" style="height: 11px; width: 55%; margin-bottom: 16px"></div>
        <div class="sk" v-for="i in 4" :key="i" style="height: 14px; margin-bottom: 10px"></div>
      </div>
    </div>

    <!-- Hazard + Investigation row -->
    <div class="hazard-sk">
      <div class="sk-card" style="flex: 2">
        <div class="sk" style="height: 11px; width: 40%; margin-bottom: 16px"></div>
        <div class="bar-chart-sk">
          <div
            class="sk bar"
            v-for="(h, i) in [80, 55, 95, 65, 45, 70, 100, 60, 85]"
            :key="i"
            :style="{ height: h + '%' }"
          ></div>
        </div>
      </div>
      <div
        class="sk-card"
        style="flex: 1; display: flex; flex-direction: column; align-items: center"
      >
        <div
          class="sk"
          style="height: 11px; width: 55%; margin-bottom: 16px; align-self: flex-start"
        ></div>
        <div class="sk" style="width: 110px; height: 110px; border-radius: 50%"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-wrapper {
  margin-top: 25px;
}

@keyframes shimmer {
  0% {
    background-position: -600px 0;
  }

  100% {
    background-position: 600px 0;
  }
}

.sk {
  background: linear-gradient(
    90deg,
    var(--color-bg-secondary, #f0f0f0) 25%,
    var(--color-bg-tertiary, #e0e0e0) 50%,
    var(--color-bg-secondary, #f0f0f0) 75%
  );
  background-size: 600px 100%;
  animation: shimmer 1.6s infinite;
  border-radius: 8px;
}

.sk-card {
  background: #fff;
  border: 0.5px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 1rem 1.25rem;
}

.projects-stats-sk {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.incidents-sk {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.incident-row-sk {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.equipment-sk,
.hazard-sk {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.bar-chart-sk {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  height: 120px;
}

.bar-chart-sk .bar {
  flex: 1;
}
</style>
