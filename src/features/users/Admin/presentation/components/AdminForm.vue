<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
// import ImageUser from '@/components/HelpersComponents/ImageUser.vue'
// import DatePicker from 'primevue/datepicker'
// import type TitleInterface from '@/base/Data/Models/title_interface'
import type ShowAdminModel from '@/features/users/Admin/Data/models/show_Admin_model'
// import { convertToBase64 } from '@/base/Presentation/utils/convert_to_base_64'
// import Select from 'primevue/select'
// import CustomSelectInput from '@/components/HelpersComponents/CustomSelectInput.vue'
import EditAdminParams from '../../Core/Params/edit_admin_params'
import { useRoute } from 'vue-router'
import AddAdminParams from '../../Core/Params/add_admin_params'

const emit = defineEmits(['update:updateData'])
const props = defineProps<{
  AdminData: ShowAdminModel
}>()
const name = ref(props.AdminData?.name)
const AdminType = ref(1)
const email = ref(props.AdminData?.email)

const password = ref<string>(props.AdminData?.password)

const phone = ref(props.AdminData?.phone)

watch(
  () => props.AdminData,
  async (newAdminData) => {
    // console.log(newAdminData);
    name.value = newAdminData?.name
    email.value = newAdminData?.email

    password.value = newAdminData?.password
    phone.value = newAdminData?.phone

    updateData()
  },
)

onMounted(async () => updateData())

const route = useRoute()

const updateData = () => {
  emit(
    'update:updateData',
    props.AdminData?.id != null
      ? new EditAdminParams({
          admin_id: +route.params.id,
          name: name.value,
          email: email.value,
          password: password.value,
          phone: phone.value,
        })
      : new AddAdminParams({
          name: name.value,
          email: email.value,
          password: password.value,
          phone: phone.value,
        }),
  )
}

const updateTeamMember = () => {
  updateData()
}
</script>

<template>
  <div class="input-wrapper">
    <label  for="name">name        <span class="text-red-500" >*</span>
    </label>
    <input
      id="name"
      v-model="name"
      class="input"
      placeholder="Enter name"
      type="text"
      @input="updateData"
    />
  </div>
  <div class="input-wrapper">
    <label  for="phone">phone <span class="text-red-500" >*</span></label>
    <input
      id="phone"
      v-model="phone"
      class="input"
      placeholder="Enter phone"
      type="text"
      @input="updateData"
    />
  </div>

  <div class="input-wrapper">
    <label  for="name">Email <span class="text-red-500" >*</span></label>
    <input
      id="email"
      v-model="email"
      class="input"
      placeholder="Enter Name"
      type="text"
      @input="updateData"
    />
  </div>
  <div class="input-wrapper">
    <label  for="password">Password <span class="text-red-500" >*</span></label>
    <input
      id="password"
      v-model="password"
      class="input"
      placeholder="Enter Password"
      type="password"
      @input="updateData"
    />
  </div>
</template>

<style scoped></style>
