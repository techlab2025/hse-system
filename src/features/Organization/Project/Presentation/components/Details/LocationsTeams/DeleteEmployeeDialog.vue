<script lang="ts" setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import MemberDeleteIcon from '@/shared/icons/MemberDeleteIcon.vue'
const visible = ref(false)
const emits = defineEmits(['delete'])
const DeleteEmployee = () => {
  emits('delete')
  visible.value = false
}
</script>

<template>
  <button
    class="delete-member-trigger"
    type="button"
    :aria-label="$t('Delete')"
    @click.prevent="visible = true"
  >
    <MemberDeleteIcon class="card-delete" />
  </button>
  <Dialog v-model:visible="visible" :modal="true" class="delete-dialog project-delete-dialog">
    <template #container>
      <div class="delete-dialog-content">
        <span class="delete-visual"
          ><img src="@/assets/images/delete-bin-full.png" :alt="$t('Delete')"
        /></span>
        <span class="delete-kicker">{{ $t('Confirmation required') }}</span>
        <h4 class="dialog-title">{{ $t('Are you sure') }}</h4>
        <p class="dialog-message">{{ $t('Now you will delete') }}</p>
        <div class="flex w-full btns">
          <button class="btn btn-primary justify-center mb-sm" @click.prevent="DeleteEmployee">
            {{ $t('Delete') }}
          </button>
          <button class="btn btn-secondary" @click.prevent="visible = false">
            {{ $t('Cancel') }}
          </button>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
.delete-member-trigger {
  position: absolute;
  z-index: 3;
  top: 7px;
  inset-inline-end: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 27px;
  padding: 5px;
  border: 1px solid color-mix(in srgb, var(--status-danger) 16%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--status-danger) 7%, var(--surface-1));
  color: var(--status-danger);
  cursor: pointer;
}

.delete-member-trigger .card-delete {
  position: static;
  width: 16px;
  height: 16px;
}

.delete-dialog-content {
  display: flex;
  align-items: center;
  width: min(390px, calc(100vw - 32px));
  flex-direction: column;
  padding: 24px;
  border: 1px solid var(--main-border);
  border-radius: 22px;
  background: var(--surface-1);
  text-align: center;
}

.delete-visual {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 84px;
  height: 84px;
  margin-bottom: 12px;
  border-radius: 24px;
  background: color-mix(in srgb, var(--status-danger) 7%, var(--surface-2));
}

.delete-visual img {
  width: 62px;
  height: 62px;
  object-fit: contain;
}

.delete-kicker {
  color: var(--status-danger);
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dialog-title {
  margin: 5px 0 4px;
  color: var(--text-strong);
  font-family: 'Bold';
}

.dialog-message {
  margin: 0 0 17px;
  color: var(--text-soft);
  font-size: 0.74rem;
}

.btns {
  gap: 9px;
}

.btns .btn {
  min-height: 42px;
  flex: 1;
  margin: 0;
  border-radius: 11px;
}
</style>
