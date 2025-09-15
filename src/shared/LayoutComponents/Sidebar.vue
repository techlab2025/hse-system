<script setup lang="ts">
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import { computed, defineProps, defineEmits} from "vue";
import IconsHome from "@/shared/icons/home.vue";
import IconsEmployee from "@/shared/icons/employee.vue";
import IconsClipboardText from "@/shared/icons/clipboardText.vue";
import IconsElement from "@/shared/icons/element.vue";
import IconsClipBoard from "@/shared/icons/clipBoard.vue";
import IconsTag from "@/shared/icons/tag.vue";

const emit = defineEmits(["close"]);
const props = defineProps({
  open: {
    type: Boolean,
    default: true,
  },
});

const isOpen = computed(() => props.open);
</script>

<template>
  <aside :class="['sidebar', isOpen ? 'open' : 'close']">
    <div
      class="menu flex items-center justify-center mb-2 cursor-pointer"
      v-if="!props.open"
      @click="$emit('close', true)"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 7H21"
          stroke="#fff"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M3 12H21"
          stroke="#fff"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M3 17H21"
          stroke="#fff"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </div>
    <router-link to="/" class="logo mt-3">
      <img src="@/assets/images/logo.png" alt="logo" />
    </router-link>
    <div class="sidebar-items">
      <router-link to="/" class="sidebar-item">
        <IconsHome />
        <p>{{ $t("home") }}</p>
      </router-link>

      <!--      <hr />-->
      <Accordion value="0">
        <!-- Blog -->

        <AccordionPanel value="0">
          <AccordionHeader>
            <div class="flex gap-sm">
              <IconsClipboardText />
              <span>{{ $t("users") }}</span>
            </div>
          </AccordionHeader>
          <AccordionContent>
            <router-link to="/employees" class="sidebar-item">
              <IconsEmployee />
              <span>{{ $t("employees") }}</span>
            </router-link>
            <router-link to="/user" class="sidebar-item">
              <IconsEmployee />
              <span>{{ $t("user") }}</span>
            </router-link>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="1">
          <AccordionHeader>
            <div class="flex gap-sm">
              <IconsClipboardText />
              <span>{{ $t("blog") }}</span>
            </div>
          </AccordionHeader>
          <AccordionContent>
            <router-link to="/blogs" class="sidebar-item">
              <IconsClipBoard />
              <span>{{ $t("blog") }}</span>
            </router-link>
            <router-link to="/blog_categories" class="sidebar-item">
              <IconsElement />
              <span>{{ $t("categories") }}</span>
            </router-link>
            <router-link to="/blog_hashtags" class="sidebar-item">
              <IconsTag />
              <span>{{ $t("hashtags") }}</span>
            </router-link>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="2">
          <AccordionHeader>
            <div class="flex gap-sm">
              <IconsClipboardText />
              <span>{{ $t("location") }}</span>
            </div>
          </AccordionHeader>
          <AccordionContent>
            <router-link to="/countries" class="sidebar-item">
              <IconsClipBoard />
              <span>{{ $t("countries") }}</span>
            </router-link>
            <router-link to="/governorates" class="sidebar-item">
              <IconsTag />
              <span>{{ $t("governorates") }}</span>
            </router-link>
            <router-link to="/cities" class="sidebar-item">
              <IconsElement />
              <span>{{ $t("cities") }}</span>
            </router-link>
            <router-link to="/regions" class="sidebar-item">
              <IconsTag />
              <span>{{ $t("region") }}</span>
            </router-link>
            <router-link to="/places" class="sidebar-item">
              <IconsTag />
              <span>{{ $t("places") }}</span>
            </router-link>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="3">
          <AccordionHeader>
            <div class="flex gap-sm">
              <IconsClipboardText />
              <span>{{ $t("stages_university") }}</span>
            </div>
          </AccordionHeader>
          <AccordionContent>
            <router-link to="/university_type" class="sidebar-item">
              <IconsClipBoard />
              <span>{{ $t("universityType") }}</span>
            </router-link>
            <router-link to="/university" class="sidebar-item">
              <IconsClipBoard />
              <span>{{ $t("university") }}</span>
            </router-link>
            <router-link to="/faculty" class="sidebar-item">
              <IconsTag />
              <span>{{ $t("faculty") }}</span>
            </router-link>
            <router-link to="/level" class="sidebar-item">
              <IconsElement />
              <span>{{ $t("level") }}</span>
            </router-link>
            <router-link to="/department" class="sidebar-item">
              <IconsTag />
              <span>{{ $t("department") }}</span>
            </router-link>
            <router-link to="/semester_university" class="sidebar-item">
              <IconsTag />
              <span>{{ $t("semester") }}</span>
            </router-link>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="4">
          <AccordionHeader>
            <div class="flex gap-sm">
              <IconsClipboardText />
              <span>{{ $t("stages_primary") }}</span>
            </div>
          </AccordionHeader>
          <AccordionContent>
            <router-link to="/primary_type" class="sidebar-item">
              <IconsTag />
              <span>{{ $t("primary_type") }}</span>
            </router-link>
            <router-link to="/primary_level" class="sidebar-item">
              <IconsTag />
              <span>{{ $t("primary_level") }}</span>
            </router-link>
            <router-link to="/primary_year" class="sidebar-item">
              <IconsTag />
              <span>{{ $t("year") }}</span>
            </router-link>
            <router-link to="/primary_semester" class="sidebar-item">
              <IconsTag />
              <span>{{ $t("semester") }}</span>
            </router-link>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="5">
          <AccordionHeader>
            <div class="flex gap-sm">
              <IconsClipboardText />
              <span>{{ $t("stages_general") }}</span>
            </div>
          </AccordionHeader>
          <AccordionContent>
            <router-link to="/stage_category" class="sidebar-item">
              <IconsTag />
              <span>{{ $t("stage_category") }}</span>
            </router-link>
            <router-link to="/stage_subcategory" class="sidebar-item">
              <IconsTag />
              <span>{{ $t("stage_subcategory") }}</span>
            </router-link>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="6">
          <AccordionHeader>
            <div class="flex gap-sm">
              <IconsClipboardText />
              <span>{{ $t("subjects") }}</span>
            </div>
          </AccordionHeader>
          <AccordionContent>
            <router-link to="/subjects" class="sidebar-item">
              <IconsClipBoard />
              <span>{{ $t("subjects") }}</span>
            </router-link>
            <router-link to="/units" class="sidebar-item">
              <IconsTag />
              <span>{{ $t("units") }}</span>
            </router-link>
            <router-link to="/lessons" class="sidebar-item">
              <IconsElement />
              <span>{{ $t("lessons") }}</span>
            </router-link>
          </AccordionContent>
        </AccordionPanel>


        <AccordionPanel value="7">
          <AccordionHeader>
            <div class="flex gap-sm">
              <IconsClipboardText />
              <span>{{ $t("courses") }}</span>
            </div>
          </AccordionHeader>
          <AccordionContent>
            <router-link to="/courses" class="sidebar-item">
              <IconsClipBoard />
              <span>{{ $t("courses") }}</span>
            </router-link>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="8">
          <AccordionHeader>
            <div class="flex gap-sm">
              <IconsClipboardText />
              <span>{{ $t("settings") }}</span>
            </div>
          </AccordionHeader>
          <AccordionContent>
            <router-link to="/partners" class="sidebar-item">
              <IconsClipBoard />
              <span>{{ $t("partners") }}</span>
            </router-link>
            <router-link to="/certificates" class="sidebar-item">
              <IconsClipBoard />
              <span>{{ $t("certificates") }}</span>
            </router-link>
            <router-link to="/platforms" class="sidebar-item">
              <IconsClipBoard />
              <span>{{ $t("platforms") }}</span>
            </router-link>
            <router-link to="/currency" class="sidebar-item">
              <IconsTag />
              <span>{{ $t("currency") }}</span>
            </router-link>
          </AccordionContent>
        </AccordionPanel>

      </Accordion>
    </div>
  </aside>
</template>

<style scoped></style>
