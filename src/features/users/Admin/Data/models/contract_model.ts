export default class ContractModel {
  id: number;
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
    id: number,
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
    this.id = id;
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

  static fromMap(data: any): ContractModel {
    return new ContractModel(
      data.id,
      data.expiration_date,
      data.contract_date,
      data.appointment_date,
      data.insurance,
      data.suits,
      data.salary,
      data.housing,
      data.commission,
      data.incentives,
      data.covenant_finance,
      data.annual_tickets,
      data.transfers,
    );
  }
}
