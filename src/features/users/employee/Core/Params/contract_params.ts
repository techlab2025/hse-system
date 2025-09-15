import type Params from "@/base/core/params/params";
import { formatJoinDate } from "@/base/persention/utils/date_format";

export default class ContactParams implements Params {
  expirationDate: string;
  contractDate: string;
  appointmentDate: string;
  insurance: string;
  suits: string;
  salary: string;
  housing: string;
  commission: string;
  incentives: string;
  covenantFinance: string;
  annualTickets: string;
  transfers: string;

  constructor(
    expirationDate: string,
    contractDate: string,
    appointmentDate: string,
    insurance: string,
    suits: string,
    salary: string,
    housing: string,
    commission: string,
    incentives: string,
    covenantFinance: string,
    annualTickets: string,
    transfers: string,
  ) {
    this.expirationDate = expirationDate;
    this.contractDate = contractDate;
    this.appointmentDate = appointmentDate;
    this.insurance = insurance;
    this.suits = suits;
    this.salary = salary;
    this.housing = housing;
    this.commission = commission;
    this.incentives = incentives;
    this.covenantFinance = covenantFinance;
    this.annualTickets = annualTickets;
    this.transfers = transfers;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};

    data.expiration_date = this.expirationDate
      ? formatJoinDate(this.expirationDate)
      : null;
    data.contract_date = this.contractDate
      ? formatJoinDate(this.contractDate)
      : null;
    data.appointment_date = this.appointmentDate
      ? formatJoinDate(this.appointmentDate)
      : null;
    data.insurance = this.insurance;
    data.suits = this.suits;
    data.salary = this.salary;
    data.housing = this.housing;
    data.commission = this.commission;
    data.incentives = this.incentives;
    data.covenant_finance = this.covenantFinance;
    data.annual_tickets = this.annualTickets;
    data.transfers = this.transfers;
    // console.log(data);
    return data;
  }
}
