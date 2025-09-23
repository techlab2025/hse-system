import TitleModel from "@/base/core/Models/title_model";
import TitleInterface from "@/base/Data/Models/title_interface";
import { PermissionsEnum } from "@/features/users/employee/Core/enums/permission_enum";

export default class PermissionModel {
  id: number;
  isMaster: number;
  allOffer: number;
  mention: number;
  permission: TitleModel[];

  constructor(
    id: number,
    isMaster: number,
    allOffer: number,
    mention: number,
    permission: TitleModel[],
  ) {
    this.id = id;
    this.isMaster = isMaster;
    this.allOffer = allOffer;
    this.mention = mention;
    this.permission = permission;
  }

  static fromMap(data: any): PermissionModel {
    return new PermissionModel(
      data?.id,
      data?.is_master ?? 1,
      data?.response_status ?? 1,
      data?.mention ?? 1,
      this.handlePermissionTitles(data?.permissions) ?? [],
    );
  }

  static handlePermissionTitles(data) {
    const maps: TitleInterface[] = [
      new TitleInterface({
        id: 1,
        title: "All In Offers",
        subtitle: PermissionsEnum.AllOffers,
      }),
      new TitleInterface({
        id: 2,
        title: "Add Offer",
        subtitle: PermissionsEnum.AddOffer,
      }),
      new TitleInterface({
        id: 33,
        title: "Fetch Offers",
        subtitle: PermissionsEnum.FetchProjects,
      }),

      new TitleInterface({
        id: 3,
        title: "Export Invoice",
        subtitle: PermissionsEnum.ExportInvoice,
      }),
      new TitleInterface({
        id: 4,
        title: "Invoices",
        subtitle: PermissionsEnum.Invoices,
      }),
      new TitleInterface({
        id: 5,
        title: "Client Request",
        subtitle: PermissionsEnum.ClientRequest,
      }),
      new TitleInterface({
        id: 6,
        title: "Add Client Request",
        subtitle: PermissionsEnum.AddClientRequest,
      }),
      new TitleInterface({
        id: 7,
        title: "Convert Offer",
        subtitle: PermissionsEnum.ConvertOffer,
      }),
      new TitleInterface({
        id: 8,
        title: "IconSetting",
        subtitle: PermissionsEnum.Setting,
      }),
      new TitleInterface({
        id: 9,
        title: "Website",
        subtitle: PermissionsEnum.Website,
      }),
      new TitleInterface({
        id: 10,
        title: "Clients",
        subtitle: PermissionsEnum.Clients,
      }),
      new TitleInterface({
        id: 53,
        title: "Change LPO To Confirmed",
        subtitle: PermissionsEnum.ChangeLpoToConfirmed,
      }),
      new TitleInterface({
        id: 11,
        title: "Change Status Client",
        subtitle: PermissionsEnum.ChangeStatusClient,
      }),
      new TitleInterface({
        id: 12,
        title: "Employees",
        subtitle: PermissionsEnum.Employees,
      }),
      new TitleInterface({
        id: 13,
        title: "Add Employee",
        subtitle: PermissionsEnum.AddEmployee,
      }),
      new TitleInterface({
        id: 14,
        title: "Draft Client",
        subtitle: PermissionsEnum.DraftClient,
      }),
      new TitleInterface({
        id: 15,
        title: "All Project Actions",
        subtitle: PermissionsEnum.AllProjectActions,
      }),
      new TitleInterface({
        id: 16,
        title: "Edit Project",
        subtitle: PermissionsEnum.EditProject,
      }),
      new TitleInterface({
        id: 17,
        title: "Delete Offer",
        subtitle: PermissionsEnum.DeleteProject,
      }),
      new TitleInterface({
        id: 18,
        title: "Hold Offer",
        subtitle: PermissionsEnum.HoldProject,
      }),
      new TitleInterface({
        id: 19,
        title: "Cancel Offer",
        subtitle: PermissionsEnum.CancelProject,
      }),
      new TitleInterface({
        id: 21,
        title: "Export Offer",
        subtitle: PermissionsEnum.ExportProject,
      }),
      new TitleInterface({
        id: 22,
        title: " Invoices For Project",
        subtitle: PermissionsEnum.InvoicesProject,
      }),
      new TitleInterface({
        id: 23,
        title: "Group Invoice For Project",
        subtitle: PermissionsEnum.GroupInvoiceProject,
      }),
      new TitleInterface({
        id: 24,
        title: "Backstage offer",
        subtitle: PermissionsEnum.BackStageProject,
      }),
      new TitleInterface({
        id: 25,
        title: "Change Status Project ",
        subtitle: PermissionsEnum.ChangeStatusProject,
      }),
      new TitleInterface({
        id: 26,
        title: "Revised Project",
        subtitle: PermissionsEnum.RevisedProject,
      }),
      new TitleInterface({
        id: 27,
        title: "Drop Menu Project",
        subtitle: PermissionsEnum.DropMenuProject,
      }),
      new TitleInterface({
        id: 28,
        title: "Unlock Offer",
        subtitle: PermissionsEnum.UnlockProject,
      }),
      new TitleInterface({
        id: 29,
        title: "Reject Project",
        subtitle: PermissionsEnum.RejectProject,
      }),
      new TitleInterface({
        id: 30,
        title: "Accept  / Lpo Project",
        subtitle: PermissionsEnum.AcceptProject,
      }),
      new TitleInterface({
        id: 34,
        title: "Offers Report",
        subtitle: PermissionsEnum.ProjectReports,
      }),
      new TitleInterface({
        id: 35,
        title: "Client request Report",
        subtitle: PermissionsEnum.ClientRequestReports,
      }),
      new TitleInterface({
        id: 36,
        title: "Add Absence",
        subtitle: PermissionsEnum.AddAbsence,
      }),
      new TitleInterface({
        id: 37,
        title: "Fetch Absences",
        subtitle: PermissionsEnum.FetchAbsence,
      }),
      new TitleInterface({
        id: 38,
        title: "Hr",
        subtitle: PermissionsEnum.HR,
      }),
      new TitleInterface({
        id: 39,
        title: "Project",
        subtitle: PermissionsEnum.FinalProjects,
      }),
      new TitleInterface({
        id: 40,
        title: "Employee Plan",
        subtitle: PermissionsEnum.EmployeePlan,
      }),
      new TitleInterface({
        id: 41,
        title: "Plan",
        subtitle: PermissionsEnum.Plans,
      }),
      new TitleInterface({
        id: 43,
        title: "All In Projects",
        subtitle: PermissionsEnum.AllInProjects,
      }),
      new TitleInterface({
        id: 42,
        title: "Requirements",
        subtitle: PermissionsEnum.Requirements,
      }),
      new TitleInterface({
        id: 48,
        title: "Assign To Project",
        subtitle: PermissionsEnum.AssignToProject,
      }),
      new TitleInterface({
        id: 49,
        title: "Study Project",
        subtitle: PermissionsEnum.StudyProject,
      }),
      new TitleInterface({
        id: 50,
        title: "Quick Search",
        subtitle: PermissionsEnum.QuickSearch,
      }),
      new TitleInterface({
        id: 51,
        title: "Finish Study Project",
        subtitle: PermissionsEnum.FinishStudy,
      }),
      new TitleInterface({
        id: 52,
        title: "Ready To Export",
        subtitle: PermissionsEnum.ReadyToExport,
      }),
      new TitleInterface({
        id: 54,
        title: "Project Which You mention on it",
        subtitle: PermissionsEnum.Mention,
      }),
    ];
    const titles: TitleModel[] = [];

    data?.forEach((item: any) => {
      const index: number = maps.findIndex((e) => e.subtitle == item.title);

      // console.log(index, "index");
      titles.push(
        new TitleModel(
          maps[index]?.title ?? "",
          maps[index]?.id,
          maps[index]?.subtitle,
        ),
      );
    });

    // console.log(titles);
    return titles;
  }
}
