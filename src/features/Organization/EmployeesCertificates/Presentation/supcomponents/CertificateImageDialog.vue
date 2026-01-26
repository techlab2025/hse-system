<script setup lang="ts">
import { ref } from "vue";
import Dialog from 'primevue/dialog';
import Cert from "@/assets/images/Cert.png"
import HeaderSection from "@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue";
import DatePicker from 'primevue/datepicker';
import isBase64 from "@/base/Presentation/utils/isBase64";
import { filesToBase64 } from "@/base/Presentation/utils/file_to_base_64";
import SingleFileUpload from "@/shared/HelpersComponents/SingleFileUpload.vue";
import AddEmployeeCertificateController from "../controllers/addEmployeeCertificateController";
import AddEmployeeCertificateParams from "../../Core/params/AddEmplyeeCertificateParams";
import { useRouter } from "vue-router";

const props = defineProps<{
  certificateId: number,
  organizationEmployeeId: number,
  title: string,
  is_expire_date: boolean
}>()
const visible = ref(false);
const Notes = ref()
const SelectedData = ref(new Date())
const SelectedIssueData = ref(new Date())

const UpdateDate = (date) => {
  SelectedData.value = date
  // UpdateData();
}
const UpdateIssueDate = (date) => {
  SelectedIssueData.value = date
  // UpdateData();
}
const certificateImage = ref<string | null>(null)

const originalCertificateImage = ref<string | null>(null)
const resolveCertificateImage = () => {
  // EDIT
  // 1) not changed
  if (certificateImage.value === originalCertificateImage.value) {
    return undefined // <-- key مش هيتبعت
  }

  // 2) deleted
  if (!certificateImage.value) {
    return '*'
  }

  // 3) updated
  if (isBase64(certificateImage.value)) {
    return certificateImage.value
  }

  return undefined
}

const setCertificateImage = async (value: any) => {
  if (!value) {
    // user deleted image
    certificateImage.value = ''
  } else if (typeof value === 'string') {
    certificateImage.value = value
  } else {
    certificateImage.value = await filesToBase64(value)
  }
  // UpdateData()
}

const emit = defineEmits(['update:data'])
// const UpdateData = () => {
//   emit('update:data', {
//     certificateImage: resolveCertificateImage(),
//     notes: Notes.value,
//     expiryDate: SelectedData.value,
//   })
// }

const router = useRouter()
const UploadCertificateImage = async () => {
  const addEmployeeCertificateController = AddEmployeeCertificateController.getInstance()
  const addEmployeeCertificateParams = new AddEmployeeCertificateParams(props.certificateId, props.organizationEmployeeId, SelectedData.value, Notes.value, certificateImage.value, SelectedIssueData.value)
  const state = await addEmployeeCertificateController.addEmployeeCertificate(addEmployeeCertificateParams, router)
  visible.value = false
  emit("update:data")
}
</script>

<template>
  <button class="invalid-date" @click="visible = true"> {{ title || `add` }}</button>
  <Dialog v-model:visible="visible" :dismissable-mask="true" modal :style="{ width: '50rem' }">
    <template #header>
      <HeaderSection :img="Cert" title="Add certification"
        subtitle="Upload and assign a certification to this employee" />
    </template>

    <div class="certificate-dialog">
      <hr />
      <div class="dialog-content mt-10">
        <div class="input-wrapper">
          <label for="Notes">Notes</label>
          <input type="text" v-model="Notes" class="input" placeholder="Add notes ...">
        </div>
        <div class="input-wrapper mt-10" v-if="is_expire_date">
          <label for="">{{ $t('select_expire_date') }}</label>
          <DatePicker v-model="SelectedData" class="input" label="select Expiry Date" id="Day"
            placeholder="select Expiry Date" @update:modelValue="UpdateDate" />
        </div>
        <div class="input-wrapper mt-10">
          <label for="">{{ $t('select_issue_date') }}</label>
          <DatePicker v-model="SelectedIssueData" class="input" label="select Issue Date" id="Day"
            placeholder="select Issue Date" @update:modelValue="UpdateIssueDate" />
        </div>

        <div class="flex flex-col gap-2 input-wrapper col-span-2 md:col-span-1 mt-10">
          <label class="flex justify-between flex-wrap">
            <p>{{ $t('Certification Image upload') }}</p>
          </label>
          <SingleFileUpload :returnType="`base64`" v-model="certificateImage" @update:modelValue="setCertificateImage"
            label="Certification upload" id="Certification upload" index="2" placeholder="Certification upload" />
        </div>
      </div>
      <button class="btn btn-primary w-full mt-10" @click="UploadCertificateImage">Confirm</button>
    </div>
  </Dialog>
</template>

<style scoped>
.mt-10 {

  margin-top: 10px;
}
</style>
