// userStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type UserModel from "@/features/auth/Data/models/user_model";

export const useUserStore = defineStore("user", () => {
  const user = ref<UserModel | null>(null);
  const isAuth = ref(false);
  const expiresAt = ref<number | null>(null);

  function setUser(newUser: UserModel) {
    user.value = newUser;
    isAuth.value = true;
    expiresAt.value = Date.now() + 24 * 60 * 60 * 1000; // 24h
    setAutoLogout();
  }

  async function logout() {
    user.value = null;
    isAuth.value = false;
    expiresAt.value = null;
  }

  function setAutoLogout() {
    if (expiresAt.value) {
      const timeout = expiresAt.value - Date.now();
      if (timeout > 0) {
        setTimeout(() => logout(), timeout);
      }
    }
  }

  return {
    user,
    isAuth,
    expiresAt,
    setUser,
    logout,
    setAutoLogout,
  };
}, {
  persist: {
    enabled: true,

  },
});
