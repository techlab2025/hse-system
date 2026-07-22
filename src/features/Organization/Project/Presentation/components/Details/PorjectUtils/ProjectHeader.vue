<script setup lang="ts">
// import DeleteProjectParams from '@/features/Organization/Project/Core/params/deleteProjectParams'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import ContractorIcon from '@/shared/icons/ContractorIcon.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import { useI18n } from 'vue-i18n'
// import DeleteProjectController from '../../../controllers/deleteProjectController'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useI18n()
const props = defineProps<{
  projectName: string | undefined
  SerialNumber: string | undefined
  Projectdate: string | undefined
  Contractors: number | undefined
  serialName: string | undefined
  endDate: string | undefined
}>()

const actionList = (id: number) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/organization/project/${id}`,
    permission: [
      PermissionsEnum.PROJECT_UPDATE,
      PermissionsEnum.PROJECT_DETAILS,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.PROJECT_ALL,
    ],
  },
]

// const deleteProject = async (id: number) => {
//   const deleteProjectParams = new DeleteProjectParams(id)
//   await DeleteProjectController.getInstance().deleteProject(deleteProjectParams)
// }
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
          <span class="project-eyebrow"><i></i>{{ t('Project overview') }}</span>
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
          <small>{{ t('contractors') }}</small>
          <strong>{{ Contractors || 0 }}</strong>
        </span>
      </div>
    </div>

    <div class="project-actions" :aria-label="t('Project actions')">
      <DropList :actionList="actionList(Number(route.params.id))" />
    </div>
  </header>
</template>

<style scoped lang="scss">
.project-header-container {
  position: relative;
  display: grid;
  grid-template-columns: minmax(240px, 1fr) auto auto;
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
.project-actions {
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
  white-space: nowrap;
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

.project-actions {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 13px;
  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));
}

.project-actions :deep(.list-trigger) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.project-actions :deep(svg) {
  width: 28px;
  height: 28px;
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

  .project-actions {
    grid-column: 2;
    grid-row: 1;
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
}
</style>
