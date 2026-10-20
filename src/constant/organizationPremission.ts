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
        {
          key: PermissionsEnum.INTERNAL_AUDIT_ALL,
          code: PermissionsEnum.INTERNAL_AUDIT_ALL,
          label: 'Internal Audit',
          permissions: [
            {
              key: PermissionsEnum.INTERNAL_AUDIT_ALL,
              code: PermissionsEnum.INTERNAL_AUDIT_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.INTERNAL_AUDIT_FETCH,
              code: PermissionsEnum.INTERNAL_AUDIT_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.INTERNAL_AUDIT_DETAILS,
              code: PermissionsEnum.INTERNAL_AUDIT_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.INTERNAL_AUDIT_CREATE,
              code: PermissionsEnum.INTERNAL_AUDIT_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.INTERNAL_AUDIT_UPDATE,
              code: PermissionsEnum.INTERNAL_AUDIT_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.INTERNAL_AUDIT_DELETE,
              code: PermissionsEnum.INTERNAL_AUDIT_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.MY_INTERNAL_AUDIT_ALL,
          code: PermissionsEnum.MY_INTERNAL_AUDIT_ALL,
          label: 'My Internal Audit',
          permissions: [
            {
              key: PermissionsEnum.MY_INTERNAL_AUDIT_ALL,
              code: PermissionsEnum.MY_INTERNAL_AUDIT_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.MY_INTERNAL_AUDIT_FETCH,
              code: PermissionsEnum.MY_INTERNAL_AUDIT_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.MY_INTERNAL_AUDIT_DETAILS,
              code: PermissionsEnum.MY_INTERNAL_AUDIT_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.MY_INTERNAL_AUDIT_CREATE,
              code: PermissionsEnum.MY_INTERNAL_AUDIT_CREATE,
              label: 'Create NCR',
            },
          ],
        },
        // Auth
        // {
        //   key: PermissionsEnum.ORG_EMPLOYEE_LOGIN,
        //   code: PermissionsEnum.ORG_EMPLOYEE_LOGIN,
        //   label: 'Auth',
        //   permissions: [
        //     {
        //       key: PermissionsEnum.ORG_EMPLOYEE_LOGIN,
        //       code: PermissionsEnum.ORG_EMPLOYEE_LOGIN,
        //       label: 'Org Employee - Login',
        //     },
        //     {
        //       key: PermissionsEnum.ORG_EMPLOYEE_CHANGE_PASSWORD,
        //       code: PermissionsEnum.ORG_EMPLOYEE_CHANGE_PASSWORD,
        //       label: 'Org Employee - Change Password',
        //     },
        //   ],
        // },

        // Permission
        // {
        //   key: PermissionsEnum.CREATE_PERMISSION,
        //   code: PermissionsEnum.CREATE_PERMISSION,
        //   label: 'Permission',
        //   permissions: [
        //     {
        //       key: PermissionsEnum.CREATE_PERMISSION,
        //       code: PermissionsEnum.CREATE_PERMISSION,
        //       label: 'Create',
        //     },
        //   ],
        // },

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
              label: 'Table',
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
              label: 'Table',
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
            {
              key: PermissionsEnum.OBJECTIVE_ORG_ORDER,
              code: PermissionsEnum.OBJECTIVE_ORG_ORDER,
              label: 'Order',
            },
            {
              key: PermissionsEnum.OBJECTIVE_ORG_CHANGE_STATUS,
              code: PermissionsEnum.OBJECTIVE_ORG_CHANGE_STATUS,
              label: 'Change Status',
            },
          ],
        },

        // Factory
        {
          key: PermissionsEnum.ORG_FACTORY_ALL,
          code: PermissionsEnum.ORG_FACTORY_ALL,
          label: 'Factor',
          permissions: [
            {
              key: PermissionsEnum.ORG_FACTORY_ALL,
              code: PermissionsEnum.ORG_FACTORY_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_FACTORY_FETCH,
              code: PermissionsEnum.ORG_FACTORY_FETCH,
              label: 'Table',
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
              label: 'Table',
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
            {
              key: PermissionsEnum.PROJECT_ZONE_FETCH_LOCATIONS,
              code: PermissionsEnum.PROJECT_ZONE_FETCH_LOCATIONS,
              label: 'Fetch Locations',
            },
          ],
        },

        // Position
        {
          key: PermissionsEnum.HERIKALY_ALL,
          code: PermissionsEnum.HERIKALY_ALL,
          label: 'Position',
          permissions: [
            { key: PermissionsEnum.HERIKALY_ALL, code: PermissionsEnum.HERIKALY_ALL, label: 'All' },
            {
              key: PermissionsEnum.HERIKALY_FETCH,
              code: PermissionsEnum.HERIKALY_FETCH,
              label: 'Table',
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
          label: 'Factor Item',
          permissions: [
            {
              key: PermissionsEnum.ORG_FACTORY_ITEM_ALL,
              code: PermissionsEnum.ORG_FACTORY_ITEM_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_FACTORY_ITEM_FETCH,
              code: PermissionsEnum.ORG_FACTORY_ITEM_FETCH,
              label: 'Table',
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
              label: 'Table',
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
        // Template Item
        {
          key: PermissionsEnum.TEMPLATE_ITEM_ALL,
          code: PermissionsEnum.TEMPLATE_ITEM_ALL,
          label: 'Template Item',
          permissions: [
            {
              key: PermissionsEnum.TEMPLATE_ITEM_ALL,
              code: PermissionsEnum.TEMPLATE_ITEM_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.TEMPLATE_ITEM_FETCH,
              code: PermissionsEnum.TEMPLATE_ITEM_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.TEMPLATE_ITEM_DETAILS,
              code: PermissionsEnum.TEMPLATE_ITEM_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.TEMPLATE_ITEM_CREATE,
              code: PermissionsEnum.TEMPLATE_ITEM_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.TEMPLATE_ITEM_UPDATE,
              code: PermissionsEnum.TEMPLATE_ITEM_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.TEMPLATE_ITEM_DELETE,
              code: PermissionsEnum.TEMPLATE_ITEM_DELETE,
              label: 'Delete',
            },
          ],
        },

        // Hazard Type
        {
          key: PermissionsEnum.ORG_HAZARD_TYPE_ALL,
          code: PermissionsEnum.ORG_HAZARD_TYPE_ALL,
          label: 'Hazard Classification',
          permissions: [
            {
              key: PermissionsEnum.ORG_HAZARD_TYPE_ALL,
              code: PermissionsEnum.ORG_HAZARD_TYPE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_HAZARD_TYPE_FETCH,
              code: PermissionsEnum.ORG_HAZARD_TYPE_FETCH,
              label: 'Table',
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
              label: 'Table',
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
              label: 'Table',
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

        // Organization Documents
        {
          key: PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
          code: PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
          label: 'Organization Documents',
          permissions: [
            {
              key: PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
              code: PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORGANIZATION_DOCUMENTS_FETCH,
              code: PermissionsEnum.ORGANIZATION_DOCUMENTS_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORGANIZATION_DOCUMENTS_DETAILS,
              code: PermissionsEnum.ORGANIZATION_DOCUMENTS_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORGANIZATION_DOCUMENTS_CREATE,
              code: PermissionsEnum.ORGANIZATION_DOCUMENTS_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORGANIZATION_DOCUMENTS_UPDATE,
              code: PermissionsEnum.ORGANIZATION_DOCUMENTS_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORGANIZATION_DOCUMENTS_DELETE,
              code: PermissionsEnum.ORGANIZATION_DOCUMENTS_DELETE,
              label: 'Delete',
            },
          ],
        },

        // Certificate
        {
          key: PermissionsEnum.CERTIFICATE_ALL,
          code: PermissionsEnum.CERTIFICATE_ALL,
          label: 'Training',
          permissions: [
            {
              key: PermissionsEnum.CERTIFICATE_ALL,
              code: PermissionsEnum.CERTIFICATE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.CERTIFICATE_FETCH,
              code: PermissionsEnum.CERTIFICATE_FETCH,
              label: 'Table',
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

        // Incidents Type
        {
          key: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
          code: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
          label: 'Incidents Type',
          permissions: [
            {
              key: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
              code: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_ACCIDENTS_TYPE_FETCH,
              code: PermissionsEnum.ORG_ACCIDENTS_TYPE_FETCH,
              label: 'Table',
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
              label: 'Table',
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
              label: 'Table',
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
              label: 'Table',
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
              label: 'Table',
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
              label: 'Table',
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
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_DETAILS,
              code: PermissionsEnum.ORG_CONTRACTOR_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_CREATE,
              code: PermissionsEnum.ORG_CONTRACTOR_CREATE,
              label: 'Create',
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
          label: 'Operations',
          permissions: [
            {
              key: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
              code: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_FETCH,
              code: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_FETCH,
              label: 'Table',
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
            {
              key: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_CREATE,
              code: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_CREATE,
              label: 'Create',
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
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_ROLE_DETAILS,
              code: PermissionsEnum.ORG_ROLE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_ROLE_CREATE,
              code: PermissionsEnum.ORG_ROLE_CREATE,
              label: 'Create',
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

        // Attachment Matrix
        {
          key: PermissionsEnum.ATTACHMENT_MATRIX_ALL,
          code: PermissionsEnum.ATTACHMENT_MATRIX_ALL,
          label: 'Attachment Matrix',
          permissions: [
            {
              key: PermissionsEnum.ATTACHMENT_MATRIX_ALL,
              code: PermissionsEnum.ATTACHMENT_MATRIX_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ATTACHMENT_MATRIX_FETCH,
              code: PermissionsEnum.ATTACHMENT_MATRIX_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ATTACHMENT_MATRIX_CREATE,
              code: PermissionsEnum.ATTACHMENT_MATRIX_CREATE,
              label: 'Create',
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
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_INSPECTION_DETAILS,
              code: PermissionsEnum.ORG_INSPECTION_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_INSPECTION_CREATE,
              code: PermissionsEnum.ORG_INSPECTION_CREATE,
              label: 'Create',
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
            {
              key: PermissionsEnum.MY_TASKS_ALL,
              code: PermissionsEnum.MY_TASKS_ALL,
              label: 'drag',
            },
            {
              key: PermissionsEnum.INSPECTION_RESULTS_FETCH,
              code: PermissionsEnum.INSPECTION_RESULTS_FETCH,
              label: 'results',
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
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_HAZARD_DETAILS,
              code: PermissionsEnum.ORG_HAZARD_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_HAZARD_CREATE,
              code: PermissionsEnum.ORG_HAZARD_CREATE,
              label: 'Create',
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
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_INCEDANT_DETAILS,
              code: PermissionsEnum.ORG_INCEDANT_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_INCEDANT_CREATE,
              code: PermissionsEnum.ORG_INCEDANT_CREATE,
              label: 'Create',
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
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_DETAILS,
              code: PermissionsEnum.ORG_OBSERVATION_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_CREATE,
              code: PermissionsEnum.ORG_OBSERVATION_CREATE,
              label: 'Create',
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
        // Scope
        {
          key: PermissionsEnum.SCOPE_ALL,
          code: PermissionsEnum.SCOPE_ALL,
          label: 'Scope',
          permissions: [
            {
              key: PermissionsEnum.SCOPE_ALL,
              code: PermissionsEnum.SCOPE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.SCOPE_FETCH,
              code: PermissionsEnum.SCOPE_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.SCOPE_DETAILS,
              code: PermissionsEnum.SCOPE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.SCOPE_CREATE,
              code: PermissionsEnum.SCOPE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.SCOPE_DELETE,
              code: PermissionsEnum.SCOPE_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.SCOPE_UPDATE,
              code: PermissionsEnum.SCOPE_UPDATE,
              label: 'update',
            },
          ],
        },
        // EMPLOYEE CERTIFICATE
        {
          key: PermissionsEnum.EMPLOYEE_CERTIFICATE_ALL,
          code: PermissionsEnum.EMPLOYEE_CERTIFICATE_ALL,
          label: 'Employee Training',
          permissions: [
            {
              key: PermissionsEnum.EMPLOYEE_CERTIFICATE_ALL,
              code: PermissionsEnum.EMPLOYEE_CERTIFICATE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.EMPLOYEE_CERTIFICATE_FETCH,
              code: PermissionsEnum.EMPLOYEE_CERTIFICATE_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.EMPLOYEE_CERTIFICATE_DETAILS,
              code: PermissionsEnum.EMPLOYEE_CERTIFICATE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.EMPLOYEE_CERTIFICATE_DELETE,
              code: PermissionsEnum.EMPLOYEE_CERTIFICATE_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.EMPLOYEE_CERTIFICATE_UPDATE,
              code: PermissionsEnum.EMPLOYEE_CERTIFICATE_UPDATE,
              label: 'update',
            },
            {
              key: PermissionsEnum.EMPLOYEE_CERTIFICATE_CREATE,
              code: PermissionsEnum.EMPLOYEE_CERTIFICATE_CREATE,
              label: 'Create',
            },
          ],
        },
        // Observation Type
        {
          key: PermissionsEnum.ORG_OBSERVATION_TYPE_ALL,
          code: PermissionsEnum.ORG_OBSERVATION_TYPE_ALL,
          label: 'Observation Type',
          permissions: [
            {
              key: PermissionsEnum.ORG_OBSERVATION_TYPE_ALL,
              code: PermissionsEnum.ORG_OBSERVATION_TYPE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_TYPE_FETCH,
              code: PermissionsEnum.ORG_OBSERVATION_TYPE_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_TYPE_DETAILS,
              code: PermissionsEnum.ORG_OBSERVATION_TYPE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_TYPE_DELETE,
              code: PermissionsEnum.ORG_OBSERVATION_TYPE_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_TYPE_CREATE,
              code: PermissionsEnum.ORG_OBSERVATION_TYPE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_TYPE_UPDATE,
              code: PermissionsEnum.ORG_OBSERVATION_TYPE_UPDATE,
              label: 'update',
            },
          ],
        },
        // WareHouse
        {
          key: PermissionsEnum.WHIERE_HOUSE_ALL,
          code: PermissionsEnum.WHIERE_HOUSE_ALL,
          label: 'Warehouse',
          permissions: [
            {
              key: PermissionsEnum.WHIERE_HOUSE_ALL,
              code: PermissionsEnum.WHIERE_HOUSE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_FETCH,
              code: PermissionsEnum.WHIERE_HOUSE_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_DETAILS,
              code: PermissionsEnum.WHIERE_HOUSE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_DELETE,
              code: PermissionsEnum.WHIERE_HOUSE_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_CREATE,
              code: PermissionsEnum.WHIERE_HOUSE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_UPDATE,
              code: PermissionsEnum.WHIERE_HOUSE_UPDATE,
              label: 'update',
            },
          ],
        },
        // WareHouse Type
        {
          key: PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
          code: PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
          label: 'Warehouse Type',
          permissions: [
            {
              key: PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
              code: PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_TYPE_FETCH,
              code: PermissionsEnum.WHIERE_HOUSE_TYPE_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_TYPE_DETAILS,
              code: PermissionsEnum.WHIERE_HOUSE_TYPE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_TYPE_DELETE,
              code: PermissionsEnum.WHIERE_HOUSE_TYPE_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_TYPE_CREATE,
              code: PermissionsEnum.WHIERE_HOUSE_TYPE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_TYPE_UPDATE,
              code: PermissionsEnum.WHIERE_HOUSE_TYPE_UPDATE,
              label: 'update',
            },
          ],
        },
        // Drill Type
        {
          key: PermissionsEnum.ORG_DRILL_TYPE_ALL,
          code: PermissionsEnum.ORG_DRILL_TYPE_ALL,
          label: 'Drill Type',
          permissions: [
            {
              key: PermissionsEnum.ORG_DRILL_TYPE_ALL,
              code: PermissionsEnum.ORG_DRILL_TYPE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_DRILL_TYPE_FETCH,
              code: PermissionsEnum.ORG_DRILL_TYPE_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_DRILL_TYPE_DETAILS,
              code: PermissionsEnum.ORG_DRILL_TYPE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_DRILL_TYPE_CREATE,
              code: PermissionsEnum.ORG_DRILL_TYPE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_DRILL_TYPE_UPDATE,
              code: PermissionsEnum.ORG_DRILL_TYPE_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_DRILL_TYPE_DELETE,
              code: PermissionsEnum.ORG_DRILL_TYPE_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_PTW_TYPE_ALL,
          code: PermissionsEnum.ORG_PTW_TYPE_ALL,
          label: 'PTW Type',
          permissions: [
            {
              key: PermissionsEnum.ORG_PTW_TYPE_ALL,
              code: PermissionsEnum.ORG_PTW_TYPE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_PTW_TYPE_FETCH,
              code: PermissionsEnum.ORG_PTW_TYPE_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_PTW_TYPE_CREATE,
              code: PermissionsEnum.ORG_PTW_TYPE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_PTW_TYPE_UPDATE,
              code: PermissionsEnum.ORG_PTW_TYPE_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_PTW_TYPE_DELETE,
              code: PermissionsEnum.ORG_PTW_TYPE_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_VISIT_ACTIVITIES_ALL,
          code: PermissionsEnum.ORG_VISIT_ACTIVITIES_ALL,
          label: 'Visit Activities',
          permissions: [
            {
              key: PermissionsEnum.ORG_VISIT_ACTIVITIES_ALL,
              code: PermissionsEnum.ORG_VISIT_ACTIVITIES_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_VISIT_ACTIVITIES_FETCH,
              code: PermissionsEnum.ORG_VISIT_ACTIVITIES_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_VISIT_ACTIVITIES_DETAILS,
              code: PermissionsEnum.ORG_VISIT_ACTIVITIES_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_VISIT_ACTIVITIES_CREATE,
              code: PermissionsEnum.ORG_VISIT_ACTIVITIES_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_VISIT_ACTIVITIES_UPDATE,
              code: PermissionsEnum.ORG_VISIT_ACTIVITIES_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_VISIT_ACTIVITIES_DELETE,
              code: PermissionsEnum.ORG_VISIT_ACTIVITIES_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_VISIT_THEME_ALL,
          code: PermissionsEnum.ORG_VISIT_THEME_ALL,
          label: 'Visit Theme',
          permissions: [
            {
              key: PermissionsEnum.ORG_VISIT_THEME_ALL,
              code: PermissionsEnum.ORG_VISIT_THEME_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_VISIT_THEME_FETCH,
              code: PermissionsEnum.ORG_VISIT_THEME_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_VISIT_THEME_DETAILS,
              code: PermissionsEnum.ORG_VISIT_THEME_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_VISIT_THEME_CREATE,
              code: PermissionsEnum.ORG_VISIT_THEME_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_VISIT_THEME_UPDATE,
              code: PermissionsEnum.ORG_VISIT_THEME_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_VISIT_THEME_DELETE,
              code: PermissionsEnum.ORG_VISIT_THEME_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_VISIT_CATEGORY_ALL,
          code: PermissionsEnum.ORG_VISIT_CATEGORY_ALL,
          label: 'Visit Category',
          permissions: [
            {
              key: PermissionsEnum.ORG_VISIT_CATEGORY_ALL,
              code: PermissionsEnum.ORG_VISIT_CATEGORY_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_VISIT_CATEGORY_FETCH,
              code: PermissionsEnum.ORG_VISIT_CATEGORY_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_VISIT_CATEGORY_DETAILS,
              code: PermissionsEnum.ORG_VISIT_CATEGORY_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_VISIT_CATEGORY_CREATE,
              code: PermissionsEnum.ORG_VISIT_CATEGORY_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_VISIT_CATEGORY_UPDATE,
              code: PermissionsEnum.ORG_VISIT_CATEGORY_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_VISIT_CATEGORY_DELETE,
              code: PermissionsEnum.ORG_VISIT_CATEGORY_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_PPE_ACTIVITY_ALL,
          code: PermissionsEnum.ORG_PPE_ACTIVITY_ALL,
          label: 'PPE Activity',
          permissions: [
            {
              key: PermissionsEnum.ORG_PPE_ACTIVITY_ALL,
              code: PermissionsEnum.ORG_PPE_ACTIVITY_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_PPE_ACTIVITY_FETCH,
              code: PermissionsEnum.ORG_PPE_ACTIVITY_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_PPE_ACTIVITY_DETAILS,
              code: PermissionsEnum.ORG_PPE_ACTIVITY_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_PPE_ACTIVITY_CREATE,
              code: PermissionsEnum.ORG_PPE_ACTIVITY_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_PPE_ACTIVITY_UPDATE,
              code: PermissionsEnum.ORG_PPE_ACTIVITY_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_PPE_ACTIVITY_DELETE,
              code: PermissionsEnum.ORG_PPE_ACTIVITY_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_PPE_TOOLS_ALL,
          code: PermissionsEnum.ORG_PPE_TOOLS_ALL,
          label: 'PPE Tools',
          permissions: [
            {
              key: PermissionsEnum.ORG_PPE_TOOLS_ALL,
              code: PermissionsEnum.ORG_PPE_TOOLS_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_PPE_TOOLS_FETCH,
              code: PermissionsEnum.ORG_PPE_TOOLS_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_PPE_TOOLS_DETAILS,
              code: PermissionsEnum.ORG_PPE_TOOLS_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_PPE_TOOLS_CREATE,
              code: PermissionsEnum.ORG_PPE_TOOLS_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_PPE_TOOLS_UPDATE,
              code: PermissionsEnum.ORG_PPE_TOOLS_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_PPE_TOOLS_DELETE,
              code: PermissionsEnum.ORG_PPE_TOOLS_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_DOCUMENT_CATEGORY_ALL,
          code: PermissionsEnum.ORG_DOCUMENT_CATEGORY_ALL,
          label: 'Document Categories',
          permissions: [
            {
              key: PermissionsEnum.ORG_DOCUMENT_CATEGORY_ALL,
              code: PermissionsEnum.ORG_DOCUMENT_CATEGORY_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_DOCUMENT_CATEGORY_FETCH,
              code: PermissionsEnum.ORG_DOCUMENT_CATEGORY_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_DOCUMENT_CATEGORY_DETAILS,
              code: PermissionsEnum.ORG_DOCUMENT_CATEGORY_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_DOCUMENT_CATEGORY_CREATE,
              code: PermissionsEnum.ORG_DOCUMENT_CATEGORY_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_DOCUMENT_CATEGORY_UPDATE,
              code: PermissionsEnum.ORG_DOCUMENT_CATEGORY_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_DOCUMENT_CATEGORY_DELETE,
              code: PermissionsEnum.ORG_DOCUMENT_CATEGORY_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_AUDIT_STANDARDS_ALL,
          code: PermissionsEnum.ORG_AUDIT_STANDARDS_ALL,
          label: 'Audit Standards',
          permissions: [
            {
              key: PermissionsEnum.ORG_AUDIT_STANDARDS_ALL,
              code: PermissionsEnum.ORG_AUDIT_STANDARDS_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_AUDIT_STANDARDS_FETCH,
              code: PermissionsEnum.ORG_AUDIT_STANDARDS_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_AUDIT_STANDARDS_DETAILS,
              code: PermissionsEnum.ORG_AUDIT_STANDARDS_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_AUDIT_STANDARDS_CREATE,
              code: PermissionsEnum.ORG_AUDIT_STANDARDS_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_AUDIT_STANDARDS_UPDATE,
              code: PermissionsEnum.ORG_AUDIT_STANDARDS_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_AUDIT_STANDARDS_DELETE,
              code: PermissionsEnum.ORG_AUDIT_STANDARDS_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_AUDIT_ACTIVITIES_ALL,
          code: PermissionsEnum.ORG_AUDIT_ACTIVITIES_ALL,
          label: 'Audit Activities',
          permissions: [
            {
              key: PermissionsEnum.ORG_AUDIT_ACTIVITIES_ALL,
              code: PermissionsEnum.ORG_AUDIT_ACTIVITIES_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_AUDIT_ACTIVITIES_FETCH,
              code: PermissionsEnum.ORG_AUDIT_ACTIVITIES_FETCH,
              label: 'Fetch',
            },
            {
              key: PermissionsEnum.ORG_AUDIT_ACTIVITIES_DETAILS,
              code: PermissionsEnum.ORG_AUDIT_ACTIVITIES_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_AUDIT_ACTIVITIES_CREATE,
              code: PermissionsEnum.ORG_AUDIT_ACTIVITIES_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_AUDIT_ACTIVITIES_UPDATE,
              code: PermissionsEnum.ORG_AUDIT_ACTIVITIES_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_AUDIT_ACTIVITIES_DELETE,
              code: PermissionsEnum.ORG_AUDIT_ACTIVITIES_DELETE,
              label: 'Delete',
            },
          ],
        },
        // PPE Item
        {
          key: PermissionsEnum.ORG_PPE_ITEM_ALL,
          code: PermissionsEnum.ORG_PPE_ITEM_ALL,
          label: 'PPE Item',
          permissions: [
            {
              key: PermissionsEnum.ORG_PPE_ITEM_ALL,
              code: PermissionsEnum.ORG_PPE_ITEM_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_PPE_ITEM_FETCH,
              code: PermissionsEnum.ORG_PPE_ITEM_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_PPE_ITEM_DETAILS,
              code: PermissionsEnum.ORG_PPE_ITEM_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_PPE_ITEM_CREATE,
              code: PermissionsEnum.ORG_PPE_ITEM_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_PPE_ITEM_UPDATE,
              code: PermissionsEnum.ORG_PPE_ITEM_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_PPE_ITEM_DELETE,
              code: PermissionsEnum.ORG_PPE_ITEM_DELETE,
              label: 'Delete',
            },
          ],
        },
        // Injury
        {
          key: PermissionsEnum.INJURY_ALL,
          code: PermissionsEnum.INJURY_ALL,
          label: 'Injury',
          permissions: [
            {
              key: PermissionsEnum.INJURY_ALL,
              code: PermissionsEnum.INJURY_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.INJURY_FETCH,
              code: PermissionsEnum.INJURY_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.INJURY_DETAILS,
              code: PermissionsEnum.INJURY_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.INJURY_DELETE,
              code: PermissionsEnum.INJURY_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.INJURY_CREATE,
              code: PermissionsEnum.INJURY_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.INJURY_UPDATE,
              code: PermissionsEnum.INJURY_UPDATE,
              label: 'update',
            },
          ],
        },
        // Root Causes
        {
          key: PermissionsEnum.ROOT_CAUSES_ALL,
          code: PermissionsEnum.ROOT_CAUSES_ALL,
          label: 'Root Causes',
          permissions: [
            {
              key: PermissionsEnum.ROOT_CAUSES_ALL,
              code: PermissionsEnum.ROOT_CAUSES_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ROOT_CAUSES_FETCH,
              code: PermissionsEnum.ROOT_CAUSES_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ROOT_CAUSES_DETAILS,
              code: PermissionsEnum.ROOT_CAUSES_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ROOT_CAUSES_DELETE,
              code: PermissionsEnum.ROOT_CAUSES_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.ROOT_CAUSES_CREATE,
              code: PermissionsEnum.ROOT_CAUSES_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ROOT_CAUSES_UPDATE,
              code: PermissionsEnum.ROOT_CAUSES_UPDATE,
              label: 'update',
            },
          ],
        },
        //Coding System
        {
          key: PermissionsEnum.CODING_SYSTEM_ALL,
          code: PermissionsEnum.CODING_SYSTEM_ALL,
          label: 'Coding System',
          permissions: [
            {
              key: PermissionsEnum.CODING_SYSTEM_ALL,
              code: PermissionsEnum.CODING_SYSTEM_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.CODING_SYSTEM_FETCH,
              code: PermissionsEnum.CODING_SYSTEM_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.CODING_SYSTEM_DETAILS,
              code: PermissionsEnum.CODING_SYSTEM_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.CODING_SYSTEM_DELETE,
              code: PermissionsEnum.CODING_SYSTEM_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.CODING_SYSTEM_CREATE,
              code: PermissionsEnum.CODING_SYSTEM_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.CODING_SYSTEM_UPDATE,
              code: PermissionsEnum.CODING_SYSTEM_UPDATE,
              label: 'update',
            },
          ],
        },
        // Investigation
        {
          key: PermissionsEnum.INVESTIGATION_ALL,
          code: PermissionsEnum.INVESTIGATION_ALL,
          label: 'Investigation',
          permissions: [
            {
              key: PermissionsEnum.INVESTIGATION_ALL,
              code: PermissionsEnum.INVESTIGATION_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.INVESTIGATION_FETCH,
              code: PermissionsEnum.INVESTIGATION_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.INVESTIGATION_DETAILS,
              code: PermissionsEnum.INVESTIGATION_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.INVESTIGATION_DELETE,
              code: PermissionsEnum.INVESTIGATION_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.INVESTIGATION_CREATE,
              code: PermissionsEnum.INVESTIGATION_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.INVESTIGATION_UPDATE,
              code: PermissionsEnum.INVESTIGATION_UPDATE,
              label: 'update',
            },
            {
              key: PermissionsEnum.FULL_INVESTIGATION_CREATE,
              code: PermissionsEnum.FULL_INVESTIGATION_CREATE,
              label: 'Create Full Investigation',
            },
          ],
        },
        // Capa
        {
          key: PermissionsEnum.CAPA_ALL,
          code: PermissionsEnum.CAPA_ALL,
          label: 'Capa',
          permissions: [
            {
              key: PermissionsEnum.CAPA_ALL,
              code: PermissionsEnum.CAPA_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.CAPA_FETCH,
              code: PermissionsEnum.CAPA_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.CAPA_DETAILS,
              code: PermissionsEnum.CAPA_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.CAPA_DELETE,
              code: PermissionsEnum.CAPA_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.CAPA_CAREATE,
              code: PermissionsEnum.CAPA_CAREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.CAPA_UPDATE,
              code: PermissionsEnum.CAPA_UPDATE,
              label: 'update',
            },
            {
              key: PermissionsEnum.CAPA_CHANGE_STATUS,
              code: PermissionsEnum.CAPA_CHANGE_STATUS,
              label: 'Change Status',
            },
            {
              key: PermissionsEnum.CAPA_SET_RESULT,
              code: PermissionsEnum.CAPA_SET_RESULT,
              label: 'Set Result',
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_MEETING_TYPE_ALL,
          code: PermissionsEnum.ORG_MEETING_TYPE_ALL,
          label: 'meeting type',
          permissions: [
            {
              key: PermissionsEnum.ORG_MEETING_TYPE_ALL,
              code: PermissionsEnum.ORG_MEETING_TYPE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_MEETING_TYPE_FETCH,
              code: PermissionsEnum.ORG_MEETING_TYPE_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_MEETING_TYPE_DETAILS,
              code: PermissionsEnum.ORG_MEETING_TYPE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_MEETING_TYPE_DELETE,
              code: PermissionsEnum.ORG_MEETING_TYPE_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.ORG_MEETING_TYPE_CREATE,
              code: PermissionsEnum.ORG_MEETING_TYPE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_MEETING_TYPE_UPDATE,
              code: PermissionsEnum.ORG_MEETING_TYPE_UPDATE,
              label: 'update',
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_PERMIT,
          code: PermissionsEnum.PROJECT_PERMIT,
          label: 'Project Permit',
          permissions: [
            {
              key: PermissionsEnum.PROJECT_PERMIT,
              code: PermissionsEnum.PROJECT_PERMIT,
              label: 'Allow',
            },
          ],
        },

        {
          key: PermissionsEnum.ORG_TRANING_TOPIC_ALL,
          code: PermissionsEnum.ORG_TRANING_TOPIC_ALL,
          label: 'Traning Topic',
          permissions: [
            {
              key: PermissionsEnum.ORG_TRANING_TOPIC_ALL,
              code: PermissionsEnum.ORG_TRANING_TOPIC_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_TRANING_TOPIC_FETCH,
              code: PermissionsEnum.ORG_TRANING_TOPIC_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_TRANING_TOPIC_DETAILS,
              code: PermissionsEnum.ORG_TRANING_TOPIC_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_TRANING_TOPIC_CREATE,
              code: PermissionsEnum.ORG_TRANING_TOPIC_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_TRANING_TOPIC_UPDATE,
              code: PermissionsEnum.ORG_TRANING_TOPIC_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_TRANING_TOPIC_DELETE,
              code: PermissionsEnum.ORG_TRANING_TOPIC_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.inductions_ALL,
          code: PermissionsEnum.inductions_ALL,
          label: 'Inductions',
          permissions: [
            {
              key: PermissionsEnum.inductions_ALL,
              code: PermissionsEnum.inductions_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.inductions_FETCH,
              code: PermissionsEnum.inductions_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.inductions_DETAILS,
              code: PermissionsEnum.inductions_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.inductions_CREATE,
              code: PermissionsEnum.inductions_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.inductions_UPDATE,
              code: PermissionsEnum.inductions_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.inductions_DELETE,
              code: PermissionsEnum.inductions_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.ppe_matrix_logs_ALL,
          code: PermissionsEnum.ppe_matrix_logs_ALL,
          label: 'PPE Matrix Logs',
          permissions: [
            {
              key: PermissionsEnum.ppe_matrix_logs_ALL,
              code: PermissionsEnum.ppe_matrix_logs_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ppe_matrix_logs_FETCH,
              code: PermissionsEnum.ppe_matrix_logs_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ppe_matrix_logs_DETAILS,
              code: PermissionsEnum.ppe_matrix_logs_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ppe_matrix_logs_CREATE,
              code: PermissionsEnum.ppe_matrix_logs_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ppe_matrix_logs_UPDATE,
              code: PermissionsEnum.ppe_matrix_logs_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ppe_matrix_logs_DELETE,
              code: PermissionsEnum.ppe_matrix_logs_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.objectives_ALL,
          code: PermissionsEnum.objectives_ALL,
          label: 'Objectives',
          permissions: [
            {
              key: PermissionsEnum.objectives_ALL,
              code: PermissionsEnum.objectives_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.objectives_FETCH,
              code: PermissionsEnum.objectives_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.objectives_DETAILS,
              code: PermissionsEnum.objectives_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.objectives_CREATE,
              code: PermissionsEnum.objectives_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.objectives_UPDATE,
              code: PermissionsEnum.objectives_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.objectives_DELETE,
              code: PermissionsEnum.objectives_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.PTW_ALL,
          code: PermissionsEnum.PTW_ALL,
          label: 'Permit to wotk',
          permissions: [
            {
              key: PermissionsEnum.PTW_ALL,
              code: PermissionsEnum.PTW_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.PTW_FETCH,
              code: PermissionsEnum.PTW_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.PTW_CREATE,
              code: PermissionsEnum.PTW_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.PTW_DELETE,
              code: PermissionsEnum.PTW_DELETE,
              label: 'Delete',
            },
            {
              key: PermissionsEnum.PTW_DETAILS,
              code: PermissionsEnum.PTW_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.PTW_UPDATE,
              code: PermissionsEnum.PTW_UPDATE,
              label: 'Update',
            },
          ],
        },
        {
          key: PermissionsEnum.RISK_ASSESSMENT_ALL,
          code: PermissionsEnum.RISK_ASSESSMENT_ALL,
          label: 'Risk Assessment',
          permissions: [
            {
              key: PermissionsEnum.RISK_ASSESSMENT_ALL,
              code: PermissionsEnum.RISK_ASSESSMENT_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.RISK_ASSESSMENT_FETCH,
              code: PermissionsEnum.RISK_ASSESSMENT_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.RISK_ASSESSMENT_DETAILS,
              code: PermissionsEnum.RISK_ASSESSMENT_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.RISK_ASSESSMENT_CREATE,
              code: PermissionsEnum.RISK_ASSESSMENT_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.RISK_ASSESSMENT_UPDATE,
              code: PermissionsEnum.RISK_ASSESSMENT_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.RISK_ASSESSMENT_DELETE,
              code: PermissionsEnum.RISK_ASSESSMENT_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.LEADERSHIP_ALL,
          code: PermissionsEnum.LEADERSHIP_ALL,
          label: 'Leadership ',
          permissions: [
            {
              key: PermissionsEnum.LEADERSHIP_ALL,
              code: PermissionsEnum.LEADERSHIP_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.LEADERSHIP_FETCH,
              code: PermissionsEnum.LEADERSHIP_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.LEADERSHIP_DETAILS,
              code: PermissionsEnum.LEADERSHIP_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.LEADERSHIP_CRAETE,
              code: PermissionsEnum.LEADERSHIP_CRAETE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.LEADERSHIP_UPDATE,
              code: PermissionsEnum.LEADERSHIP_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.LEADERSHIP_DELETE,
              code: PermissionsEnum.LEADERSHIP_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.MOC_ALL,
          code: PermissionsEnum.MOC_ALL,
          label: 'Mangement Of Change ',
          permissions: [
            {
              key: PermissionsEnum.MOC_ALL,
              code: PermissionsEnum.MOC_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.MOC_FETCH,
              code: PermissionsEnum.MOC_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.MOC_DETAILS,
              code: PermissionsEnum.MOC_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.MOC_CRAETE,
              code: PermissionsEnum.MOC_CRAETE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.MOC_UPDATE,
              code: PermissionsEnum.MOC_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.MOC_DELETE,
              code: PermissionsEnum.MOC_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_ALL,
          code: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_ALL,
          label: 'Mangement Of Change Type ',
          permissions: [
            {
              key: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_ALL,
              code: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_FETCH,
              code: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_DETAILS,
              code: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_CREATE,
              code: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_UPDATE,
              code: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_DELETE,
              code: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_PROGRESS_ALL,
          code: PermissionsEnum.PROJECT_PROGRESS_ALL,
          label: 'Project Progress',
          permissions: [
            {
              key: PermissionsEnum.PROJECT_PROGRESS_ALL,
              code: PermissionsEnum.PROJECT_PROGRESS_ALL,
              label: 'All',
            },
          ],
        },
        {
          key: PermissionsEnum.ORGANIZATION_CERTIFICATE_ALL,
          code: PermissionsEnum.ORGANIZATION_CERTIFICATE_ALL,
          label: 'Organization Certificates',
          permissions: [
            {
              key: PermissionsEnum.ORGANIZATION_CERTIFICATE_ALL,
              code: PermissionsEnum.ORGANIZATION_CERTIFICATE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORGANIZATION_CERTIFICATE_FETCH,
              code: PermissionsEnum.ORGANIZATION_CERTIFICATE_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORGANIZATION_CERTIFICATE_DETAILS,
              code: PermissionsEnum.ORGANIZATION_CERTIFICATE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORGANIZATION_CERTIFICATE_CREATE,
              code: PermissionsEnum.ORGANIZATION_CERTIFICATE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORGANIZATION_CERTIFICATE_UPDATE,
              code: PermissionsEnum.ORGANIZATION_CERTIFICATE_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORGANIZATION_CERTIFICATE_DELETE,
              code: PermissionsEnum.ORGANIZATION_CERTIFICATE_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_LOCATION_ALL,
          code: PermissionsEnum.ORG_LOCATION_ALL,
          label: 'Organization Locations',
          permissions: [
            {
              key: PermissionsEnum.ORG_LOCATION_ALL,
              code: PermissionsEnum.ORG_LOCATION_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_LOCATION_FETCH,
              code: PermissionsEnum.ORG_LOCATION_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_LOCATION_DETAILS,
              code: PermissionsEnum.ORG_LOCATION_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_LOCATION_CREATE,
              code: PermissionsEnum.ORG_LOCATION_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_LOCATION_UPDATE,
              code: PermissionsEnum.ORG_LOCATION_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_LOCATION_DELETE,
              code: PermissionsEnum.ORG_LOCATION_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.HEALTH_CONDITION_ALL,
          code: PermissionsEnum.HEALTH_CONDITION_ALL,
          label: 'Health Conditions',
          permissions: [
            {
              key: PermissionsEnum.HEALTH_CONDITION_ALL,
              code: PermissionsEnum.HEALTH_CONDITION_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.HEALTH_CONDITION_FETCH,
              code: PermissionsEnum.HEALTH_CONDITION_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.HEALTH_CONDITION_DETAILS,
              code: PermissionsEnum.HEALTH_CONDITION_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.HEALTH_CONDITION_CREATE,
              code: PermissionsEnum.HEALTH_CONDITION_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.HEALTH_CONDITION_UPDATE,
              code: PermissionsEnum.HEALTH_CONDITION_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.HEALTH_CONDITION_DELETE,
              code: PermissionsEnum.HEALTH_CONDITION_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_HEALTH_CONDITION_ALL,
          code: PermissionsEnum.ORG_HEALTH_CONDITION_ALL,
          label: 'Organization Health Conditions',
          permissions: [
            {
              key: PermissionsEnum.ORG_HEALTH_CONDITION_ALL,
              code: PermissionsEnum.ORG_HEALTH_CONDITION_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_HEALTH_CONDITION_FETCH,
              code: PermissionsEnum.ORG_HEALTH_CONDITION_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_HEALTH_CONDITION_DETAILS,
              code: PermissionsEnum.ORG_HEALTH_CONDITION_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_HEALTH_CONDITION_CREATE,
              code: PermissionsEnum.ORG_HEALTH_CONDITION_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_HEALTH_CONDITION_UPDATE,
              code: PermissionsEnum.ORG_HEALTH_CONDITION_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_HEALTH_CONDITION_DELETE,
              code: PermissionsEnum.ORG_HEALTH_CONDITION_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_ALL,
          code: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_ALL,
          label: 'Contractor Management',
          permissions: [
            {
              key: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_ALL,
              code: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_FETCH,
              code: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_DETAILS,
              code: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_CREATE,
              code: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_UPDATE,
              code: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_DELETE,
              code: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_LOCATION_ALL,
          code: PermissionsEnum.PROJECT_LOCATION_ALL,
          label: 'Project Locations',
          permissions: [
            {
              key: PermissionsEnum.PROJECT_LOCATION_ALL,
              code: PermissionsEnum.PROJECT_LOCATION_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_FETCH,
              code: PermissionsEnum.PROJECT_LOCATION_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_DETAILS,
              code: PermissionsEnum.PROJECT_LOCATION_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_CREATE,
              code: PermissionsEnum.PROJECT_LOCATION_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_UPDATE,
              code: PermissionsEnum.PROJECT_LOCATION_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_DELETE,
              code: PermissionsEnum.PROJECT_LOCATION_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_ZONE_ALL,
          code: PermissionsEnum.PROJECT_ZONE_ALL,
          label: 'Project Zones',
          permissions: [
            {
              key: PermissionsEnum.PROJECT_ZONE_ALL,
              code: PermissionsEnum.PROJECT_ZONE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_FETCH,
              code: PermissionsEnum.PROJECT_ZONE_FETCH,
              label: 'Table',
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
        {
          key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_ALL,
          code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_ALL,
          label: 'Project Location Hierarchy',
          permissions: [
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_ALL,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_FETCH,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_DETAILS,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_CREATE,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_UPDATE,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_DELETE,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_ALL,
          code: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_ALL,
          label: 'Project Location Employees',
          permissions: [
            {
              key: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_ALL,
              code: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_FETCH,
              code: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_DETAILS,
              code: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_CREATE,
              code: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_UPDATE,
              code: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_DELETE,
              code: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_ALL,
          code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_ALL,
          label: 'Project Location Hierarchy Employees',
          permissions: [
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_ALL,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_FETCH,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_DETAILS,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_CREATE,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_UPDATE,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_DELETE,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_ZOON_EQUIPMENT_ALL,
          code: PermissionsEnum.PROJECT_ZOON_EQUIPMENT_ALL,
          label: 'Project Zone Equipment',
          permissions: [
            {
              key: PermissionsEnum.PROJECT_ZOON_EQUIPMENT_ALL,
              code: PermissionsEnum.PROJECT_ZOON_EQUIPMENT_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.PROJECT_ZOON_EQUIPMENT_FETCH,
              code: PermissionsEnum.PROJECT_ZOON_EQUIPMENT_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.PROJECT_ZOON_EQUIPMENT_CREATE,
              code: PermissionsEnum.PROJECT_ZOON_EQUIPMENT_CREATE,
              label: 'Create',
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_ALL,
          code: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_ALL,
          label: 'Project Location Team Employees',
          permissions: [
            {
              key: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_ALL,
              code: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_FETCH,
              code: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_CREATE,
              code: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_DELETE,
              code: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.TASK_ALL,
          code: PermissionsEnum.TASK_ALL,
          label: 'Tasks',
          permissions: [
            { key: PermissionsEnum.TASK_ALL, code: PermissionsEnum.TASK_ALL, label: 'All' },
            { key: PermissionsEnum.TASK_FETCH, code: PermissionsEnum.TASK_FETCH, label: 'Table' },
            {
              key: PermissionsEnum.TASK_DETAILS,
              code: PermissionsEnum.TASK_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.TASK_CREATE,
              code: PermissionsEnum.TASK_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.TASK_UPDATE,
              code: PermissionsEnum.TASK_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.TASK_DELETE,
              code: PermissionsEnum.TASK_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.TASK_RESULT_ALL,
          code: PermissionsEnum.TASK_RESULT_ALL,
          label: 'Task Results',
          permissions: [
            {
              key: PermissionsEnum.TASK_RESULT_ALL,
              code: PermissionsEnum.TASK_RESULT_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.TASK_RESULT_FETCH,
              code: PermissionsEnum.TASK_RESULT_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.TASK_RESULT_DETAILS,
              code: PermissionsEnum.TASK_RESULT_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.TASK_RESULT_CREATE,
              code: PermissionsEnum.TASK_RESULT_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.TASK_RESULT_UPDATE,
              code: PermissionsEnum.TASK_RESULT_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.TASK_RESULT_DELETE,
              code: PermissionsEnum.TASK_RESULT_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.TASK_RESULT_ITEM_ALL,
          code: PermissionsEnum.TASK_RESULT_ITEM_ALL,
          label: 'Task Result Items',
          permissions: [
            {
              key: PermissionsEnum.TASK_RESULT_ITEM_ALL,
              code: PermissionsEnum.TASK_RESULT_ITEM_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.TASK_RESULT_ITEM_FETCH,
              code: PermissionsEnum.TASK_RESULT_ITEM_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.TASK_RESULT_ITEM_DETAILS,
              code: PermissionsEnum.TASK_RESULT_ITEM_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.TASK_RESULT_ITEM_CREATE,
              code: PermissionsEnum.TASK_RESULT_ITEM_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.TASK_RESULT_ITEM_UPDATE,
              code: PermissionsEnum.TASK_RESULT_ITEM_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.TASK_RESULT_ITEM_DELETE,
              code: PermissionsEnum.TASK_RESULT_ITEM_DELETE,
              label: 'Delete',
            },
          ],
        },
        // {
        //   key: PermissionsEnum.TASK_RESULT_ITEM_ANSWER_ALL,
        //   code: PermissionsEnum.TASK_RESULT_ITEM_ANSWER_ALL,
        //   label: 'Task Result Item Answers',
        //   permissions: [
        //     {
        //       key: PermissionsEnum.TASK_RESULT_ITEM_ANSWER_ALL,
        //       code: PermissionsEnum.TASK_RESULT_ITEM_ANSWER_ALL,
        //       label: 'All',
        //     },
        //     {
        //       key: PermissionsEnum.TASK_RESULT_ITEM_ANSWER_FETCH,
        //       code: PermissionsEnum.TASK_RESULT_ITEM_ANSWER_FETCH,
        //       label: 'Table',
        //     },
        //     {
        //       key: PermissionsEnum.TASK_RESULT_ITEM_ANSWER_DETAILS,
        //       code: PermissionsEnum.TASK_RESULT_ITEM_ANSWER_DETAILS,
        //       label: 'Details',
        //     },
        //     {
        //       key: PermissionsEnum.TASK_RESULT_ITEM_ANSWER_CREATE,
        //       code: PermissionsEnum.TASK_RESULT_ITEM_ANSWER_CREATE,
        //       label: 'Create',
        //     },
        //     {
        //       key: PermissionsEnum.TASK_RESULT_ITEM_ANSWER_UPDATE,
        //       code: PermissionsEnum.TASK_RESULT_ITEM_ANSWER_UPDATE,
        //       label: 'Update',
        //     },
        //     {
        //       key: PermissionsEnum.TASK_RESULT_ITEM_ANSWER_DELETE,
        //       code: PermissionsEnum.TASK_RESULT_ITEM_ANSWER_DELETE,
        //       label: 'Delete',
        //     },
        //   ],
        // },
        // {
        //   key: PermissionsEnum.INVESTIGATION_TASK_ALL,
        //   code: PermissionsEnum.INVESTIGATION_TASK_ALL,
        //   label: 'Investigation Tasks',
        //   permissions: [
        //     {
        //       key: PermissionsEnum.INVESTIGATION_TASK_ALL,
        //       code: PermissionsEnum.INVESTIGATION_TASK_ALL,
        //       label: 'All',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_TASK_FETCH,
        //       code: PermissionsEnum.INVESTIGATION_TASK_FETCH,
        //       label: 'Table',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_TASK_DETAILS,
        //       code: PermissionsEnum.INVESTIGATION_TASK_DETAILS,
        //       label: 'Details',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_TASK_CREATE,
        //       code: PermissionsEnum.INVESTIGATION_TASK_CREATE,
        //       label: 'Create',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_TASK_UPDATE,
        //       code: PermissionsEnum.INVESTIGATION_TASK_UPDATE,
        //       label: 'Update',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_TASK_DELETE,
        //       code: PermissionsEnum.INVESTIGATION_TASK_DELETE,
        //       label: 'Delete',
        //     },
        //   ],
        // },
        // {
        //   key: PermissionsEnum.INVESTIGATION_EMPLOYEE_ALL,
        //   code: PermissionsEnum.INVESTIGATION_EMPLOYEE_ALL,
        //   label: 'Investigation Employees',
        //   permissions: [
        //     {
        //       key: PermissionsEnum.INVESTIGATION_EMPLOYEE_ALL,
        //       code: PermissionsEnum.INVESTIGATION_EMPLOYEE_ALL,
        //       label: 'All',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_EMPLOYEE_FETCH,
        //       code: PermissionsEnum.INVESTIGATION_EMPLOYEE_FETCH,
        //       label: 'Table',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_EMPLOYEE_DETAILS,
        //       code: PermissionsEnum.INVESTIGATION_EMPLOYEE_DETAILS,
        //       label: 'Details',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_EMPLOYEE_CREATE,
        //       code: PermissionsEnum.INVESTIGATION_EMPLOYEE_CREATE,
        //       label: 'Create',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_EMPLOYEE_UPDATE,
        //       code: PermissionsEnum.INVESTIGATION_EMPLOYEE_UPDATE,
        //       label: 'Update',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_EMPLOYEE_DELETE,
        //       code: PermissionsEnum.INVESTIGATION_EMPLOYEE_DELETE,
        //       label: 'Delete',
        //     },
        //   ],
        // },
        // {
        //   key: PermissionsEnum.INVESTIGATION_TASK_EMPLOYEE_ALL,
        //   code: PermissionsEnum.INVESTIGATION_TASK_EMPLOYEE_ALL,
        //   label: 'Investigation Task Employees',
        //   permissions: [
        //     {
        //       key: PermissionsEnum.INVESTIGATION_TASK_EMPLOYEE_ALL,
        //       code: PermissionsEnum.INVESTIGATION_TASK_EMPLOYEE_ALL,
        //       label: 'All',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_TASK_EMPLOYEE_FETCH,
        //       code: PermissionsEnum.INVESTIGATION_TASK_EMPLOYEE_FETCH,
        //       label: 'Table',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_TASK_EMPLOYEE_DETAILS,
        //       code: PermissionsEnum.INVESTIGATION_TASK_EMPLOYEE_DETAILS,
        //       label: 'Details',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_TASK_EMPLOYEE_CREATE,
        //       code: PermissionsEnum.INVESTIGATION_TASK_EMPLOYEE_CREATE,
        //       label: 'Create',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_TASK_EMPLOYEE_UPDATE,
        //       code: PermissionsEnum.INVESTIGATION_TASK_EMPLOYEE_UPDATE,
        //       label: 'Update',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_TASK_EMPLOYEE_DELETE,
        //       code: PermissionsEnum.INVESTIGATION_TASK_EMPLOYEE_DELETE,
        //       label: 'Delete',
        //     },
        //   ],
        // },
        {
          key: PermissionsEnum.INVESTIGATION_TASK_RESULT_ALL,
          code: PermissionsEnum.INVESTIGATION_TASK_RESULT_ALL,
          label: 'Investigation Task Results',
          permissions: [
            {
              key: PermissionsEnum.INVESTIGATION_TASK_RESULT_ALL,
              code: PermissionsEnum.INVESTIGATION_TASK_RESULT_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.INVESTIGATION_TASK_RESULT_FETCH,
              code: PermissionsEnum.INVESTIGATION_TASK_RESULT_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.INVESTIGATION_TASK_RESULT_DETAILS,
              code: PermissionsEnum.INVESTIGATION_TASK_RESULT_DETAILS,
              label: 'Details',
            },
            // {
            //   key: PermissionsEnum.INVESTIGATION_TASK_RESULT_CREATE,
            //   code: PermissionsEnum.INVESTIGATION_TASK_RESULT_CREATE,
            //   label: 'Create',
            // },
            {
              key: PermissionsEnum.FULL_INVESTIGATION_MEETING_RESULT_CREATE,
              code: PermissionsEnum.FULL_INVESTIGATION_MEETING_RESULT_CREATE,
              label: 'Create ',
            },
            {
              key: PermissionsEnum.INVESTIGATION_TASK_RESULT_UPDATE,
              code: PermissionsEnum.INVESTIGATION_TASK_RESULT_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.INVESTIGATION_TASK_RESULT_DELETE,
              code: PermissionsEnum.INVESTIGATION_TASK_RESULT_DELETE,
              label: 'Delete',
            },
          ],
        },
        // {
        //   key: PermissionsEnum.INVESTIGATION_FACTOR_ALL,
        //   code: PermissionsEnum.INVESTIGATION_FACTOR_ALL,
        //   label: 'Investigation Factors',
        //   permissions: [
        //     {
        //       key: PermissionsEnum.INVESTIGATION_FACTOR_ALL,
        //       code: PermissionsEnum.INVESTIGATION_FACTOR_ALL,
        //       label: 'All',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_FACTOR_FETCH,
        //       code: PermissionsEnum.INVESTIGATION_FACTOR_FETCH,
        //       label: 'Table',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_FACTOR_DETAILS,
        //       code: PermissionsEnum.INVESTIGATION_FACTOR_DETAILS,
        //       label: 'Details',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_FACTOR_CREATE,
        //       code: PermissionsEnum.INVESTIGATION_FACTOR_CREATE,
        //       label: 'Create',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_FACTOR_UPDATE,
        //       code: PermissionsEnum.INVESTIGATION_FACTOR_UPDATE,
        //       label: 'Update',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_FACTOR_DELETE,
        //       code: PermissionsEnum.INVESTIGATION_FACTOR_DELETE,
        //       label: 'Delete',
        //     },
        //   ],
        // },
        // {
        //   key: PermissionsEnum.INVESTIGATION_FACTOR_ITEM_ALL,
        //   code: PermissionsEnum.INVESTIGATION_FACTOR_ITEM_ALL,
        //   label: 'Investigation Factor Items',
        //   permissions: [
        //     {
        //       key: PermissionsEnum.INVESTIGATION_FACTOR_ITEM_ALL,
        //       code: PermissionsEnum.INVESTIGATION_FACTOR_ITEM_ALL,
        //       label: 'All',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_FACTOR_ITEM_FETCH,
        //       code: PermissionsEnum.INVESTIGATION_FACTOR_ITEM_FETCH,
        //       label: 'Table',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_FACTOR_ITEM_DETAILS,
        //       code: PermissionsEnum.INVESTIGATION_FACTOR_ITEM_DETAILS,
        //       label: 'Details',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_FACTOR_ITEM_CREATE,
        //       code: PermissionsEnum.INVESTIGATION_FACTOR_ITEM_CREATE,
        //       label: 'Create',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_FACTOR_ITEM_UPDATE,
        //       code: PermissionsEnum.INVESTIGATION_FACTOR_ITEM_UPDATE,
        //       label: 'Update',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_FACTOR_ITEM_DELETE,
        //       code: PermissionsEnum.INVESTIGATION_FACTOR_ITEM_DELETE,
        //       label: 'Delete',
        //     },
        //   ],
        // },
        // {
        //   key: PermissionsEnum.INVESTIGATION_MEETING_ALL,
        //   code: PermissionsEnum.INVESTIGATION_MEETING_ALL,
        //   label: 'Investigation Meetings',
        //   permissions: [
        //     {
        //       key: PermissionsEnum.INVESTIGATION_MEETING_ALL,
        //       code: PermissionsEnum.INVESTIGATION_MEETING_ALL,
        //       label: 'All',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_MEETING_FETCH,
        //       code: PermissionsEnum.INVESTIGATION_MEETING_FETCH,
        //       label: 'Table',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_MEETING_DETAILS,
        //       code: PermissionsEnum.INVESTIGATION_MEETING_DETAILS,
        //       label: 'Details',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_MEETING_CREATE,
        //       code: PermissionsEnum.INVESTIGATION_MEETING_CREATE,
        //       label: 'Create',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_MEETING_UPDATE,
        //       code: PermissionsEnum.INVESTIGATION_MEETING_UPDATE,
        //       label: 'Update',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_MEETING_DELETE,
        //       code: PermissionsEnum.INVESTIGATION_MEETING_DELETE,
        //       label: 'Delete',
        //     },
        //   ],
        // },
        // {
        //   key: PermissionsEnum.INVESTIGATION_DOCUMENTATION_ALL,
        //   code: PermissionsEnum.INVESTIGATION_DOCUMENTATION_ALL,
        //   label: 'Investigation Documentation',
        //   permissions: [
        //     {
        //       key: PermissionsEnum.INVESTIGATION_DOCUMENTATION_ALL,
        //       code: PermissionsEnum.INVESTIGATION_DOCUMENTATION_ALL,
        //       label: 'All',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_DOCUMENTATION_FETCH,
        //       code: PermissionsEnum.INVESTIGATION_DOCUMENTATION_FETCH,
        //       label: 'Table',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_DOCUMENTATION_DETAILS,
        //       code: PermissionsEnum.INVESTIGATION_DOCUMENTATION_DETAILS,
        //       label: 'Details',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_DOCUMENTATION_CREATE,
        //       code: PermissionsEnum.INVESTIGATION_DOCUMENTATION_CREATE,
        //       label: 'Create',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_DOCUMENTATION_UPDATE,
        //       code: PermissionsEnum.INVESTIGATION_DOCUMENTATION_UPDATE,
        //       label: 'Update',
        //     },
        //     {
        //       key: PermissionsEnum.INVESTIGATION_DOCUMENTATION_DELETE,
        //       code: PermissionsEnum.INVESTIGATION_DOCUMENTATION_DELETE,
        //       label: 'Delete',
        //     },
        //   ],
        // },
        // {
        //   key: PermissionsEnum.WITNESS_STATEMENT_ALL,
        //   code: PermissionsEnum.WITNESS_STATEMENT_ALL,
        //   label: 'Witness Statements',
        //   permissions: [
        //     {
        //       key: PermissionsEnum.WITNESS_STATEMENT_ALL,
        //       code: PermissionsEnum.WITNESS_STATEMENT_ALL,
        //       label: 'All',
        //     },
        //     {
        //       key: PermissionsEnum.WITNESS_STATEMENT_FETCH,
        //       code: PermissionsEnum.WITNESS_STATEMENT_FETCH,
        //       label: 'Table',
        //     },
        //     {
        //       key: PermissionsEnum.WITNESS_STATEMENT_DETAILS,
        //       code: PermissionsEnum.WITNESS_STATEMENT_DETAILS,
        //       label: 'Details',
        //     },
        //     {
        //       key: PermissionsEnum.WITNESS_STATEMENT_CREATE,
        //       code: PermissionsEnum.WITNESS_STATEMENT_CREATE,
        //       label: 'Create',
        //     },
        //     {
        //       key: PermissionsEnum.WITNESS_STATEMENT_UPDATE,
        //       code: PermissionsEnum.WITNESS_STATEMENT_UPDATE,
        //       label: 'Update',
        //     },
        //     {
        //       key: PermissionsEnum.WITNESS_STATEMENT_DELETE,
        //       code: PermissionsEnum.WITNESS_STATEMENT_DELETE,
        //       label: 'Delete',
        //     },
        //   ],
        // },
        // {
        //   key: PermissionsEnum.MEDIA_DELETE,
        //   code: PermissionsEnum.MEDIA_DELETE,
        //   label: 'Media',
        //   permissions: [
        //     {
        //       key: PermissionsEnum.MEDIA_DELETE,
        //       code: PermissionsEnum.MEDIA_DELETE,
        //       label: 'Delete',
        //     },
        //   ],
        // },
        // {
        //   key: PermissionsEnum.ZOON_ALL,
        //   code: PermissionsEnum.ZOON_ALL,
        //   label: 'Zones',
        //   permissions: [
        //     { key: PermissionsEnum.ZOON_ALL, code: PermissionsEnum.ZOON_ALL, label: 'All' },
        //     { key: PermissionsEnum.ZOON_FETCH, code: PermissionsEnum.ZOON_FETCH, label: 'Table' },
        //     {
        //       key: PermissionsEnum.ZOON_DETAILS,
        //       code: PermissionsEnum.ZOON_DETAILS,
        //       label: 'Details',
        //     },
        //     {
        //       key: PermissionsEnum.ZOON_CREATE,
        //       code: PermissionsEnum.ZOON_CREATE,
        //       label: 'Create',
        //     },
        //     {
        //       key: PermissionsEnum.ZOON_UPDATE,
        //       code: PermissionsEnum.ZOON_UPDATE,
        //       label: 'Update',
        //     },
        //     {
        //       key: PermissionsEnum.ZOON_DELETE,
        //       code: PermissionsEnum.ZOON_DELETE,
        //       label: 'Delete',
        //     },
        //   ],
        // },
        {
          key: PermissionsEnum.TICKET_ALL,
          code: PermissionsEnum.TICKET_ALL,
          label: 'Support Tickets',
          permissions: [
            { key: PermissionsEnum.TICKET_ALL, code: PermissionsEnum.TICKET_ALL, label: 'All' },
            {
              key: PermissionsEnum.TICKET_FETCH,
              code: PermissionsEnum.TICKET_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.TICKET_DETAILS,
              code: PermissionsEnum.TICKET_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.TICKET_CREATE,
              code: PermissionsEnum.TICKET_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.TICKET_UPDATE,
              code: PermissionsEnum.TICKET_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.TICKET_DELETE,
              code: PermissionsEnum.TICKET_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_ALL,
          code: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_ALL,
          label: 'Documentation References',
          permissions: [
            {
              key: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_ALL,
              code: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_FETCH,
              code: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_DETAILS,
              code: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_CREATE,
              code: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_UPDATE,
              code: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_DELETE,
              code: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_SHIFT_ALL,
          code: PermissionsEnum.ORG_SHIFT_ALL,
          label: 'Shifts',
          permissions: [
            {
              key: PermissionsEnum.ORG_SHIFT_ALL,
              code: PermissionsEnum.ORG_SHIFT_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.ORG_SHIFT_FETCH,
              code: PermissionsEnum.ORG_SHIFT_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.ORG_SHIFT_DETAILS,
              code: PermissionsEnum.ORG_SHIFT_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.ORG_SHIFT_CREATE,
              code: PermissionsEnum.ORG_SHIFT_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.ORG_SHIFT_UPDATE,
              code: PermissionsEnum.ORG_SHIFT_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.ORG_SHIFT_DELETE,
              code: PermissionsEnum.ORG_SHIFT_DELETE,
              label: 'Delete',
            },
          ],
        },
        {
          key: PermissionsEnum.NOTIFICATION_PLAN_ALL,
          code: PermissionsEnum.NOTIFICATION_PLAN_ALL,
          label: 'Notification Plans',
          permissions: [
            {
              key: PermissionsEnum.NOTIFICATION_PLAN_ALL,
              code: PermissionsEnum.NOTIFICATION_PLAN_ALL,
              label: 'All',
            },
            {
              key: PermissionsEnum.NOTIFICATION_PLAN_FETCH,
              code: PermissionsEnum.NOTIFICATION_PLAN_FETCH,
              label: 'Table',
            },
            {
              key: PermissionsEnum.NOTIFICATION_PLAN_DETAILS,
              code: PermissionsEnum.NOTIFICATION_PLAN_DETAILS,
              label: 'Details',
            },
            {
              key: PermissionsEnum.NOTIFICATION_PLAN_CREATE,
              code: PermissionsEnum.NOTIFICATION_PLAN_CREATE,
              label: 'Create',
            },
            {
              key: PermissionsEnum.NOTIFICATION_PLAN_UPDATE,
              code: PermissionsEnum.NOTIFICATION_PLAN_UPDATE,
              label: 'Update',
            },
            {
              key: PermissionsEnum.NOTIFICATION_PLAN_DELETE,
              code: PermissionsEnum.NOTIFICATION_PLAN_DELETE,
              label: 'Delete',
            },
          ],
        },
      ],
    },
  ],
}
