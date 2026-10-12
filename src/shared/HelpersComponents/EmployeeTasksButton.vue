<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { EmployeeStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/EmployeeStatus'

const userStore = useUserStore()
</script>

<template>
  <RouterLink
    v-if="
      userStore.user?.type === OrganizationTypeEnum.ORGANIZATION &&
      userStore.user.employeeType === EmployeeStatusEnum.Employee &&
      userStore.user.isMaster !== 1 &&
      userStore.user.id
    "
    :to="{ name: 'Organization Employee Tasks', params: { id: userStore.user.id } }"
    class="employee-tasks-action"
  >
    <span class="tasks-icon" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <rect x="7" y="6" width="20" height="23" rx="4" />
        <rect x="12" y="3" width="10" height="6" rx="2" />
        <path d="m11 16 2 2 4-4m-6 9 2 2 4-4m3-5h3m-3 7h3" />
      </svg>
      <span class="tasks-icon-spark">✦</span>
    </span>
    <span class="tasks-copy">
      <strong>{{ $t('My tasks') }}</strong>
      <span>{{ $t('employee_tasks_shortcut_hint') }}</span>
    </span>
    <span class="tasks-link">
      <span>{{ $t('show tasks') }}</span>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </span>
  </RouterLink>
</template>

<style scoped>
.employee-tasks-action {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
  isolation: isolate;
  overflow: hidden;
  min-width: 0;
  padding: 24px;
  margin-block: 0 20px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 24%, var(--main-border));
  border-radius: 24px;
  background:
    radial-gradient(ellipse at 100% 0%, color-mix(in srgb, var(--brand-primary-500) 18%, transparent), transparent 65%),
    var(--surface-1);
  color: var(--text-strong);
  text-decoration: none;
  box-shadow: 0 8px 24px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.employee-tasks-action:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 30px color-mix(in srgb, var(--brand-primary-900) 12%, transparent);
}

.employee-tasks-action:focus-visible {
  outline: 3px solid var(--brand-primary-500);
  outline-offset: 4px;
}

.tasks-icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  flex-shrink: 0;
  border-radius: 18px;
  background: var(--brand-primary-700);
  color: var(--text-on-brand);
  transform: rotate(-7deg);
}

.tasks-icon svg {
  width: 34px;
  height: 34px;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.tasks-icon-spark {
  position: absolute;
  top: -9px;
  inset-inline-end: -6px;
  color: var(--brand-primary-500);
  font-size: 22px;
}

.tasks-copy {
  display: flex;
  flex: 1 1 140px;
  flex-direction: column;
  gap: 5px;
}

.tasks-copy strong {
  font-size: 21px;
  font-weight: 800;
}

.tasks-copy > span {
  color: var(--text-soft);
  font-size: 13px;
  line-height: 1.6;
}

.tasks-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 42px;
  margin-inline-start: auto;
  padding: 10px 15px;
  border-radius: 13px;
  background: var(--brand-primary-700);
  color: var(--text-on-brand);
  font-size: 13px;
  font-weight: 700;
}

.tasks-link svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

:global([dir='rtl']) .tasks-link svg {
  transform: scaleX(-1);
}

@media (max-width: 480px) {
  .employee-tasks-action { padding: 20px; gap: 14px; }
  .tasks-link { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .employee-tasks-action { transition: none; }
  .employee-tasks-action:hover { transform: none; }
}
</style>
