<script setup lang="ts">
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import ContractorIcon from '@/shared/icons/ContractorIcon.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps<{
  projectId: number | undefined
  projectName: string | undefined
  SerialNumber: string | undefined
  Projectdate: string | undefined
  Contractors: number | undefined
  serialName: string | undefined
  endDate: string | undefined
  has_assigned_permit?: boolean
}>()
</script>
<template>
  <header class="project-header-container">
    <span class="header-orbit orbit-one" aria-hidden="true"></span>
    <span class="header-orbit orbit-two" aria-hidden="true"></span>

    <div class="project-identity">
      <div class="project-heading">
        <span class="project-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" />
            <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
          </svg>
        </span>
        <div>
          <!-- <span class="project-eyebrow"><i></i>{{ t('Project overview') }}</span> -->
          <h1 class="project-name">{{ projectName || t('Project') }}</h1>
        </div>
      </div>

      <div class="project-serial">
        <span>{{ t('serial') }}</span>
        <strong>{{ serialName || SerialNumber || '—' }}</strong>
      </div>
    </div>

    <div class="project-meta">
      <div class="meta-item start-date">
        <span class="meta-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
          </svg>
        </span>
        <span class="meta-copy">
          <small>{{ t('start in') }}</small>
          <strong>{{ Projectdate || '—' }}</strong>
        </span>
      </div>

      <span class="schedule-line" aria-hidden="true"><i></i></span>

      <div class="meta-item end-date">
        <span class="meta-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
            <path d="m9 15 2 2 4-4" />
          </svg>
        </span>
        <span class="meta-copy">
          <small>{{ t('end in') }}</small>
          <strong>{{ endDate || '—' }}</strong>
        </span>
      </div>

      <div class="meta-item contractors-item">
        <span class="meta-icon" aria-hidden="true"><ContractorIcon class="contractor-icon" /></span>
        <span class="meta-copy">
          <small>{{ t('sub_contractors') }}</small>
          <strong>{{ Contractors || 0 }}</strong>
        </span>
      </div>
    </div>

    <div v-if="projectId" class="project-actions-dock">
      <div class="project-actions-heading">
        <span>{{ t('Project actions') }}</span>
        <small>{{ t('Quick access to project workflows') }}</small>
      </div>

      <div class="btn-route">
        <router-link
          class="project-action-link action-audits"
          :to="{
            name: 'Audits',
            query: { project_id: projectId, inspectionType: 1 },
            params: { id: projectId },
          }"
        >
          <span class="action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 4h10l4 4v12H5zM15 4v5h4M8 13h8M8 17h5" />
            </svg>
          </span>
          <span class="action-copy">
            <strong>{{ t('Audits') }}</strong>
            <small>{{ t('Review project audits') }}</small>
          </span>
          <span class="action-arrow" aria-hidden="true">→</span>
        </router-link>

        <router-link
          :to="{
            name: 'management-of-change',
            params: { id: projectId },
            query: { project_id: projectId },
          }"
          class="project-action-link action-change"
        >
          <span class="action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 7h11M4 17h16M15 4l3 3-3 3M9 14l-3 3 3 3" />
            </svg>
          </span>
          <span class="action-copy">
            <strong>{{ t('Management of change') }}</strong>
            <small>{{ t('Track project changes') }}</small>
          </span>
          <span class="action-arrow" aria-hidden="true">→</span>
        </router-link>

        <router-link
          :to="{ path: `/organization/project-permit/project/${projectId}` }"
          class="project-action-link action-create-permit"
        >
          <span class="action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 3.75h9l3 3V20H6zM15 3.75V7h3M9 12h6M12 9v6" />
            </svg>
          </span>
          <span class="action-copy">
            <strong>{{ t('Create permit to work') }}</strong>
            <small>{{ t('Start a new work permit') }}</small>
          </span>
          <span class="action-arrow" aria-hidden="true">→</span>
        </router-link>

        <PermissionBuilder v-if="has_assigned_permit" :code="[PermissionsEnum.PROJECT_PERMIT]">
          <router-link
            :to="{ path: `/organization/project-permits/${projectId}` }"
            class="project-action-link action-permits"
          >
            <span class="action-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 5h14v15H5zM8 3h8v4H8zM8 11h8M8 15h8" />
              </svg>
            </span>
            <span class="action-copy">
              <strong>{{ t('Show permits') }}</strong>
              <small>{{ t('Browse project permits') }}</small>
            </span>
            <span class="action-arrow" aria-hidden="true">→</span>
          </router-link>
        </PermissionBuilder>

        <router-link
          :to="{ path: `/organization/project-my-permits/${projectId}` }"
          class="project-action-link action-my-permits"
        >
          <span class="action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3.25" />
              <path d="M5.5 20a6.5 6.5 0 0 1 13 0M17 11.5l1.5 1.5 2.5-3" />
            </svg>
          </span>
          <span class="action-copy">
            <strong>{{ t('My Permits') }}</strong>
            <small>{{ t('View permits assigned to me') }}</small>
          </span>
          <span class="action-arrow" aria-hidden="true">→</span>
        </router-link>

        <router-link
          :to="{ name: 'Inductions', query: { project_id: projectId } }"
          class="project-action-link action-induction"
        >
          <span class="action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h4" />
              <path d="M17 5.5h2.5V18H17" />
            </svg>
          </span>
          <span class="action-copy">
            <strong>{{ t('Induction') }}</strong>
            <small>{{ t('Manage project inductions') }}</small>
          </span>
          <span class="action-arrow" aria-hidden="true">→</span>
        </router-link>

        <router-link
          :to="{ name: 'Project Leadership', params: { id: projectId } }"
          class="project-action-link action-leadership"
        >
          <span class="action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3v18M3 12h18M5 5l14 14M19 5 5 19" />
            </svg>
          </span>
          <span class="action-copy">
            <strong>Leadership visits</strong>
            <small>Plan visits and submit reports</small>
          </span>
          <span class="action-arrow" aria-hidden="true">→</span>
        </router-link>

        <router-link
          :to="{ name: 'Project PPE Matrix', params: { id: projectId } }"
          class="project-action-link action-ppe-matrix"
        >
          <span class="action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16v16H4zM4 10h16M4 15h16M10 4v16" />
            </svg>
          </span>
          <span class="action-copy">
            <strong>PPE Matrix & Log</strong>
            <small>Set required PPE Matrix</small>
          </span>
          <span class="action-arrow" aria-hidden="true">→</span>
        </router-link>

        <router-link
          :to="{ name: 'Project Risk Assessments', params: { id: projectId } }"
          class="project-action-link action-risk-assessments"
        >
          <span class="action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3 2.5 20h19L12 3ZM12 9v5M12 17h.01" />
            </svg>
          </span>
          <span class="action-copy">
            <strong>Risk assessments</strong>
            <small>Review project safety</small>
          </span>
          <span class="action-arrow" aria-hidden="true">→</span>
        </router-link>

        <PermissionBuilder
          :code="[PermissionsEnum.ORGANIZATION_EMPLOYEE, PermissionsEnum.OBJECTIVE_ORG_CREATE]"
        >
          <router-link
            :to="{ name: 'Project Objectives', params: { project_id: projectId } }"
            class="project-action-link action-objectives"
          >
            <span class="action-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="3.25" />
                <path d="m15 9 4-4M16 5h3v3" />
              </svg>
            </span>
            <span class="action-copy">
              <strong>{{ t('Objectives') }}</strong>
              <small>{{ t('Create project objectives') }}</small>
            </span>
            <span class="action-arrow" aria-hidden="true">→</span>
          </router-link>
        </PermissionBuilder>
      </div>
    </div>
  </header>
</template>
<style scoped lang="scss">
.btn-route {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
}
.project-header-container {
  position: relative;
  display: grid;
  // grid-template-columns: minmax(240px, 1fr) auto auto;
  grid-template-columns: minmax(240px, 1fr) auto;
  align-items: center;
  overflow: hidden;
  width: 100%;
  min-height: 150px;
  gap: 24px;
  padding: 22px !important;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border)) !important;
  border-radius: 23px !important;
  background:
    radial-gradient(
      circle at 0 0,
      color-mix(in srgb, var(--PrimaryColor) 13%, transparent),
      transparent 37%
    ),
    linear-gradient(
      135deg,
      var(--surface-1),
      color-mix(in srgb, var(--surface-2) 58%, var(--surface-1))
    ) !important;
  box-shadow: 0 16px 38px color-mix(in srgb, var(--brand-primary-900) 8%, transparent) !important;
  font-family: 'Regular';
}
.project-header-container::before {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 5px;
  background: linear-gradient(180deg, var(--PrimaryColor), var(--status-success));
  content: '';
}
.header-orbit {
  position: absolute;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 8%, transparent);
  border-radius: 50%;
  pointer-events: none;
}
.orbit-one {
  inset-inline-end: -62px;
  top: -105px;
  width: 230px;
  height: 230px;
}
.orbit-two {
  inset-inline-end: 26%;
  bottom: -96px;
  width: 150px;
  height: 150px;
}
.project-identity,
.project-meta,
.project-actions-dock,
.project-action-link {
  position: relative;
  z-index: 1;
}
.project-identity {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 15px;
}
.project-heading {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 13px;
}
.project-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  border-radius: 16px;
  color: var(--text-on-brand);
  background: linear-gradient(135deg, var(--PrimaryColor), var(--brand-secondary-500));
  box-shadow: 0 10px 22px color-mix(in srgb, var(--PrimaryColor) 24%, transparent);
}
.project-mark svg {
  width: 25px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}
.project-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--PrimaryColor);
  font-size: 0.58rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.project-eyebrow i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--status-success);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--status-success) 10%, transparent);
}
.project-name {
  overflow: hidden;
  margin: 4px 0 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: clamp(1.15rem, 2vw, 1.55rem);
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  max-width: 650px;
}
.project-serial {
  display: flex;
  min-width: 0;
  max-width: 560px;
  flex-direction: column;
  gap: 3px;
  padding-inline-start: 65px;
}
.project-serial span {
  color: var(--text-soft);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.project-serial strong {
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.69rem;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.project-meta {
  display: grid;
  grid-template-columns: auto 24px auto auto;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--main-border);
  border-radius: 17px;
  background: color-mix(in srgb, var(--surface-1) 82%, transparent);
  backdrop-filter: blur(8px);
}
.meta-item {
  display: flex;
  align-items: center;
  min-width: 112px;
  gap: 9px;
  padding: 7px;
}
.meta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 11px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
}
.end-date .meta-icon {
  color: var(--status-success);
  background: color-mix(in srgb, var(--status-success) 9%, transparent);
}
.contractors-item .meta-icon {
  color: var(--brand-accent-500);
  background: color-mix(in srgb, var(--brand-accent-500) 9%, transparent);
}
.meta-icon svg,
.meta-icon :deep(svg) {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}
.meta-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}
.meta-copy small {
  color: var(--text-soft);
  font-size: 0.55rem;
}
.meta-copy strong {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.69rem;
  white-space: nowrap;
}
.contractors-item .meta-copy strong {
  color: var(--brand-accent-500);
  font-size: 0.9rem;
}
.schedule-line {
  position: relative;
  width: 24px;
  height: 1px;
  background: var(--main-border);
}
.schedule-line i {
  position: absolute;
  top: -2px;
  inset-inline-end: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--status-success);
}
.project-actions-dock {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: 165px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, var(--main-border));
  border-radius: 18px;
  background: color-mix(in srgb, var(--surface-1) 88%, transparent);
  backdrop-filter: blur(9px);
}
.project-actions-heading {
  padding-inline: 5px;
}
.project-actions-heading span,
.project-actions-heading small {
  display: block;
}
.project-actions-heading span {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.74rem;
}
.project-actions-heading small {
  margin-top: 3px;
  color: var(--text-soft);
  font-size: 0.58rem;
  line-height: 1.45;
}
.project-action-link {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  align-items: center;
  gap: 9px;
  min-width: 0;
  min-height: 60px;
  padding: 9px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  color: var(--text-strong);
  background: var(--surface-2);
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}
.project-action-link:hover {
  transform: translateY(-2px);
  border-color: color-mix(
    in srgb,
    var(--action-color, var(--PrimaryColor)) 42%,
    var(--main-border)
  );
  box-shadow: 0 10px 20px color-mix(in srgb, var(--text-strong) 7%, transparent);
}
.action-icon {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 11px;
  color: var(--action-color, var(--PrimaryColor));
  background: color-mix(in srgb, var(--action-color, var(--PrimaryColor)) 10%, transparent);
}
.action-icon svg {
  width: 19px;
  height: 19px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}
.action-copy {
  min-width: 0;
}
.action-copy strong,
.action-copy small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.action-copy strong {
  color: var(--text-strong);
  font-size: 0.65rem;
}
.action-copy small {
  margin-top: 3px;
  color: var(--text-soft);
  font-size: 0.52rem;
}
.action-arrow {
  color: var(--action-color, var(--PrimaryColor));
  font-size: 0.85rem;
  transition: transform 0.2s ease;
}
.project-action-link:hover .action-arrow {
  transform: translateX(2px);
}
[dir='rtl'] .action-arrow {
  transform: rotate(180deg);
}
[dir='rtl'] .project-action-link:hover .action-arrow {
  transform: rotate(180deg) translateX(2px);
}
.action-audits {
  --action-color: var(--PrimaryColor);
}
.action-change {
  --action-color: var(--brand-accent-500);
}
.action-create-permit {
  --action-color: var(--status-success);
}
.action-permits {
  --action-color: #7c5ce7;
}
.action-my-permits {
  --action-color: #d97706;
}
.action-induction {
  --action-color: #0f9f6e;
}
.action-leadership {
  --action-color: #138b83;
}
.action-ppe-matrix {
  --action-color: #5375cf;
}
.action-risk-assessments {
  --action-color: #bf6b36;
}
.action-objectives {
  --action-color: #1f8f6a;
}
@media (max-width: 1100px) {
  .project-header-container {
    grid-template-columns: minmax(0, 1fr) auto;
  }
  .project-meta {
    grid-column: 1 / -1;
    grid-row: 2;
    width: 100%;
  }
  .project-actions-dock {
    grid-template-columns: 1fr;
  }
  .btn-route {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 680px) {
  .project-header-container {
    gap: 16px;
    padding: 17px !important;
    border-radius: 19px !important;
  }
  .project-meta {
    grid-template-columns: 1fr 1fr;
  }
  .schedule-line {
    display: none;
  }
  .contractors-item {
    grid-column: 1 / -1;
  }
  .project-serial {
    padding-inline-start: 0;
  }
  .btn-route {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 460px) {
  .project-name {
    white-space: normal;
  }
  .project-meta {
    grid-template-columns: 1fr;
  }
  .contractors-item {
    grid-column: auto;
  }
  .btn-route {
    grid-template-columns: 1fr;
  }
}
</style>
