<script setup lang="ts">
import { ref } from "vue";
import Dialog from 'primevue/dialog';
import GuideIcon from '@/assets/images/GuideIcon.gif';
// Control for the Dialog

// Logic for the Minimized Switch
const checked = defineModel<boolean>('checked', { default: false });

const props = defineProps<{
  visible: boolean,
  title: string,
  index: number
}>();
const visible = ref(props.visible);

// Function to open the help dialog
const openHelp = () => {
  visible.value = true;
};
const emit = defineEmits(['Gotit']);
const Gotit = () => {
  visible.value = false;
  emit('Gotit' , true);
}
</script>

<template>
  <div class="component-wrapper">
    <!-- <div class="switch-container">
      <input type="checkbox" v-model="checked" :id="`switch-${index}`" class="hidden-input" />
      <label :for="`switch-${index}`" class="switch-label">
        <div class="switch-track">
          <div class="switch-thumb">
            <svg v-if="!checked" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <svg v-else class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <span class="label-text">{{ $t(title) }}</span>
      </label>

      <button class="info-btn" @click.stop="openHelp">?</button>
    </div> -->

    <Dialog v-model:visible="visible" :dismissable-mask="true" modal header="Project Progress Guide"
      :style="{ width: '60rem', height: 'fit-content' }" :breakpoints="{ '960px': '75vw', '641px': '90vw' }">
      <div class="dialog-content">
        <div class="gif-container">
          <img :src="GuideIcon" alt="System Guide" />
        </div>

        <div class="text-section">
          <h3>Track Your Milestones</h3>
          <p>This is the <strong>Projects Progress Page</strong>. To use the system effectively, ensure you:</p>

          <ul class="guide-list">
            <li><span>1</span> Fill in All Data You Want To Track.</li>
            <li><span>2</span> Link your Employees to the project.</li>
            <li><span>3</span> Toggle the status switch to "Active" to start tracking.</li>
          </ul>
        </div>

        <div class="dialog-footer">
          <button class="close-btn" @click="Gotit">Got it!</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
/* --- Switch Styles (Minimized) --- */
.switch-container {
  --switch-scale: 0.75;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.hidden-input {
  display: none;
}

.switch-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
}

.switch-track {
  width: calc(44px * var(--switch-scale));
  height: calc(24px * var(--switch-scale));
  background-color: #cbd5e1;
  border-radius: 999px;
  position: relative;
  transition: 0.3s;
}

.hidden-input:checked+.switch-label .switch-track {
  background-color: #10b981;
  /* Success Green */
}

.switch-thumb {
  width: calc(18px * var(--switch-scale));
  height: calc(18px * var(--switch-scale));
  background: white;
  border-radius: 50%;
  position: absolute;
  top: calc(3px * var(--switch-scale));
  left: calc(3px * var(--switch-scale));
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hidden-input:checked+.switch-label .switch-thumb {
  transform: translateX(calc(20px * var(--switch-scale)));
}

.icon {
  width: 70%;
  height: 70%;
  color: #94a3b8;
}

.info-btn {
  border: none;
  background: #f1f5f9;
  color: #64748b;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.info-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* --- Dialog Styles --- */
.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 10px;
}

.gif-container {
  width: 100%;
  height: 230px;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
}

.gif-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-section h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #1e293b;
}

.text-section p {
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
}

.guide-list {
  list-style: none;
  padding: 0;
  margin-top: 12px;
}

.guide-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 0.85rem;
  color: #334155;
}

.guide-list span {
  background: #3b82f6;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.close-btn {
  background: #0f172a;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
</style>
