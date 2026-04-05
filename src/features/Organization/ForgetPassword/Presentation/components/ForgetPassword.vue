<script setup lang="ts">
import Eyehidden from '@/shared/icons/eyehidden.vue';
import EyeIcon from '@/shared/icons/EyeIcon.vue';
import ForgetImge from '@/shared/icons/ForgetImge.vue';
import Forgettitle from '@/shared/icons/Forgettitle.vue';
import Keyicon from '@/shared/icons/keyicon.vue';
import { ref } from 'vue'

// change password
const isPasswordVisible = ref()
</script>

<template>
  <div class="forget-password-page">

    <div class="forget-form">
      <form @submit.prevent="">
        <div class="forget-title">
          <Forgettitle />
          <h6>HSE.Cloud.Ai</h6>
        </div>
        <div class="title">
          <h6>Create password</h6>
          <p>create your own password here</p>
        </div>
        <div class="input-wrapper">
          <label for="">{{ $t('Password') }}</label>
          <div class="input-with-icon">
           <div class="key">
             <Keyicon />
           </div>
            <input :type="isPasswordVisible ? 'text' : 'password'" :placeholder="$t('Password')">
            <div class="eye">
              <Eyehidden v-if="isPasswordVisible" @click="isPasswordVisible = false"/>
              <EyeIcon v-else @click="isPasswordVisible = true"/>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-forget-password">{{ $t('change_password') }}</button>
      </form>
      <div class="imge">
        <ForgetImge />
      </div>
    </div>
  </div>
</template>
