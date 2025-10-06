import { PermissionsEnum } from "@/features/users/Admin/Core/Enum/permission_enum";

export type PermissionItem = {
    key: PermissionsEnum;
    code: PermissionsEnum;
    label: string;
    permissions?: PermissionItem[];
};

export const adminPermissions: PermissionItem = {
    key: PermissionsEnum.ADMIN,
    code: PermissionsEnum.ADMIN,
    label: "Admin",
    permissions: [
        // =========================
        // WEBSITE
        // =========================
        {
            key: PermissionsEnum.WEBSITE,
            code: PermissionsEnum.WEBSITE,
            label: "Website",
            permissions: [
                // Header
                {
                    key: PermissionsEnum.HEADER_ALL,
                    code: PermissionsEnum.HEADER_ALL,
                    label: "Header",
                    permissions: [
                        { key: PermissionsEnum.HEADER_ALL, code: PermissionsEnum.HEADER_ALL, label: "All" },
                        { key: PermissionsEnum.HEADER_FETCH, code: PermissionsEnum.HEADER_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.HEADER_DETAILS, code: PermissionsEnum.HEADER_DETAILS, label: "Details" },
                        { key: PermissionsEnum.HEADER_CREATE, code: PermissionsEnum.HEADER_CREATE, label: "Create" },
                        { key: PermissionsEnum.HEADER_UPDATE, code: PermissionsEnum.HEADER_UPDATE, label: "Update" },
                        { key: PermissionsEnum.HEADER_DELETE, code: PermissionsEnum.HEADER_DELETE, label: "Delete" },
                        { key: PermissionsEnum.HEADER_ORDER, code: PermissionsEnum.HEADER_ORDER, label: "Order" },
                        { key: PermissionsEnum.HEADER_CHANGE_STATUS, code: PermissionsEnum.HEADER_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Header Title
                {
                    key: PermissionsEnum.HEADER_TITLE_ALL,
                    code: PermissionsEnum.HEADER_TITLE_ALL,
                    label: "Header Title",
                    permissions: [
                        { key: PermissionsEnum.HEADER_TITLE_ALL, code: PermissionsEnum.HEADER_TITLE_ALL, label: "All" },
                        { key: PermissionsEnum.HEADER_TITLE_FETCH, code: PermissionsEnum.HEADER_TITLE_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.HEADER_TITLE_CREATE_OR_UPDATE, code: PermissionsEnum.HEADER_TITLE_CREATE_OR_UPDATE, label: "Create/Update" },
                    ],
                },

                // Home About Us
                {
                    key: PermissionsEnum.HOME_ABOUT_US_ALL,
                    code: PermissionsEnum.HOME_ABOUT_US_ALL,
                    label: "Home About Us",
                    permissions: [
                        { key: PermissionsEnum.HOME_ABOUT_US_ALL, code: PermissionsEnum.HOME_ABOUT_US_ALL, label: "All" },
                        { key: PermissionsEnum.HOME_ABOUT_US_FETCH, code: PermissionsEnum.HOME_ABOUT_US_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.HOME_ABOUT_US_DETAILS, code: PermissionsEnum.HOME_ABOUT_US_DETAILS, label: "Details" },
                        { key: PermissionsEnum.HOME_ABOUT_US_CREATE, code: PermissionsEnum.HOME_ABOUT_US_CREATE, label: "Create" },
                        { key: PermissionsEnum.HOME_ABOUT_US_UPDATE, code: PermissionsEnum.HOME_ABOUT_US_UPDATE, label: "Update" },
                        { key: PermissionsEnum.HOME_ABOUT_US_DELETE, code: PermissionsEnum.HOME_ABOUT_US_DELETE, label: "Delete" },
                        { key: PermissionsEnum.HOME_ABOUT_US_ORDER, code: PermissionsEnum.HOME_ABOUT_US_ORDER, label: "Order" },
                        { key: PermissionsEnum.HOME_ABOUT_US_CHANGE_STATUS, code: PermissionsEnum.HOME_ABOUT_US_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Home Contact Us
                {
                    key: PermissionsEnum.HOME_CONTACT_US_ALL,
                    code: PermissionsEnum.HOME_CONTACT_US_ALL,
                    label: "Home Contact Us",
                    permissions: [
                        { key: PermissionsEnum.HOME_CONTACT_US_ALL, code: PermissionsEnum.HOME_CONTACT_US_ALL, label: "All" },
                        { key: PermissionsEnum.HOME_CONTACT_US_FETCH, code: PermissionsEnum.HOME_CONTACT_US_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.HOME_CONTACT_US_DETAILS, code: PermissionsEnum.HOME_CONTACT_US_DETAILS, label: "Details" },
                        { key: PermissionsEnum.HOME_CONTACT_US_CREATE, code: PermissionsEnum.HOME_CONTACT_US_CREATE, label: "Create" },
                        { key: PermissionsEnum.HOME_CONTACT_US_UPDATE, code: PermissionsEnum.HOME_CONTACT_US_UPDATE, label: "Update" },
                        { key: PermissionsEnum.HOME_CONTACT_US_DELETE, code: PermissionsEnum.HOME_CONTACT_US_DELETE, label: "Delete" },
                        { key: PermissionsEnum.HOME_CONTACT_US_ORDER, code: PermissionsEnum.HOME_CONTACT_US_ORDER, label: "Order" },
                        { key: PermissionsEnum.HOME_CONTACT_US_CHANGE_STATUS, code: PermissionsEnum.HOME_CONTACT_US_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Home View Pricing
                {
                    key: PermissionsEnum.HOME_VIEW_PRICING_ALL,
                    code: PermissionsEnum.HOME_VIEW_PRICING_ALL,
                    label: "Home View Pricing",
                    permissions: [
                        { key: PermissionsEnum.HOME_VIEW_PRICING_ALL, code: PermissionsEnum.HOME_VIEW_PRICING_ALL, label: "All" },
                        { key: PermissionsEnum.HOME_VIEW_PRICING_FETCH, code: PermissionsEnum.HOME_VIEW_PRICING_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.HOME_VIEW_PRICING_DETAILS, code: PermissionsEnum.HOME_VIEW_PRICING_DETAILS, label: "Details" },
                        { key: PermissionsEnum.HOME_VIEW_PRICING_CREATE, code: PermissionsEnum.HOME_VIEW_PRICING_CREATE, label: "Create" },
                        { key: PermissionsEnum.HOME_VIEW_PRICING_UPDATE, code: PermissionsEnum.HOME_VIEW_PRICING_UPDATE, label: "Update" },
                        { key: PermissionsEnum.HOME_VIEW_PRICING_DELETE, code: PermissionsEnum.HOME_VIEW_PRICING_DELETE, label: "Delete" },
                        { key: PermissionsEnum.HOME_VIEW_PRICING_ORDER, code: PermissionsEnum.HOME_VIEW_PRICING_ORDER, label: "Order" },
                        { key: PermissionsEnum.HOME_VIEW_PRICING_CHANGE_STATUS, code: PermissionsEnum.HOME_VIEW_PRICING_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Service
                {
                    key: PermissionsEnum.SERVICE_ALL,
                    code: PermissionsEnum.SERVICE_ALL,
                    label: "Service",
                    permissions: [
                        { key: PermissionsEnum.SERVICE_ALL, code: PermissionsEnum.SERVICE_ALL, label: "All" },
                        { key: PermissionsEnum.SERVICE_FETCH, code: PermissionsEnum.SERVICE_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.SERVICE_DETAILS, code: PermissionsEnum.SERVICE_DETAILS, label: "Details" },
                        { key: PermissionsEnum.SERVICE_CREATE, code: PermissionsEnum.SERVICE_CREATE, label: "Create" },
                        { key: PermissionsEnum.SERVICE_UPDATE, code: PermissionsEnum.SERVICE_UPDATE, label: "Update" },
                        { key: PermissionsEnum.SERVICE_DELETE, code: PermissionsEnum.SERVICE_DELETE, label: "Delete" },
                        { key: PermissionsEnum.SERVICE_ORDER, code: PermissionsEnum.SERVICE_ORDER, label: "Order" },
                        { key: PermissionsEnum.SERVICE_CHANGE_STATUS, code: PermissionsEnum.SERVICE_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Service Feature
                {
                    key: PermissionsEnum.SERVICE_FEATURE_ALL,
                    code: PermissionsEnum.SERVICE_FEATURE_ALL,
                    label: "Service Feature",
                    permissions: [
                        { key: PermissionsEnum.SERVICE_FEATURE_ALL, code: PermissionsEnum.SERVICE_FEATURE_ALL, label: "All" },
                        { key: PermissionsEnum.SERVICE_FEATURE_FETCH, code: PermissionsEnum.SERVICE_FEATURE_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.SERVICE_FEATURE_DETAILS, code: PermissionsEnum.SERVICE_FEATURE_DETAILS, label: "Details" },
                        { key: PermissionsEnum.SERVICE_FEATURE_CREATE, code: PermissionsEnum.SERVICE_FEATURE_CREATE, label: "Create" },
                        { key: PermissionsEnum.SERVICE_FEATURE_UPDATE, code: PermissionsEnum.SERVICE_FEATURE_UPDATE, label: "Update" },
                        { key: PermissionsEnum.SERVICE_FEATURE_DELETE, code: PermissionsEnum.SERVICE_FEATURE_DELETE, label: "Delete" },
                        { key: PermissionsEnum.SERVICE_FEATURE_ORDER, code: PermissionsEnum.SERVICE_FEATURE_ORDER, label: "Order" },
                        { key: PermissionsEnum.SERVICE_FEATURE_CHANGE_STATUS, code: PermissionsEnum.SERVICE_FEATURE_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Service Section
                {
                    key: PermissionsEnum.SERVICE_SECTION_ALL,
                    code: PermissionsEnum.SERVICE_SECTION_ALL,
                    label: "Service Section",
                    permissions: [
                        { key: PermissionsEnum.SERVICE_SECTION_ALL, code: PermissionsEnum.SERVICE_SECTION_ALL, label: "All" },
                        { key: PermissionsEnum.SERVICE_SECTION_FETCH, code: PermissionsEnum.SERVICE_SECTION_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.SERVICE_SECTION_DETAILS, code: PermissionsEnum.SERVICE_SECTION_DETAILS, label: "Details" },
                        { key: PermissionsEnum.SERVICE_SECTION_CREATE, code: PermissionsEnum.SERVICE_SECTION_CREATE, label: "Create" },
                        { key: PermissionsEnum.SERVICE_SECTION_UPDATE, code: PermissionsEnum.SERVICE_SECTION_UPDATE, label: "Update" },
                        { key: PermissionsEnum.SERVICE_SECTION_DELETE, code: PermissionsEnum.SERVICE_SECTION_DELETE, label: "Delete" },
                        { key: PermissionsEnum.SERVICE_SECTION_ORDER, code: PermissionsEnum.SERVICE_SECTION_ORDER, label: "Order" },
                        { key: PermissionsEnum.SERVICE_SECTION_CHANGE_STATUS, code: PermissionsEnum.SERVICE_SECTION_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Service Log
                {
                    key: PermissionsEnum.SERVICE_LOG_ALL,
                    code: PermissionsEnum.SERVICE_LOG_ALL,
                    label: "Service Log",
                    permissions: [
                        { key: PermissionsEnum.SERVICE_LOG_ALL, code: PermissionsEnum.SERVICE_LOG_ALL, label: "All" },
                        { key: PermissionsEnum.SERVICE_LOG_FETCH, code: PermissionsEnum.SERVICE_LOG_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.SERVICE_LOG_DETAILS, code: PermissionsEnum.SERVICE_LOG_DETAILS, label: "Details" },
                        { key: PermissionsEnum.SERVICE_LOG_CREATE, code: PermissionsEnum.SERVICE_LOG_CREATE, label: "Create" },
                        { key: PermissionsEnum.SERVICE_LOG_UPDATE, code: PermissionsEnum.SERVICE_LOG_UPDATE, label: "Update" },
                        { key: PermissionsEnum.SERVICE_LOG_DELETE, code: PermissionsEnum.SERVICE_LOG_DELETE, label: "Delete" },
                        { key: PermissionsEnum.SERVICE_LOG_ORDER, code: PermissionsEnum.SERVICE_LOG_ORDER, label: "Order" },
                        { key: PermissionsEnum.SERVICE_LOG_CHANGE_STATUS, code: PermissionsEnum.SERVICE_LOG_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Service Key
                {
                    key: PermissionsEnum.SERVICE_KEY_ALL,
                    code: PermissionsEnum.SERVICE_KEY_ALL,
                    label: "Service Key",
                    permissions: [
                        { key: PermissionsEnum.SERVICE_KEY_ALL, code: PermissionsEnum.SERVICE_KEY_ALL, label: "All" },
                        { key: PermissionsEnum.SERVICE_KEY_FETCH, code: PermissionsEnum.SERVICE_KEY_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.SERVICE_KEY_DETAILS, code: PermissionsEnum.SERVICE_KEY_DETAILS, label: "Details" },
                        { key: PermissionsEnum.SERVICE_KEY_CREATE, code: PermissionsEnum.SERVICE_KEY_CREATE, label: "Create" },
                        { key: PermissionsEnum.SERVICE_KEY_UPDATE, code: PermissionsEnum.SERVICE_KEY_UPDATE, label: "Update" },
                        { key: PermissionsEnum.SERVICE_KEY_DELETE, code: PermissionsEnum.SERVICE_KEY_DELETE, label: "Delete" },
                        { key: PermissionsEnum.SERVICE_KEY_ORDER, code: PermissionsEnum.SERVICE_KEY_ORDER, label: "Order" },
                        { key: PermissionsEnum.SERVICE_KEY_CHANGE_STATUS, code: PermissionsEnum.SERVICE_KEY_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Client Opinion
                {
                    key: PermissionsEnum.CLIENT_OPINION_ALL,
                    code: PermissionsEnum.CLIENT_OPINION_ALL,
                    label: "Client Opinion",
                    permissions: [
                        { key: PermissionsEnum.CLIENT_OPINION_ALL, code: PermissionsEnum.CLIENT_OPINION_ALL, label: "All" },
                        { key: PermissionsEnum.CLIENT_OPINION_FETCH, code: PermissionsEnum.CLIENT_OPINION_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.CLIENT_OPINION_DETAILS, code: PermissionsEnum.CLIENT_OPINION_DETAILS, label: "Details" },
                        { key: PermissionsEnum.CLIENT_OPINION_CREATE, code: PermissionsEnum.CLIENT_OPINION_CREATE, label: "Create" },
                        { key: PermissionsEnum.CLIENT_OPINION_UPDATE, code: PermissionsEnum.CLIENT_OPINION_UPDATE, label: "Update" },
                        { key: PermissionsEnum.CLIENT_OPINION_DELETE, code: PermissionsEnum.CLIENT_OPINION_DELETE, label: "Delete" },
                        { key: PermissionsEnum.CLIENT_OPINION_ORDER, code: PermissionsEnum.CLIENT_OPINION_ORDER, label: "Order" },
                        { key: PermissionsEnum.CLIENT_OPINION_CHANGE_STATUS, code: PermissionsEnum.CLIENT_OPINION_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Blog
                {
                    key: PermissionsEnum.BLOG_ALL,
                    code: PermissionsEnum.BLOG_ALL,
                    label: "Blog",
                    permissions: [
                        { key: PermissionsEnum.BLOG_ALL, code: PermissionsEnum.BLOG_ALL, label: "All" },
                        { key: PermissionsEnum.BLOG_FETCH, code: PermissionsEnum.BLOG_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.BLOG_DETAILS, code: PermissionsEnum.BLOG_DETAILS, label: "Details" },
                        { key: PermissionsEnum.BLOG_CREATE, code: PermissionsEnum.BLOG_CREATE, label: "Create" },
                        { key: PermissionsEnum.BLOG_UPDATE, code: PermissionsEnum.BLOG_UPDATE, label: "Update" },
                        { key: PermissionsEnum.BLOG_DELETE, code: PermissionsEnum.BLOG_DELETE, label: "Delete" },
                        { key: PermissionsEnum.BLOG_ORDER, code: PermissionsEnum.BLOG_ORDER, label: "Order" },
                        { key: PermissionsEnum.BLOG_CHANGE_STATUS, code: PermissionsEnum.BLOG_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Hashtag
                {
                    key: PermissionsEnum.HASHTAG_ALL,
                    code: PermissionsEnum.HASHTAG_ALL,
                    label: "Hashtag",
                    permissions: [
                        { key: PermissionsEnum.HASHTAG_ALL, code: PermissionsEnum.HASHTAG_ALL, label: "All" },
                        { key: PermissionsEnum.HASHTAG_FETCH, code: PermissionsEnum.HASHTAG_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.HASHTAG_DETAILS, code: PermissionsEnum.HASHTAG_DETAILS, label: "Details" },
                        { key: PermissionsEnum.HASHTAG_CREATE, code: PermissionsEnum.HASHTAG_CREATE, label: "Create" },
                        { key: PermissionsEnum.HASHTAG_UPDATE, code: PermissionsEnum.HASHTAG_UPDATE, label: "Update" },
                        { key: PermissionsEnum.HASHTAG_DELETE, code: PermissionsEnum.HASHTAG_DELETE, label: "Delete" },
                        { key: PermissionsEnum.HASHTAG_ORDER, code: PermissionsEnum.HASHTAG_ORDER, label: "Order" },
                        { key: PermissionsEnum.HASHTAG_CHANGE_STATUS, code: PermissionsEnum.HASHTAG_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Category
                {
                    key: PermissionsEnum.CATEGORY_ALL,
                    code: PermissionsEnum.CATEGORY_ALL,
                    label: "Category",
                    permissions: [
                        { key: PermissionsEnum.CATEGORY_ALL, code: PermissionsEnum.CATEGORY_ALL, label: "All" },
                        { key: PermissionsEnum.CATEGORY_FETCH, code: PermissionsEnum.CATEGORY_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.CATEGORY_DETAILS, code: PermissionsEnum.CATEGORY_DETAILS, label: "Details" },
                        { key: PermissionsEnum.CATEGORY_CREATE, code: PermissionsEnum.CATEGORY_CREATE, label: "Create" },
                        { key: PermissionsEnum.CATEGORY_UPDATE, code: PermissionsEnum.CATEGORY_UPDATE, label: "Update" },
                        { key: PermissionsEnum.CATEGORY_DELETE, code: PermissionsEnum.CATEGORY_DELETE, label: "Delete" },
                        { key: PermissionsEnum.CATEGORY_ORDER, code: PermissionsEnum.CATEGORY_ORDER, label: "Order" },
                        { key: PermissionsEnum.CATEGORY_CHANGE_STATUS, code: PermissionsEnum.CATEGORY_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Term
                {
                    key: PermissionsEnum.TERM_ALL,
                    code: PermissionsEnum.TERM_ALL,
                    label: "Term",
                    permissions: [
                        { key: PermissionsEnum.TERM_ALL, code: PermissionsEnum.TERM_ALL, label: "All" },
                        { key: PermissionsEnum.TERM_FETCH, code: PermissionsEnum.TERM_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.TERM_CREATE_OR_UPDATE, code: PermissionsEnum.TERM_CREATE_OR_UPDATE, label: "Create/Update" },
                    ],
                },

                // Privacy
                {
                    key: PermissionsEnum.PRIVACY_ALL,
                    code: PermissionsEnum.PRIVACY_ALL,
                    label: "Privacy",
                    permissions: [
                        { key: PermissionsEnum.PRIVACY_ALL, code: PermissionsEnum.PRIVACY_ALL, label: "All" },
                        { key: PermissionsEnum.PRIVACY_FETCH, code: PermissionsEnum.PRIVACY_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.PRIVACY_CREATE_OR_UPDATE, code: PermissionsEnum.PRIVACY_CREATE_OR_UPDATE, label: "Create/Update" },
                    ],
                },

                // FAQ
                {
                    key: PermissionsEnum.FAQ_ALL,
                    code: PermissionsEnum.FAQ_ALL,
                    label: "FAQ",
                    permissions: [
                        { key: PermissionsEnum.FAQ_ALL, code: PermissionsEnum.FAQ_ALL, label: "All" },
                        { key: PermissionsEnum.FAQ_FETCH, code: PermissionsEnum.FAQ_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.FAQ_DETAILS, code: PermissionsEnum.FAQ_DETAILS, label: "Details" },
                        { key: PermissionsEnum.FAQ_CREATE, code: PermissionsEnum.FAQ_CREATE, label: "Create" },
                        { key: PermissionsEnum.FAQ_UPDATE, code: PermissionsEnum.FAQ_UPDATE, label: "Update" },
                        { key: PermissionsEnum.FAQ_DELETE, code: PermissionsEnum.FAQ_DELETE, label: "Delete" },
                        { key: PermissionsEnum.FAQ_ORDER, code: PermissionsEnum.FAQ_ORDER, label: "Order" },
                        { key: PermissionsEnum.FAQ_CHANGE_STATUS, code: PermissionsEnum.FAQ_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // About Us Feature
                {
                    key: PermissionsEnum.ABOUT_US_FEATURE_ALL,
                    code: PermissionsEnum.ABOUT_US_FEATURE_ALL,
                    label: "About Us Feature",
                    permissions: [
                        { key: PermissionsEnum.ABOUT_US_FEATURE_ALL, code: PermissionsEnum.ABOUT_US_FEATURE_ALL, label: "All" },
                        { key: PermissionsEnum.ABOUT_US_FEATURE_FETCH, code: PermissionsEnum.ABOUT_US_FEATURE_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.ABOUT_US_FEATURE_DETAILS, code: PermissionsEnum.ABOUT_US_FEATURE_DETAILS, label: "Details" },
                        { key: PermissionsEnum.ABOUT_US_FEATURE_CREATE, code: PermissionsEnum.ABOUT_US_FEATURE_CREATE, label: "Create" },
                        { key: PermissionsEnum.ABOUT_US_FEATURE_UPDATE, code: PermissionsEnum.ABOUT_US_FEATURE_UPDATE, label: "Update" },
                        { key: PermissionsEnum.ABOUT_US_FEATURE_DELETE, code: PermissionsEnum.ABOUT_US_FEATURE_DELETE, label: "Delete" },
                        { key: PermissionsEnum.ABOUT_US_FEATURE_ORDER, code: PermissionsEnum.ABOUT_US_FEATURE_ORDER, label: "Order" },
                        { key: PermissionsEnum.ABOUT_US_FEATURE_CHANGE_STATUS, code: PermissionsEnum.ABOUT_US_FEATURE_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // About Us Core
                {
                    key: PermissionsEnum.ABOUT_US_CORE_ALL,
                    code: PermissionsEnum.ABOUT_US_CORE_ALL,
                    label: "About Us Core",
                    permissions: [
                        { key: PermissionsEnum.ABOUT_US_CORE_ALL, code: PermissionsEnum.ABOUT_US_CORE_ALL, label: "All" },
                        { key: PermissionsEnum.ABOUT_US_CORE_FETCH, code: PermissionsEnum.ABOUT_US_CORE_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.ABOUT_US_CORE_DETAILS, code: PermissionsEnum.ABOUT_US_CORE_DETAILS, label: "Details" },
                        { key: PermissionsEnum.ABOUT_US_CORE_CREATE, code: PermissionsEnum.ABOUT_US_CORE_CREATE, label: "Create" },
                        { key: PermissionsEnum.ABOUT_US_CORE_UPDATE, code: PermissionsEnum.ABOUT_US_CORE_UPDATE, label: "Update" },
                        { key: PermissionsEnum.ABOUT_US_CORE_DELETE, code: PermissionsEnum.ABOUT_US_CORE_DELETE, label: "Delete" },
                        { key: PermissionsEnum.ABOUT_US_CORE_ORDER, code: PermissionsEnum.ABOUT_US_CORE_ORDER, label: "Order" },
                        { key: PermissionsEnum.ABOUT_US_CORE_CHANGE_STATUS, code: PermissionsEnum.ABOUT_US_CORE_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Our System Banner
                {
                    key: PermissionsEnum.OUR_SYSTEM_BANNER_ALL,
                    code: PermissionsEnum.OUR_SYSTEM_BANNER_ALL,
                    label: "Our System Banner",
                    permissions: [
                        { key: PermissionsEnum.OUR_SYSTEM_BANNER_ALL, code: PermissionsEnum.OUR_SYSTEM_BANNER_ALL, label: "All" },
                        { key: PermissionsEnum.OUR_SYSTEM_BANNER_FETCH, code: PermissionsEnum.OUR_SYSTEM_BANNER_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.OUR_SYSTEM_BANNER_DETAILS, code: PermissionsEnum.OUR_SYSTEM_BANNER_DETAILS, label: "Details" },
                        { key: PermissionsEnum.OUR_SYSTEM_BANNER_CREATE, code: PermissionsEnum.OUR_SYSTEM_BANNER_CREATE, label: "Create" },
                        { key: PermissionsEnum.OUR_SYSTEM_BANNER_UPDATE, code: PermissionsEnum.OUR_SYSTEM_BANNER_UPDATE, label: "Update" },
                        { key: PermissionsEnum.OUR_SYSTEM_BANNER_DELETE, code: PermissionsEnum.OUR_SYSTEM_BANNER_DELETE, label: "Delete" },
                        { key: PermissionsEnum.OUR_SYSTEM_BANNER_ORDER, code: PermissionsEnum.OUR_SYSTEM_BANNER_ORDER, label: "Order" },
                        { key: PermissionsEnum.OUR_SYSTEM_BANNER_CHANGE_STATUS, code: PermissionsEnum.OUR_SYSTEM_BANNER_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Our System Feature
                {
                    key: PermissionsEnum.OUR_SYSTEM_FEATURE_ALL,
                    code: PermissionsEnum.OUR_SYSTEM_FEATURE_ALL,
                    label: "Our System Feature",
                    permissions: [
                        { key: PermissionsEnum.OUR_SYSTEM_FEATURE_ALL, code: PermissionsEnum.OUR_SYSTEM_FEATURE_ALL, label: "All" },
                        { key: PermissionsEnum.OUR_SYSTEM_FEATURE_FETCH, code: PermissionsEnum.OUR_SYSTEM_FEATURE_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.OUR_SYSTEM_FEATURE_DETAILS, code: PermissionsEnum.OUR_SYSTEM_FEATURE_DETAILS, label: "Details" },
                        { key: PermissionsEnum.OUR_SYSTEM_FEATURE_CREATE, code: PermissionsEnum.OUR_SYSTEM_FEATURE_CREATE, label: "Create" },
                        { key: PermissionsEnum.OUR_SYSTEM_FEATURE_UPDATE, code: PermissionsEnum.OUR_SYSTEM_FEATURE_UPDATE, label: "Update" },
                        { key: PermissionsEnum.OUR_SYSTEM_FEATURE_DELETE, code: PermissionsEnum.OUR_SYSTEM_FEATURE_DELETE, label: "Delete" },
                        { key: PermissionsEnum.OUR_SYSTEM_FEATURE_ORDER, code: PermissionsEnum.OUR_SYSTEM_FEATURE_ORDER, label: "Order" },
                        { key: PermissionsEnum.OUR_SYSTEM_FEATURE_CHANGE_STATUS, code: PermissionsEnum.OUR_SYSTEM_FEATURE_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Our System Risk Management
                {
                    key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ALL,
                    code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ALL,
                    label: "Our System Risk Management",
                    permissions: [
                        { key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ALL, code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ALL, label: "All" },
                        { key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_FETCH, code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_DETAILS, code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_DETAILS, label: "Details" },
                        { key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_CREATE, code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_CREATE, label: "Create" },
                        { key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_UPDATE, code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_UPDATE, label: "Update" },
                        { key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_DELETE, code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_DELETE, label: "Delete" },
                        { key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ORDER, code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ORDER, label: "Order" },
                        { key: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_CHANGE_STATUS, code: PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Our System Risk Type
                {
                    key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_ALL,
                    code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_ALL,
                    label: "Our System Risk Type",
                    permissions: [
                        { key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_ALL, code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_ALL, label: "All" },
                        { key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_FETCH, code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_DETAILS, code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_DETAILS, label: "Details" },
                        { key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_CREATE, code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_CREATE, label: "Create" },
                        { key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_UPDATE, code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_UPDATE, label: "Update" },
                        { key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_DELETE, code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_DELETE, label: "Delete" },
                        { key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_ORDER, code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_ORDER, label: "Order" },
                        { key: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_CHANGE_STATUS, code: PermissionsEnum.OUR_SYSTEM_RISK_TYPE_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Our System Component
                {
                    key: PermissionsEnum.OUR_SYSTEM_COMPONENT_ALL,
                    code: PermissionsEnum.OUR_SYSTEM_COMPONENT_ALL,
                    label: "Our System Component",
                    permissions: [
                        { key: PermissionsEnum.OUR_SYSTEM_COMPONENT_ALL, code: PermissionsEnum.OUR_SYSTEM_COMPONENT_ALL, label: "All" },
                        { key: PermissionsEnum.OUR_SYSTEM_COMPONENT_FETCH, code: PermissionsEnum.OUR_SYSTEM_COMPONENT_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.OUR_SYSTEM_COMPONENT_DETAILS, code: PermissionsEnum.OUR_SYSTEM_COMPONENT_DETAILS, label: "Details" },
                        { key: PermissionsEnum.OUR_SYSTEM_COMPONENT_CREATE, code: PermissionsEnum.OUR_SYSTEM_COMPONENT_CREATE, label: "Create" },
                        { key: PermissionsEnum.OUR_SYSTEM_COMPONENT_UPDATE, code: PermissionsEnum.OUR_SYSTEM_COMPONENT_UPDATE, label: "Update" },
                        { key: PermissionsEnum.OUR_SYSTEM_COMPONENT_DELETE, code: PermissionsEnum.OUR_SYSTEM_COMPONENT_DELETE, label: "Delete" },
                        { key: PermissionsEnum.OUR_SYSTEM_COMPONENT_ORDER, code: PermissionsEnum.OUR_SYSTEM_COMPONENT_ORDER, label: "Order" },
                        { key: PermissionsEnum.OUR_SYSTEM_COMPONENT_CHANGE_STATUS, code: PermissionsEnum.OUR_SYSTEM_COMPONENT_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Our System Step
                {
                    key: PermissionsEnum.OUR_SYSTEM_STEP_ALL,
                    code: PermissionsEnum.OUR_SYSTEM_STEP_ALL,
                    label: "Our System Step",
                    permissions: [
                        { key: PermissionsEnum.OUR_SYSTEM_STEP_ALL, code: PermissionsEnum.OUR_SYSTEM_STEP_ALL, label: "All" },
                        { key: PermissionsEnum.OUR_SYSTEM_STEP_FETCH, code: PermissionsEnum.OUR_SYSTEM_STEP_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.OUR_SYSTEM_STEP_DETAILS, code: PermissionsEnum.OUR_SYSTEM_STEP_DETAILS, label: "Details" },
                        { key: PermissionsEnum.OUR_SYSTEM_STEP_CREATE, code: PermissionsEnum.OUR_SYSTEM_STEP_CREATE, label: "Create" },
                        { key: PermissionsEnum.OUR_SYSTEM_STEP_UPDATE, code: PermissionsEnum.OUR_SYSTEM_STEP_UPDATE, label: "Update" },
                        { key: PermissionsEnum.OUR_SYSTEM_STEP_DELETE, code: PermissionsEnum.OUR_SYSTEM_STEP_DELETE, label: "Delete" },
                        { key: PermissionsEnum.OUR_SYSTEM_STEP_ORDER, code: PermissionsEnum.OUR_SYSTEM_STEP_ORDER, label: "Order" },
                        { key: PermissionsEnum.OUR_SYSTEM_STEP_CHANGE_STATUS, code: PermissionsEnum.OUR_SYSTEM_STEP_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Powerful Feature
                {
                    key: PermissionsEnum.POWERFUL_FEATURE_ALL,
                    code: PermissionsEnum.POWERFUL_FEATURE_ALL,
                    label: "Powerful Feature",
                    permissions: [
                        { key: PermissionsEnum.POWERFUL_FEATURE_ALL, code: PermissionsEnum.POWERFUL_FEATURE_ALL, label: "All" },
                        { key: PermissionsEnum.POWERFUL_FEATURE_FETCH, code: PermissionsEnum.POWERFUL_FEATURE_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.POWERFUL_FEATURE_DETAILS, code: PermissionsEnum.POWERFUL_FEATURE_DETAILS, label: "Details" },
                        { key: PermissionsEnum.POWERFUL_FEATURE_CREATE, code: PermissionsEnum.POWERFUL_FEATURE_CREATE, label: "Create" },
                        { key: PermissionsEnum.POWERFUL_FEATURE_UPDATE, code: PermissionsEnum.POWERFUL_FEATURE_UPDATE, label: "Update" },
                        { key: PermissionsEnum.POWERFUL_FEATURE_DELETE, code: PermissionsEnum.POWERFUL_FEATURE_DELETE, label: "Delete" },
                        { key: PermissionsEnum.POWERFUL_FEATURE_ORDER, code: PermissionsEnum.POWERFUL_FEATURE_ORDER, label: "Order" },
                        { key: PermissionsEnum.POWERFUL_FEATURE_CHANGE_STATUS, code: PermissionsEnum.POWERFUL_FEATURE_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // System Work
                {
                    key: PermissionsEnum.SYSTEM_WORK_ALL,
                    code: PermissionsEnum.SYSTEM_WORK_ALL,
                    label: "System Work",
                    permissions: [
                        { key: PermissionsEnum.SYSTEM_WORK_ALL, code: PermissionsEnum.SYSTEM_WORK_ALL, label: "All" },
                        { key: PermissionsEnum.SYSTEM_WORK_FETCH, code: PermissionsEnum.SYSTEM_WORK_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.SYSTEM_WORK_DETAILS, code: PermissionsEnum.SYSTEM_WORK_DETAILS, label: "Details" },
                        { key: PermissionsEnum.SYSTEM_WORK_CREATE, code: PermissionsEnum.SYSTEM_WORK_CREATE, label: "Create" },
                        { key: PermissionsEnum.SYSTEM_WORK_UPDATE, code: PermissionsEnum.SYSTEM_WORK_UPDATE, label: "Update" },
                        { key: PermissionsEnum.SYSTEM_WORK_DELETE, code: PermissionsEnum.SYSTEM_WORK_DELETE, label: "Delete" },
                        { key: PermissionsEnum.SYSTEM_WORK_ORDER, code: PermissionsEnum.SYSTEM_WORK_ORDER, label: "Order" },
                        { key: PermissionsEnum.SYSTEM_WORK_CHANGE_STATUS, code: PermissionsEnum.SYSTEM_WORK_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Website Info (also used in settings but included here under website too)
                {
                    key: PermissionsEnum.WEBSITE_INFO_ALL,
                    code: PermissionsEnum.WEBSITE_INFO_ALL,
                    label: "Website Info",
                    permissions: [
                        { key: PermissionsEnum.WEBSITE_INFO_ALL, code: PermissionsEnum.WEBSITE_INFO_ALL, label: "All" },
                        { key: PermissionsEnum.WEBSITE_INFO_FETCH, code: PermissionsEnum.WEBSITE_INFO_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.WEBSITE_INFO_DETAILS, code: PermissionsEnum.WEBSITE_INFO_DETAILS, label: "Details" },
                        { key: PermissionsEnum.WEBSITE_INFO_CREATE, code: PermissionsEnum.WEBSITE_INFO_CREATE, label: "Create" },
                        { key: PermissionsEnum.WEBSITE_INFO_UPDATE, code: PermissionsEnum.WEBSITE_INFO_UPDATE, label: "Update" },
                        { key: PermissionsEnum.WEBSITE_INFO_DELETE, code: PermissionsEnum.WEBSITE_INFO_DELETE, label: "Delete" },
                        { key: PermissionsEnum.WEBSITE_INFO_ORDER, code: PermissionsEnum.WEBSITE_INFO_ORDER, label: "Order" },
                        { key: PermissionsEnum.WEBSITE_INFO_CHANGE_STATUS, code: PermissionsEnum.WEBSITE_INFO_CHANGE_STATUS, label: "Change Status" },
                    ],
                },

                // Contact Us
                {
                    key: PermissionsEnum.CONTACT_US_ALL,
                    code: PermissionsEnum.CONTACT_US_ALL,
                    label: "Contact Us",
                    permissions: [
                        { key: PermissionsEnum.CONTACT_US_ALL, code: PermissionsEnum.CONTACT_US_ALL, label: "All" },
                        { key: PermissionsEnum.CONTACT_US_FETCH, code: PermissionsEnum.CONTACT_US_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.CONTACT_US_DETAILS, code: PermissionsEnum.CONTACT_US_DETAILS, label: "Details" },
                        { key: PermissionsEnum.CONTACT_US_DELETE, code: PermissionsEnum.CONTACT_US_DELETE, label: "Delete" },
                    ],
                },

                // Request Service
                {
                    key: PermissionsEnum.REQUEST_SERVICE_ALL,
                    code: PermissionsEnum.REQUEST_SERVICE_ALL,
                    label: "Request Service",
                    permissions: [
                        { key: PermissionsEnum.REQUEST_SERVICE_ALL, code: PermissionsEnum.REQUEST_SERVICE_ALL, label: "All" },
                        { key: PermissionsEnum.REQUEST_SERVICE_FETCH, code: PermissionsEnum.REQUEST_SERVICE_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.REQUEST_SERVICE_DETAILS, code: PermissionsEnum.REQUEST_SERVICE_DETAILS, label: "Details" },
                        { key: PermissionsEnum.REQUEST_SERVICE_DELETE, code: PermissionsEnum.REQUEST_SERVICE_DELETE, label: "Delete" },
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
            label: "Settings",
            permissions: [
                // Admin
                {
                    key: PermissionsEnum.ADMIN_ALL,
                    code: PermissionsEnum.ADMIN_ALL,
                    label: "Admin",
                    permissions: [
                        { key: PermissionsEnum.ADMIN_ALL, code: PermissionsEnum.ADMIN_ALL, label: "All" },
                        { key: PermissionsEnum.ADMIN_FETCH, code: PermissionsEnum.ADMIN_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.ADMIN_DETAILS, code: PermissionsEnum.ADMIN_DETAILS, label: "Details" },
                        { key: PermissionsEnum.ADMIN_CREATE, code: PermissionsEnum.ADMIN_CREATE, label: "Create" },
                        { key: PermissionsEnum.ADMIN_UPDATE, code: PermissionsEnum.ADMIN_UPDATE, label: "Update" },
                        { key: PermissionsEnum.ADMIN_DELETE, code: PermissionsEnum.ADMIN_DELETE, label: "Delete" },
                    ],
                },
                // Language
                {
                    key: PermissionsEnum.LANGUAGE_ALL,
                    code: PermissionsEnum.LANGUAGE_ALL,
                    label: "Language",
                    permissions: [
                        { key: PermissionsEnum.LANGUAGE_ALL, code: PermissionsEnum.LANGUAGE_ALL, label: "All" },
                        { key: PermissionsEnum.LANGUAGE_FETCH, code: PermissionsEnum.LANGUAGE_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.LANGUAGE_DETAILS, code: PermissionsEnum.LANGUAGE_DETAILS, label: "Details" },
                        { key: PermissionsEnum.LANGUAGE_CREATE, code: PermissionsEnum.LANGUAGE_CREATE, label: "Create" },
                        { key: PermissionsEnum.LANGUAGE_UPDATE, code: PermissionsEnum.LANGUAGE_UPDATE, label: "Update" },
                        { key: PermissionsEnum.LANGUAGE_DELETE, code: PermissionsEnum.LANGUAGE_DELETE, label: "Delete" },
                    ],
                },

                // Location
                {
                    key: PermissionsEnum.LOCATION_ALL,
                    code: PermissionsEnum.LOCATION_ALL,
                    label: "Location",
                    permissions: [
                        { key: PermissionsEnum.LOCATION_ALL, code: PermissionsEnum.LOCATION_ALL, label: "All" },
                        { key: PermissionsEnum.LOCATION_FETCH, code: PermissionsEnum.LOCATION_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.LOCATION_DETAILS, code: PermissionsEnum.LOCATION_DETAILS, label: "Details" },
                        { key: PermissionsEnum.LOCATION_CREATE, code: PermissionsEnum.LOCATION_CREATE, label: "Create" },
                        { key: PermissionsEnum.LOCATION_UPDATE, code: PermissionsEnum.LOCATION_UPDATE, label: "Update" },
                        { key: PermissionsEnum.LOCATION_DELETE, code: PermissionsEnum.LOCATION_DELETE, label: "Delete" },
                    ],
                },

                // Industry
                {
                    key: PermissionsEnum.INDUSTRY_ALL,
                    code: PermissionsEnum.INDUSTRY_ALL,
                    label: "Industry",
                    permissions: [
                        { key: PermissionsEnum.INDUSTRY_ALL, code: PermissionsEnum.INDUSTRY_ALL, label: "All" },
                        { key: PermissionsEnum.INDUSTRY_FETCH, code: PermissionsEnum.INDUSTRY_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.INDUSTRY_DETAILS, code: PermissionsEnum.INDUSTRY_DETAILS, label: "Details" },
                        { key: PermissionsEnum.INDUSTRY_CREATE, code: PermissionsEnum.INDUSTRY_CREATE, label: "Create" },
                        { key: PermissionsEnum.INDUSTRY_UPDATE, code: PermissionsEnum.INDUSTRY_UPDATE, label: "Update" },
                        { key: PermissionsEnum.INDUSTRY_DELETE, code: PermissionsEnum.INDUSTRY_DELETE, label: "Delete" },
                    ],
                },

                // Equipment Type
                {
                    key: PermissionsEnum.EQUIPMENT_TYPE_ALL,
                    code: PermissionsEnum.EQUIPMENT_TYPE_ALL,
                    label: "Equipment Type",
                    permissions: [
                        { key: PermissionsEnum.EQUIPMENT_TYPE_ALL, code: PermissionsEnum.EQUIPMENT_TYPE_ALL, label: "All" },
                        { key: PermissionsEnum.EQUIPMENT_TYPE_FETCH, code: PermissionsEnum.EQUIPMENT_TYPE_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.EQUIPMENT_TYPE_DETAILS, code: PermissionsEnum.EQUIPMENT_TYPE_DETAILS, label: "Details" },
                        { key: PermissionsEnum.EQUIPMENT_TYPE_CREATE, code: PermissionsEnum.EQUIPMENT_TYPE_CREATE, label: "Create" },
                        { key: PermissionsEnum.EQUIPMENT_TYPE_UPDATE, code: PermissionsEnum.EQUIPMENT_TYPE_UPDATE, label: "Update" },
                        { key: PermissionsEnum.EQUIPMENT_TYPE_DELETE, code: PermissionsEnum.EQUIPMENT_TYPE_DELETE, label: "Delete" },
                    ],
                },

                // Factory
                {
                    key: PermissionsEnum.FACTORY_ALL,
                    code: PermissionsEnum.FACTORY_ALL,
                    label: "Factory",
                    permissions: [
                        { key: PermissionsEnum.FACTORY_ALL, code: PermissionsEnum.FACTORY_ALL, label: "All" },
                        { key: PermissionsEnum.FACTORY_FETCH, code: PermissionsEnum.FACTORY_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.FACTORY_DETAILS, code: PermissionsEnum.FACTORY_DETAILS, label: "Details" },
                        { key: PermissionsEnum.FACTORY_CREATE, code: PermissionsEnum.FACTORY_CREATE, label: "Create" },
                        { key: PermissionsEnum.FACTORY_UPDATE, code: PermissionsEnum.FACTORY_UPDATE, label: "Update" },
                        { key: PermissionsEnum.FACTORY_DELETE, code: PermissionsEnum.FACTORY_DELETE, label: "Delete" },
                    ],
                },

                // Factory Item
                {
                    key: PermissionsEnum.FACTORY_ITEM_ALL,
                    code: PermissionsEnum.FACTORY_ITEM_ALL,
                    label: "Factory Item",
                    permissions: [
                        { key: PermissionsEnum.FACTORY_ITEM_ALL, code: PermissionsEnum.FACTORY_ITEM_ALL, label: "All" },
                        { key: PermissionsEnum.FACTORY_ITEM_FETCH, code: PermissionsEnum.FACTORY_ITEM_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.FACTORY_ITEM_DETAILS, code: PermissionsEnum.FACTORY_ITEM_DETAILS, label: "Details" },
                        { key: PermissionsEnum.FACTORY_ITEM_CREATE, code: PermissionsEnum.FACTORY_ITEM_CREATE, label: "Create" },
                        { key: PermissionsEnum.FACTORY_ITEM_UPDATE, code: PermissionsEnum.FACTORY_ITEM_UPDATE, label: "Update" },
                        { key: PermissionsEnum.FACTORY_ITEM_DELETE, code: PermissionsEnum.FACTORY_ITEM_DELETE, label: "Delete" },
                    ],
                },

                // Template
                {
                    key: PermissionsEnum.TEMPLATE_ALL,
                    code: PermissionsEnum.TEMPLATE_ALL,
                    label: "Template",
                    permissions: [
                        { key: PermissionsEnum.TEMPLATE_ALL, code: PermissionsEnum.TEMPLATE_ALL, label: "All" },
                        { key: PermissionsEnum.TEMPLATE_FETCH, code: PermissionsEnum.TEMPLATE_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.TEMPLATE_DETAILS, code: PermissionsEnum.TEMPLATE_DETAILS, label: "Details" },
                        { key: PermissionsEnum.TEMPLATE_CREATE, code: PermissionsEnum.TEMPLATE_CREATE, label: "Create" },
                        { key: PermissionsEnum.TEMPLATE_UPDATE, code: PermissionsEnum.TEMPLATE_UPDATE, label: "Update" },
                        { key: PermissionsEnum.TEMPLATE_DELETE, code: PermissionsEnum.TEMPLATE_DELETE, label: "Delete" },
                    ],
                },

                // Hazard Type
                {
                    key: PermissionsEnum.HAZARD_TYPE_ALL,
                    code: PermissionsEnum.HAZARD_TYPE_ALL,
                    label: "Hazard Type",
                    permissions: [
                        { key: PermissionsEnum.HAZARD_TYPE_ALL, code: PermissionsEnum.HAZARD_TYPE_ALL, label: "All" },
                        { key: PermissionsEnum.HAZARD_TYPE_FETCH, code: PermissionsEnum.HAZARD_TYPE_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.HAZARD_TYPE_DETAILS, code: PermissionsEnum.HAZARD_TYPE_DETAILS, label: "Details" },
                        { key: PermissionsEnum.HAZARD_TYPE_CREATE, code: PermissionsEnum.HAZARD_TYPE_CREATE, label: "Create" },
                        { key: PermissionsEnum.HAZARD_TYPE_UPDATE, code: PermissionsEnum.HAZARD_TYPE_UPDATE, label: "Update" },
                        { key: PermissionsEnum.HAZARD_TYPE_DELETE, code: PermissionsEnum.HAZARD_TYPE_DELETE, label: "Delete" },
                    ],
                },

                // Accidents Type
                {
                    key: PermissionsEnum.ACCIDENTS_TYPE_ALL,
                    code: PermissionsEnum.ACCIDENTS_TYPE_ALL,
                    label: "Accidents Type",
                    permissions: [
                        { key: PermissionsEnum.ACCIDENTS_TYPE_ALL, code: PermissionsEnum.ACCIDENTS_TYPE_ALL, label: "All" },
                        { key: PermissionsEnum.ACCIDENTS_TYPE_FETCH, code: PermissionsEnum.ACCIDENTS_TYPE_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.ACCIDENTS_TYPE_DETAILS, code: PermissionsEnum.ACCIDENTS_TYPE_DETAILS, label: "Details" },
                        { key: PermissionsEnum.ACCIDENTS_TYPE_CREATE, code: PermissionsEnum.ACCIDENTS_TYPE_CREATE, label: "Create" },
                        { key: PermissionsEnum.ACCIDENTS_TYPE_UPDATE, code: PermissionsEnum.ACCIDENTS_TYPE_UPDATE, label: "Update" },
                        { key: PermissionsEnum.ACCIDENTS_TYPE_DELETE, code: PermissionsEnum.ACCIDENTS_TYPE_DELETE, label: "Delete" },
                    ],
                },

                // Equipment (general)
                {
                    key: PermissionsEnum.EQUIPMENT_ALL,
                    code: PermissionsEnum.EQUIPMENT_ALL,
                    label: "Equipment",
                    permissions: [
                        { key: PermissionsEnum.EQUIPMENT_ALL, code: PermissionsEnum.EQUIPMENT_ALL, label: "All" },
                        { key: PermissionsEnum.EQUIPMENT_FETCH, code: PermissionsEnum.EQUIPMENT_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.EQUIPMENT_DETAILS, code: PermissionsEnum.EQUIPMENT_DETAILS, label: "Details" },
                        { key: PermissionsEnum.EQUIPMENT_CREATE, code: PermissionsEnum.EQUIPMENT_CREATE, label: "Create" },
                        { key: PermissionsEnum.EQUIPMENT_UPDATE, code: PermissionsEnum.EQUIPMENT_UPDATE, label: "Update" },
                        { key: PermissionsEnum.EQUIPMENT_DELETE, code: PermissionsEnum.EQUIPMENT_DELETE, label: "Delete" },
                    ],
                },

                // Certificate
                {
                    key: PermissionsEnum.CERTIFICATE_ALL,
                    code: PermissionsEnum.CERTIFICATE_ALL,
                    label: "Certificate",
                    permissions: [
                        { key: PermissionsEnum.CERTIFICATE_ALL, code: PermissionsEnum.CERTIFICATE_ALL, label: "All" },
                        { key: PermissionsEnum.CERTIFICATE_FETCH, code: PermissionsEnum.CERTIFICATE_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.CERTIFICATE_DETAILS, code: PermissionsEnum.CERTIFICATE_DETAILS, label: "Details" },
                        { key: PermissionsEnum.CERTIFICATE_CREATE, code: PermissionsEnum.CERTIFICATE_CREATE, label: "Create" },
                        { key: PermissionsEnum.CERTIFICATE_UPDATE, code: PermissionsEnum.CERTIFICATE_UPDATE, label: "Update" },
                        { key: PermissionsEnum.CERTIFICATE_DELETE, code: PermissionsEnum.CERTIFICATE_DELETE, label: "Delete" },
                    ],
                },

                // Organization (if needed in settings)
                {
                    key: PermissionsEnum.ORGANIZATION_ALL,
                    code: PermissionsEnum.ORGANIZATION_ALL,
                    label: "Organization",
                    permissions: [
                        { key: PermissionsEnum.ORGANIZATION_ALL, code: PermissionsEnum.ORGANIZATION_ALL, label: "All" },
                        { key: PermissionsEnum.ORGANIZATION_FETCH, code: PermissionsEnum.ORGANIZATION_FETCH, label: "Fetch" },
                        { key: PermissionsEnum.ORGANIZATION_DETAILS, code: PermissionsEnum.ORGANIZATION_DETAILS, label: "Details" },
                        { key: PermissionsEnum.ORGANIZATION_CREATE, code: PermissionsEnum.ORGANIZATION_CREATE, label: "Create" },
                        { key: PermissionsEnum.ORGANIZATION_UPDATE, code: PermissionsEnum.ORGANIZATION_UPDATE, label: "Update" },
                        { key: PermissionsEnum.ORGANIZATION_DELETE, code: PermissionsEnum.ORGANIZATION_DELETE, label: "Delete" },
                    ],
                },

            ],
        },
    ],
};

