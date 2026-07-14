<script setup lang="ts">
import EmployeeBg from '@/assets/images/topleft.png'
import Yellowback from '@/assets/images/botleft.png'

import type OrganizatoinEmployeeDetailsModel from '../../../Data/models/OrganizatoinEmployeeDetailsModel'

const { state } = defineProps<{
  state: OrganizatoinEmployeeDetailsModel
}>()
</script>

<template>
  <div class="performance-box">
    <!-- <div class="decor-bg">
      <img class="dot-top-left" :src="EmployeeBg" alt="bg" />
      <img class="dot-bottom-right" :src="Yellowback" alt="bg" />
    </div> -->

    <div class="per-wrapper">
      <div class="progress-circle" :style="`--value: ${Number('78'.replace('%', ''))}`">
        <span>{{ '78' }}%</span>
      </div>
      <div class="performance-title">
        <h4 class="title">{{ $t('overall performance') }}</h4>
        <p class="description">
          {{
            $t(
              'This is the overall evaluation of an employee performance across all projects they work on. These evaluations are calculated based on tasks, training, or drill',
            )
          }}
        </p>
      </div>
    </div>
    <div class="details-wrapper">
      <div class="info">
        <h5>current</h5>
        <span>Eco-friendly / Sustainability-oriented Names</span>
      </div>
      <div class="progress-circle-small" :style="`--value: ${Number('20'.replace('%', ''))}`">
        <span>{{ '20' }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@property --progress {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

.progress-circle-small {
  z-index: 5;
  --size: 55px;
  --thickness: 18px;
  --progress: 0;
  margin: auto 0;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: conic-gradient(
    from -0deg,
    var(--brand-primary-700) 0%,
    var(--brand-primary-700) calc(var(--progress) * 0.5%),
    var(--brand-primary-700) calc(var(--progress) * 1%),
    var(--brand-primary-100) 0
  );

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  animation: fill-progress 1.6s ease-out forwards;
}

/* الجزء الداخلي */
.progress-circle-small::before {
  content: '';
  position: absolute;
  inset: 5px;
  background: var(--surface-1);
  border-radius: 50%;
}

/* النص */
.progress-circle-small span {
  position: relative;
  font-size: 14px;
  font-family: 'Bold';
  color: var(--brand-primary-700);
}

.progress-circle {
  --size: 110px;
  --thickness: 10px;
  --progress: 0;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: conic-gradient(
    from -0deg,
    var(--brand-primary-400) 0%,
    var(--status-success) calc(var(--progress) * 0.5%),
    var(--status-success-soft) calc(var(--progress) * 1%),
    var(--status-danger) calc(var(--progress) * 100%)
  );

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  animation: fill-progress 1.6s ease-out forwards;
}

/* الجزء الداخلي */
.progress-circle::before {
  content: '';
  position: absolute;
  inset: 12px;
  background: var(--surface-1);
  border-radius: 50%;
}

/* النص */
.progress-circle span {
  position: relative;
  font-size: 28px;
  background: linear-gradient(90deg, var(--status-info), var(--status-success), var(--brand-primary-300));
  font-weight: bold;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  /* optional */
  background-clip: text;
}

@keyframes fill-progress {
  from {
    --progress: 0;
  }
  to {
    --progress: var(--value);
  }
}
</style>
