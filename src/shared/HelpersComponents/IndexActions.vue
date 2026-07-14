<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
// import ExportPdf from '@/components/ExportPdf.vue'
import PermissionBuilder from './PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

// ── search state ──────────────────────────────────────────
const word = ref('')
const searchOrganizatoinEmployee = () => {
  // your existing search logic here
}

const props = defineProps<{
  permissions: PermissionsEnum[],
  addLink: string,
  ImportexcelLink: string,
  addText: string,
  addDescription: string,
  numberOfActions: number
}>()
// ── menu state ────────────────────────────────────────────
const menuOpen = ref(false)
const wrapperRef = ref(null)

// close on outside click
const onClickOutside = (e) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    menuOpen.value = false
  }
}
onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
const emit = defineEmits(['export:excel', 'export:pdf'])
// ── actions ───────────────────────────────────────────────
const handleExportPdf = () => {
  menuOpen.value = false
  emit('export:pdf')
  // trigger your ExportPdf logic here
}

const handleExportExcel = () => {
  menuOpen.value = false
  emit('export:excel')
  // your existing exportExcel() call here
}



</script>
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">


    <!-- Actions Menu -->
    <div class="col-span-2 flex justify-end">
      <div class="actions-wrapper" ref="wrapperRef">

        <button class="trigger-btn" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
          </svg>
          <span>Actions</span>
          <span class="trigger-badge">{{ numberOfActions }}</span>
          <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <Transition name="panel">
          <div v-if="menuOpen" class="action-panel">

            <!-- Export section -->
            <p class="panel-label">Export</p>

            <!-- handleExportPdf -->
            <button class="action-item" @click="handleExportPdf">
              <span class="action-icon icon-pdf">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </span>
              <span class="action-meta">
                <span class="action-name">Export PDF</span>
                <span class="action-desc">Download as .pdf</span>
              </span>
            </button>

            <!-- handleExportExcel -->
            <button class="action-item" @click="handleExportExcel">
              <span class="action-icon icon-xls">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              </span>
              <span class="action-meta">
                <span class="action-name">Export Excel</span>
                <span class="action-desc">Download as .xlsx</span>
              </span>
            </button>

            <div class="panel-divider" />
            <p class="panel-label">Import</p>

            <router-link class="action-item" :to="ImportexcelLink" @click="menuOpen = false">
              <span class="action-icon icon-up">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
              </span>
              <span class="action-meta">
                <span class="action-name">{{ $t('upload_excel') }}</span>
                <span class="action-desc">Import from .xlsx</span>
              </span>
            </router-link>

            <div class="panel-divider" />

            <!-- Add Employee (highlighted CTA) -->
            <!-- [PermissionsEnum.ADMIN, PermissionsEnum.ORG_EMPLOYEE_CREATE] -->
            <PermissionBuilder :code="permissions">
              <router-link class="action-item highlight" to="/organization/organization-employee/add"
                @click="menuOpen = false">
                <span class="action-icon icon-add">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </span>
                <span class="action-meta">
                  <span class="action-name">{{ $t(addText) }}</span>
                  <span class="action-desc">{{ $t(addDescription) }}</span>
                </span>
              </router-link>
            </PermissionBuilder>

          </div>
        </Transition>

      </div>
    </div>
  </div>
</template>



<style scoped>
/* ── Wrapper ──────────────────────────────────────────── */
.actions-wrapper {
  position: relative;
}

/* ── Trigger button ───────────────────────────────────── */
.trigger-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  /* background: linear-gradient(135deg, var(--brand-primary-800) 0%, var(--brand-primary-600) 100%); */
  color: color-mix(in srgb, var(--text-strong) 73.3%, transparent);
  border: none;
  border-radius: 14px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.01em;
  /* box-shadow: 0 4px 16px color-mix(in srgb, var(--brand-primary-600) 35%, transparent); */
  transition: all 0.2s ease;
  user-select: none;
  border: 1px solid color-mix(in srgb, var(--text-soft) 59.6%, transparent);
}

.trigger-btn:hover {
  transform: translateY(-1px);
  /* box-shadow: 0 6px 24px color-mix(in srgb, var(--brand-primary-600) 45%, transparent); */
}

.trigger-btn:active {
  transform: scale(0.97);
}

.trigger-btn .chevron {
  transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.trigger-btn.open .chevron {
  transform: rotate(180deg);
}

.trigger-badge {
  background: color-mix(in srgb, var(--surface-1) 20%, transparent);
  border-radius: 6px;
  padding: 1px 7px;
  font-size: 12px;
  font-weight: 700;
}

/* ── Panel ────────────────────────────────────────────── */
.action-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 230px;
  background: var(--surface-1);
  border-radius: 18px;
  box-shadow:
    0 20px 60px color-mix(in srgb, var(--shadow-color) 13%, transparent),
    0 4px 16px color-mix(in srgb, var(--shadow-color) 6%, transparent),
    0 0 0 1px color-mix(in srgb, var(--shadow-color) 4%, transparent);
  padding: 8px;
  z-index: 999;
  transform-origin: top right;
}

/* ── Vue Transition ───────────────────────────────────── */
.panel-enter-active {
  transition: opacity 0.2s ease, transform 0.22s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.panel-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.panel-enter-to,
.panel-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* ── Section label ────────────────────────────────────── */
.panel-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-soft);
  padding: 6px 10px 4px;
}

/* ── Action rows ──────────────────────────────────────── */
.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: 12px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s ease, transform 0.15s ease;
  color: var(--brand-primary-700);
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  font-size: 13.5px;
  font-weight: 500;
}

.action-item:hover {
  background: var(--brand-primary-50);
  transform: translateX(3px);
}

.action-item:active {
  transform: scale(0.98);
}

/* Highlighted CTA row */
.action-item.highlight {
  background: linear-gradient(135deg, var(--brand-primary-50), var(--brand-primary-50));
  border: 1px solid var(--brand-primary-100);
  margin-top: 2px;
}

.action-item.highlight:hover {
  background: linear-gradient(135deg, var(--brand-primary-100), var(--brand-primary-50));
  transform: translateX(3px);
}

/* ── Icon chips ───────────────────────────────────────── */
.action-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-pdf {
  background: var(--status-danger-soft);
  color: var(--status-danger);
}

.icon-xls {
  background: var(--status-success-soft);
  color: var(--status-success);
}

.icon-up {
  background: var(--brand-primary-50);
  color: var(--brand-primary-400);
}

.icon-add {
  background: var(--brand-primary-50);
  color: var(--brand-primary-400);
}

/* ── Meta text ────────────────────────────────────────── */
.action-meta {
  display: flex;
  flex-direction: column;
}

.action-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--brand-primary-900);
  line-height: 1.3;
}

.action-desc {
  font-size: 11px;
  color: var(--text-soft);
  margin-top: 1px;
}

/* ── Divider ──────────────────────────────────────────── */
.panel-divider {
  height: 1px;
  background: var(--brand-primary-50);
  margin: 5px 4px;
}

/* ── Staggered row entrance ───────────────────────────── */
.panel-enter-active .action-item:nth-child(1) {
  animation: rowIn 0.2s 0.04s both;
}

.panel-enter-active .action-item:nth-child(2) {
  animation: rowIn 0.2s 0.08s both;
}

.panel-enter-active .action-item:nth-child(3) {
  animation: rowIn 0.2s 0.12s both;
}

.panel-enter-active .action-item:nth-child(4) {
  animation: rowIn 0.2s 0.16s both;
}

.panel-enter-active .action-item:nth-child(5) {
  animation: rowIn 0.2s 0.20s both;
}

@keyframes rowIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
