import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import type { PermissionItem } from './adminPremission'

export const OrgPermissions: PermissionItem = {
  key: PermissionsEnum.ORGANIZATION_EMPLOYEE,
  code: PermissionsEnum.ORGANIZATION_EMPLOYEE,
  label: 'Organization',
  permissions: [
    // =========================
    // ORGANIZATION
    // =========================
    {
      key: PermissionsEnum.ORGANIZATION_EMPLOYEE,
      code: PermissionsEnum.ORGANIZATION_EMPLOYEE,
      label: 'Organization',
      permissions: [
        // Auth
        // {
        //     key: PermissionsEnum.ORG_EMPLOYEE_LOGIN,
        //     code: PermissionsEnum.ORG_EMPLOYEE_LOGIN,
        //     label: "Auth",
        //     permissions: [
        //         {
        //             key: PermissionsEnum.ORG_EMPLOYEE_LOGIN,
        //             code: PermissionsEnum.ORG_EMPLOYEE_LOGIN,
        //             label: "Org Employee - Login",
        //         },
        //         {
        //             key: PermissionsEnum.ORG_EMPLOYEE_CHANGE_PASSWORD,
        //             code: PermissionsEnum.ORG_EMPLOYEE_CHANGE_PASSWORD,
        //             label: "Org Employee - Change Password",
        //         },
        //     ],
        // },

        // Permission
        {
          key: PermissionsEnum.CREATE_PERMISSION,
          code: PermissionsEnum.CREATE_PERMISSION,
          label: 'Permission',
          permissions: [
            {
              key: PermissionsEnum.CREATE_PERMISSION,
              code: PermissionsEnum.CREATE_PERMISSION,
              label: 'Create',
            },
          ],
        },

        // Equipment Type
        {
          key: PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
          code: PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
          label: 'Equipment Type',
          permissions: [
            {
              key: PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
              code: PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_TYPE_FETCH,
              code: PermissionsEnum.ORG_EQUIPMENT_TYPE_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_TYPE_DETAILS,
              code: PermissionsEnum.ORG_EQUIPMENT_TYPE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_TYPE_CREATE,
              code: PermissionsEnum.ORG_EQUIPMENT_TYPE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_TYPE_UPDATE,
              code: PermissionsEnum.ORG_EQUIPMENT_TYPE_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_TYPE_DELETE,
              code: PermissionsEnum.ORG_EQUIPMENT_TYPE_DELETE,
              label: 'Delete',
            },
          ],
        },

        // Objective
        {
          key: PermissionsEnum.OBJECTIVE_ORG_ALL,
          code: PermissionsEnum.OBJECTIVE_ORG_ALL,
          label: 'Objective',
          permissions: [
            {
              key: PermissionsEnum.OBJECTIVE_ORG_ALL,
              code: PermissionsEnum.OBJECTIVE_ORG_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.OBJECTIVE_ORG_FETCH,
              code: PermissionsEnum.OBJECTIVE_ORG_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.OBJECTIVE_ORG_DETAILS,
              code: PermissionsEnum.OBJECTIVE_ORG_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.OBJECTIVE_ORG_CREATE,
              code: PermissionsEnum.OBJECTIVE_ORG_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.OBJECTIVE_ORG_UPDATE,
              code: PermissionsEnum.OBJECTIVE_ORG_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.OBJECTIVE_ORG_DELETE,
              code: PermissionsEnum.OBJECTIVE_ORG_DELETE,
              label: 'Delete',
            },
          ],
        },

        // Factory
        {
          key: PermissionsEnum.ORG_FACTORY_ALL,
          code: PermissionsEnum.ORG_FACTORY_ALL,
          label: 'Factory',
          permissions: [
            {
              key: PermissionsEnum.ORG_FACTORY_ALL,
              code: PermissionsEnum.ORG_FACTORY_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_FACTORY_FETCH,
              code: PermissionsEnum.ORG_FACTORY_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_FACTORY_DETAILS,
              code: PermissionsEnum.ORG_FACTORY_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_FACTORY_CREATE,
              code: PermissionsEnum.ORG_FACTORY_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_FACTORY_UPDATE,
              code: PermissionsEnum.ORG_FACTORY_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_FACTORY_DELETE,
              code: PermissionsEnum.ORG_FACTORY_DELETE,
              label: 'Delete',
            },
          ],
        },

        // PROJECT ZONE
        {
          key: PermissionsEnum.PROJECT_ZONE_ALL,
          code: PermissionsEnum.PROJECT_ZONE_ALL,
          label: 'Project Zone',
          permissions: [
            {
              key: PermissionsEnum.PROJECT_ZONE_ALL,
              code: PermissionsEnum.PROJECT_ZONE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_FETCH,
              code: PermissionsEnum.PROJECT_ZONE_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_DETAILS,
              code: PermissionsEnum.PROJECT_ZONE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_CREATE,
              code: PermissionsEnum.PROJECT_ZONE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_UPDATE,
              code: PermissionsEnum.PROJECT_ZONE_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_DELETE,
              code: PermissionsEnum.PROJECT_ZONE_DELETE,
              label: 'Delete',
            },
          ],
        },

        // HiRikaly
        {
          key: PermissionsEnum.HERIKALY_ALL,
          code: PermissionsEnum.HERIKALY_ALL,
          label: 'HiRikaly',
          permissions: [
            { key: PermissionsEnum.HERIKALY_ALL, code: PermissionsEnum.HERIKALY_ALL, label: 'All' },
            {
              key: PermissionsEnum.HERIKALY_FETCH,
              code: PermissionsEnum.HERIKALY_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.HERIKALY_DETAILS,
              code: PermissionsEnum.HERIKALY_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.HERIKALY_CREATE,
              code: PermissionsEnum.HERIKALY_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.HERIKALY_UPDATE,
              code: PermissionsEnum.HERIKALY_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.HERIKALY_DELETE,
              code: PermissionsEnum.HERIKALY_DELETE,
              label: 'Delete',
            },
          ],
        },

        // Factory Item
        {
          key: PermissionsEnum.ORG_FACTORY_ITEM_ALL,
          code: PermissionsEnum.ORG_FACTORY_ITEM_ALL,
          label: 'Factory Item',
          permissions: [
            {
              key: PermissionsEnum.ORG_FACTORY_ITEM_ALL,
              code: PermissionsEnum.ORG_FACTORY_ITEM_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_FACTORY_ITEM_FETCH,
              code: PermissionsEnum.ORG_FACTORY_ITEM_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_FACTORY_ITEM_DETAILS,
              code: PermissionsEnum.ORG_FACTORY_ITEM_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_FACTORY_ITEM_CREATE,
              code: PermissionsEnum.ORG_FACTORY_ITEM_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_FACTORY_ITEM_UPDATE,
              code: PermissionsEnum.ORG_FACTORY_ITEM_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_FACTORY_ITEM_DELETE,
              code: PermissionsEnum.ORG_FACTORY_ITEM_DELETE,
              label: 'Delete',
            },
          ],
        },

        // Template
        {
          key: PermissionsEnum.ORG_TEMPLATE_ALL,
          code: PermissionsEnum.ORG_TEMPLATE_ALL,
          label: 'Template',
          permissions: [
            {
              key: PermissionsEnum.ORG_TEMPLATE_ALL,
              code: PermissionsEnum.ORG_TEMPLATE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_TEMPLATE_FETCH,
              code: PermissionsEnum.ORG_TEMPLATE_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_TEMPLATE_DETAILS,
              code: PermissionsEnum.ORG_TEMPLATE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_TEMPLATE_CREATE,
              code: PermissionsEnum.ORG_TEMPLATE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_TEMPLATE_UPDATE,
              code: PermissionsEnum.ORG_TEMPLATE_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_TEMPLATE_DELETE,
              code: PermissionsEnum.ORG_TEMPLATE_DELETE,
              label: 'Delete',
            },
          ],
        },

        // Hazard Type
        {
          key: PermissionsEnum.ORG_HAZARD_TYPE_ALL,
          code: PermissionsEnum.ORG_HAZARD_TYPE_ALL,
          label: 'Hazard Type',
          permissions: [
            {
              key: PermissionsEnum.ORG_HAZARD_TYPE_ALL,
              code: PermissionsEnum.ORG_HAZARD_TYPE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_HAZARD_TYPE_FETCH,
              code: PermissionsEnum.ORG_HAZARD_TYPE_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_HAZARD_TYPE_DETAILS,
              code: PermissionsEnum.ORG_HAZARD_TYPE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_HAZARD_TYPE_CREATE,
              code: PermissionsEnum.ORG_HAZARD_TYPE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_HAZARD_TYPE_UPDATE,
              code: PermissionsEnum.ORG_HAZARD_TYPE_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_HAZARD_TYPE_DELETE,
              code: PermissionsEnum.ORG_HAZARD_TYPE_DELETE,
              label: 'Delete',
            },
          ],
        },

        // PARTNER
        {
          key: PermissionsEnum.PARTNER_ALL,
          code: PermissionsEnum.PARTNER_ALL,
          label: 'Partner',
          permissions: [
            { key: PermissionsEnum.PARTNER_ALL, code: PermissionsEnum.PARTNER_ALL, label: 'All' },
            {
              key: PermissionsEnum.PARTNER_FETCH,
              code: PermissionsEnum.PARTNER_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.PARTNER_DETAILS,
              code: PermissionsEnum.PARTNER_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.PARTNER_CREATE,
              code: PermissionsEnum.PARTNER_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.PARTNER_UPDATE,
              code: PermissionsEnum.PARTNER_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.PARTNER_DELETE,
              code: PermissionsEnum.PARTNER_DELETE,
              label: 'Delete',
            },
          ],
        },

        // Projects
        {
          key: PermissionsEnum.PROJECT_ALL,
          code: PermissionsEnum.PROJECT_ALL,
          label: 'Projects',
          permissions: [
            { key: PermissionsEnum.PROJECT_ALL, code: PermissionsEnum.PROJECT_ALL, label: 'All' },
            {
              key: PermissionsEnum.PROJECT_FETCH,
              code: PermissionsEnum.PROJECT_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.PROJECT_DETAILS,
              code: PermissionsEnum.PROJECT_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.PROJECT_CREATE,
              code: PermissionsEnum.PROJECT_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.PROJECT_UPDATE,
              code: PermissionsEnum.PROJECT_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.PROJECT_DELETE,
              code: PermissionsEnum.PROJECT_DELETE,
              label: 'Delete',
            },
          ],
        },

        // Certificate
        {
          key: PermissionsEnum.CERTIFICATE_ALL,
          code: PermissionsEnum.CERTIFICATE_ALL,
          label: 'Certificate',
          permissions: [
            {
              key: PermissionsEnum.CERTIFICATE_ALL,
              code: PermissionsEnum.CERTIFICATE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.CERTIFICATE_FETCH,
              code: PermissionsEnum.CERTIFICATE_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.CERTIFICATE_DETAILS,
              code: PermissionsEnum.CERTIFICATE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.CERTIFICATE_CREATE,
              code: PermissionsEnum.CERTIFICATE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.CERTIFICATE_UPDATE,
              code: PermissionsEnum.CERTIFICATE_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.CERTIFICATE_DELETE,
              code: PermissionsEnum.CERTIFICATE_DELETE,
              label: 'Delete',
            },
          ],
        },

        // Accidents Type
        {
          key: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
          code: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
          label: 'Accidents Type',
          permissions: [
            {
              key: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
              code: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_ACCIDENTS_TYPE_FETCH,
              code: PermissionsEnum.ORG_ACCIDENTS_TYPE_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_ACCIDENTS_TYPE_DETAILS,
              code: PermissionsEnum.ORG_ACCIDENTS_TYPE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_ACCIDENTS_TYPE_CREATE,
              code: PermissionsEnum.ORG_ACCIDENTS_TYPE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_ACCIDENTS_TYPE_UPDATE,
              code: PermissionsEnum.ORG_ACCIDENTS_TYPE_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_ACCIDENTS_TYPE_DELETE,
              code: PermissionsEnum.ORG_ACCIDENTS_TYPE_DELETE,
              label: 'Delete',
            },
          ],
        },

        // Equipment
        {
          key: PermissionsEnum.ORG_EQUIPMENT_ALL,
          code: PermissionsEnum.ORG_EQUIPMENT_ALL,
          label: 'Equipment',
          permissions: [
            {
              key: PermissionsEnum.ORG_EQUIPMENT_ALL,
              code: PermissionsEnum.ORG_EQUIPMENT_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_FETCH,
              code: PermissionsEnum.ORG_EQUIPMENT_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_DETAILS,
              code: PermissionsEnum.ORG_EQUIPMENT_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_CREATE,
              code: PermissionsEnum.ORG_EQUIPMENT_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_UPDATE,
              code: PermissionsEnum.ORG_EQUIPMENT_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_DELETE,
              code: PermissionsEnum.ORG_EQUIPMENT_DELETE,
              label: 'Delete',
            },
          ],
        },

        // Location
        {
          key: PermissionsEnum.LOCATION_ORG_ALL,
          code: PermissionsEnum.LOCATION_ORG_ALL,
          label: 'Location',
          permissions: [
            {
              key: PermissionsEnum.LOCATION_ORG_ALL,
              code: PermissionsEnum.LOCATION_ORG_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.LOCATION_ORG_FETCH,
              code: PermissionsEnum.LOCATION_ORG_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.LOCATION_ORG_DETAILS,
              code: PermissionsEnum.LOCATION_ORG_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.LOCATION_ORG_CREATE,
              code: PermissionsEnum.LOCATION_ORG_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.LOCATION_ORG_UPDATE,
              code: PermissionsEnum.LOCATION_ORG_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.LOCATION_ORG_DELETE,
              code: PermissionsEnum.LOCATION_ORG_DELETE,
              label: 'Delete',
            },
          ],
        },
        // methods
        {
          key: PermissionsEnum.ORG_METHOD_ALL,
          code: PermissionsEnum.ORG_METHOD_ALL,
          label: 'Method',
          permissions: [
            {
              key: PermissionsEnum.ORG_METHOD_ALL,
              code: PermissionsEnum.ORG_METHOD_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_METHOD_FETCH,
              code: PermissionsEnum.ORG_METHOD_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_METHOD_DETAILS,
              code: PermissionsEnum.ORG_METHOD_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_METHOD_CREATE,
              code: PermissionsEnum.ORG_METHOD_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_METHOD_UPDATE,
              code: PermissionsEnum.ORG_METHOD_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_METHOD_DELETE,
              code: PermissionsEnum.ORG_METHOD_DELETE,
              label: 'Delete',
            },
          ],
        },
        // team
        {
          key: PermissionsEnum.ORG_TEAM_ALL,
          code: PermissionsEnum.ORG_TEAM_ALL,
          label: 'Team',
          permissions: [
            { key: PermissionsEnum.ORG_TEAM_ALL, code: PermissionsEnum.ORG_TEAM_ALL, label: 'All' },
            {
              key: PermissionsEnum.ORG_TEAM_FETCH,
              code: PermissionsEnum.ORG_TEAM_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_TEAM_DETAILS,
              code: PermissionsEnum.ORG_TEAM_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_TEAM_CREATE,
              code: PermissionsEnum.ORG_TEAM_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_TEAM_UPDATE,
              code: PermissionsEnum.ORG_TEAM_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_TEAM_DELETE,
              code: PermissionsEnum.ORG_TEAM_DELETE,
              label: 'Delete',
            },
          ],
        },

        // Employee
        {
          key: PermissionsEnum.ORG_EMPLOYEE_ALL,
          code: PermissionsEnum.ORG_EMPLOYEE_ALL,
          label: 'Employee',
          permissions: [
            {
              key: PermissionsEnum.ORG_EMPLOYEE_ALL,
              code: PermissionsEnum.ORG_EMPLOYEE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_EMPLOYEE_FETCH,
              code: PermissionsEnum.ORG_EMPLOYEE_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_EMPLOYEE_DETAILS,
              code: PermissionsEnum.ORG_EMPLOYEE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_EMPLOYEE_CREATE,
              code: PermissionsEnum.ORG_EMPLOYEE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_EMPLOYEE_UPDATE,
              code: PermissionsEnum.ORG_EMPLOYEE_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_EMPLOYEE_DELETE,
              code: PermissionsEnum.ORG_EMPLOYEE_DELETE,
              label: 'Delete',
            },
          ],
        },

        // Contractor
        {
          key: PermissionsEnum.ORG_CONTRACTOR_ALL,
          code: PermissionsEnum.ORG_CONTRACTOR_ALL,
          label: 'Contractor',
          permissions: [
            {
              key: PermissionsEnum.ORG_CONTRACTOR_ALL,
              code: PermissionsEnum.ORG_CONTRACTOR_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_FETCH,
              code: PermissionsEnum.ORG_CONTRACTOR_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_DETAILS,
              code: PermissionsEnum.ORG_CONTRACTOR_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_DELETE,
              code: PermissionsEnum.ORG_CONTRACTOR_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_UPDATE,
              code: PermissionsEnum.ORG_CONTRACTOR_UPDATE,
              label: 'update',
            },
          ],
        },

        // Eqipment Mangement
        {
          key: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
          code: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
          label: 'Equipment Manegement',
          permissions: [
            {
              key: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
              code: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_FETCH,
              code: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_DETAILS,
              code: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_DELETE,
              code: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_UPDATE,
              code: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_UPDATE,
              label: 'update',
            },
          ],
        },
        // Roles
        {
          key: PermissionsEnum.ORG_ROLE_ALL,
          code: PermissionsEnum.ORG_ROLE_ALL,
          label: 'Role',
          permissions: [
            {
              key: PermissionsEnum.ORG_ROLE_ALL,
              code: PermissionsEnum.ORG_ROLE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_ROLE_FETCH,
              code: PermissionsEnum.ORG_ROLE_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_ROLE_DETAILS,
              code: PermissionsEnum.ORG_ROLE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_ROLE_DELETE,
              code: PermissionsEnum.ORG_ROLE_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.ORG_ROLE_UPDATE,
              code: PermissionsEnum.ORG_ROLE_UPDATE,
              label: 'update',
            },
          ],
        },

        // Inspection
        {
          key: PermissionsEnum.ORG_INSPECTION_ALL,
          code: PermissionsEnum.ORG_INSPECTION_ALL,
          label: 'Inspection',
          permissions: [
            {
              key: PermissionsEnum.ORG_INSPECTION_ALL,
              code: PermissionsEnum.ORG_INSPECTION_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_INSPECTION_FETCH,
              code: PermissionsEnum.ORG_INSPECTION_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_INSPECTION_DETAILS,
              code: PermissionsEnum.ORG_INSPECTION_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_INSPECTION_DELETE,
              code: PermissionsEnum.ORG_INSPECTION_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.ORG_INSPECTION_UPDATE,
              code: PermissionsEnum.ORG_INSPECTION_UPDATE,
              label: 'update',
            },
          ],
        },
        // Hazard
        {
          key: PermissionsEnum.ORG_HAZARD_ALL,
          code: PermissionsEnum.ORG_HAZARD_ALL,
          label: 'Hazard',
          permissions: [
            {
              key: PermissionsEnum.ORG_HAZARD_ALL,
              code: PermissionsEnum.ORG_HAZARD_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_HAZARD_FETCH,
              code: PermissionsEnum.ORG_HAZARD_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_HAZARD_DETAILS,
              code: PermissionsEnum.ORG_HAZARD_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_HAZARD_DELETE,
              code: PermissionsEnum.ORG_HAZARD_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.ORG_HAZARD_UPDATE,
              code: PermissionsEnum.ORG_HAZARD_UPDATE,
              label: 'update',
            },
          ],
        },
        // INCEDANT
        {
          key: PermissionsEnum.ORG_INCEDANT_ALL,
          code: PermissionsEnum.ORG_INCEDANT_ALL,
          label: 'Incident',
          permissions: [
            {
              key: PermissionsEnum.ORG_INCEDANT_ALL,
              code: PermissionsEnum.ORG_INCEDANT_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_INCEDANT_FETCH,
              code: PermissionsEnum.ORG_INCEDANT_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_INCEDANT_DETAILS,
              code: PermissionsEnum.ORG_INCEDANT_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_INCEDANT_DELETE,
              code: PermissionsEnum.ORG_INCEDANT_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.ORG_INCEDANT_UPDATE,
              code: PermissionsEnum.ORG_INCEDANT_UPDATE,
              label: 'update',
            },
          ],
        },
        // Observation
        {
          key: PermissionsEnum.ORG_OBSERVATION_ALL,
          code: PermissionsEnum.ORG_OBSERVATION_ALL,
          label: 'Observation',
          permissions: [
            {
              key: PermissionsEnum.ORG_OBSERVATION_ALL,
              code: PermissionsEnum.ORG_OBSERVATION_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_FETCH,
              code: PermissionsEnum.ORG_OBSERVATION_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_DETAILS,
              code: PermissionsEnum.ORG_OBSERVATION_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_DELETE,
              code: PermissionsEnum.ORG_OBSERVATION_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_UPDATE,
              code: PermissionsEnum.ORG_OBSERVATION_UPDATE,
              label: 'update',
            },
          ],
        },
      ],
    },
  ],
}
