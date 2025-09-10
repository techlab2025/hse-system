<script lang="ts" setup>
import { defineEmits, defineProps, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import IconFullScreen from "@/shared/icons/IconFullScreen.vue";
import IconMenu from "@/shared/icons/IconMenu.vue";
import IconLogout from "@/shared/icons/IconLogout.vue";
import IconArrowDownNav from "@/shared/icons/IconArrowDownNav.vue";
import { setDefaultImage } from "@/base/presentation/utils/set_default_image";
import { useUserStore } from "@/stores/user";
import defaultImage from "@/assets/images/user.png";
import ChangeLanguage from "./ChangeLanguage.vue";

const route = useRoute();
// console.log(route.name)
// defineEmits(["open"]);

const props = defineProps({
  open: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["open"]);

const toggleSidebar = () => {
  emit("open", !props.open);
};

const isFullScreen = ref(false);

const toggleFullScreen = () => {
  if (!isFullScreen.value) {
    enterFullScreen();
  } else {
    exitFullScreen();
  }
};

const enterFullScreen = () => {
  const elem = document.documentElement; // Make the entire page full screen
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen(); // Firefox
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen(); // Chrome, Safari, and Opera
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen(); // IE/Edge
  }
};

const exitFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen(); // Firefox
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen(); // Chrome, Safari, and Opera
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen(); // IE/Edge
  }
};

const updateFullScreenState = () => {
  isFullScreen.value = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
};

onMounted(() => {
  document.addEventListener("fullscreenchange", updateFullScreenState);
  document.addEventListener("webkitfullscreenchange", updateFullScreenState);
  document.addEventListener("mozfullscreenchange", updateFullScreenState);
  document.addEventListener("MSFullscreenChange", updateFullScreenState);
});

onBeforeUnmount(() => {
  document.removeEventListener("fullscreenchange", updateFullScreenState);
  document.removeEventListener("webkitfullscreenchange", updateFullScreenState);
  document.removeEventListener("mozfullscreenchange", updateFullScreenState);
  document.removeEventListener("MSFullscreenChange", updateFullScreenState);
});

const language = ref<string>("");

const router = useRouter();
const userStore = useUserStore();

const logout = async () => {
  localStorage.removeItem("user");
  await userStore.logout();
  await router.push("/login");
};

const isDropMenuOpen = ref(false);

const toggleDropMenu = () => {
  isDropMenuOpen.value = !isDropMenuOpen.value;
};

// fetch user store data
const user = useUserStore()?.user;
</script>

<template>
  <header class="header">
    <nav class="nav">
      <div class="menu">
        <!-- Add the new icon to open the sidebar -->
        <span v-if="!props.open" class="cursor-pointer" @click="toggleSidebar">
          <IconMenu />
        </span>
        <span v-else class="cursor-pointer" @click="toggleSidebar">
          <IconMenu />
        </span>
        <div class="header-link flex gap-sm items-center">
          <h1>
            <router-link to="/">{{ $t("home") }} / </router-link>
          </h1>
          <p>
            {{ $t(typeof route?.name === "string" ? route.name : "") }}
          </p>
        </div>
      </div>
      <div class="setting">
        <div class="full_screen cursor-pointer" @click="toggleFullScreen">
          <IconFullScreen />
        </div>
        <ChangeLanguage />
        <div
          class="user cursor-pointer dropdown-trigger"
          @click="toggleDropMenu"
        >
          <IconArrowDownNav />
          <span>{{ user?.name }}</span>
          <img
            alt="user"
            :src="user?.image"
            @error="setDefaultImage($event, defaultImage)"
          />
          <div class="dropdown-menu" v-if="isDropMenuOpen">
            <ul>
              <li @click="logout">
                <IconLogout />
                <span> Logout </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped></style>
