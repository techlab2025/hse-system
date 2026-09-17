<script setup lang="ts">
import type ProjectLossTimeModel from '../../../../Data/models/ProjectLossTimeModel'

defineProps<{ lossTimes: ProjectLossTimeModel[] }>()

const formatValue = (value: number) => new Intl.NumberFormat().format(value)
</script>

<template>
  <section class="loss-time-card">
    <header class="loss-time-header">
      <div>
        <span>SAFETY PERFORMANCE</span>
        <h2>Loss Time Matrix</h2>
        <p>Daily, monthly, and yearly loss time by accident type.</p>
      </div>
    </header>

    <div class="matrix-scroll">
      <table>
        <thead>
          <tr>
            <th scope="col">Accident type</th>
            <th scope="col">Daily</th>
            <th scope="col">Monthly</th>
            <th scope="col">Yearly</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in lossTimes" :key="item.accidentTypeId">
            <th scope="row">{{ item.accidentType.title || '—' }}</th>
            <td>{{ formatValue(item.dailyLossTime) }}</td>
            <td>{{ formatValue(item.monthlyLossTime) }}</td>
            <td>{{ formatValue(item.yearlyLossTime) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.loss-time-card {
  margin-block: 16px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, var(--main-border));
  border-radius: 20px;
  background: var(--surface-1);
  box-shadow: 0 14px 35px color-mix(in srgb, var(--brand-primary-900) 8%, transparent);
}

.loss-time-header {
  padding: 18px 20px;
  border-bottom: 1px solid var(--main-border);
  background: color-mix(in srgb, var(--PrimaryColor) 5%, var(--surface-1));
}

.loss-time-header span {
  color: var(--PrimaryColor);
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.loss-time-header h2 {
  margin: 3px 0;
  color: var(--text-strong);
  font-size: 1.15rem;
}

.loss-time-header p {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.75rem;
}

.matrix-scroll {
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
}

th,
td {
  padding: 14px 20px;
  border-bottom: 1px solid var(--main-border);
  text-align: start;
}

thead th {
  background: var(--surface-2);
  color: var(--text-soft);
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

tbody th {
  color: var(--text-strong);
  font-size: 0.82rem;
  font-weight: 800;
}

tbody td {
  color: var(--GrayText-1);
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
}

tbody tr:last-child th,
tbody tr:last-child td {
  border-bottom: 0;
}

tbody tr:hover {
  background: color-mix(in srgb, var(--PrimaryColor) 3%, transparent);
}
</style>
