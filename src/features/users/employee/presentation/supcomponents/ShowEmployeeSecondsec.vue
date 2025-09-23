<script setup lang="ts">
import ShowEmployeeModel from "@/features/users/employee/Data/models/show_employee_model";
const props = defineProps<{ data: ShowEmployeeModel | null }>();
</script>

<template>
  <div class="contracting-information">
    <div class="all-deta">
      <div class="head">
        <h4>Contracting information</h4>
      </div>
      <div
        class="client-details grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6"
      >
        <div class="main-details col-span-1">
          <h4>Appointment date</h4>
          <p>{{ data?.contracts?.appointmentDate }}</p>
        </div>
        <div class="end-date col-span-1">
          <h4>Contract expiration date</h4>
          <p>{{ data?.contracts?.expirationDate }}</p>
        </div>
        <div class="card-client col-span-1">
          <h4>Contract date</h4>
          <p>{{ data?.contracts?.contractDate }}</p>
        </div>

        <div class="phone-number col-span-1">
          <h4>Salary</h4>
          <p>{{ data?.contracts?.salary }}</p>
        </div>
        <div class="academic-degree col-span-1">
          <h4>Suits</h4>
          <p>{{ data?.contracts?.suits }}</p>
        </div>
        <div class="marital-status col-span-1">
          <h4>Insurance</h4>
          <p>{{ data?.contracts?.insurance }}</p>
        </div>
        <div class="main-details col-span-1">
          <h4>Covenant Finance</h4>
          <p>{{ data?.contracts?.covenantFinance }}</p>
        </div>
        <div class="card-client col-span-1">
          <h4>Annual tickets</h4>
          <p>{{ data?.contracts?.annualTickets }}</p>
        </div>
        <div class="end-date col-span-1">
          <h4>Transfers</h4>
          <p>{{ data?.contracts?.transfers }}</p>
        </div>
        <div class="phone-number col-span-1">
          <h4>housing</h4>
          <p>{{ data?.contracts?.housing }}</p>
        </div>
        <div class="academic-degree col-span-1">
          <h4>Commissions</h4>
          <p>{{ data?.contracts?.commission }}</p>
        </div>
        <div class="marital-status col-span-1">
          <h4>Incentives</h4>
          <p>{{ data?.contracts?.incentives }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
