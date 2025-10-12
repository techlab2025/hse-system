<script setup lang="ts">
import { ref } from 'vue'
import LoginController from '@/features/auth/presentation/controllers/login_controller'
import LoginParams from '@/features/auth/Core/Params/login_params'
import { useRouter } from 'vue-router'
import { OrganizationTypeEnum } from '../../Core/Enum/organization_type'
import Email from '@/shared/icons/email.vue'
import Lock from '@/shared/icons/lock.vue'
import CloseEye from '@/shared/icons/closeEye.vue'
import Loca from '@/shared/icons/loca.vue'
import EyeIcon from '@/shared/icons/EyeIcon.vue'

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

const isPasswordVisible = ref()
</script>

<template>
  <section class="login">
    <div class="images">
      <div class="login-image">
        <div class="top-glass-card">
          <p>{{ $t('See your entire safety operation at a glance') }}</p>
          <span>{{ $t('Real-time data. One powerful dashboard') }}</span>
        </div>
        <img src="@/assets/images/login.png" alt="" />
        <div class="bottom-glass-card">
          <p>{{ $t('Work from the field — even offline') }}</p>
          <span>{{ $t('Submit reports, inspections & observations anytime, anywhere') }}</span>
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="111"
        height="120"
        viewBox="0 0 111 120"
        fill="none"
      >
        <g opacity="0.1">
          <path
            d="M6.62818 119.845C4.01659 119.845 1.64793 118.265 0.651881 115.848C-0.356318 113.431 0.202443 110.637 2.04878 108.791L37.275 73.5639C39.8137 71.0373 43.9072 71.0373 46.4338 73.5639C48.9725 76.0905 48.9725 80.1962 46.4338 82.7229L11.2076 117.95C10.005 119.164 8.35305 119.845 6.62818 119.845Z"
            fill="#CAD8FF"
          />
          <path
            d="M110.336 0.354388L18.2259 92.4541C-1.01491 73.213 -1.01491 42.007 18.2259 22.7537C45.6051 -4.62595 110.336 0.354388 110.336 0.354388Z"
            fill="white"
          />
          <path
            d="M87.9253 92.4523C68.6845 111.706 37.479 111.706 18.2261 92.4523L110.336 0.352539C110.336 0.352539 115.317 65.0726 87.9253 92.4523Z"
            fill="#CAD8FF"
          />
        </g>
      </svg>
    </div>

    <form @submit.prevent="login" class="login-form">
      <div class="title">
        <div class="logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="28"
            viewBox="0 0 26 28"
            fill="none"
          >
            <path
              d="M2.08446 27.6292C1.49046 27.6292 0.951721 27.2701 0.725173 26.7203C0.495862 26.1705 0.62295 25.535 1.04289 25.1151L9.05494 17.1029C9.63236 16.5282 10.5634 16.5282 11.1381 17.1029C11.7155 17.6775 11.7155 18.6114 11.1381 19.186L3.12602 27.1982C2.85251 27.4745 2.47677 27.6292 2.08446 27.6292Z"
              fill="#1D4ED8"
            />
            <path
              d="M25.6725 0.451698L4.72236 21.3994C0.346126 17.0231 0.346126 9.92541 4.72236 5.54634C10.9497 -0.681059 25.6725 0.451698 25.6725 0.451698Z"
              fill="#DBE6FF"
            />
            <path
              d="M20.5752 21.3989C16.199 25.778 9.10141 25.778 4.72241 21.3989L25.6725 0.451172C25.6725 0.451172 26.8053 15.1715 20.5752 21.3989Z"
              fill="#1D4ED8"
            />
          </svg>
          <h2>HSE.Cloud.Ai</h2>
        </div>

        <div class="text">
          <p>{{ $t('Log in now') }}</p>
          <span>{{ $t('Please enter your email and password to log in') }}</span>
        </div>
      </div>

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

      <div class="inputs">
        <div class="input-wrapper">
          <Email class="icon" />
          <input
            class="input"
            :placeholder="$t('enter Your Mail')"
            type="email"
            id="email"
            v-model="email"
          />
        </div>
        <div class="input-wrapper">
          <Loca class="icon" />
          <input
            :type="isPasswordVisible ? 'text' : 'password'"
            id="password"
            :placeholder="$t('Password')"
            class="input"
            v-model="password"
          />
          <CloseEye
            class="icon-eye"
            v-if="!isPasswordVisible"
            @click="isPasswordVisible = !isPasswordVisible"
          />
          <EyeIcon class="icon-eye" v-else @click="isPasswordVisible = !isPasswordVisible" />
        </div>
      </div>
      <button type="submit" class="btn btn-primary">{{ $t('login') }}</button>
    </form>
  </section>
</template>

<style scoped></style>
