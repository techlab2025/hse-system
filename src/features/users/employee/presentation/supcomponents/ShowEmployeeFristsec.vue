<script setup lang="ts">
import ShowEmployeeModel from "@/features/users/employee/Data/models/show_employee_model";
import { setDefaultImage } from "@/base/Presentation/utils/set_default_image";
import defaultImage from "@/assets/images/user.png";

const props = defineProps<{ data: ShowEmployeeModel | null }>();
</script>

<template>
  <div class="information-section">
    <div class="all-deta">
      <div class="head">
        <h4>Employee personal information</h4>
      </div>
      <div
        class="client-details grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7"
      >
        <div class="main-details col-span-1">
          <img
            :src="data?.image"
            @error="setDefaultImage($event, defaultImage)"
            alt=""
          />
          <h4>Employee name</h4>
          <p>{{ data?.name }}</p>
        </div>
        <div class="card-client col-span-1">
          <h4>Card number</h4>
          <p>{{ data?.crudNumber }}</p>
        </div>
        <div class="end-date col-span-1">
          <h4>End date</h4>
          <p>{{ data?.endDateCrud }}</p>
        </div>
        <div class="phone-number col-span-1">
          <h4>Phone number</h4>
          <p>{{ data?.phone }}</p>
        </div>
        <div class="academic-degree col-span-1">
          <h4>Academic degree</h4>
          <p>{{ data?.department?.title }}</p>
        </div>
        <div class="marital-status col-span-1">
          <h4>marital status</h4>
          <p>
            {{ data?.maritalStatus == 1 ? "Single" : "Married" }}
          </p>
        </div>
        <div class="kind col-span-1">
          <h4>Kind</h4>
          <p>
            {{ data?.gender == 1 ? "Male" : "Female" }}
          </p>
        </div>
      </div>
      <div class="appointment-papers flex-col gap-4">
        <div class="appointment-download" v-if="data?.attachments?.length > 0">
          <div class="head">
            <h4>Appointment papers</h4>
          </div>
          <div class="all-download">
            <div
              class="download"
              v-for="attachment in data?.attachments"
              :key="attachment.id"
            >
              <div class="img-inof">
                <img src="../../../../../../assets/images/user.png" alt="" />
                <div class="in-of">
                  <p>PNG</p>
                  <p>2.8 MB</p>
                </div>
              </div>
              <div class="icon-download">
                <img
                  src="../../../../../../assets/images/receive-square.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div class="his-address">
          <div class="head">
            <h4>His address and place of residence</h4>
            <p>
              {{ data?.country?.title }} / {{ data?.city?.title }} /
              {{ data?.governorate?.title }} /
              {{ data?.department?.title }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
