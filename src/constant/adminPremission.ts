import { translate as localizeUi } from '@/localization/i18n'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

export type PermissionItem = {
  key: PermissionsEnum
  code: PermissionsEnum
  label: string
  permissions?: PermissionItem[]
}

export const adminPermissions: PermissionItem = {
  key: PermissionsEnum.ADMIN,
  code: PermissionsEnum.ADMIN,
  get label() {
    return localizeUi('admin')
  },
  permissions: [
    // =========================
    // WEBSITE
    // =========================
    {
      key: PermissionsEnum.WEBSITE,
      code: PermissionsEnum.WEBSITE,
      get label() {
        return localizeUi('website')
      },
      permissions: [
        // Header
        {
          key: PermissionsEnum.HEADER_ALL,
          code: PermissionsEnum.HEADER_ALL,
          get label() {
            return localizeUi('header')
          },
          permissions: [
            {
              key: PermissionsEnum.HEADER_ALL,
              code: PermissionsEnum.HEADER_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.HEADER_FETCH,
              code: PermissionsEnum.HEADER_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.HEADER_DETAILS,
              code: PermissionsEnum.HEADER_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.HEADER_CREATE,
              code: PermissionsEnum.HEADER_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.HEADER_UPDATE,
              code: PermissionsEnum.HEADER_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.HEADER_DELETE,
              code: PermissionsEnum.HEADER_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.HEADER_ORDER,
              code: PermissionsEnum.HEADER_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.HEADER_CHANGE_STATUS,
              code: PermissionsEnum.HEADER_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Header Title
        {
          key: PermissionsEnum.HEADER_TITLE_ALL,
          code: PermissionsEnum.HEADER_TITLE_ALL,
          get label() {
            return localizeUi('Header Title')
          },
          permissions: [
            {
              key: PermissionsEnum.HEADER_TITLE_ALL,
              code: PermissionsEnum.HEADER_TITLE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.HEADER_TITLE_FETCH,
              code: PermissionsEnum.HEADER_TITLE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.HEADER_TITLE_CREATE_OR_UPDATE,
              code: PermissionsEnum.HEADER_TITLE_CREATE_OR_UPDATE,
              get label() {
                return localizeUi('Create/Update')
              },
            },
          ],
        },

        // Home About Us
        {
          key: PermissionsEnum.HOME_ABOUT_US_ALL,
          code: PermissionsEnum.HOME_ABOUT_US_ALL,
          get label() {
            return localizeUi('home_about_us')
          },
          permissions: [
            {
              key: PermissionsEnum.HOME_ABOUT_US_ALL,
              code: PermissionsEnum.HOME_ABOUT_US_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.HOME_ABOUT_US_FETCH,
              code: PermissionsEnum.HOME_ABOUT_US_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.HOME_ABOUT_US_DETAILS,
              code: PermissionsEnum.HOME_ABOUT_US_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.HOME_ABOUT_US_CREATE,
              code: PermissionsEnum.HOME_ABOUT_US_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.HOME_ABOUT_US_UPDATE,
              code: PermissionsEnum.HOME_ABOUT_US_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.HOME_ABOUT_US_DELETE,
              code: PermissionsEnum.HOME_ABOUT_US_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.HOME_ABOUT_US_ORDER,
              code: PermissionsEnum.HOME_ABOUT_US_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.HOME_ABOUT_US_CHANGE_STATUS,
              code: PermissionsEnum.HOME_ABOUT_US_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Home Contact Us
        {
          key: PermissionsEnum.HOME_CONTACT_US_ALL,
          code: PermissionsEnum.HOME_CONTACT_US_ALL,
          get label() {
            return localizeUi('home_contact_us')
          },
          permissions: [
            {
              key: PermissionsEnum.HOME_CONTACT_US_ALL,
              code: PermissionsEnum.HOME_CONTACT_US_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.HOME_CONTACT_US_FETCH,
              code: PermissionsEnum.HOME_CONTACT_US_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.HOME_CONTACT_US_DETAILS,
              code: PermissionsEnum.HOME_CONTACT_US_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.HOME_CONTACT_US_CREATE,
              code: PermissionsEnum.HOME_CONTACT_US_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.HOME_CONTACT_US_UPDATE,
              code: PermissionsEnum.HOME_CONTACT_US_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.HOME_CONTACT_US_DELETE,
              code: PermissionsEnum.HOME_CONTACT_US_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.HOME_CONTACT_US_ORDER,
              code: PermissionsEnum.HOME_CONTACT_US_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.HOME_CONTACT_US_CHANGE_STATUS,
              code: PermissionsEnum.HOME_CONTACT_US_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Home View Pricing
        {
          key: PermissionsEnum.HOME_VIEW_PRICING_ALL,
          code: PermissionsEnum.HOME_VIEW_PRICING_ALL,
          get label() {
            return localizeUi('homeViewPricing')
          },
          permissions: [
            {
              key: PermissionsEnum.HOME_VIEW_PRICING_ALL,
              code: PermissionsEnum.HOME_VIEW_PRICING_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.HOME_VIEW_PRICING_FETCH,
              code: PermissionsEnum.HOME_VIEW_PRICING_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.HOME_VIEW_PRICING_DETAILS,
              code: PermissionsEnum.HOME_VIEW_PRICING_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.HOME_VIEW_PRICING_CREATE,
              code: PermissionsEnum.HOME_VIEW_PRICING_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.HOME_VIEW_PRICING_UPDATE,
              code: PermissionsEnum.HOME_VIEW_PRICING_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.HOME_VIEW_PRICING_DELETE,
              code: PermissionsEnum.HOME_VIEW_PRICING_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.HOME_VIEW_PRICING_ORDER,
              code: PermissionsEnum.HOME_VIEW_PRICING_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.HOME_VIEW_PRICING_CHANGE_STATUS,
              code: PermissionsEnum.HOME_VIEW_PRICING_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Service
        {
          key: PermissionsEnum.SERVICE_ALL,
          code: PermissionsEnum.SERVICE_ALL,
          get label() {
            return localizeUi('Service')
          },
          permissions: [
            {
              key: PermissionsEnum.SERVICE_ALL,
              code: PermissionsEnum.SERVICE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.SERVICE_FETCH,
              code: PermissionsEnum.SERVICE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.SERVICE_DETAILS,
              code: PermissionsEnum.SERVICE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.SERVICE_CREATE,
              code: PermissionsEnum.SERVICE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.SERVICE_UPDATE,
              code: PermissionsEnum.SERVICE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.SERVICE_DELETE,
              code: PermissionsEnum.SERVICE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.SERVICE_ORDER,
              code: PermissionsEnum.SERVICE_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.SERVICE_CHANGE_STATUS,
              code: PermissionsEnum.SERVICE_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Service Feature
        {
          key: PermissionsEnum.SERVICE_FEATURE_ALL,
          code: PermissionsEnum.SERVICE_FEATURE_ALL,
          get label() {
            return localizeUi('Service Feature')
          },
          permissions: [
            {
              key: PermissionsEnum.SERVICE_FEATURE_ALL,
              code: PermissionsEnum.SERVICE_FEATURE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.SERVICE_FEATURE_FETCH,
              code: PermissionsEnum.SERVICE_FEATURE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.SERVICE_FEATURE_DETAILS,
              code: PermissionsEnum.SERVICE_FEATURE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.SERVICE_FEATURE_CREATE,
              code: PermissionsEnum.SERVICE_FEATURE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.SERVICE_FEATURE_UPDATE,
              code: PermissionsEnum.SERVICE_FEATURE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.SERVICE_FEATURE_DELETE,
              code: PermissionsEnum.SERVICE_FEATURE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.SERVICE_FEATURE_ORDER,
              code: PermissionsEnum.SERVICE_FEATURE_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.SERVICE_FEATURE_CHANGE_STATUS,
              code: PermissionsEnum.SERVICE_FEATURE_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Service Section
        {
          key: PermissionsEnum.SERVICE_SECTION_ALL,
          code: PermissionsEnum.SERVICE_SECTION_ALL,
          get label() {
            return localizeUi('service_section')
          },
          permissions: [
            {
              key: PermissionsEnum.SERVICE_SECTION_ALL,
              code: PermissionsEnum.SERVICE_SECTION_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.SERVICE_SECTION_FETCH,
              code: PermissionsEnum.SERVICE_SECTION_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.SERVICE_SECTION_DETAILS,
              code: PermissionsEnum.SERVICE_SECTION_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.SERVICE_SECTION_CREATE,
              code: PermissionsEnum.SERVICE_SECTION_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.SERVICE_SECTION_UPDATE,
              code: PermissionsEnum.SERVICE_SECTION_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.SERVICE_SECTION_DELETE,
              code: PermissionsEnum.SERVICE_SECTION_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.SERVICE_SECTION_ORDER,
              code: PermissionsEnum.SERVICE_SECTION_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.SERVICE_SECTION_CHANGE_STATUS,
              code: PermissionsEnum.SERVICE_SECTION_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Service Log
        {
          key: PermissionsEnum.SERVICE_LOG_ALL,
          code: PermissionsEnum.SERVICE_LOG_ALL,
          get label() {
            return localizeUi('Service Log')
          },
          permissions: [
            {
              key: PermissionsEnum.SERVICE_LOG_ALL,
              code: PermissionsEnum.SERVICE_LOG_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.SERVICE_LOG_FETCH,
              code: PermissionsEnum.SERVICE_LOG_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.SERVICE_LOG_DETAILS,
              code: PermissionsEnum.SERVICE_LOG_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.SERVICE_LOG_CREATE,
              code: PermissionsEnum.SERVICE_LOG_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.SERVICE_LOG_UPDATE,
              code: PermissionsEnum.SERVICE_LOG_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.SERVICE_LOG_DELETE,
              code: PermissionsEnum.SERVICE_LOG_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.SERVICE_LOG_ORDER,
              code: PermissionsEnum.SERVICE_LOG_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.SERVICE_LOG_CHANGE_STATUS,
              code: PermissionsEnum.SERVICE_LOG_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Service Key
        {
          key: PermissionsEnum.SERVICE_KEY_ALL,
          code: PermissionsEnum.SERVICE_KEY_ALL,
          get label() {
            return localizeUi('Service Key')
          },
          permissions: [
            {
              key: PermissionsEnum.SERVICE_KEY_ALL,
              code: PermissionsEnum.SERVICE_KEY_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.SERVICE_KEY_FETCH,
              code: PermissionsEnum.SERVICE_KEY_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.SERVICE_KEY_DETAILS,
              code: PermissionsEnum.SERVICE_KEY_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.SERVICE_KEY_CREATE,
              code: PermissionsEnum.SERVICE_KEY_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.SERVICE_KEY_UPDATE,
              code: PermissionsEnum.SERVICE_KEY_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.SERVICE_KEY_DELETE,
              code: PermissionsEnum.SERVICE_KEY_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.SERVICE_KEY_ORDER,
              code: PermissionsEnum.SERVICE_KEY_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.SERVICE_KEY_CHANGE_STATUS,
              code: PermissionsEnum.SERVICE_KEY_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Client Opinion
        {
          key: PermissionsEnum.CLIENT_OPINION_ALL,
          code: PermissionsEnum.CLIENT_OPINION_ALL,
          get label() {
            return localizeUi('client_opinion')
          },
          permissions: [
            {
              key: PermissionsEnum.CLIENT_OPINION_ALL,
              code: PermissionsEnum.CLIENT_OPINION_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.CLIENT_OPINION_FETCH,
              code: PermissionsEnum.CLIENT_OPINION_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.CLIENT_OPINION_DETAILS,
              code: PermissionsEnum.CLIENT_OPINION_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.CLIENT_OPINION_CREATE,
              code: PermissionsEnum.CLIENT_OPINION_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.CLIENT_OPINION_UPDATE,
              code: PermissionsEnum.CLIENT_OPINION_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.CLIENT_OPINION_DELETE,
              code: PermissionsEnum.CLIENT_OPINION_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.CLIENT_OPINION_ORDER,
              code: PermissionsEnum.CLIENT_OPINION_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.CLIENT_OPINION_CHANGE_STATUS,
              code: PermissionsEnum.CLIENT_OPINION_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Blog
        {
          key: PermissionsEnum.BLOG_ALL,
          code: PermissionsEnum.BLOG_ALL,
          get label() {
            return localizeUi('blog')
          },
          permissions: [
            {
              key: PermissionsEnum.BLOG_ALL,
              code: PermissionsEnum.BLOG_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.BLOG_FETCH,
              code: PermissionsEnum.BLOG_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.BLOG_DETAILS,
              code: PermissionsEnum.BLOG_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.BLOG_CREATE,
              code: PermissionsEnum.BLOG_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.BLOG_UPDATE,
              code: PermissionsEnum.BLOG_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.BLOG_DELETE,
              code: PermissionsEnum.BLOG_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.BLOG_ORDER,
              code: PermissionsEnum.BLOG_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.BLOG_CHANGE_STATUS,
              code: PermissionsEnum.BLOG_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Hashtag
        {
          key: PermissionsEnum.HASHTAG_ALL,
          code: PermissionsEnum.HASHTAG_ALL,
          get label() {
            return localizeUi('Hashtag')
          },
          permissions: [
            {
              key: PermissionsEnum.HASHTAG_ALL,
              code: PermissionsEnum.HASHTAG_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.HASHTAG_FETCH,
              code: PermissionsEnum.HASHTAG_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.HASHTAG_DETAILS,
              code: PermissionsEnum.HASHTAG_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.HASHTAG_CREATE,
              code: PermissionsEnum.HASHTAG_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.HASHTAG_UPDATE,
              code: PermissionsEnum.HASHTAG_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.HASHTAG_DELETE,
              code: PermissionsEnum.HASHTAG_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.HASHTAG_ORDER,
              code: PermissionsEnum.HASHTAG_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.HASHTAG_CHANGE_STATUS,
              code: PermissionsEnum.HASHTAG_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Category
        {
          key: PermissionsEnum.CATEGORY_ALL,
          code: PermissionsEnum.CATEGORY_ALL,
          get label() {
            return localizeUi('category')
          },
          permissions: [
            {
              key: PermissionsEnum.CATEGORY_ALL,
              code: PermissionsEnum.CATEGORY_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.CATEGORY_FETCH,
              code: PermissionsEnum.CATEGORY_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.CATEGORY_DETAILS,
              code: PermissionsEnum.CATEGORY_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.CATEGORY_CREATE,
              code: PermissionsEnum.CATEGORY_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.CATEGORY_UPDATE,
              code: PermissionsEnum.CATEGORY_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.CATEGORY_DELETE,
              code: PermissionsEnum.CATEGORY_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.CATEGORY_ORDER,
              code: PermissionsEnum.CATEGORY_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.CATEGORY_CHANGE_STATUS,
              code: PermissionsEnum.CATEGORY_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Term
        {
          key: PermissionsEnum.TERM_ALL,
          code: PermissionsEnum.TERM_ALL,
          get label() {
            return localizeUi('Term')
          },
          permissions: [
            {
              key: PermissionsEnum.TERM_ALL,
              code: PermissionsEnum.TERM_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.TERM_FETCH,
              code: PermissionsEnum.TERM_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.TERM_CREATE_OR_UPDATE,
              code: PermissionsEnum.TERM_CREATE_OR_UPDATE,
              get label() {
                return localizeUi('Create/Update')
              },
            },
          ],
        },

        // Privacy
        {
          key: PermissionsEnum.PRIVACY_ALL,
          code: PermissionsEnum.PRIVACY_ALL,
          get label() {
            return localizeUi('privacy')
          },
          permissions: [
            {
              key: PermissionsEnum.PRIVACY_ALL,
              code: PermissionsEnum.PRIVACY_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.PRIVACY_FETCH,
              code: PermissionsEnum.PRIVACY_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.PRIVACY_CREATE_OR_UPDATE,
              code: PermissionsEnum.PRIVACY_CREATE_OR_UPDATE,
              get label() {
                return localizeUi('Create/Update')
              },
            },
          ],
        },

        // FAQ
        {
          key: PermissionsEnum.FAQ_ALL,
          code: PermissionsEnum.FAQ_ALL,
          get label() {
            return localizeUi('Faq')
          },
          permissions: [
            {
              key: PermissionsEnum.FAQ_ALL,
              code: PermissionsEnum.FAQ_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.FAQ_FETCH,
              code: PermissionsEnum.FAQ_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.FAQ_DETAILS,
              code: PermissionsEnum.FAQ_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.FAQ_CREATE,
              code: PermissionsEnum.FAQ_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.FAQ_UPDATE,
              code: PermissionsEnum.FAQ_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.FAQ_DELETE,
              code: PermissionsEnum.FAQ_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.FAQ_ORDER,
              code: PermissionsEnum.FAQ_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.FAQ_CHANGE_STATUS,
              code: PermissionsEnum.FAQ_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // About Us Feature
        {
          key: PermissionsEnum.ABOUT_US_FEATURE_ALL,
          code: PermissionsEnum.ABOUT_US_FEATURE_ALL,
          get label() {
            return localizeUi('About Us Feature')
          },
          permissions: [
            {
              key: PermissionsEnum.ABOUT_US_FEATURE_ALL,
              code: PermissionsEnum.ABOUT_US_FEATURE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ABOUT_US_FEATURE_FETCH,
              code: PermissionsEnum.ABOUT_US_FEATURE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.ABOUT_US_FEATURE_DETAILS,
              code: PermissionsEnum.ABOUT_US_FEATURE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ABOUT_US_FEATURE_CREATE,
              code: PermissionsEnum.ABOUT_US_FEATURE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ABOUT_US_FEATURE_UPDATE,
              code: PermissionsEnum.ABOUT_US_FEATURE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ABOUT_US_FEATURE_DELETE,
              code: PermissionsEnum.ABOUT_US_FEATURE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.ABOUT_US_FEATURE_ORDER,
              code: PermissionsEnum.ABOUT_US_FEATURE_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.ABOUT_US_FEATURE_CHANGE_STATUS,
              code: PermissionsEnum.ABOUT_US_FEATURE_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // About Us Core
        {
          key: PermissionsEnum.ABOUT_US_CORE_ALL,
          code: PermissionsEnum.ABOUT_US_CORE_ALL,
          get label() {
            return localizeUi('about_us_core')
          },
          permissions: [
            {
              key: PermissionsEnum.ABOUT_US_CORE_ALL,
              code: PermissionsEnum.ABOUT_US_CORE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ABOUT_US_CORE_FETCH,
              code: PermissionsEnum.ABOUT_US_CORE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.ABOUT_US_CORE_DETAILS,
              code: PermissionsEnum.ABOUT_US_CORE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ABOUT_US_CORE_CREATE,
              code: PermissionsEnum.ABOUT_US_CORE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ABOUT_US_CORE_UPDATE,
              code: PermissionsEnum.ABOUT_US_CORE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ABOUT_US_CORE_DELETE,
              code: PermissionsEnum.ABOUT_US_CORE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.ABOUT_US_CORE_ORDER,
              code: PermissionsEnum.ABOUT_US_CORE_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.ABOUT_US_CORE_CHANGE_STATUS,
              code: PermissionsEnum.ABOUT_US_CORE_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Our System Banner
        {
          key: PermissionsEnum.OUR_SYSTEM_BANNER_ALL,
          code: PermissionsEnum.OUR_SYSTEM_BANNER_ALL,
          get label() {
            return localizeUi('Our System Banner')
          },
          permissions: [
            {
              key: PermissionsEnum.OUR_SYSTEM_BANNER_ALL,
              code: PermissionsEnum.OUR_SYSTEM_BANNER_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_BANNER_FETCH,
              code: PermissionsEnum.OUR_SYSTEM_BANNER_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_BANNER_DETAILS,
              code: PermissionsEnum.OUR_SYSTEM_BANNER_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_BANNER_CREATE,
              code: PermissionsEnum.OUR_SYSTEM_BANNER_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_BANNER_UPDATE,
              code: PermissionsEnum.OUR_SYSTEM_BANNER_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_BANNER_DELETE,
              code: PermissionsEnum.OUR_SYSTEM_BANNER_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_BANNER_ORDER,
              code: PermissionsEnum.OUR_SYSTEM_BANNER_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_BANNER_CHANGE_STATUS,
              code: PermissionsEnum.OUR_SYSTEM_BANNER_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Our System Feature
        {
          key: PermissionsEnum.OUR_SYSTEM_FEATURE_ALL,
          code: PermissionsEnum.OUR_SYSTEM_FEATURE_ALL,
          get label() {
            return localizeUi('Our System Feature')
          },
          permissions: [
            {
              key: PermissionsEnum.OUR_SYSTEM_FEATURE_ALL,
              code: PermissionsEnum.OUR_SYSTEM_FEATURE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_FEATURE_FETCH,
              code: PermissionsEnum.OUR_SYSTEM_FEATURE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_FEATURE_DETAILS,
              code: PermissionsEnum.OUR_SYSTEM_FEATURE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_FEATURE_CREATE,
              code: PermissionsEnum.OUR_SYSTEM_FEATURE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_FEATURE_UPDATE,
              code: PermissionsEnum.OUR_SYSTEM_FEATURE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_FEATURE_DELETE,
              code: PermissionsEnum.OUR_SYSTEM_FEATURE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_FEATURE_ORDER,
              code: PermissionsEnum.OUR_SYSTEM_FEATURE_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_FEATURE_CHANGE_STATUS,
              code: PermissionsEnum.OUR_SYSTEM_FEATURE_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Our System Risk Management
        {
          key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ALL,
          code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ALL,
          get label() {
            return localizeUi('Our System Risk Management')
          },
          permissions: [
            {
              key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ALL,
              code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_FETCH,
              code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_DETAILS,
              code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_CREATE,
              code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_UPDATE,
              code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_DELETE,
              code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ORDER,
              code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_CHANGE_STATUS,
              code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Our System Risk Type
        {
          key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_ALL,
          code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_ALL,
          get label() {
            return localizeUi('Our System Risk Type')
          },
          permissions: [
            {
              key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_ALL,
              code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_FETCH,
              code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_DETAILS,
              code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_CREATE,
              code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_UPDATE,
              code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_DELETE,
              code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_ORDER,
              code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_CHANGE_STATUS,
              code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Our System Component
        {
          key: PermissionsEnum.OUR_SYSTEM_COMPONENT_ALL,
          code: PermissionsEnum.OUR_SYSTEM_COMPONENT_ALL,
          get label() {
            return localizeUi('Our System Component')
          },
          permissions: [
            {
              key: PermissionsEnum.OUR_SYSTEM_COMPONENT_ALL,
              code: PermissionsEnum.OUR_SYSTEM_COMPONENT_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_COMPONENT_FETCH,
              code: PermissionsEnum.OUR_SYSTEM_COMPONENT_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_COMPONENT_DETAILS,
              code: PermissionsEnum.OUR_SYSTEM_COMPONENT_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_COMPONENT_CREATE,
              code: PermissionsEnum.OUR_SYSTEM_COMPONENT_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_COMPONENT_UPDATE,
              code: PermissionsEnum.OUR_SYSTEM_COMPONENT_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_COMPONENT_DELETE,
              code: PermissionsEnum.OUR_SYSTEM_COMPONENT_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_COMPONENT_ORDER,
              code: PermissionsEnum.OUR_SYSTEM_COMPONENT_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_COMPONENT_CHANGE_STATUS,
              code: PermissionsEnum.OUR_SYSTEM_COMPONENT_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Our System Step
        {
          key: PermissionsEnum.OUR_SYSTEM_STEP_ALL,
          code: PermissionsEnum.OUR_SYSTEM_STEP_ALL,
          get label() {
            return localizeUi('ourSystemStep')
          },
          permissions: [
            {
              key: PermissionsEnum.OUR_SYSTEM_STEP_ALL,
              code: PermissionsEnum.OUR_SYSTEM_STEP_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_STEP_FETCH,
              code: PermissionsEnum.OUR_SYSTEM_STEP_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_STEP_DETAILS,
              code: PermissionsEnum.OUR_SYSTEM_STEP_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_STEP_CREATE,
              code: PermissionsEnum.OUR_SYSTEM_STEP_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_STEP_UPDATE,
              code: PermissionsEnum.OUR_SYSTEM_STEP_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_STEP_DELETE,
              code: PermissionsEnum.OUR_SYSTEM_STEP_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_STEP_ORDER,
              code: PermissionsEnum.OUR_SYSTEM_STEP_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.OUR_SYSTEM_STEP_CHANGE_STATUS,
              code: PermissionsEnum.OUR_SYSTEM_STEP_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Powerful Feature
        {
          key: PermissionsEnum.POWERFUL_FEATURE_ALL,
          code: PermissionsEnum.POWERFUL_FEATURE_ALL,
          get label() {
            return localizeUi('Powerful Feature')
          },
          permissions: [
            {
              key: PermissionsEnum.POWERFUL_FEATURE_ALL,
              code: PermissionsEnum.POWERFUL_FEATURE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.POWERFUL_FEATURE_FETCH,
              code: PermissionsEnum.POWERFUL_FEATURE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.POWERFUL_FEATURE_DETAILS,
              code: PermissionsEnum.POWERFUL_FEATURE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.POWERFUL_FEATURE_CREATE,
              code: PermissionsEnum.POWERFUL_FEATURE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.POWERFUL_FEATURE_UPDATE,
              code: PermissionsEnum.POWERFUL_FEATURE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.POWERFUL_FEATURE_DELETE,
              code: PermissionsEnum.POWERFUL_FEATURE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.POWERFUL_FEATURE_ORDER,
              code: PermissionsEnum.POWERFUL_FEATURE_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.POWERFUL_FEATURE_CHANGE_STATUS,
              code: PermissionsEnum.POWERFUL_FEATURE_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // System Work
        {
          key: PermissionsEnum.SYSTEM_WORK_ALL,
          code: PermissionsEnum.SYSTEM_WORK_ALL,
          get label() {
            return localizeUi('System Work')
          },
          permissions: [
            {
              key: PermissionsEnum.SYSTEM_WORK_ALL,
              code: PermissionsEnum.SYSTEM_WORK_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.SYSTEM_WORK_FETCH,
              code: PermissionsEnum.SYSTEM_WORK_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.SYSTEM_WORK_DETAILS,
              code: PermissionsEnum.SYSTEM_WORK_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.SYSTEM_WORK_CREATE,
              code: PermissionsEnum.SYSTEM_WORK_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.SYSTEM_WORK_UPDATE,
              code: PermissionsEnum.SYSTEM_WORK_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.SYSTEM_WORK_DELETE,
              code: PermissionsEnum.SYSTEM_WORK_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.SYSTEM_WORK_ORDER,
              code: PermissionsEnum.SYSTEM_WORK_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.SYSTEM_WORK_CHANGE_STATUS,
              code: PermissionsEnum.SYSTEM_WORK_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Website Info (also used in settings but included here under website too)
        {
          key: PermissionsEnum.WEBSITE_INFO_ALL,
          code: PermissionsEnum.WEBSITE_INFO_ALL,
          get label() {
            return localizeUi('Website Info')
          },
          permissions: [
            {
              key: PermissionsEnum.WEBSITE_INFO_ALL,
              code: PermissionsEnum.WEBSITE_INFO_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.WEBSITE_INFO_FETCH,
              code: PermissionsEnum.WEBSITE_INFO_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.WEBSITE_INFO_DETAILS,
              code: PermissionsEnum.WEBSITE_INFO_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.WEBSITE_INFO_CREATE,
              code: PermissionsEnum.WEBSITE_INFO_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.WEBSITE_INFO_UPDATE,
              code: PermissionsEnum.WEBSITE_INFO_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.WEBSITE_INFO_DELETE,
              code: PermissionsEnum.WEBSITE_INFO_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.WEBSITE_INFO_ORDER,
              code: PermissionsEnum.WEBSITE_INFO_ORDER,
              get label() {
                return localizeUi('Order')
              },
            },
            {
              key: PermissionsEnum.WEBSITE_INFO_CHANGE_STATUS,
              code: PermissionsEnum.WEBSITE_INFO_CHANGE_STATUS,
              get label() {
                return localizeUi('Change Status')
              },
            },
          ],
        },

        // Contact Us
        {
          key: PermissionsEnum.CONTACT_US_ALL,
          code: PermissionsEnum.CONTACT_US_ALL,
          get label() {
            return localizeUi('Contact Us')
          },
          permissions: [
            {
              key: PermissionsEnum.CONTACT_US_ALL,
              code: PermissionsEnum.CONTACT_US_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.CONTACT_US_FETCH,
              code: PermissionsEnum.CONTACT_US_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.CONTACT_US_DETAILS,
              code: PermissionsEnum.CONTACT_US_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.CONTACT_US_DELETE,
              code: PermissionsEnum.CONTACT_US_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Request Service
        {
          key: PermissionsEnum.REQUEST_SERVICE_ALL,
          code: PermissionsEnum.REQUEST_SERVICE_ALL,
          get label() {
            return localizeUi('Request Service')
          },
          permissions: [
            {
              key: PermissionsEnum.REQUEST_SERVICE_ALL,
              code: PermissionsEnum.REQUEST_SERVICE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.REQUEST_SERVICE_FETCH,
              code: PermissionsEnum.REQUEST_SERVICE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.REQUEST_SERVICE_DETAILS,
              code: PermissionsEnum.REQUEST_SERVICE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.REQUEST_SERVICE_DELETE,
              code: PermissionsEnum.REQUEST_SERVICE_DELETE,
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
                return localizeUi('Fetch')
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
      ],
    },

    // =========================
    // SETTINGS
    // =========================
    {
      key: PermissionsEnum.SETTING,
      code: PermissionsEnum.SETTING,
      get label() {
        return localizeUi('settings')
      },
      permissions: [
        // Admin
        {
          key: PermissionsEnum.ADMIN_ALL,
          code: PermissionsEnum.ADMIN_ALL,
          get label() {
            return localizeUi('admin')
          },
          permissions: [
            {
              key: PermissionsEnum.ADMIN_ALL,
              code: PermissionsEnum.ADMIN_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ADMIN_FETCH,
              code: PermissionsEnum.ADMIN_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.ADMIN_DETAILS,
              code: PermissionsEnum.ADMIN_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ADMIN_CREATE,
              code: PermissionsEnum.ADMIN_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ADMIN_UPDATE,
              code: PermissionsEnum.ADMIN_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ADMIN_DELETE,
              code: PermissionsEnum.ADMIN_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        // Language
        {
          key: PermissionsEnum.LANGUAGE_ALL,
          code: PermissionsEnum.LANGUAGE_ALL,
          get label() {
            return localizeUi('Language')
          },
          permissions: [
            {
              key: PermissionsEnum.LANGUAGE_ALL,
              code: PermissionsEnum.LANGUAGE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.LANGUAGE_FETCH,
              code: PermissionsEnum.LANGUAGE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.LANGUAGE_DETAILS,
              code: PermissionsEnum.LANGUAGE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.LANGUAGE_CREATE,
              code: PermissionsEnum.LANGUAGE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.LANGUAGE_UPDATE,
              code: PermissionsEnum.LANGUAGE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.LANGUAGE_DELETE,
              code: PermissionsEnum.LANGUAGE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Location
        {
          key: PermissionsEnum.LOCATION_ALL,
          code: PermissionsEnum.LOCATION_ALL,
          get label() {
            return localizeUi('Location')
          },
          permissions: [
            {
              key: PermissionsEnum.LOCATION_ALL,
              code: PermissionsEnum.LOCATION_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.LOCATION_FETCH,
              code: PermissionsEnum.LOCATION_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.LOCATION_DETAILS,
              code: PermissionsEnum.LOCATION_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.LOCATION_CREATE,
              code: PermissionsEnum.LOCATION_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.LOCATION_UPDATE,
              code: PermissionsEnum.LOCATION_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.LOCATION_DELETE,
              code: PermissionsEnum.LOCATION_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // methods
        {
          key: PermissionsEnum.METHOD_ALL,
          code: PermissionsEnum.METHOD_ALL,
          get label() {
            return localizeUi('Method')
          },
          permissions: [
            {
              key: PermissionsEnum.METHOD_ALL,
              code: PermissionsEnum.METHOD_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.METHOD_FETCH,
              code: PermissionsEnum.METHOD_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.METHOD_DETAILS,
              code: PermissionsEnum.METHOD_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.METHOD_CREATE,
              code: PermissionsEnum.METHOD_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.METHOD_UPDATE,
              code: PermissionsEnum.METHOD_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.METHOD_DELETE,
              code: PermissionsEnum.METHOD_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        // team
        {
          key: PermissionsEnum.TEAM_ALL,
          code: PermissionsEnum.TEAM_ALL,
          get label() {
            return localizeUi('Team')
          },
          permissions: [
            {
              key: PermissionsEnum.TEAM_ALL,
              code: PermissionsEnum.TEAM_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.TEAM_FETCH,
              code: PermissionsEnum.TEAM_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.TEAM_DETAILS,
              code: PermissionsEnum.TEAM_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.TEAM_CREATE,
              code: PermissionsEnum.TEAM_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.TEAM_UPDATE,
              code: PermissionsEnum.TEAM_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.TEAM_DELETE,
              code: PermissionsEnum.TEAM_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Industry
        {
          key: PermissionsEnum.INDUSTRY_ALL,
          code: PermissionsEnum.INDUSTRY_ALL,
          get label() {
            return localizeUi('industry')
          },
          permissions: [
            {
              key: PermissionsEnum.INDUSTRY_ALL,
              code: PermissionsEnum.INDUSTRY_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.INDUSTRY_FETCH,
              code: PermissionsEnum.INDUSTRY_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.INDUSTRY_DETAILS,
              code: PermissionsEnum.INDUSTRY_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.INDUSTRY_CREATE,
              code: PermissionsEnum.INDUSTRY_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.INDUSTRY_UPDATE,
              code: PermissionsEnum.INDUSTRY_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.INDUSTRY_DELETE,
              code: PermissionsEnum.INDUSTRY_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Equipment Type
        {
          key: PermissionsEnum.EQUIPMENT_TYPE_ALL,
          code: PermissionsEnum.EQUIPMENT_TYPE_ALL,
          get label() {
            return localizeUi('Equipment Type')
          },
          permissions: [
            {
              key: PermissionsEnum.EQUIPMENT_TYPE_ALL,
              code: PermissionsEnum.EQUIPMENT_TYPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.EQUIPMENT_TYPE_FETCH,
              code: PermissionsEnum.EQUIPMENT_TYPE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.EQUIPMENT_TYPE_DETAILS,
              code: PermissionsEnum.EQUIPMENT_TYPE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.EQUIPMENT_TYPE_CREATE,
              code: PermissionsEnum.EQUIPMENT_TYPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.EQUIPMENT_TYPE_UPDATE,
              code: PermissionsEnum.EQUIPMENT_TYPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.EQUIPMENT_TYPE_DELETE,
              code: PermissionsEnum.EQUIPMENT_TYPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Factory
        {
          key: PermissionsEnum.FACTORY_ALL,
          code: PermissionsEnum.FACTORY_ALL,
          get label() {
            return localizeUi('Factory')
          },
          permissions: [
            {
              key: PermissionsEnum.FACTORY_ALL,
              code: PermissionsEnum.FACTORY_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.FACTORY_FETCH,
              code: PermissionsEnum.FACTORY_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.FACTORY_DETAILS,
              code: PermissionsEnum.FACTORY_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.FACTORY_CREATE,
              code: PermissionsEnum.FACTORY_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.FACTORY_UPDATE,
              code: PermissionsEnum.FACTORY_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.FACTORY_DELETE,
              code: PermissionsEnum.FACTORY_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Factory Item
        {
          key: PermissionsEnum.FACTORY_ITEM_ALL,
          code: PermissionsEnum.FACTORY_ITEM_ALL,
          get label() {
            return localizeUi('Factory Item')
          },
          permissions: [
            {
              key: PermissionsEnum.FACTORY_ITEM_ALL,
              code: PermissionsEnum.FACTORY_ITEM_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.FACTORY_ITEM_FETCH,
              code: PermissionsEnum.FACTORY_ITEM_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.FACTORY_ITEM_DETAILS,
              code: PermissionsEnum.FACTORY_ITEM_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.FACTORY_ITEM_CREATE,
              code: PermissionsEnum.FACTORY_ITEM_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.FACTORY_ITEM_UPDATE,
              code: PermissionsEnum.FACTORY_ITEM_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.FACTORY_ITEM_DELETE,
              code: PermissionsEnum.FACTORY_ITEM_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Template
        {
          key: PermissionsEnum.TEMPLATE_ALL,
          code: PermissionsEnum.TEMPLATE_ALL,
          get label() {
            return localizeUi('Template')
          },
          permissions: [
            {
              key: PermissionsEnum.TEMPLATE_ALL,
              code: PermissionsEnum.TEMPLATE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.TEMPLATE_FETCH,
              code: PermissionsEnum.TEMPLATE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.TEMPLATE_DETAILS,
              code: PermissionsEnum.TEMPLATE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.TEMPLATE_CREATE,
              code: PermissionsEnum.TEMPLATE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.TEMPLATE_UPDATE,
              code: PermissionsEnum.TEMPLATE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.TEMPLATE_DELETE,
              code: PermissionsEnum.TEMPLATE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Hazard Type
        {
          key: PermissionsEnum.HAZARD_TYPE_ALL,
          code: PermissionsEnum.HAZARD_TYPE_ALL,
          get label() {
            return localizeUi('Hazard Classification')
          },
          permissions: [
            {
              key: PermissionsEnum.HAZARD_TYPE_ALL,
              code: PermissionsEnum.HAZARD_TYPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.HAZARD_TYPE_FETCH,
              code: PermissionsEnum.HAZARD_TYPE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.HAZARD_TYPE_DETAILS,
              code: PermissionsEnum.HAZARD_TYPE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.HAZARD_TYPE_CREATE,
              code: PermissionsEnum.HAZARD_TYPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.HAZARD_TYPE_UPDATE,
              code: PermissionsEnum.HAZARD_TYPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.HAZARD_TYPE_DELETE,
              code: PermissionsEnum.HAZARD_TYPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Accidents Type
        {
          key: PermissionsEnum.ACCIDENTS_TYPE_ALL,
          code: PermissionsEnum.ACCIDENTS_TYPE_ALL,
          get label() {
            return localizeUi('Accidents Type')
          },
          permissions: [
            {
              key: PermissionsEnum.ACCIDENTS_TYPE_ALL,
              code: PermissionsEnum.ACCIDENTS_TYPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ACCIDENTS_TYPE_FETCH,
              code: PermissionsEnum.ACCIDENTS_TYPE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.ACCIDENTS_TYPE_DETAILS,
              code: PermissionsEnum.ACCIDENTS_TYPE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ACCIDENTS_TYPE_CREATE,
              code: PermissionsEnum.ACCIDENTS_TYPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ACCIDENTS_TYPE_UPDATE,
              code: PermissionsEnum.ACCIDENTS_TYPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ACCIDENTS_TYPE_DELETE,
              code: PermissionsEnum.ACCIDENTS_TYPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        // Equipment (general)
        {
          key: PermissionsEnum.EQUIPMENT_ALL,
          code: PermissionsEnum.EQUIPMENT_ALL,
          get label() {
            return localizeUi('Equipment')
          },
          permissions: [
            {
              key: PermissionsEnum.EQUIPMENT_ALL,
              code: PermissionsEnum.EQUIPMENT_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.EQUIPMENT_FETCH,
              code: PermissionsEnum.EQUIPMENT_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.EQUIPMENT_DETAILS,
              code: PermissionsEnum.EQUIPMENT_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.EQUIPMENT_CREATE,
              code: PermissionsEnum.EQUIPMENT_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.EQUIPMENT_UPDATE,
              code: PermissionsEnum.EQUIPMENT_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.EQUIPMENT_DELETE,
              code: PermissionsEnum.EQUIPMENT_DELETE,
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
                return localizeUi('Fetch')
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

        // Permission
        {
          key: PermissionsEnum.CREATE_PERMISSION,
          code: PermissionsEnum.CREATE_PERMISSION,
          get label() {
            return localizeUi('Permission')
          },
          permissions: [
            {
              key: PermissionsEnum.CREATE_PERMISSION,
              code: PermissionsEnum.CREATE_PERMISSION,
              get label() {
                return localizeUi('create')
              },
            },
          ],
        },

        // Organization (if needed in settings)
        {
          key: PermissionsEnum.ORGANIZATION_ALL,
          code: PermissionsEnum.ORGANIZATION_ALL,
          get label() {
            return localizeUi('Organization')
          },
          permissions: [
            {
              key: PermissionsEnum.ORGANIZATION_ALL,
              code: PermissionsEnum.ORGANIZATION_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.ORGANIZATION_FETCH,
              code: PermissionsEnum.ORGANIZATION_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.ORGANIZATION_DETAILS,
              code: PermissionsEnum.ORGANIZATION_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.ORGANIZATION_CREATE,
              code: PermissionsEnum.ORGANIZATION_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.ORGANIZATION_UPDATE,
              code: PermissionsEnum.ORGANIZATION_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.ORGANIZATION_DELETE,
              code: PermissionsEnum.ORGANIZATION_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },

        {
          key: PermissionsEnum.CREATE_PERMISSION,
          code: PermissionsEnum.CREATE_PERMISSION,
          get label() {
            return localizeUi('Permission')
          },
          permissions: [
            {
              key: PermissionsEnum.CREATE_PERMISSION,
              code: PermissionsEnum.CREATE_PERMISSION,
              get label() {
                return localizeUi('create')
              },
            },
          ],
        },

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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
          ],
        },

        // Factory
        {
          key: PermissionsEnum.ORG_FACTORY_ALL,
          code: PermissionsEnum.ORG_FACTORY_ALL,
          get label() {
            return localizeUi('Factory')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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

        // HiRikaly
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
                return localizeUi('Fetch')
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
            return localizeUi('Factory Item')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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

        // Accidents Type
        {
          key: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
          code: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
          get label() {
            return localizeUi('Accidents Type')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
                return localizeUi('Fetch')
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
          key: PermissionsEnum.DRILL_TYPE_ALL,
          code: PermissionsEnum.DRILL_TYPE_ALL,
          get label() {
            return localizeUi('Drill Type')
          },
          permissions: [
            {
              key: PermissionsEnum.DRILL_TYPE_ALL,
              code: PermissionsEnum.DRILL_TYPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.DRILL_TYPE_FETCH,
              code: PermissionsEnum.DRILL_TYPE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.DRILL_TYPE_DETAILS,
              code: PermissionsEnum.DRILL_TYPE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.DRILL_TYPE_CREATE,
              code: PermissionsEnum.DRILL_TYPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.DRILL_TYPE_UPDATE,
              code: PermissionsEnum.DRILL_TYPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.DRILL_TYPE_DELETE,
              code: PermissionsEnum.DRILL_TYPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.PTW_TYPE_ALL,
          code: PermissionsEnum.PTW_TYPE_ALL,
          get label() {
            return localizeUi('PTW Type')
          },
          permissions: [
            {
              key: PermissionsEnum.PTW_TYPE_ALL,
              code: PermissionsEnum.PTW_TYPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.PTW_TYPE_FETCH,
              code: PermissionsEnum.PTW_TYPE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.PTW_TYPE_CREATE,
              code: PermissionsEnum.PTW_TYPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.PTW_TYPE_UPDATE,
              code: PermissionsEnum.PTW_TYPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.PTW_TYPE_DELETE,
              code: PermissionsEnum.PTW_TYPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.VISIT_ACTIVITIES_ALL,
          code: PermissionsEnum.VISIT_ACTIVITIES_ALL,
          get label() {
            return localizeUi('Visit Activities')
          },
          permissions: [
            {
              key: PermissionsEnum.VISIT_ACTIVITIES_ALL,
              code: PermissionsEnum.VISIT_ACTIVITIES_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.VISIT_ACTIVITIES_FETCH,
              code: PermissionsEnum.VISIT_ACTIVITIES_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.VISIT_ACTIVITIES_DETAILS,
              code: PermissionsEnum.VISIT_ACTIVITIES_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.VISIT_ACTIVITIES_CREATE,
              code: PermissionsEnum.VISIT_ACTIVITIES_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.VISIT_ACTIVITIES_UPDATE,
              code: PermissionsEnum.VISIT_ACTIVITIES_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.VISIT_ACTIVITIES_DELETE,
              code: PermissionsEnum.VISIT_ACTIVITIES_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.VISIT_THEME_ALL,
          code: PermissionsEnum.VISIT_THEME_ALL,
          get label() {
            return localizeUi('Visit Theme')
          },
          permissions: [
            {
              key: PermissionsEnum.VISIT_THEME_ALL,
              code: PermissionsEnum.VISIT_THEME_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.VISIT_THEME_FETCH,
              code: PermissionsEnum.VISIT_THEME_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.VISIT_THEME_DETAILS,
              code: PermissionsEnum.VISIT_THEME_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.VISIT_THEME_CREATE,
              code: PermissionsEnum.VISIT_THEME_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.VISIT_THEME_UPDATE,
              code: PermissionsEnum.VISIT_THEME_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.VISIT_THEME_DELETE,
              code: PermissionsEnum.VISIT_THEME_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.VISIT_CATEGORY_ALL,
          code: PermissionsEnum.VISIT_CATEGORY_ALL,
          get label() {
            return localizeUi('Visit Category')
          },
          permissions: [
            {
              key: PermissionsEnum.VISIT_CATEGORY_ALL,
              code: PermissionsEnum.VISIT_CATEGORY_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.VISIT_CATEGORY_FETCH,
              code: PermissionsEnum.VISIT_CATEGORY_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.VISIT_CATEGORY_DETAILS,
              code: PermissionsEnum.VISIT_CATEGORY_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.VISIT_CATEGORY_CREATE,
              code: PermissionsEnum.VISIT_CATEGORY_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.VISIT_CATEGORY_UPDATE,
              code: PermissionsEnum.VISIT_CATEGORY_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.VISIT_CATEGORY_DELETE,
              code: PermissionsEnum.VISIT_CATEGORY_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.PPE_ACTIVITY_ALL,
          code: PermissionsEnum.PPE_ACTIVITY_ALL,
          get label() {
            return localizeUi('PPE Activity')
          },
          permissions: [
            {
              key: PermissionsEnum.PPE_ACTIVITY_ALL,
              code: PermissionsEnum.PPE_ACTIVITY_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.PPE_ACTIVITY_FETCH,
              code: PermissionsEnum.PPE_ACTIVITY_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.PPE_ACTIVITY_DETAILS,
              code: PermissionsEnum.PPE_ACTIVITY_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.PPE_ACTIVITY_CREATE,
              code: PermissionsEnum.PPE_ACTIVITY_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.PPE_ACTIVITY_UPDATE,
              code: PermissionsEnum.PPE_ACTIVITY_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.PPE_ACTIVITY_DELETE,
              code: PermissionsEnum.PPE_ACTIVITY_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.PPE_TOOLS_ALL,
          code: PermissionsEnum.PPE_TOOLS_ALL,
          get label() {
            return localizeUi('PPE Tools')
          },
          permissions: [
            {
              key: PermissionsEnum.PPE_TOOLS_ALL,
              code: PermissionsEnum.PPE_TOOLS_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.PPE_TOOLS_FETCH,
              code: PermissionsEnum.PPE_TOOLS_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.PPE_TOOLS_DETAILS,
              code: PermissionsEnum.PPE_TOOLS_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.PPE_TOOLS_CREATE,
              code: PermissionsEnum.PPE_TOOLS_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.PPE_TOOLS_UPDATE,
              code: PermissionsEnum.PPE_TOOLS_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.PPE_TOOLS_DELETE,
              code: PermissionsEnum.PPE_TOOLS_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.DOCUMENT_CATEGORY_ALL,
          code: PermissionsEnum.DOCUMENT_CATEGORY_ALL,
          get label() {
            return localizeUi('Document Categories')
          },
          permissions: [
            {
              key: PermissionsEnum.DOCUMENT_CATEGORY_ALL,
              code: PermissionsEnum.DOCUMENT_CATEGORY_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.DOCUMENT_CATEGORY_FETCH,
              code: PermissionsEnum.DOCUMENT_CATEGORY_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.DOCUMENT_CATEGORY_DETAILS,
              code: PermissionsEnum.DOCUMENT_CATEGORY_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.DOCUMENT_CATEGORY_CREATE,
              code: PermissionsEnum.DOCUMENT_CATEGORY_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.DOCUMENT_CATEGORY_UPDATE,
              code: PermissionsEnum.DOCUMENT_CATEGORY_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.DOCUMENT_CATEGORY_DELETE,
              code: PermissionsEnum.DOCUMENT_CATEGORY_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.AUDIT_STANDARDS_ALL,
          code: PermissionsEnum.AUDIT_STANDARDS_ALL,
          get label() {
            return localizeUi('Audit Standards')
          },
          permissions: [
            {
              key: PermissionsEnum.AUDIT_STANDARDS_ALL,
              code: PermissionsEnum.AUDIT_STANDARDS_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.AUDIT_STANDARDS_FETCH,
              code: PermissionsEnum.AUDIT_STANDARDS_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.AUDIT_STANDARDS_DETAILS,
              code: PermissionsEnum.AUDIT_STANDARDS_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.AUDIT_STANDARDS_CREATE,
              code: PermissionsEnum.AUDIT_STANDARDS_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.AUDIT_STANDARDS_UPDATE,
              code: PermissionsEnum.AUDIT_STANDARDS_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.AUDIT_STANDARDS_DELETE,
              code: PermissionsEnum.AUDIT_STANDARDS_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.AUDIT_ACTIVITIES_ALL,
          code: PermissionsEnum.AUDIT_ACTIVITIES_ALL,
          get label() {
            return localizeUi('Audit Activities')
          },
          permissions: [
            {
              key: PermissionsEnum.AUDIT_ACTIVITIES_ALL,
              code: PermissionsEnum.AUDIT_ACTIVITIES_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.AUDIT_ACTIVITIES_FETCH,
              code: PermissionsEnum.AUDIT_ACTIVITIES_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.AUDIT_ACTIVITIES_DETAILS,
              code: PermissionsEnum.AUDIT_ACTIVITIES_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.AUDIT_ACTIVITIES_CREATE,
              code: PermissionsEnum.AUDIT_ACTIVITIES_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.AUDIT_ACTIVITIES_UPDATE,
              code: PermissionsEnum.AUDIT_ACTIVITIES_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.AUDIT_ACTIVITIES_DELETE,
              code: PermissionsEnum.AUDIT_ACTIVITIES_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
          ],
        },
        // PPE Item
        {
          key: PermissionsEnum.PPE_ITEM_ALL,
          code: PermissionsEnum.PPE_ITEM_ALL,
          get label() {
            return localizeUi('PPE Item')
          },
          permissions: [
            {
              key: PermissionsEnum.PPE_ITEM_ALL,
              code: PermissionsEnum.PPE_ITEM_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.PPE_ITEM_FETCH,
              code: PermissionsEnum.PPE_ITEM_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.PPE_ITEM_DETAILS,
              code: PermissionsEnum.PPE_ITEM_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.PPE_ITEM_CREATE,
              code: PermissionsEnum.PPE_ITEM_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.PPE_ITEM_UPDATE,
              code: PermissionsEnum.PPE_ITEM_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.PPE_ITEM_DELETE,
              code: PermissionsEnum.PPE_ITEM_DELETE,
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
                return localizeUi('Fetch')
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
        // Ticket Type
        {
          key: PermissionsEnum.TICKET_TYPE_ALL,
          code: PermissionsEnum.TICKET_TYPE_ALL,
          get label() {
            return localizeUi('Ticket Type')
          },
          permissions: [
            {
              key: PermissionsEnum.TICKET_TYPE_ALL,
              code: PermissionsEnum.TICKET_TYPE_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.TICKET_TYPE_FETCH,
              code: PermissionsEnum.TICKET_TYPE_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.TICKET_TYPE_DETAILS,
              code: PermissionsEnum.TICKET_TYPE_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.TICKET_TYPE_DELETE,
              code: PermissionsEnum.TICKET_TYPE_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.TICKET_TYPE_CREATE,
              code: PermissionsEnum.TICKET_TYPE_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.TICKET_TYPE_UPDATE,
              code: PermissionsEnum.TICKET_TYPE_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
          ],
        },
        // Ticket Status
        {
          key: PermissionsEnum.TICKET_ALL,
          code: PermissionsEnum.TICKET_ALL,
          get label() {
            return localizeUi('ticket')
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
                return localizeUi('Fetch')
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
              key: PermissionsEnum.TICKET_DELETE,
              code: PermissionsEnum.TICKET_DELETE,
              get label() {
                return localizeUi('Delete')
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
          ],
        },

        // Catalog
        {
          key: PermissionsEnum.CATALOG_ALL,
          code: PermissionsEnum.CATALOG_ALL,
          get label() {
            return localizeUi('Catalog')
          },
          permissions: [
            {
              key: PermissionsEnum.CATALOG_ALL,
              code: PermissionsEnum.CATALOG_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.CATALOG_FETCH,
              code: PermissionsEnum.CATALOG_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.CATALOG_DETAILS,
              code: PermissionsEnum.CATALOG_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.CATALOG_DELETE,
              code: PermissionsEnum.CATALOG_DELETE,
              get label() {
                return localizeUi('Delete')
              },
            },
            {
              key: PermissionsEnum.CATALOG_CREATE,
              code: PermissionsEnum.CATALOG_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.CATALOG_UPDATE,
              code: PermissionsEnum.CATALOG_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
          ],
        },
        {
          key: PermissionsEnum.TRANING_TOPIC_ALL,
          code: PermissionsEnum.TRANING_TOPIC_ALL,
          get label() {
            return localizeUi('Traning Topic')
          },
          permissions: [
            {
              key: PermissionsEnum.TRANING_TOPIC_ALL,
              code: PermissionsEnum.TRANING_TOPIC_ALL,
              get label() {
                return localizeUi('ALL')
              },
            },
            {
              key: PermissionsEnum.TRANING_TOPIC_FETCH,
              code: PermissionsEnum.TRANING_TOPIC_FETCH,
              get label() {
                return localizeUi('Fetch')
              },
            },
            {
              key: PermissionsEnum.TRANING_TOPIC_DETAILS,
              code: PermissionsEnum.TRANING_TOPIC_DETAILS,
              get label() {
                return localizeUi('Details')
              },
            },
            {
              key: PermissionsEnum.TRANING_TOPIC_CREATE,
              code: PermissionsEnum.TRANING_TOPIC_CREATE,
              get label() {
                return localizeUi('create')
              },
            },
            {
              key: PermissionsEnum.TRANING_TOPIC_UPDATE,
              code: PermissionsEnum.TRANING_TOPIC_UPDATE,
              get label() {
                return localizeUi('update')
              },
            },
            {
              key: PermissionsEnum.TRANING_TOPIC_DELETE,
              code: PermissionsEnum.TRANING_TOPIC_DELETE,
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
