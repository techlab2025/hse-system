import type Params from "@/base/core/params/params";

export default class PermissionParams implements Params {
  id?: number;
  permissions: number[];
  allOffers?: number;
  isMaster?: number;
  AllProjects?: number;
  mention?: number;

  constructor(
    id: number,
    permissions: number[],
    allOffers: number,
    isMaster: number,
    AllProjects: number,
    mention: number,
  ) {
    this.id = id;
    this.permissions = permissions;
    this.allOffers = allOffers;
    this.isMaster = isMaster;
    this.AllProjects = AllProjects;
    this.mention = mention;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["employee_id"] = this.id;
    data["permissions"] = this.permissions.map((permission) => {
      if (permission) return { name: permission };
    });
    data["response_status"] = this.allOffers;
    data["is_master"] = this.isMaster;
    data["all_project"] = this.AllProjects;
    data["mention"] = this.mention;
    return data;
  }
}
