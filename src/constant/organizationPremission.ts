import { translate as localizeUi } from '@/localization/i18n'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import type { PermissionItem } from './adminPremission'

export const OrgPermissions: PermissionItem = {
  key: PermissionsEnum.ORGANIZATION_EMPLOYEE,
  code: PermissionsEnum.ORGANIZATION_EMPLOYEE,
  get label() {
    return localizeUi('Organization')
  },
  permissions: [
    // =========================
    // ORGANIZATION
    // =========================
    {
      key: PermissionsEnum.ORGANIZATION_EMPLOYEE,
      code: PermissionsEnum.ORGANIZATION_EMPLOYEE,
      get label() {
        return localizeUi('Organization')
      },
      permissions: [
        {
          key: PermissionsEnum.INTERNAL_AUDIT_ALL,
          code: PermissionsEnum.INTERNAL_AUDIT_ALL,
          get label() {
            return localizeUi('Internal Audit')
          },
          permissions: [
            {
              key: PermissionsEnum.INTERNAL_AUDIT_ALL,
              code: PermissionsEnum.INTERNAL_AUDIT_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.INTERNAL_AUDIT_FETCH,
              code: PermissionsEnum.INTERNAL_AUDIT_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.INTERNAL_AUDIT_DETAILS,
              code: PermissionsEnum.INTERNAL_AUDIT_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.INTERNAL_AUDIT_CREATE,
              code: PermissionsEnum.INTERNAL_AUDIT_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.INTERNAL_AUDIT_UPDATE,
              code: PermissionsEnum.INTERNAL_AUDIT_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.INTERNAL_AUDIT_DELETE,
              code: PermissionsEnum.INTERNAL_AUDIT_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.MY_INTERNAL_AUDIT_ALL,
          code: PermissionsEnum.MY_INTERNAL_AUDIT_ALL,
          get label() {
            return localizeUi('My Internal Audit')
          },
          permissions: [
            {
              key: PermissionsEnum.MY_INTERNAL_AUDIT_ALL,
              code: PermissionsEnum.MY_INTERNAL_AUDIT_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.MY_INTERNAL_AUDIT_FETCH,
              code: PermissionsEnum.MY_INTERNAL_AUDIT_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.MY_INTERNAL_AUDIT_DETAILS,
              code: PermissionsEnum.MY_INTERNAL_AUDIT_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.MY_INTERNAL_AUDIT_CREATE,
              code: PermissionsEnum.MY_INTERNAL_AUDIT_CREATE,
              get label() {
                return localizeUi('Create NCR')
              },
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
          get label() {
            return localizeUi('Equipment Type')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
              code: PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_TYPE_FETCH,
              code: PermissionsEnum.ORG_EQUIPMENT_TYPE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_TYPE_DETAILS,
              code: PermissionsEnum.ORG_EQUIPMENT_TYPE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_TYPE_CREATE,
              code: PermissionsEnum.ORG_EQUIPMENT_TYPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_TYPE_UPDATE,
              code: PermissionsEnum.ORG_EQUIPMENT_TYPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_TYPE_DELETE,
              code: PermissionsEnum.ORG_EQUIPMENT_TYPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Objective
        {
          key: PermissionsEnum.OBJECTIVE_ORG_ALL,
          code: PermissionsEnum.OBJECTIVE_ORG_ALL,
          get label() {
            return localizeUi('Objective')
          },
          permissions: [
            {
              key: PermissionsEnum.OBJECTIVE_ORG_ALL,
              code: PermissionsEnum.OBJECTIVE_ORG_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.OBJECTIVE_ORG_FETCH,
              code: PermissionsEnum.OBJECTIVE_ORG_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.OBJECTIVE_ORG_DETAILS,
              code: PermissionsEnum.OBJECTIVE_ORG_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.OBJECTIVE_ORG_CREATE,
              code: PermissionsEnum.OBJECTIVE_ORG_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.OBJECTIVE_ORG_UPDATE,
              code: PermissionsEnum.OBJECTIVE_ORG_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.OBJECTIVE_ORG_DELETE,
              code: PermissionsEnum.OBJECTIVE_ORG_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.OBJECTIVE_ORG_ORDER,
              code: PermissionsEnum.OBJECTIVE_ORG_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.OBJECTIVE_ORG_CHANGE_STATUS,
              code: PermissionsEnum.OBJECTIVE_ORG_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Factory
        {
          key: PermissionsEnum.ORG_FACTORY_ALL,
          code: PermissionsEnum.ORG_FACTORY_ALL,
          get label() {
            return localizeUi('hazard_factor')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_FACTORY_ALL,
              code: PermissionsEnum.ORG_FACTORY_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_FACTORY_FETCH,
              code: PermissionsEnum.ORG_FACTORY_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_FACTORY_DETAILS,
              code: PermissionsEnum.ORG_FACTORY_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_FACTORY_CREATE,
              code: PermissionsEnum.ORG_FACTORY_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_FACTORY_UPDATE,
              code: PermissionsEnum.ORG_FACTORY_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_FACTORY_DELETE,
              code: PermissionsEnum.ORG_FACTORY_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // PROJECT ZONE
        {
          key: PermissionsEnum.PROJECT_ZONE_ALL,
          code: PermissionsEnum.PROJECT_ZONE_ALL,
          get label() {
            return localizeUi('Project Zone')
          },
          permissions: [
            {
              key: PermissionsEnum.PROJECT_ZONE_ALL,
              code: PermissionsEnum.PROJECT_ZONE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_FETCH,
              code: PermissionsEnum.PROJECT_ZONE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_DETAILS,
              code: PermissionsEnum.PROJECT_ZONE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_CREATE,
              code: PermissionsEnum.PROJECT_ZONE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_UPDATE,
              code: PermissionsEnum.PROJECT_ZONE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_DELETE,
              code: PermissionsEnum.PROJECT_ZONE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_FETCH_LOCATIONS,
              code: PermissionsEnum.PROJECT_ZONE_FETCH_LOCATIONS,
              get label() {
                return localizeUi('Fetch Locations')
              },
            },
          ],
        },

        // Position
        {
          key: PermissionsEnum.HERIKALY_ALL,
          code: PermissionsEnum.HERIKALY_ALL,
          get label() {
            return localizeUi('position')
          },
          permissions: [
            {
              key: PermissionsEnum.HERIKALY_ALL,
              code: PermissionsEnum.HERIKALY_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.HERIKALY_FETCH,
              code: PermissionsEnum.HERIKALY_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.HERIKALY_DETAILS,
              code: PermissionsEnum.HERIKALY_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.HERIKALY_CREATE,
              code: PermissionsEnum.HERIKALY_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.HERIKALY_UPDATE,
              code: PermissionsEnum.HERIKALY_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.HERIKALY_DELETE,
              code: PermissionsEnum.HERIKALY_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Factory Item
        {
          key: PermissionsEnum.ORG_FACTORY_ITEM_ALL,
          code: PermissionsEnum.ORG_FACTORY_ITEM_ALL,
          get label() {
            return localizeUi('factor_item')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_FACTORY_ITEM_ALL,
              code: PermissionsEnum.ORG_FACTORY_ITEM_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_FACTORY_ITEM_FETCH,
              code: PermissionsEnum.ORG_FACTORY_ITEM_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_FACTORY_ITEM_DETAILS,
              code: PermissionsEnum.ORG_FACTORY_ITEM_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_FACTORY_ITEM_CREATE,
              code: PermissionsEnum.ORG_FACTORY_ITEM_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_FACTORY_ITEM_UPDATE,
              code: PermissionsEnum.ORG_FACTORY_ITEM_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_FACTORY_ITEM_DELETE,
              code: PermissionsEnum.ORG_FACTORY_ITEM_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Template
        {
          key: PermissionsEnum.ORG_TEMPLATE_ALL,
          code: PermissionsEnum.ORG_TEMPLATE_ALL,
          get label() {
            return localizeUi('Template')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_TEMPLATE_ALL,
              code: PermissionsEnum.ORG_TEMPLATE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_TEMPLATE_FETCH,
              code: PermissionsEnum.ORG_TEMPLATE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_TEMPLATE_DETAILS,
              code: PermissionsEnum.ORG_TEMPLATE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_TEMPLATE_CREATE,
              code: PermissionsEnum.ORG_TEMPLATE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_TEMPLATE_UPDATE,
              code: PermissionsEnum.ORG_TEMPLATE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_TEMPLATE_DELETE,
              code: PermissionsEnum.ORG_TEMPLATE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        // Template Item
        {
          key: PermissionsEnum.TEMPLATE_ITEM_ALL,
          code: PermissionsEnum.TEMPLATE_ITEM_ALL,
          get label() {
            return localizeUi('Template_Item')
          },
          permissions: [
            {
              key: PermissionsEnum.TEMPLATE_ITEM_ALL,
              code: PermissionsEnum.TEMPLATE_ITEM_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.TEMPLATE_ITEM_FETCH,
              code: PermissionsEnum.TEMPLATE_ITEM_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.TEMPLATE_ITEM_DETAILS,
              code: PermissionsEnum.TEMPLATE_ITEM_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.TEMPLATE_ITEM_CREATE,
              code: PermissionsEnum.TEMPLATE_ITEM_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.TEMPLATE_ITEM_UPDATE,
              code: PermissionsEnum.TEMPLATE_ITEM_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.TEMPLATE_ITEM_DELETE,
              code: PermissionsEnum.TEMPLATE_ITEM_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Hazard Type
        {
          key: PermissionsEnum.ORG_HAZARD_TYPE_ALL,
          code: PermissionsEnum.ORG_HAZARD_TYPE_ALL,
          get label() {
            return localizeUi('Hazard Classification')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_HAZARD_TYPE_ALL,
              code: PermissionsEnum.ORG_HAZARD_TYPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_HAZARD_TYPE_FETCH,
              code: PermissionsEnum.ORG_HAZARD_TYPE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_HAZARD_TYPE_DETAILS,
              code: PermissionsEnum.ORG_HAZARD_TYPE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_HAZARD_TYPE_CREATE,
              code: PermissionsEnum.ORG_HAZARD_TYPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_HAZARD_TYPE_UPDATE,
              code: PermissionsEnum.ORG_HAZARD_TYPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_HAZARD_TYPE_DELETE,
              code: PermissionsEnum.ORG_HAZARD_TYPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // PARTNER
        {
          key: PermissionsEnum.PARTNER_ALL,
          code: PermissionsEnum.PARTNER_ALL,
          get label() {
            return localizeUi('partner')
          },
          permissions: [
            {
              key: PermissionsEnum.PARTNER_ALL,
              code: PermissionsEnum.PARTNER_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.PARTNER_FETCH,
              code: PermissionsEnum.PARTNER_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.PARTNER_DETAILS,
              code: PermissionsEnum.PARTNER_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.PARTNER_CREATE,
              code: PermissionsEnum.PARTNER_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.PARTNER_UPDATE,
              code: PermissionsEnum.PARTNER_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.PARTNER_DELETE,
              code: PermissionsEnum.PARTNER_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Projects
        {
          key: PermissionsEnum.PROJECT_ALL,
          code: PermissionsEnum.PROJECT_ALL,
          get label() {
            return localizeUi('Projects')
          },
          permissions: [
            {
              key: PermissionsEnum.PROJECT_ALL,
              code: PermissionsEnum.PROJECT_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.PROJECT_FETCH,
              code: PermissionsEnum.PROJECT_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.PROJECT_DETAILS,
              code: PermissionsEnum.PROJECT_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.PROJECT_CREATE,
              code: PermissionsEnum.PROJECT_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.PROJECT_UPDATE,
              code: PermissionsEnum.PROJECT_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.PROJECT_DELETE,
              code: PermissionsEnum.PROJECT_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Organization Documents
        {
          key: PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
          code: PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
          get label() {
            return localizeUi('organization_documents')
          },
          permissions: [
            {
              key: PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
              code: PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORGANIZATION_DOCUMENTS_FETCH,
              code: PermissionsEnum.ORGANIZATION_DOCUMENTS_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORGANIZATION_DOCUMENTS_DETAILS,
              code: PermissionsEnum.ORGANIZATION_DOCUMENTS_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORGANIZATION_DOCUMENTS_CREATE,
              code: PermissionsEnum.ORGANIZATION_DOCUMENTS_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORGANIZATION_DOCUMENTS_UPDATE,
              code: PermissionsEnum.ORGANIZATION_DOCUMENTS_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORGANIZATION_DOCUMENTS_DELETE,
              code: PermissionsEnum.ORGANIZATION_DOCUMENTS_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Certificate
        {
          key: PermissionsEnum.CERTIFICATE_ALL,
          code: PermissionsEnum.CERTIFICATE_ALL,
          get label() {
            return localizeUi('organization_setup_steps.training.title')
          },
          permissions: [
            {
              key: PermissionsEnum.CERTIFICATE_ALL,
              code: PermissionsEnum.CERTIFICATE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.CERTIFICATE_FETCH,
              code: PermissionsEnum.CERTIFICATE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.CERTIFICATE_DETAILS,
              code: PermissionsEnum.CERTIFICATE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.CERTIFICATE_CREATE,
              code: PermissionsEnum.CERTIFICATE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.CERTIFICATE_UPDATE,
              code: PermissionsEnum.CERTIFICATE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.CERTIFICATE_DELETE,
              code: PermissionsEnum.CERTIFICATE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Incidents Type
        {
          key: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
          code: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
          get label() {
            return localizeUi('Incidents Type')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
              code: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_ACCIDENTS_TYPE_FETCH,
              code: PermissionsEnum.ORG_ACCIDENTS_TYPE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_ACCIDENTS_TYPE_DETAILS,
              code: PermissionsEnum.ORG_ACCIDENTS_TYPE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_ACCIDENTS_TYPE_CREATE,
              code: PermissionsEnum.ORG_ACCIDENTS_TYPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_ACCIDENTS_TYPE_UPDATE,
              code: PermissionsEnum.ORG_ACCIDENTS_TYPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_ACCIDENTS_TYPE_DELETE,
              code: PermissionsEnum.ORG_ACCIDENTS_TYPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Equipment
        {
          key: PermissionsEnum.ORG_EQUIPMENT_ALL,
          code: PermissionsEnum.ORG_EQUIPMENT_ALL,
          get label() {
            return localizeUi('Equipment')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_EQUIPMENT_ALL,
              code: PermissionsEnum.ORG_EQUIPMENT_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_FETCH,
              code: PermissionsEnum.ORG_EQUIPMENT_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_DETAILS,
              code: PermissionsEnum.ORG_EQUIPMENT_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_CREATE,
              code: PermissionsEnum.ORG_EQUIPMENT_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_UPDATE,
              code: PermissionsEnum.ORG_EQUIPMENT_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_DELETE,
              code: PermissionsEnum.ORG_EQUIPMENT_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Location
        {
          key: PermissionsEnum.LOCATION_ORG_ALL,
          code: PermissionsEnum.LOCATION_ORG_ALL,
          get label() {
            return localizeUi('Location')
          },
          permissions: [
            {
              key: PermissionsEnum.LOCATION_ORG_ALL,
              code: PermissionsEnum.LOCATION_ORG_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.LOCATION_ORG_FETCH,
              code: PermissionsEnum.LOCATION_ORG_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.LOCATION_ORG_DETAILS,
              code: PermissionsEnum.LOCATION_ORG_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.LOCATION_ORG_CREATE,
              code: PermissionsEnum.LOCATION_ORG_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.LOCATION_ORG_UPDATE,
              code: PermissionsEnum.LOCATION_ORG_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.LOCATION_ORG_DELETE,
              code: PermissionsEnum.LOCATION_ORG_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        // methods
        {
          key: PermissionsEnum.ORG_METHOD_ALL,
          code: PermissionsEnum.ORG_METHOD_ALL,
          get label() {
            return localizeUi('Method')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_METHOD_ALL,
              code: PermissionsEnum.ORG_METHOD_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_METHOD_FETCH,
              code: PermissionsEnum.ORG_METHOD_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_METHOD_DETAILS,
              code: PermissionsEnum.ORG_METHOD_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_METHOD_CREATE,
              code: PermissionsEnum.ORG_METHOD_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_METHOD_UPDATE,
              code: PermissionsEnum.ORG_METHOD_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_METHOD_DELETE,
              code: PermissionsEnum.ORG_METHOD_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        // team
        {
          key: PermissionsEnum.ORG_TEAM_ALL,
          code: PermissionsEnum.ORG_TEAM_ALL,
          get label() {
            return localizeUi('Team')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_TEAM_ALL,
              code: PermissionsEnum.ORG_TEAM_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_TEAM_FETCH,
              code: PermissionsEnum.ORG_TEAM_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_TEAM_DETAILS,
              code: PermissionsEnum.ORG_TEAM_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_TEAM_CREATE,
              code: PermissionsEnum.ORG_TEAM_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_TEAM_UPDATE,
              code: PermissionsEnum.ORG_TEAM_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_TEAM_DELETE,
              code: PermissionsEnum.ORG_TEAM_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Employee
        {
          key: PermissionsEnum.ORG_EMPLOYEE_ALL,
          code: PermissionsEnum.ORG_EMPLOYEE_ALL,
          get label() {
            return localizeUi('Employee')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_EMPLOYEE_ALL,
              code: PermissionsEnum.ORG_EMPLOYEE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_EMPLOYEE_FETCH,
              code: PermissionsEnum.ORG_EMPLOYEE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_EMPLOYEE_DETAILS,
              code: PermissionsEnum.ORG_EMPLOYEE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_EMPLOYEE_CREATE,
              code: PermissionsEnum.ORG_EMPLOYEE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_EMPLOYEE_UPDATE,
              code: PermissionsEnum.ORG_EMPLOYEE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_EMPLOYEE_DELETE,
              code: PermissionsEnum.ORG_EMPLOYEE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Contractor
        {
          key: PermissionsEnum.ORG_CONTRACTOR_ALL,
          code: PermissionsEnum.ORG_CONTRACTOR_ALL,
          get label() {
            return localizeUi('Contructor')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_CONTRACTOR_ALL,
              code: PermissionsEnum.ORG_CONTRACTOR_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_FETCH,
              code: PermissionsEnum.ORG_CONTRACTOR_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_DETAILS,
              code: PermissionsEnum.ORG_CONTRACTOR_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_CREATE,
              code: PermissionsEnum.ORG_CONTRACTOR_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_DELETE,
              code: PermissionsEnum.ORG_CONTRACTOR_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_UPDATE,
              code: PermissionsEnum.ORG_CONTRACTOR_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
          ],
        },

        // Eqipment Mangement
        {
          key: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
          code: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
          get label() {
            return localizeUi('operations')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
              code: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_FETCH,
              code: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_DETAILS,
              code: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_DELETE,
              code: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_UPDATE,
              code: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_CREATE,
              code: PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
          ],
        },
        // Roles
        {
          key: PermissionsEnum.ORG_ROLE_ALL,
          code: PermissionsEnum.ORG_ROLE_ALL,
          get label() {
            return localizeUi('Role')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_ROLE_ALL,
              code: PermissionsEnum.ORG_ROLE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_ROLE_FETCH,
              code: PermissionsEnum.ORG_ROLE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_ROLE_DETAILS,
              code: PermissionsEnum.ORG_ROLE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_ROLE_CREATE,
              code: PermissionsEnum.ORG_ROLE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_ROLE_DELETE,
              code: PermissionsEnum.ORG_ROLE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.ORG_ROLE_UPDATE,
              code: PermissionsEnum.ORG_ROLE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
          ],
        },

        // Attachment Matrix
        {
          key: PermissionsEnum.ATTACHMENT_MATRIX_ALL,
          code: PermissionsEnum.ATTACHMENT_MATRIX_ALL,
          get label() {
            return localizeUi('Attachment Matrix')
          },
          permissions: [
            {
              key: PermissionsEnum.ATTACHMENT_MATRIX_ALL,
              code: PermissionsEnum.ATTACHMENT_MATRIX_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ATTACHMENT_MATRIX_FETCH,
              code: PermissionsEnum.ATTACHMENT_MATRIX_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ATTACHMENT_MATRIX_CREATE,
              code: PermissionsEnum.ATTACHMENT_MATRIX_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
          ],
        },

        // Inspection
        {
          key: PermissionsEnum.ORG_INSPECTION_ALL,
          code: PermissionsEnum.ORG_INSPECTION_ALL,
          get label() {
            return localizeUi('Inspection')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_INSPECTION_ALL,
              code: PermissionsEnum.ORG_INSPECTION_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_INSPECTION_FETCH,
              code: PermissionsEnum.ORG_INSPECTION_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_INSPECTION_DETAILS,
              code: PermissionsEnum.ORG_INSPECTION_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_INSPECTION_CREATE,
              code: PermissionsEnum.ORG_INSPECTION_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_INSPECTION_DELETE,
              code: PermissionsEnum.ORG_INSPECTION_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.ORG_INSPECTION_UPDATE,
              code: PermissionsEnum.ORG_INSPECTION_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.MY_TASKS_ALL,
              code: PermissionsEnum.MY_TASKS_ALL,
              get label() {
                return localizeUi('perform_assigned_inspections')
              },
            },
            {
              key: PermissionsEnum.INSPECTION_RESULTS_FETCH,
              code: PermissionsEnum.INSPECTION_RESULTS_FETCH,
              get label() {
                return localizeUi('Results')
              },
            },
          ],
        },
        // Hazard
        {
          key: PermissionsEnum.ORG_HAZARD_ALL,
          code: PermissionsEnum.ORG_HAZARD_ALL,
          get label() {
            return localizeUi('Hazard')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_HAZARD_ALL,
              code: PermissionsEnum.ORG_HAZARD_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_HAZARD_FETCH,
              code: PermissionsEnum.ORG_HAZARD_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_HAZARD_DETAILS,
              code: PermissionsEnum.ORG_HAZARD_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_HAZARD_CREATE,
              code: PermissionsEnum.ORG_HAZARD_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_HAZARD_DELETE,
              code: PermissionsEnum.ORG_HAZARD_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.ORG_HAZARD_UPDATE,
              code: PermissionsEnum.ORG_HAZARD_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
          ],
        },
        // INCEDANT
        {
          key: PermissionsEnum.ORG_INCEDANT_ALL,
          code: PermissionsEnum.ORG_INCEDANT_ALL,
          get label() {
            return localizeUi('Incident')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_INCEDANT_ALL,
              code: PermissionsEnum.ORG_INCEDANT_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_INCEDANT_FETCH,
              code: PermissionsEnum.ORG_INCEDANT_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_INCEDANT_DETAILS,
              code: PermissionsEnum.ORG_INCEDANT_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_INCEDANT_CREATE,
              code: PermissionsEnum.ORG_INCEDANT_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_INCEDANT_DELETE,
              code: PermissionsEnum.ORG_INCEDANT_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.ORG_INCEDANT_UPDATE,
              code: PermissionsEnum.ORG_INCEDANT_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
          ],
        },
        // Observation
        {
          key: PermissionsEnum.ORG_OBSERVATION_ALL,
          code: PermissionsEnum.ORG_OBSERVATION_ALL,
          get label() {
            return localizeUi('Observation')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_OBSERVATION_ALL,
              code: PermissionsEnum.ORG_OBSERVATION_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_FETCH,
              code: PermissionsEnum.ORG_OBSERVATION_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_DETAILS,
              code: PermissionsEnum.ORG_OBSERVATION_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_CREATE,
              code: PermissionsEnum.ORG_OBSERVATION_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_DELETE,
              code: PermissionsEnum.ORG_OBSERVATION_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_UPDATE,
              code: PermissionsEnum.ORG_OBSERVATION_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
          ],
        },
        // Scope
        {
          key: PermissionsEnum.SCOPE_ALL,
          code: PermissionsEnum.SCOPE_ALL,
          get label() {
            return localizeUi('Scope')
          },
          permissions: [
            {
              key: PermissionsEnum.SCOPE_ALL,
              code: PermissionsEnum.SCOPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.SCOPE_FETCH,
              code: PermissionsEnum.SCOPE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.SCOPE_DETAILS,
              code: PermissionsEnum.SCOPE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.SCOPE_CREATE,
              code: PermissionsEnum.SCOPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.SCOPE_DELETE,
              code: PermissionsEnum.SCOPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.SCOPE_UPDATE,
              code: PermissionsEnum.SCOPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
          ],
        },
        // EMPLOYEE CERTIFICATE
        {
          key: PermissionsEnum.EMPLOYEE_CERTIFICATE_ALL,
          code: PermissionsEnum.EMPLOYEE_CERTIFICATE_ALL,
          get label() {
            return localizeUi('employee_certificate')
          },
          permissions: [
            {
              key: PermissionsEnum.EMPLOYEE_CERTIFICATE_ALL,
              code: PermissionsEnum.EMPLOYEE_CERTIFICATE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.EMPLOYEE_CERTIFICATE_FETCH,
              code: PermissionsEnum.EMPLOYEE_CERTIFICATE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.EMPLOYEE_CERTIFICATE_DETAILS,
              code: PermissionsEnum.EMPLOYEE_CERTIFICATE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.EMPLOYEE_CERTIFICATE_DELETE,
              code: PermissionsEnum.EMPLOYEE_CERTIFICATE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.EMPLOYEE_CERTIFICATE_UPDATE,
              code: PermissionsEnum.EMPLOYEE_CERTIFICATE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.EMPLOYEE_CERTIFICATE_CREATE,
              code: PermissionsEnum.EMPLOYEE_CERTIFICATE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
          ],
        },
        // Observation Type
        {
          key: PermissionsEnum.ORG_OBSERVATION_TYPE_ALL,
          code: PermissionsEnum.ORG_OBSERVATION_TYPE_ALL,
          get label() {
            return localizeUi('Observation Type')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_OBSERVATION_TYPE_ALL,
              code: PermissionsEnum.ORG_OBSERVATION_TYPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_TYPE_FETCH,
              code: PermissionsEnum.ORG_OBSERVATION_TYPE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_TYPE_DETAILS,
              code: PermissionsEnum.ORG_OBSERVATION_TYPE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_TYPE_DELETE,
              code: PermissionsEnum.ORG_OBSERVATION_TYPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_TYPE_CREATE,
              code: PermissionsEnum.ORG_OBSERVATION_TYPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_OBSERVATION_TYPE_UPDATE,
              code: PermissionsEnum.ORG_OBSERVATION_TYPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
          ],
        },
        // WareHouse
        {
          key: PermissionsEnum.WHIERE_HOUSE_ALL,
          code: PermissionsEnum.WHIERE_HOUSE_ALL,
          get label() {
            return localizeUi('Warehouse')
          },
          permissions: [
            {
              key: PermissionsEnum.WHIERE_HOUSE_ALL,
              code: PermissionsEnum.WHIERE_HOUSE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_FETCH,
              code: PermissionsEnum.WHIERE_HOUSE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_DETAILS,
              code: PermissionsEnum.WHIERE_HOUSE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_DELETE,
              code: PermissionsEnum.WHIERE_HOUSE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_CREATE,
              code: PermissionsEnum.WHIERE_HOUSE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_UPDATE,
              code: PermissionsEnum.WHIERE_HOUSE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
          ],
        },
        // WareHouse Type
        {
          key: PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
          code: PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
          get label() {
            return localizeUi('wareHouse_type')
          },
          permissions: [
            {
              key: PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
              code: PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_TYPE_FETCH,
              code: PermissionsEnum.WHIERE_HOUSE_TYPE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_TYPE_DETAILS,
              code: PermissionsEnum.WHIERE_HOUSE_TYPE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_TYPE_DELETE,
              code: PermissionsEnum.WHIERE_HOUSE_TYPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_TYPE_CREATE,
              code: PermissionsEnum.WHIERE_HOUSE_TYPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.WHIERE_HOUSE_TYPE_UPDATE,
              code: PermissionsEnum.WHIERE_HOUSE_TYPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
          ],
        },
        // Drill Type
        {
          key: PermissionsEnum.ORG_DRILL_TYPE_ALL,
          code: PermissionsEnum.ORG_DRILL_TYPE_ALL,
          get label() {
            return localizeUi('Drill Type')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_DRILL_TYPE_ALL,
              code: PermissionsEnum.ORG_DRILL_TYPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_DRILL_TYPE_FETCH,
              code: PermissionsEnum.ORG_DRILL_TYPE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_DRILL_TYPE_DETAILS,
              code: PermissionsEnum.ORG_DRILL_TYPE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_DRILL_TYPE_CREATE,
              code: PermissionsEnum.ORG_DRILL_TYPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_DRILL_TYPE_UPDATE,
              code: PermissionsEnum.ORG_DRILL_TYPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_DRILL_TYPE_DELETE,
              code: PermissionsEnum.ORG_DRILL_TYPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_PTW_TYPE_ALL,
          code: PermissionsEnum.ORG_PTW_TYPE_ALL,
          get label() {
            return localizeUi('PTW Type')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_PTW_TYPE_ALL,
              code: PermissionsEnum.ORG_PTW_TYPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_PTW_TYPE_FETCH,
              code: PermissionsEnum.ORG_PTW_TYPE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_PTW_TYPE_CREATE,
              code: PermissionsEnum.ORG_PTW_TYPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_PTW_TYPE_UPDATE,
              code: PermissionsEnum.ORG_PTW_TYPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_PTW_TYPE_DELETE,
              code: PermissionsEnum.ORG_PTW_TYPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_VISIT_ACTIVITIES_ALL,
          code: PermissionsEnum.ORG_VISIT_ACTIVITIES_ALL,
          get label() {
            return localizeUi('Visit Activities')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_VISIT_ACTIVITIES_ALL,
              code: PermissionsEnum.ORG_VISIT_ACTIVITIES_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_VISIT_ACTIVITIES_FETCH,
              code: PermissionsEnum.ORG_VISIT_ACTIVITIES_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_VISIT_ACTIVITIES_DETAILS,
              code: PermissionsEnum.ORG_VISIT_ACTIVITIES_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_VISIT_ACTIVITIES_CREATE,
              code: PermissionsEnum.ORG_VISIT_ACTIVITIES_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_VISIT_ACTIVITIES_UPDATE,
              code: PermissionsEnum.ORG_VISIT_ACTIVITIES_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_VISIT_ACTIVITIES_DELETE,
              code: PermissionsEnum.ORG_VISIT_ACTIVITIES_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_VISIT_THEME_ALL,
          code: PermissionsEnum.ORG_VISIT_THEME_ALL,
          get label() {
            return localizeUi('Visit Theme')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_VISIT_THEME_ALL,
              code: PermissionsEnum.ORG_VISIT_THEME_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_VISIT_THEME_FETCH,
              code: PermissionsEnum.ORG_VISIT_THEME_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_VISIT_THEME_DETAILS,
              code: PermissionsEnum.ORG_VISIT_THEME_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_VISIT_THEME_CREATE,
              code: PermissionsEnum.ORG_VISIT_THEME_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_VISIT_THEME_UPDATE,
              code: PermissionsEnum.ORG_VISIT_THEME_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_VISIT_THEME_DELETE,
              code: PermissionsEnum.ORG_VISIT_THEME_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_VISIT_CATEGORY_ALL,
          code: PermissionsEnum.ORG_VISIT_CATEGORY_ALL,
          get label() {
            return localizeUi('Visit Category')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_VISIT_CATEGORY_ALL,
              code: PermissionsEnum.ORG_VISIT_CATEGORY_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_VISIT_CATEGORY_FETCH,
              code: PermissionsEnum.ORG_VISIT_CATEGORY_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_VISIT_CATEGORY_DETAILS,
              code: PermissionsEnum.ORG_VISIT_CATEGORY_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_VISIT_CATEGORY_CREATE,
              code: PermissionsEnum.ORG_VISIT_CATEGORY_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_VISIT_CATEGORY_UPDATE,
              code: PermissionsEnum.ORG_VISIT_CATEGORY_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_VISIT_CATEGORY_DELETE,
              code: PermissionsEnum.ORG_VISIT_CATEGORY_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_PPE_ACTIVITY_ALL,
          code: PermissionsEnum.ORG_PPE_ACTIVITY_ALL,
          get label() {
            return localizeUi('PPE Activity')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_PPE_ACTIVITY_ALL,
              code: PermissionsEnum.ORG_PPE_ACTIVITY_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_PPE_ACTIVITY_FETCH,
              code: PermissionsEnum.ORG_PPE_ACTIVITY_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.ORG_PPE_ACTIVITY_DETAILS,
              code: PermissionsEnum.ORG_PPE_ACTIVITY_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_PPE_ACTIVITY_CREATE,
              code: PermissionsEnum.ORG_PPE_ACTIVITY_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_PPE_ACTIVITY_UPDATE,
              code: PermissionsEnum.ORG_PPE_ACTIVITY_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_PPE_ACTIVITY_DELETE,
              code: PermissionsEnum.ORG_PPE_ACTIVITY_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_PPE_TOOLS_ALL,
          code: PermissionsEnum.ORG_PPE_TOOLS_ALL,
          get label() {
            return localizeUi('PPE Tools')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_PPE_TOOLS_ALL,
              code: PermissionsEnum.ORG_PPE_TOOLS_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_PPE_TOOLS_FETCH,
              code: PermissionsEnum.ORG_PPE_TOOLS_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.ORG_PPE_TOOLS_DETAILS,
              code: PermissionsEnum.ORG_PPE_TOOLS_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_PPE_TOOLS_CREATE,
              code: PermissionsEnum.ORG_PPE_TOOLS_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_PPE_TOOLS_UPDATE,
              code: PermissionsEnum.ORG_PPE_TOOLS_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_PPE_TOOLS_DELETE,
              code: PermissionsEnum.ORG_PPE_TOOLS_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_DOCUMENT_CATEGORY_ALL,
          code: PermissionsEnum.ORG_DOCUMENT_CATEGORY_ALL,
          get label() {
            return localizeUi('Document Categories')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_DOCUMENT_CATEGORY_ALL,
              code: PermissionsEnum.ORG_DOCUMENT_CATEGORY_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_DOCUMENT_CATEGORY_FETCH,
              code: PermissionsEnum.ORG_DOCUMENT_CATEGORY_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.ORG_DOCUMENT_CATEGORY_DETAILS,
              code: PermissionsEnum.ORG_DOCUMENT_CATEGORY_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_DOCUMENT_CATEGORY_CREATE,
              code: PermissionsEnum.ORG_DOCUMENT_CATEGORY_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_DOCUMENT_CATEGORY_UPDATE,
              code: PermissionsEnum.ORG_DOCUMENT_CATEGORY_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_DOCUMENT_CATEGORY_DELETE,
              code: PermissionsEnum.ORG_DOCUMENT_CATEGORY_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_AUDIT_STANDARDS_ALL,
          code: PermissionsEnum.ORG_AUDIT_STANDARDS_ALL,
          get label() {
            return localizeUi('Audit Standards')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_AUDIT_STANDARDS_ALL,
              code: PermissionsEnum.ORG_AUDIT_STANDARDS_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_AUDIT_STANDARDS_FETCH,
              code: PermissionsEnum.ORG_AUDIT_STANDARDS_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.ORG_AUDIT_STANDARDS_DETAILS,
              code: PermissionsEnum.ORG_AUDIT_STANDARDS_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_AUDIT_STANDARDS_CREATE,
              code: PermissionsEnum.ORG_AUDIT_STANDARDS_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_AUDIT_STANDARDS_UPDATE,
              code: PermissionsEnum.ORG_AUDIT_STANDARDS_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_AUDIT_STANDARDS_DELETE,
              code: PermissionsEnum.ORG_AUDIT_STANDARDS_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_AUDIT_ACTIVITIES_ALL,
          code: PermissionsEnum.ORG_AUDIT_ACTIVITIES_ALL,
          get label() {
            return localizeUi('Audit Activities')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_AUDIT_ACTIVITIES_ALL,
              code: PermissionsEnum.ORG_AUDIT_ACTIVITIES_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_AUDIT_ACTIVITIES_FETCH,
              code: PermissionsEnum.ORG_AUDIT_ACTIVITIES_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.ORG_AUDIT_ACTIVITIES_DETAILS,
              code: PermissionsEnum.ORG_AUDIT_ACTIVITIES_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_AUDIT_ACTIVITIES_CREATE,
              code: PermissionsEnum.ORG_AUDIT_ACTIVITIES_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_AUDIT_ACTIVITIES_UPDATE,
              code: PermissionsEnum.ORG_AUDIT_ACTIVITIES_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_AUDIT_ACTIVITIES_DELETE,
              code: PermissionsEnum.ORG_AUDIT_ACTIVITIES_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        // PPE Item
        {
          key: PermissionsEnum.ORG_PPE_ITEM_ALL,
          code: PermissionsEnum.ORG_PPE_ITEM_ALL,
          get label() {
            return localizeUi('PPE Item')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_PPE_ITEM_ALL,
              code: PermissionsEnum.ORG_PPE_ITEM_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_PPE_ITEM_FETCH,
              code: PermissionsEnum.ORG_PPE_ITEM_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_PPE_ITEM_DETAILS,
              code: PermissionsEnum.ORG_PPE_ITEM_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_PPE_ITEM_CREATE,
              code: PermissionsEnum.ORG_PPE_ITEM_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_PPE_ITEM_UPDATE,
              code: PermissionsEnum.ORG_PPE_ITEM_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_PPE_ITEM_DELETE,
              code: PermissionsEnum.ORG_PPE_ITEM_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        // Injury
        {
          key: PermissionsEnum.INJURY_ALL,
          code: PermissionsEnum.INJURY_ALL,
          get label() {
            return localizeUi('Injury')
          },
          permissions: [
            {
              key: PermissionsEnum.INJURY_ALL,
              code: PermissionsEnum.INJURY_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.INJURY_FETCH,
              code: PermissionsEnum.INJURY_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.INJURY_DETAILS,
              code: PermissionsEnum.INJURY_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.INJURY_DELETE,
              code: PermissionsEnum.INJURY_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.INJURY_CREATE,
              code: PermissionsEnum.INJURY_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.INJURY_UPDATE,
              code: PermissionsEnum.INJURY_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
          ],
        },
        // Root Causes
        {
          key: PermissionsEnum.ROOT_CAUSES_ALL,
          code: PermissionsEnum.ROOT_CAUSES_ALL,
          get label() {
            return localizeUi('Root Causes')
          },
          permissions: [
            {
              key: PermissionsEnum.ROOT_CAUSES_ALL,
              code: PermissionsEnum.ROOT_CAUSES_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ROOT_CAUSES_FETCH,
              code: PermissionsEnum.ROOT_CAUSES_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ROOT_CAUSES_DETAILS,
              code: PermissionsEnum.ROOT_CAUSES_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ROOT_CAUSES_DELETE,
              code: PermissionsEnum.ROOT_CAUSES_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.ROOT_CAUSES_CREATE,
              code: PermissionsEnum.ROOT_CAUSES_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ROOT_CAUSES_UPDATE,
              code: PermissionsEnum.ROOT_CAUSES_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
          ],
        },
        //Coding System
        {
          key: PermissionsEnum.CODING_SYSTEM_ALL,
          code: PermissionsEnum.CODING_SYSTEM_ALL,
          get label() {
            return localizeUi('coding_system')
          },
          permissions: [
            {
              key: PermissionsEnum.CODING_SYSTEM_ALL,
              code: PermissionsEnum.CODING_SYSTEM_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.CODING_SYSTEM_FETCH,
              code: PermissionsEnum.CODING_SYSTEM_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.CODING_SYSTEM_DETAILS,
              code: PermissionsEnum.CODING_SYSTEM_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.CODING_SYSTEM_DELETE,
              code: PermissionsEnum.CODING_SYSTEM_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.CODING_SYSTEM_CREATE,
              code: PermissionsEnum.CODING_SYSTEM_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.CODING_SYSTEM_UPDATE,
              code: PermissionsEnum.CODING_SYSTEM_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
          ],
        },
        // Investigation
        {
          key: PermissionsEnum.INVESTIGATION_ALL,
          code: PermissionsEnum.INVESTIGATION_ALL,
          get label() {
            return localizeUi('Investigation')
          },
          permissions: [
            {
              key: PermissionsEnum.INVESTIGATION_ALL,
              code: PermissionsEnum.INVESTIGATION_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.INVESTIGATION_FETCH,
              code: PermissionsEnum.INVESTIGATION_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.INVESTIGATION_DETAILS,
              code: PermissionsEnum.INVESTIGATION_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.INVESTIGATION_DELETE,
              code: PermissionsEnum.INVESTIGATION_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.INVESTIGATION_CREATE,
              code: PermissionsEnum.INVESTIGATION_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.INVESTIGATION_UPDATE,
              code: PermissionsEnum.INVESTIGATION_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.FULL_INVESTIGATION_CREATE,
              code: PermissionsEnum.FULL_INVESTIGATION_CREATE,
              get label() {
                return localizeUi('Create Full Investigation')
              },
            },
          ],
        },
        // Capa
        {
          key: PermissionsEnum.CAPA_ALL,
          code: PermissionsEnum.CAPA_ALL,
          get label() {
            return localizeUi('Capa')
          },
          permissions: [
            {
              key: PermissionsEnum.CAPA_ALL,
              code: PermissionsEnum.CAPA_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.CAPA_FETCH,
              code: PermissionsEnum.CAPA_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.CAPA_DETAILS,
              code: PermissionsEnum.CAPA_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.CAPA_DELETE,
              code: PermissionsEnum.CAPA_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.CAPA_CAREATE,
              code: PermissionsEnum.CAPA_CAREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.CAPA_UPDATE,
              code: PermissionsEnum.CAPA_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.CAPA_CHANGE_STATUS,
              code: PermissionsEnum.CAPA_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
            {
              key: PermissionsEnum.CAPA_SET_RESULT,
              code: PermissionsEnum.CAPA_SET_RESULT,
              get label() {
                return localizeUi('Set Result')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_MEETING_TYPE_ALL,
          code: PermissionsEnum.ORG_MEETING_TYPE_ALL,
          get label() {
            return localizeUi('meeting type')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_MEETING_TYPE_ALL,
              code: PermissionsEnum.ORG_MEETING_TYPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_MEETING_TYPE_FETCH,
              code: PermissionsEnum.ORG_MEETING_TYPE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_MEETING_TYPE_DETAILS,
              code: PermissionsEnum.ORG_MEETING_TYPE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_MEETING_TYPE_DELETE,
              code: PermissionsEnum.ORG_MEETING_TYPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.ORG_MEETING_TYPE_CREATE,
              code: PermissionsEnum.ORG_MEETING_TYPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_MEETING_TYPE_UPDATE,
              code: PermissionsEnum.ORG_MEETING_TYPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_PERMIT,
          code: PermissionsEnum.PROJECT_PERMIT,
          get label() {
            return localizeUi('Project Permit')
          },
          permissions: [
            {
              key: PermissionsEnum.PROJECT_PERMIT,
              code: PermissionsEnum.PROJECT_PERMIT,
              get label() {
                return localizeUi('Allow')
              },
            },
          ],
        },

        {
          key: PermissionsEnum.ORG_TRANING_TOPIC_ALL,
          code: PermissionsEnum.ORG_TRANING_TOPIC_ALL,
          get label() {
            return localizeUi('Traning Topic')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_TRANING_TOPIC_ALL,
              code: PermissionsEnum.ORG_TRANING_TOPIC_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_TRANING_TOPIC_FETCH,
              code: PermissionsEnum.ORG_TRANING_TOPIC_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_TRANING_TOPIC_DETAILS,
              code: PermissionsEnum.ORG_TRANING_TOPIC_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_TRANING_TOPIC_CREATE,
              code: PermissionsEnum.ORG_TRANING_TOPIC_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_TRANING_TOPIC_UPDATE,
              code: PermissionsEnum.ORG_TRANING_TOPIC_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_TRANING_TOPIC_DELETE,
              code: PermissionsEnum.ORG_TRANING_TOPIC_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.inductions_ALL,
          code: PermissionsEnum.inductions_ALL,
          get label() {
            return localizeUi('Inductions')
          },
          permissions: [
            {
              key: PermissionsEnum.inductions_ALL,
              code: PermissionsEnum.inductions_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.inductions_FETCH,
              code: PermissionsEnum.inductions_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.inductions_DETAILS,
              code: PermissionsEnum.inductions_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.inductions_CREATE,
              code: PermissionsEnum.inductions_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.inductions_UPDATE,
              code: PermissionsEnum.inductions_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.inductions_DELETE,
              code: PermissionsEnum.inductions_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ppe_matrix_logs_ALL,
          code: PermissionsEnum.ppe_matrix_logs_ALL,
          get label() {
            return localizeUi('PPE Matrix Logs')
          },
          permissions: [
            {
              key: PermissionsEnum.ppe_matrix_logs_ALL,
              code: PermissionsEnum.ppe_matrix_logs_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ppe_matrix_logs_FETCH,
              code: PermissionsEnum.ppe_matrix_logs_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ppe_matrix_logs_DETAILS,
              code: PermissionsEnum.ppe_matrix_logs_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ppe_matrix_logs_CREATE,
              code: PermissionsEnum.ppe_matrix_logs_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ppe_matrix_logs_UPDATE,
              code: PermissionsEnum.ppe_matrix_logs_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ppe_matrix_logs_DELETE,
              code: PermissionsEnum.ppe_matrix_logs_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.objectives_ALL,
          code: PermissionsEnum.objectives_ALL,
          get label() {
            return localizeUi('Objectives')
          },
          permissions: [
            {
              key: PermissionsEnum.objectives_ALL,
              code: PermissionsEnum.objectives_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.objectives_FETCH,
              code: PermissionsEnum.objectives_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.objectives_DETAILS,
              code: PermissionsEnum.objectives_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.objectives_CREATE,
              code: PermissionsEnum.objectives_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.objectives_UPDATE,
              code: PermissionsEnum.objectives_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.objectives_DELETE,
              code: PermissionsEnum.objectives_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.PTW_ALL,
          code: PermissionsEnum.PTW_ALL,
          get label() {
            return localizeUi('Permit to wotk')
          },
          permissions: [
            {
              key: PermissionsEnum.PTW_ALL,
              code: PermissionsEnum.PTW_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.PTW_FETCH,
              code: PermissionsEnum.PTW_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.PTW_CREATE,
              code: PermissionsEnum.PTW_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.PTW_DELETE,
              code: PermissionsEnum.PTW_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.PTW_DETAILS,
              code: PermissionsEnum.PTW_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.PTW_UPDATE,
              code: PermissionsEnum.PTW_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.RISK_ASSESSMENT_ALL,
          code: PermissionsEnum.RISK_ASSESSMENT_ALL,
          get label() {
            return localizeUi('Risk assessment')
          },
          permissions: [
            {
              key: PermissionsEnum.RISK_ASSESSMENT_ALL,
              code: PermissionsEnum.RISK_ASSESSMENT_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.RISK_ASSESSMENT_FETCH,
              code: PermissionsEnum.RISK_ASSESSMENT_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.RISK_ASSESSMENT_DETAILS,
              code: PermissionsEnum.RISK_ASSESSMENT_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.RISK_ASSESSMENT_CREATE,
              code: PermissionsEnum.RISK_ASSESSMENT_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.RISK_ASSESSMENT_UPDATE,
              code: PermissionsEnum.RISK_ASSESSMENT_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.RISK_ASSESSMENT_DELETE,
              code: PermissionsEnum.RISK_ASSESSMENT_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.LEADERSHIP_ALL,
          code: PermissionsEnum.LEADERSHIP_ALL,
          get label() {
            return localizeUi('Leadership')
          },
          permissions: [
            {
              key: PermissionsEnum.LEADERSHIP_ALL,
              code: PermissionsEnum.LEADERSHIP_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.LEADERSHIP_FETCH,
              code: PermissionsEnum.LEADERSHIP_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.LEADERSHIP_DETAILS,
              code: PermissionsEnum.LEADERSHIP_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.LEADERSHIP_CRAETE,
              code: PermissionsEnum.LEADERSHIP_CRAETE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.LEADERSHIP_UPDATE,
              code: PermissionsEnum.LEADERSHIP_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.LEADERSHIP_DELETE,
              code: PermissionsEnum.LEADERSHIP_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.MOC_ALL,
          code: PermissionsEnum.MOC_ALL,
          get label() {
            return localizeUi('Mangement Of Change')
          },
          permissions: [
            {
              key: PermissionsEnum.MOC_ALL,
              code: PermissionsEnum.MOC_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.MOC_FETCH,
              code: PermissionsEnum.MOC_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.MOC_DETAILS,
              code: PermissionsEnum.MOC_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.MOC_CRAETE,
              code: PermissionsEnum.MOC_CRAETE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.MOC_UPDATE,
              code: PermissionsEnum.MOC_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.MOC_DELETE,
              code: PermissionsEnum.MOC_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_ALL,
          code: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_ALL,
          get label() {
            return localizeUi('Mangement Of Change Type')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_ALL,
              code: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_FETCH,
              code: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_DETAILS,
              code: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_CREATE,
              code: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_UPDATE,
              code: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_DELETE,
              code: PermissionsEnum.ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_PROGRESS_ALL,
          code: PermissionsEnum.PROJECT_PROGRESS_ALL,
          get label() {
            return localizeUi('Project Progress')
          },
          permissions: [
            {
              key: PermissionsEnum.PROJECT_PROGRESS_ALL,
              code: PermissionsEnum.PROJECT_PROGRESS_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORGANIZATION_CERTIFICATE_ALL,
          code: PermissionsEnum.ORGANIZATION_CERTIFICATE_ALL,
          get label() {
            return localizeUi('Organization Certificates')
          },
          permissions: [
            {
              key: PermissionsEnum.ORGANIZATION_CERTIFICATE_ALL,
              code: PermissionsEnum.ORGANIZATION_CERTIFICATE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORGANIZATION_CERTIFICATE_FETCH,
              code: PermissionsEnum.ORGANIZATION_CERTIFICATE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORGANIZATION_CERTIFICATE_DETAILS,
              code: PermissionsEnum.ORGANIZATION_CERTIFICATE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORGANIZATION_CERTIFICATE_CREATE,
              code: PermissionsEnum.ORGANIZATION_CERTIFICATE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORGANIZATION_CERTIFICATE_UPDATE,
              code: PermissionsEnum.ORGANIZATION_CERTIFICATE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORGANIZATION_CERTIFICATE_DELETE,
              code: PermissionsEnum.ORGANIZATION_CERTIFICATE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_LOCATION_ALL,
          code: PermissionsEnum.ORG_LOCATION_ALL,
          get label() {
            return localizeUi('Organization Locations')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_LOCATION_ALL,
              code: PermissionsEnum.ORG_LOCATION_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_LOCATION_FETCH,
              code: PermissionsEnum.ORG_LOCATION_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_LOCATION_DETAILS,
              code: PermissionsEnum.ORG_LOCATION_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_LOCATION_CREATE,
              code: PermissionsEnum.ORG_LOCATION_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_LOCATION_UPDATE,
              code: PermissionsEnum.ORG_LOCATION_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_LOCATION_DELETE,
              code: PermissionsEnum.ORG_LOCATION_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.HEALTH_CONDITION_ALL,
          code: PermissionsEnum.HEALTH_CONDITION_ALL,
          get label() {
            return localizeUi('health_conditions')
          },
          permissions: [
            {
              key: PermissionsEnum.HEALTH_CONDITION_ALL,
              code: PermissionsEnum.HEALTH_CONDITION_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.HEALTH_CONDITION_FETCH,
              code: PermissionsEnum.HEALTH_CONDITION_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.HEALTH_CONDITION_DETAILS,
              code: PermissionsEnum.HEALTH_CONDITION_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.HEALTH_CONDITION_CREATE,
              code: PermissionsEnum.HEALTH_CONDITION_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.HEALTH_CONDITION_UPDATE,
              code: PermissionsEnum.HEALTH_CONDITION_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.HEALTH_CONDITION_DELETE,
              code: PermissionsEnum.HEALTH_CONDITION_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_HEALTH_CONDITION_ALL,
          code: PermissionsEnum.ORG_HEALTH_CONDITION_ALL,
          get label() {
            return localizeUi('Organization Health Conditions')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_HEALTH_CONDITION_ALL,
              code: PermissionsEnum.ORG_HEALTH_CONDITION_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_HEALTH_CONDITION_FETCH,
              code: PermissionsEnum.ORG_HEALTH_CONDITION_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_HEALTH_CONDITION_DETAILS,
              code: PermissionsEnum.ORG_HEALTH_CONDITION_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_HEALTH_CONDITION_CREATE,
              code: PermissionsEnum.ORG_HEALTH_CONDITION_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_HEALTH_CONDITION_UPDATE,
              code: PermissionsEnum.ORG_HEALTH_CONDITION_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_HEALTH_CONDITION_DELETE,
              code: PermissionsEnum.ORG_HEALTH_CONDITION_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_ALL,
          code: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_ALL,
          get label() {
            return localizeUi('Contractor Management')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_ALL,
              code: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_FETCH,
              code: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_DETAILS,
              code: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_CREATE,
              code: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_UPDATE,
              code: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_DELETE,
              code: PermissionsEnum.ORG_CONTRACTOR_MANAGEMENT_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_LOCATION_ALL,
          code: PermissionsEnum.PROJECT_LOCATION_ALL,
          get label() {
            return localizeUi('Project Locations')
          },
          permissions: [
            {
              key: PermissionsEnum.PROJECT_LOCATION_ALL,
              code: PermissionsEnum.PROJECT_LOCATION_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_FETCH,
              code: PermissionsEnum.PROJECT_LOCATION_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_DETAILS,
              code: PermissionsEnum.PROJECT_LOCATION_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_CREATE,
              code: PermissionsEnum.PROJECT_LOCATION_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_UPDATE,
              code: PermissionsEnum.PROJECT_LOCATION_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_DELETE,
              code: PermissionsEnum.PROJECT_LOCATION_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_ZONE_ALL,
          code: PermissionsEnum.PROJECT_ZONE_ALL,
          get label() {
            return localizeUi('Project zones')
          },
          permissions: [
            {
              key: PermissionsEnum.PROJECT_ZONE_ALL,
              code: PermissionsEnum.PROJECT_ZONE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_FETCH,
              code: PermissionsEnum.PROJECT_ZONE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_DETAILS,
              code: PermissionsEnum.PROJECT_ZONE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_CREATE,
              code: PermissionsEnum.PROJECT_ZONE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_UPDATE,
              code: PermissionsEnum.PROJECT_ZONE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.PROJECT_ZONE_DELETE,
              code: PermissionsEnum.PROJECT_ZONE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_ALL,
          code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_ALL,
          get label() {
            return localizeUi('Project Location Hierarchy')
          },
          permissions: [
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_ALL,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_FETCH,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_DETAILS,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_CREATE,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_UPDATE,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_DELETE,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_ALL,
          code: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_ALL,
          get label() {
            return localizeUi('Project Location Employees')
          },
          permissions: [
            {
              key: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_ALL,
              code: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_FETCH,
              code: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_DETAILS,
              code: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_CREATE,
              code: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_UPDATE,
              code: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_DELETE,
              code: PermissionsEnum.PROJECT_LOCATION_EMPLOYEE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_ALL,
          code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_ALL,
          get label() {
            return localizeUi('Project Location Hierarchy Employees')
          },
          permissions: [
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_ALL,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_FETCH,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_DETAILS,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_CREATE,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_UPDATE,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_DELETE,
              code: PermissionsEnum.PROJECT_LOCATION_HIERARCHY_EMPLOYEE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_ZOON_EQUIPMENT_ALL,
          code: PermissionsEnum.PROJECT_ZOON_EQUIPMENT_ALL,
          get label() {
            return localizeUi('Project Zone Equipment')
          },
          permissions: [
            {
              key: PermissionsEnum.PROJECT_ZOON_EQUIPMENT_ALL,
              code: PermissionsEnum.PROJECT_ZOON_EQUIPMENT_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.PROJECT_ZOON_EQUIPMENT_FETCH,
              code: PermissionsEnum.PROJECT_ZOON_EQUIPMENT_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.PROJECT_ZOON_EQUIPMENT_CREATE,
              code: PermissionsEnum.PROJECT_ZOON_EQUIPMENT_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_ALL,
          code: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_ALL,
          get label() {
            return localizeUi('Project Location Team Employees')
          },
          permissions: [
            {
              key: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_ALL,
              code: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_FETCH,
              code: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_CREATE,
              code: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_DELETE,
              code: PermissionsEnum.PROJECT_LOCATION_TEAM_EMPLOYEE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.TASK_ALL,
          code: PermissionsEnum.TASK_ALL,
          get label() {
            return localizeUi('tasks')
          },
          permissions: [
            {
              key: PermissionsEnum.TASK_ALL,
              code: PermissionsEnum.TASK_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.TASK_FETCH,
              code: PermissionsEnum.TASK_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.TASK_DETAILS,
              code: PermissionsEnum.TASK_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.TASK_CREATE,
              code: PermissionsEnum.TASK_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.TASK_UPDATE,
              code: PermissionsEnum.TASK_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.TASK_DELETE,
              code: PermissionsEnum.TASK_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.TASK_RESULT_ALL,
          code: PermissionsEnum.TASK_RESULT_ALL,
          get label() {
            return localizeUi('Task Results')
          },
          permissions: [
            {
              key: PermissionsEnum.TASK_RESULT_ALL,
              code: PermissionsEnum.TASK_RESULT_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.TASK_RESULT_FETCH,
              code: PermissionsEnum.TASK_RESULT_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.TASK_RESULT_DETAILS,
              code: PermissionsEnum.TASK_RESULT_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.TASK_RESULT_CREATE,
              code: PermissionsEnum.TASK_RESULT_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.TASK_RESULT_UPDATE,
              code: PermissionsEnum.TASK_RESULT_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.TASK_RESULT_DELETE,
              code: PermissionsEnum.TASK_RESULT_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.TASK_RESULT_ITEM_ALL,
          code: PermissionsEnum.TASK_RESULT_ITEM_ALL,
          get label() {
            return localizeUi('Task Result Items')
          },
          permissions: [
            {
              key: PermissionsEnum.TASK_RESULT_ITEM_ALL,
              code: PermissionsEnum.TASK_RESULT_ITEM_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.TASK_RESULT_ITEM_FETCH,
              code: PermissionsEnum.TASK_RESULT_ITEM_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.TASK_RESULT_ITEM_DETAILS,
              code: PermissionsEnum.TASK_RESULT_ITEM_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.TASK_RESULT_ITEM_CREATE,
              code: PermissionsEnum.TASK_RESULT_ITEM_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.TASK_RESULT_ITEM_UPDATE,
              code: PermissionsEnum.TASK_RESULT_ITEM_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.TASK_RESULT_ITEM_DELETE,
              code: PermissionsEnum.TASK_RESULT_ITEM_DELETE,
              get label() {
                return localizeUi('Delete')
              },
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
          get label() {
            return localizeUi('Investigation Task Results')
          },
          permissions: [
            {
              key: PermissionsEnum.INVESTIGATION_TASK_RESULT_ALL,
              code: PermissionsEnum.INVESTIGATION_TASK_RESULT_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.INVESTIGATION_TASK_RESULT_FETCH,
              code: PermissionsEnum.INVESTIGATION_TASK_RESULT_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.INVESTIGATION_TASK_RESULT_DETAILS,
              code: PermissionsEnum.INVESTIGATION_TASK_RESULT_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            // {
            //   key: PermissionsEnum.INVESTIGATION_TASK_RESULT_CREATE,
            //   code: PermissionsEnum.INVESTIGATION_TASK_RESULT_CREATE,
            //   label: 'Create',
            // },
            {
              key: PermissionsEnum.FULL_INVESTIGATION_MEETING_RESULT_CREATE,
              code: PermissionsEnum.FULL_INVESTIGATION_MEETING_RESULT_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.INVESTIGATION_TASK_RESULT_UPDATE,
              code: PermissionsEnum.INVESTIGATION_TASK_RESULT_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.INVESTIGATION_TASK_RESULT_DELETE,
              code: PermissionsEnum.INVESTIGATION_TASK_RESULT_DELETE,
              get label() {
                return localizeUi('Delete')
              },
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
          get label() {
            return localizeUi('Support Tickets')
          },
          permissions: [
            {
              key: PermissionsEnum.TICKET_ALL,
              code: PermissionsEnum.TICKET_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.TICKET_FETCH,
              code: PermissionsEnum.TICKET_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.TICKET_DETAILS,
              code: PermissionsEnum.TICKET_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.TICKET_CREATE,
              code: PermissionsEnum.TICKET_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.TICKET_UPDATE,
              code: PermissionsEnum.TICKET_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.TICKET_DELETE,
              code: PermissionsEnum.TICKET_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_ALL,
          code: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_ALL,
          get label() {
            return localizeUi('Documentation References')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_ALL,
              code: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_FETCH,
              code: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_DETAILS,
              code: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_CREATE,
              code: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_UPDATE,
              code: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_DELETE,
              code: PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.ORG_SHIFT_ALL,
          code: PermissionsEnum.ORG_SHIFT_ALL,
          get label() {
            return localizeUi('shifts')
          },
          permissions: [
            {
              key: PermissionsEnum.ORG_SHIFT_ALL,
              code: PermissionsEnum.ORG_SHIFT_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORG_SHIFT_FETCH,
              code: PermissionsEnum.ORG_SHIFT_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.ORG_SHIFT_DETAILS,
              code: PermissionsEnum.ORG_SHIFT_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORG_SHIFT_CREATE,
              code: PermissionsEnum.ORG_SHIFT_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORG_SHIFT_UPDATE,
              code: PermissionsEnum.ORG_SHIFT_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORG_SHIFT_DELETE,
              code: PermissionsEnum.ORG_SHIFT_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.NOTIFICATION_PLAN_ALL,
          code: PermissionsEnum.NOTIFICATION_PLAN_ALL,
          get label() {
            return localizeUi('Notification Plans')
          },
          permissions: [
            {
              key: PermissionsEnum.NOTIFICATION_PLAN_ALL,
              code: PermissionsEnum.NOTIFICATION_PLAN_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.NOTIFICATION_PLAN_FETCH,
              code: PermissionsEnum.NOTIFICATION_PLAN_FETCH,
              get label() {
                return localizeUi('Table')
              },
            },
            {
              key: PermissionsEnum.NOTIFICATION_PLAN_DETAILS,
              code: PermissionsEnum.NOTIFICATION_PLAN_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.NOTIFICATION_PLAN_CREATE,
              code: PermissionsEnum.NOTIFICATION_PLAN_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.NOTIFICATION_PLAN_UPDATE,
              code: PermissionsEnum.NOTIFICATION_PLAN_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.NOTIFICATION_PLAN_DELETE,
              code: PermissionsEnum.NOTIFICATION_PLAN_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
      ],
    },
  ],
}
