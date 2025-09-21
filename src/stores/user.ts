// Updated user store
import type UserModel from "@/features/website/login/Data/models/user_model";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as UserModel | null,
    isAuth: false,
    expiresAt: null as number | null, // Store expiration timestamp
  }),
  actions: {
    setUser(user: UserModel) {
      this.user = user;
      this.isAuth = true;
      this.expiresAt = Date.now() + 24 * 60 * 60 * 1000; // Set expiration 24h ahead
      this.setAutoLogout();
    },
    async logout() {
      this.user = null;
      this.isAuth = false;
      this.expiresAt = null;
    },
    setAutoLogout() {
      if (this.expiresAt) {
        const timeout = this.expiresAt - Date.now();
        if (timeout > 0) {
          setTimeout(() => this.logout(), timeout);
        }
      }
    },
  },
  persist: {
    afterRestore: (ctx) => {
      const store = ctx.store;
      if (store.expiresAt && Date.now() > store.expiresAt) {
        store.logout();
      } else {
        store.setAutoLogout();
      }
    },
  },
});
