<script setup lang="ts">
import { ref } from 'vue'
import LoginController from '@/features/auth/presentation/controllers/login_controller'
import LoginParams from '@/features/auth/Core/Params/login_params'
import { useRouter } from 'vue-router'
import { OrganizationTypeEnum } from '../../Core/Enum/organization_type'

const router = useRouter()
const email = ref('')
const password = ref('')

const activeTab = ref(OrganizationTypeEnum.ADMIN)

const changeTab = (tab: OrganizationTypeEnum) => {
  activeTab.value = tab
}

const login = () => {
  LoginController.getInstance().login(
    new LoginParams(email.value, password.value),
    router,
    activeTab.value,
  )
}
</script>

<template>
  <section class="login">
    <form @submit.prevent="login" class="login-form">
      <h1 class="title">HSE Dashboard</h1>

      <div class="tabs">
        <div
          class="tab"
          @click="changeTab(OrganizationTypeEnum.ADMIN)"
          :class="{ active: activeTab === OrganizationTypeEnum.ADMIN }"
        >
          {{ $t('admin') }}
        </div>
        <div
          class="tab"
          @click="changeTab(OrganizationTypeEnum.ORGANIZATION)"
          :class="{ active: activeTab === OrganizationTypeEnum.ORGANIZATION }"
        >
          {{ $t('organization') }}
        </div>
      </div>

      <div class="input-wrapper">
        <label for="email" class="input-label">{{ $t('email') }}</label>
        <input class="input" type="email" id="email" v-model="email" />
      </div>
      <div class="input-wrapper">
        <label for="password" class="input-label">{{ $t('password') }}</label>
        <input type="password" id="password" class="input" v-model="password" />
      </div>
      <button type="submit" class="btn btn-primary">{{ $t('login') }}</button>
    </form>
  </section>
</template>

<style scoped></style>
