<script lang="ts" setup>
import { PermissionsEnum } from '../users/Admin/Core/Enum/permission_enum';

</script>
<template>
  <div class="home-routes-cards">
    <PermissionBuilder :code="[
      PermissionsEnum.ORG_EMPLOYEE_ALL,
      PermissionsEnum.ORG_EMPLOYEE_CREATE,
      PermissionsEnum.ORG_EMPLOYEE_DELETE,
      PermissionsEnum.ORG_EMPLOYEE_FETCH,
      PermissionsEnum.ORG_EMPLOYEE_UPDATE,
      PermissionsEnum.ORG_EMPLOYEE_DETAILS,
    ]">
      <router-link to="/organization/projects">
        <!-- <HomeRoutesCard :img-src="CardProjectLogo" :title="`project`" :description="`plan . tasks . hierarchy`" /> -->
      </router-link>
    </PermissionBuilder>
  </div>
</template>
