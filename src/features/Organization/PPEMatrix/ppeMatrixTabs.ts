import { translate as localizeUi } from '@/localization/i18n'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

export const ppeMatrixTabs = [
  {
    key: 'activities',
    get label() {
      return localizeUi('PPE Activity')
    },
    permissions: [
      PermissionsEnum.ORG_PPE_ACTIVITY_ALL,
      PermissionsEnum.ORG_PPE_ACTIVITY_FETCH,
      PermissionsEnum.ORG_PPE_ACTIVITY_DETAILS,
      PermissionsEnum.ORG_PPE_ACTIVITY_CREATE,
      PermissionsEnum.ORG_PPE_ACTIVITY_UPDATE,
      PermissionsEnum.ORG_PPE_ACTIVITY_DELETE,
    ],
  },
  {
    key: 'tools',
    get label() {
      return localizeUi('PPE Tools')
    },
    permissions: [
      PermissionsEnum.ORG_PPE_TOOLS_ALL,
      PermissionsEnum.ORG_PPE_TOOLS_FETCH,
      PermissionsEnum.ORG_PPE_TOOLS_DETAILS,
      PermissionsEnum.ORG_PPE_TOOLS_CREATE,
      PermissionsEnum.ORG_PPE_TOOLS_UPDATE,
      PermissionsEnum.ORG_PPE_TOOLS_DELETE,
    ],
  },
]
