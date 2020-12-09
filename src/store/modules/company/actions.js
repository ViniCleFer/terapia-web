// import { firebaseDatabase } from "../../../config/firebase";

export function getCompanyInfo(company_id) {
  return {
    type: "@company/GET_COMPANY_INFO",
    payload: { company_id },
  };
}

export function setCompanyData(company) {
  console.tron.log(company, "company");
  return {
    type: "@company/SET_COMPANY_DATA",
    payload: { company },
  };
}

export function getTanksByCompany(company) {
  return {
    type: "@company/GET_TANKS_BY_COMPANY",
    payload: { company },
  };
}

export function setTanksByCompany(tanks) {
  return {
    type: "@company/SET_TANKS_BY_COMPANY",
    payload: { tanks },
  };
}

export function getDetailsByTank(tankId) {
  return {
    type: "@company/GET_DETAILS_BY_TANK",
    payload: { tankId },
  };
}

export function setDetailsByTank(details) {
  return {
    type: "@company/SET_DETAILS_BY_TANK",
    payload: { details },
  };
}

export function createTank(tankId, companyId) {
  return {
    type: "@company/CREATE_TANK",
    payload: { tankId, companyId },
  };
}

export function getSuppliersAction() {
  return {
    type: "@company/GET_SUPPLIERS",
    payload: {},
  };
}

export function getDataChart(treatmentId) {
  return {
    type: "@company/GET_DATA_CHART",
    payload: { treatmentId },
  };
}

export function setDataChart(chartData) {
  return {
    type: "@company/SET_DATA_CHART",
    payload: { chartData },
  };
}

export function setSuppliersAction(suppliers) {
  return {
    type: "@company/SET_SUPPLIERS",
    payload: { suppliers },
  };
}

export function getTemplateBySupplierAction(supplierId) {
  return {
    type: "@company/GET_TEMPLATE_BY_SUPPLIER",
    payload: { supplierId },
  };
}

export function setTemplateBySupplierAction(template) {
  return {
    type: "@company/SET_TEMPLATE_BY_SUPPLIER",
    payload: { template },
  };
}

export function startTreatment(data) {
  return {
    type: "@company/START_TREATMENT",
    payload: { data },
  };
}

export function getCompanies() {
  return {
    type: "@company/GET_COMPANIES",
    payload: {},
  };
}

export function setCompanies(companies) {
  return {
    type: "@company/SET_COMPANY",
    payload: { companies },
  };
}

export function getFeeders() {
  return {
    type: "@company/GET_FEEDERS",
    payload: {},
  };
}

export function setFeeders(feeders) {
  return {
    type: "@company/SET_FEEDERS",
    payload: { feeders },
  };
}

export function createFeeder(uid, serial) {
  return {
    type: "@company/CREATE_FEEDER",
    payload: { uid, serial },
  };
}

export function createCompany(name, doc, phone) {
  console.tron.log(name, doc, phone);
  return {
    type: "@company/CREATE_COMPANY",
    payload: { name, doc, phone },
  };
}

export function getCompanyById(id) {
  return {
    type: "@company/GET_COMPANY_BY_ID",
    payload: { id },
  };
}

export function setCompanyById(company) {
  return {
    type: "@company/SET_COMPANY_BY_ID",
    payload: { company },
  };
}

export function getContractByCompany(companyId) {
  return {
    type: "@company/GET_CONTRACT_BY_COMPANY",
    payload: { companyId },
  };
}

export function setContractByCompany(contracts) {
  return {
    type: "@company/SET_CONTRACT_BY_COMPANY",
    payload: { contracts },
  };
}

export function linkFeederContract(contractId, feederId) {
  return {
    type: "@company/LINK_FEEDER_TO_CONTRACT",
    payload: { contractId, feederId },
  };
}

export function reportDeadFish(fishnumber, tankId) {
  return {
    type: "@company/REPORT_DEAD_FISH",
    payload: { fishnumber, tankId },
  };
}

export function reportBiometry(fishWeight, tankId) {
  return {
    type: "@company/REPORT_BIOMETRY",
    payload: { fishWeight, tankId },
  };
}

export function createContract(
  name,
  responsible,
  serviceId,
  typeId,
  companyId
) {
  return {
    type: "@company/CREATE_CONTRACT",
    payload: { name, responsible, serviceId, typeId, companyId },
  };
}

// export const getArduinoData = (feederId) => {
//   let firebaseData;
//   return (dispatch) => {
//     firebaseDatabase.ref("/Feeder").on("value", (snapshot) => {
//       firebaseData = snapshot.val();

//       dispatch({
//         type: "@company/SET_ARDUINO_DATA",
//         payload: { firebaseData },
//       });
//     });
//   };
// };
