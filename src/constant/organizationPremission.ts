import { PermissionsEnum } from "@/features/users/employee/Core/Enum/permission_enum";
import type { PermissionItem } from "./adminPremission";

export const OrgPermissions: PermissionItem = {
    key: PermissionsEnum.ORGANIZATION_EMPLOYEE,
    code: PermissionsEnum.ORGANIZATION_EMPLOYEE,
    label: "Organization",
    permissions: [
        // ========== AUTH ==========
        {
            key: PermissionsEnum.ORG_EMPLOYEE_LOGIN,
            code: PermissionsEnum.ORG_EMPLOYEE_LOGIN,
            label: "Auth",
            permissions: [
                {
                    key: PermissionsEnum.ORG_EMPLOYEE_LOGIN,
                    code: PermissionsEnum.ORG_EMPLOYEE_LOGIN,
                    label: "Org Employee - Login",
                },
                {
                    key: PermissionsEnum.ORG_EMPLOYEE_CHANGE_PASSWORD,
                    code: PermissionsEnum.ORG_EMPLOYEE_CHANGE_PASSWORD,
                    label: "Org Employee - Change Password",
                },
            ],
        },

        // ========== EQUIPMENT TYPE ==========
        {
            key: PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
            code: PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
            label: "Equipment Type",
            permissions: [
                { key: PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL, code: PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL, label: "All" },
                { key: PermissionsEnum.ORG_EQUIPMENT_TYPE_FETCH, code: PermissionsEnum.ORG_EQUIPMENT_TYPE_FETCH, label: "Fetch" },
                { key: PermissionsEnum.ORG_EQUIPMENT_TYPE_DETAILS, code: PermissionsEnum.ORG_EQUIPMENT_TYPE_DETAILS, label: "Details" },
                { key: PermissionsEnum.ORG_EQUIPMENT_TYPE_CREATE, code: PermissionsEnum.ORG_EQUIPMENT_TYPE_CREATE, label: "Create" },
                { key: PermissionsEnum.ORG_EQUIPMENT_TYPE_UPDATE, code: PermissionsEnum.ORG_EQUIPMENT_TYPE_UPDATE, label: "Update" },
                { key: PermissionsEnum.ORG_EQUIPMENT_TYPE_DELETE, code: PermissionsEnum.ORG_EQUIPMENT_TYPE_DELETE, label: "Delete" },
            ],
        },

        // ========== FACTORY ==========
        {
            key: PermissionsEnum.ORG_FACTORY_ALL,
            code: PermissionsEnum.ORG_FACTORY_ALL,
            label: "Factory",
            permissions: [
                { key: PermissionsEnum.ORG_FACTORY_ALL, code: PermissionsEnum.ORG_FACTORY_ALL, label: "All" },
                { key: PermissionsEnum.ORG_FACTORY_FETCH, code: PermissionsEnum.ORG_FACTORY_FETCH, label: "Fetch" },
                { key: PermissionsEnum.ORG_FACTORY_DETAILS, code: PermissionsEnum.ORG_FACTORY_DETAILS, label: "Details" },
                { key: PermissionsEnum.ORG_FACTORY_CREATE, code: PermissionsEnum.ORG_FACTORY_CREATE, label: "Create" },
                { key: PermissionsEnum.ORG_FACTORY_UPDATE, code: PermissionsEnum.ORG_FACTORY_UPDATE, label: "Update" },
                { key: PermissionsEnum.ORG_FACTORY_DELETE, code: PermissionsEnum.ORG_FACTORY_DELETE, label: "Delete" },
            ],
        },

        // ========== FACTORY ITEM ==========
        {
            key: PermissionsEnum.ORG_FACTORY_ITEM_ALL,
            code: PermissionsEnum.ORG_FACTORY_ITEM_ALL,
            label: "Factory Item",
            permissions: [
                { key: PermissionsEnum.ORG_FACTORY_ITEM_ALL, code: PermissionsEnum.ORG_FACTORY_ITEM_ALL, label: "All" },
                { key: PermissionsEnum.ORG_FACTORY_ITEM_FETCH, code: PermissionsEnum.ORG_FACTORY_ITEM_FETCH, label: "Fetch" },
                { key: PermissionsEnum.ORG_FACTORY_ITEM_DETAILS, code: PermissionsEnum.ORG_FACTORY_ITEM_DETAILS, label: "Details" },
                { key: PermissionsEnum.ORG_FACTORY_ITEM_CREATE, code: PermissionsEnum.ORG_FACTORY_ITEM_CREATE, label: "Create" },
                { key: PermissionsEnum.ORG_FACTORY_ITEM_UPDATE, code: PermissionsEnum.ORG_FACTORY_ITEM_UPDATE, label: "Update" },
                { key: PermissionsEnum.ORG_FACTORY_ITEM_DELETE, code: PermissionsEnum.ORG_FACTORY_ITEM_DELETE, label: "Delete" },
            ],
        },

        // ========== TEMPLATE ==========
        {
            key: PermissionsEnum.ORG_TEMPLATE_ALL,
            code: PermissionsEnum.ORG_TEMPLATE_ALL,
            label: "Template",
            permissions: [
                { key: PermissionsEnum.ORG_TEMPLATE_ALL, code: PermissionsEnum.ORG_TEMPLATE_ALL, label: "All" },
                { key: PermissionsEnum.ORG_TEMPLATE_FETCH, code: PermissionsEnum.ORG_TEMPLATE_FETCH, label: "Fetch" },
                { key: PermissionsEnum.ORG_TEMPLATE_DETAILS, code: PermissionsEnum.ORG_TEMPLATE_DETAILS, label: "Details" },
                { key: PermissionsEnum.ORG_TEMPLATE_CREATE, code: PermissionsEnum.ORG_TEMPLATE_CREATE, label: "Create" },
                { key: PermissionsEnum.ORG_TEMPLATE_UPDATE, code: PermissionsEnum.ORG_TEMPLATE_UPDATE, label: "Update" },
                { key: PermissionsEnum.ORG_TEMPLATE_DELETE, code: PermissionsEnum.ORG_TEMPLATE_DELETE, label: "Delete" },
            ],
        },

        // ========== HAZARD TYPE ==========
        {
            key: PermissionsEnum.ORG_HAZARD_TYPE_ALL,
            code: PermissionsEnum.ORG_HAZARD_TYPE_ALL,
            label: "Hazard Type",
            permissions: [
                { key: PermissionsEnum.ORG_HAZARD_TYPE_ALL, code: PermissionsEnum.ORG_HAZARD_TYPE_ALL, label: "All" },
                { key: PermissionsEnum.ORG_HAZARD_TYPE_FETCH, code: PermissionsEnum.ORG_HAZARD_TYPE_FETCH, label: "Fetch" },
                { key: PermissionsEnum.ORG_HAZARD_TYPE_DETAILS, code: PermissionsEnum.ORG_HAZARD_TYPE_DETAILS, label: "Details" },
                { key: PermissionsEnum.ORG_HAZARD_TYPE_CREATE, code: PermissionsEnum.ORG_HAZARD_TYPE_CREATE, label: "Create" },
                { key: PermissionsEnum.ORG_HAZARD_TYPE_UPDATE, code: PermissionsEnum.ORG_HAZARD_TYPE_UPDATE, label: "Update" },
                { key: PermissionsEnum.ORG_HAZARD_TYPE_DELETE, code: PermissionsEnum.ORG_HAZARD_TYPE_DELETE, label: "Delete" },
            ],
        },

        // ========== ACCIDENTS TYPE ==========
        {
            key: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
            code: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
            label: "Accidents Type",
            permissions: [
                { key: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL, code: PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL, label: "All" },
                { key: PermissionsEnum.ORG_ACCIDENTS_TYPE_FETCH, code: PermissionsEnum.ORG_ACCIDENTS_TYPE_FETCH, label: "Fetch" },
                { key: PermissionsEnum.ORG_ACCIDENTS_TYPE_DETAILS, code: PermissionsEnum.ORG_ACCIDENTS_TYPE_DETAILS, label: "Details" },
                { key: PermissionsEnum.ORG_ACCIDENTS_TYPE_CREATE, code: PermissionsEnum.ORG_ACCIDENTS_TYPE_CREATE, label: "Create" },
                { key: PermissionsEnum.ORG_ACCIDENTS_TYPE_UPDATE, code: PermissionsEnum.ORG_ACCIDENTS_TYPE_UPDATE, label: "Update" },
                { key: PermissionsEnum.ORG_ACCIDENTS_TYPE_DELETE, code: PermissionsEnum.ORG_ACCIDENTS_TYPE_DELETE, label: "Delete" },
            ],
        },

        // ========== EQUIPMENT ==========
        {
            key: PermissionsEnum.ORG_EQUIPMENT_ALL,
            code: PermissionsEnum.ORG_EQUIPMENT_ALL,
            label: "Equipment",
            permissions: [
                { key: PermissionsEnum.ORG_EQUIPMENT_ALL, code: PermissionsEnum.ORG_EQUIPMENT_ALL, label: "All" },
                { key: PermissionsEnum.ORG_EQUIPMENT_FETCH, code: PermissionsEnum.ORG_EQUIPMENT_FETCH, label: "Fetch" },
                { key: PermissionsEnum.ORG_EQUIPMENT_DETAILS, code: PermissionsEnum.ORG_EQUIPMENT_DETAILS, label: "Details" },
                { key: PermissionsEnum.ORG_EQUIPMENT_CREATE, code: PermissionsEnum.ORG_EQUIPMENT_CREATE, label: "Create" },
                { key: PermissionsEnum.ORG_EQUIPMENT_UPDATE, code: PermissionsEnum.ORG_EQUIPMENT_UPDATE, label: "Update" },
                { key: PermissionsEnum.ORG_EQUIPMENT_DELETE, code: PermissionsEnum.ORG_EQUIPMENT_DELETE, label: "Delete" },
            ],
        },

        // ========== LOCATION ==========
        {
            key: PermissionsEnum.ORG_LOCATION_ALL,
            code: PermissionsEnum.ORG_LOCATION_ALL,
            label: "Location",
            permissions: [
                { key: PermissionsEnum.ORG_LOCATION_ALL, code: PermissionsEnum.ORG_LOCATION_ALL, label: "All" },
                { key: PermissionsEnum.ORG_LOCATION_FETCH, code: PermissionsEnum.ORG_LOCATION_FETCH, label: "Fetch" },
                { key: PermissionsEnum.ORG_LOCATION_DETAILS, code: PermissionsEnum.ORG_LOCATION_DETAILS, label: "Details" },
                { key: PermissionsEnum.ORG_LOCATION_CREATE, code: PermissionsEnum.ORG_LOCATION_CREATE, label: "Create" },
                { key: PermissionsEnum.ORG_LOCATION_UPDATE, code: PermissionsEnum.ORG_LOCATION_UPDATE, label: "Update" },
                { key: PermissionsEnum.ORG_LOCATION_DELETE, code: PermissionsEnum.ORG_LOCATION_DELETE, label: "Delete" },
            ],
        },

        // ========== EMPLOYEE ==========
        {
            key: PermissionsEnum.ORG_EMPLOYEE_ALL,
            code: PermissionsEnum.ORG_EMPLOYEE_ALL,
            label: "Employee",
            permissions: [
                { key: PermissionsEnum.ORG_EMPLOYEE_ALL, code: PermissionsEnum.ORG_EMPLOYEE_ALL, label: "All" },
                { key: PermissionsEnum.ORG_EMPLOYEE_FETCH, code: PermissionsEnum.ORG_EMPLOYEE_FETCH, label: "Fetch" },
                { key: PermissionsEnum.ORG_EMPLOYEE_DETAILS, code: PermissionsEnum.ORG_EMPLOYEE_DETAILS, label: "Details" },
                { key: PermissionsEnum.ORG_EMPLOYEE_CREATE, code: PermissionsEnum.ORG_EMPLOYEE_CREATE, label: "Create" },
                { key: PermissionsEnum.ORG_EMPLOYEE_UPDATE, code: PermissionsEnum.ORG_EMPLOYEE_UPDATE, label: "Update" },
                { key: PermissionsEnum.ORG_EMPLOYEE_DELETE, code: PermissionsEnum.ORG_EMPLOYEE_DELETE, label: "Delete" },
            ],
        },
    ],
};
