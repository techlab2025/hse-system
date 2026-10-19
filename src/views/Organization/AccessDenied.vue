<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { refreshOrganizationPermissions } from '@/features/permission/Presentation/Helpers/refresh_organization_permissions'

const route = useRoute()
const router = useRouter()
const store = useUserStore()
const refreshing = ref(false)
const failed = ref(false)
async function refresh() {
  refreshing.value = true
  failed.value = !(await refreshOrganizationPermissions())
  refreshing.value = false
  const target = String(route.query.from ?? '/organization')
  if (
    !failed.value &&
    target.startsWith('/organization') &&
    !target.startsWith('/organization/access-denied')
  )
    await router.replace(target)
}
async function signIn() {
  await store.logout()
  await router.replace('/login/organization')
}
</script>

<template>
  <section class="permission-denied" role="alert">
    <p class="permission-denied-code">403</p>
    <h1>{{ $t('authorization.denied') }}</h1>
    <p>{{ $t('authorization.description') }}</p>
    <p v-if="failed">{{ $t('authorization.refreshFailed') }}</p>
    <div class="permission-denied-actions">
      <RouterLink class="btn btn-secondary" to="/organization">{{ $t('home') }}</RouterLink>
      <button class="btn btn-primary" type="button" :disabled="refreshing" @click="refresh">
        {{ $t('authorization.refresh') }}
      </button>
      <button class="btn btn-secondary" type="button" @click="signIn">
        {{ $t('authorization.signIn') }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.permission-denied {
  margin: 24px auto;
  max-width: 720px;
  padding: 40px 24px;
  text-align: center;
  border: 1px solid var(--main-border);
  border-radius: var(--hse-card-radius, 18px);
  background: var(--surface-1);
  color: var(--text-strong);
}
.permission-denied-code {
  color: var(--PrimaryColor);
  font-size: 48px;
  font-weight: 800;
}
.permission-denied h1 {
  margin-block: 12px;
  font-size: 24px;
}
.permission-denied-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-block-start: 24px;
}
</style>
