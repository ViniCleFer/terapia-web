import { all, takeLatest, call, put } from "redux-saga/effects";
import { toast } from "react-toastify";
import api from "../../../services/api";
import history from "../../../services/history";
import {
  setCompanyData,
  setTanksByCompany,
  setDetailsByTank,
  setSuppliersAction,
  setTemplateBySupplierAction,
  setCompanies,
  setCompanyById,
  setFeeders,
  setContractByCompany,
  setDataChart,
} from "./actions";
import firebase from "../../../config/firebase";

export function* getCompanyInfo({ payload }) {
  try {
    const response = yield call(api.get, `/companies/${payload.company_id}`);
    console.tron.log(response);

    let feedersContract = {};

    const { contracts } = response.data;
    console.tron.log(contracts);

    if (response.status === 200) {
      console.tron.log("log");
      const res = yield call(
        api.get,
        `/contracts/${response.data.contracts[0].id}`
      );
      console.tron.log(res.data.feeders, "feeeder");
      feedersContract = res.data.feeders;

      console.tron.log(feedersContract, "feeeder");

      const data = {
        ...response.data,
        feeders: feedersContract,
      };

      if (res.status === 200) {
        yield put(setCompanyData(data));
      }
    }
  } catch (error) {
    console.log("error");
  }
}

export function* getTanksByCompany({ payload }) {
  const { company } = payload;

  const response = yield call(api.get, `/tanks?companyId=${company}`);

  yield put(setTanksByCompany(response.data));
}

export function* getDetailsByTank({ payload }) {
  console.log("saga");
  try {
    const { tankId } = payload;
    const response = yield call(api.get, `/tanks/${tankId}`);

    yield put(setDetailsByTank(response.data));
  } catch (err) {
    switch (err.status) {
      case 400:
        break;

      default:
        break;
    }
  }
}

export function* getSuppliersAction({ payload }) {
  try {
    const response = yield call(api.get, `/suppliers`);
    console.tron.log(response);
    yield put(setSuppliersAction(response.data));
  } catch (err) {
    switch (err.status) {
      case 400:
        break;

      default:
        break;
    }
  }
}

export function* getTemplateBySupplierAction({ payload }) {
  try {
    const response = yield call(
      api.get,
      `/templates/supplier/${payload.supplierId}`
    );
    console.tron.log(response);

    yield put(setTemplateBySupplierAction(response.data));
  } catch (err) {
    switch (err.status) {
      case 400:
        break;

      default:
        break;
    }
  }
}

export function* startTreatment({ payload }) {
  const {
    contractId,
    tankId,
    qntfish,
    fishweight,
    feederId,
    supplierId,
    templateId,
  } = payload.data;

  try {
    const response = yield call(api.get, `/templates/${templateId}`);
    console.tron.log(response, "romulo", tankId);

    if (response.status === 200) {
      const body = {
        fishCount: qntfish,
        fishWeight: fishweight,
        program: {
          supplierId,
          programDetails: [...response.data.templateDetails],
        },
      };
      console.tron.log(body, "body");

      const res = yield call(api.patch, `/feeders/${feederId}`, {
        contractId,
        tankId,
      });

      if (res.status === 200) {
        const res = yield call(api.post, `/tanks/${tankId}`, body);
        console.tron.log(res, "boaaaaa");
      }
    }

    // yield put(setTemplateBySupplierAction(response.data));
  } catch (err) {
    switch (err.status) {
      case 400:
        break;

      default:
        break;
    }
  }
}

export function* createTank({ payload }) {
  console.log(payload);
  try {
    const { tankId, companyId } = payload;
    const response = yield call(api.get, `/companies/${companyId}`);
    console.log(response);

    if (response.status === 200) {
      try {
        const res = yield call(api.put, `/companies/${companyId}`, {
          id: response.data.id,
          name: response.data.name,
          doc: response.data.doc,
          phone: response.data.phone,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
          contracts: [...response.data.contracts],
          tanks: [
            ...response.data.tanks,
            {
              name: tankId,
            },
          ],
        });

        console.log(res);
      } catch (err) {
        console.log(err.data);
      }
    }

    yield put(setDetailsByTank(response.data));
  } catch (err) {
    switch (err.status) {
      case 400:
        break;

      default:
        break;
    }
  }
}

export function* getCompanies({ payload }) {
  try {
    const response = yield call(api.get, `/companies`);
    console.tron.log(response, "companies");

    yield put(setCompanies(response.data));
  } catch (err) {
    switch (err.status) {
      case 400:
        break;

      default:
        break;
    }
  }
}

export function* creteCompany({ payload }) {
  const { name, doc, phone } = payload;
  try {
    const response = yield call(api.post, `/companies`, {
      name,
      doc,
      phone,
    });
    console.tron.log(response, "createcompany");
  } catch (err) {
    switch (err.status) {
      case 400:
        break;

      default:
        break;
    }
  }
}

export function* getCompanyById({ payload }) {
  const { id } = payload;
  try {
    const response = yield call(api.get, `/companies/${id}`);
    console.tron.log(response);
    yield put(setCompanyById(response.data));
  } catch (err) {
    switch (err.status) {
      case 400:
        break;

      default:
        break;
    }
  }
}

export function* getFeeders({ payload }) {
  try {
    const response = yield call(api.get, `/feeders`);
    console.tron.log(response);
    yield put(setFeeders(response.data));
  } catch (err) {
    switch (err.status) {
      case 400:
        break;

      default:
        break;
    }
  }
}

export function* createFeeder({ payload }) {
  const { uid, serial } = payload;
  try {
    const response = yield call(api.post, `/feeders`, {
      uid,
      serial,
    });
    console.tron.log(response);
  } catch (err) {
    switch (err.status) {
      case 400:
        break;

      default:
        break;
    }
  }
}

export function* getContractByCompany({ payload }) {
  const { companyId } = payload;
  try {
    const response = yield call(api.get, `/contracts/company/${companyId}`);
    yield put(setContractByCompany(response.data));
  } catch (err) {
    switch (err.status) {
      case 400:
        break;

      default:
        break;
    }
  }
}

export function* linkFeederContract({ payload }) {
  const { contractId, feederId } = payload;
  console.tron.log(contractId, feederId);
  try {
    const response = yield call(api.patch, `/feeders/${feederId}`, {
      contractId,
    });

    console.tron.log(response, "res");
  } catch (err) {
    switch (err.status) {
      case 400:
        break;

      default:
        break;
    }
  }
}

export function* createContract({ payload }) {
  const { name, responsible, serviceId, typeId, companyId } = payload;
  console.tron.log(name, responsible, serviceId, typeId, companyId);
  try {
    const response = yield call(api.get, `/companies/${companyId}`);
    console.tron.log(response);

    if (response.status === 200) {
      try {
        const res = yield call(api.put, `/companies/${companyId}`, {
          id: response.data.id,
          name: response.data.name,
          doc: response.data.doc,
          phone: response.data.phone,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
          contracts: [
            ...response.data.contracts,
            {
              number: name,
              type: serviceId,
              service: typeId,
              responsible,
              inactive: false,
            },
          ],
          tanks: [...response.data.tanks],
        });
        console.log(res.data);
      } catch (err) {
        console.log(err.data);
      }
    }

    // yield put(setCompanyById(response.data));
  } catch (err) {
    switch (err.status) {
      case 400:
        break;

      default:
        break;
    }
  }
}

export function* reportDeadFish({ payload }) {
  const { fishnumber, tankId } = payload;
  console.tron.log(fishnumber, tankId);
  try {
    const response = yield call(api.patch, `/tanks/${tankId}`, {
      deadFishes: fishnumber,
    });

    console.tron.log(response, "res");
  } catch (err) {
    switch (err.status) {
      case 400:
        break;

      default:
        break;
    }
  }
}

export function* getDataChart({ payload }) {
  const { treatmentId } = payload;

  try {
    const response = yield call(api.get, `/tanks/snapshot/${treatmentId}`);

    yield put(setDataChart(response.data));
  } catch (err) {
    switch (err.status) {
      case 400:
        break;

      default:
        break;
    }
  }
}

export function* reportBiometry({ payload }) {
  const { fishWeight, tankId } = payload;

  try {
    const response = yield call(api.patch, `/tanks/${tankId}`, {
      fishWeight,
    });

    yield put(setDataChart(response.data));
  } catch (err) {
    switch (err.status) {
      case 400:
        break;

      default:
        break;
    }
  }
}

export default all([
  takeLatest("@company/GET_COMPANY_INFO", getCompanyInfo),
  takeLatest("@company/GET_TANKS_BY_COMPANY", getTanksByCompany),
  takeLatest("@company/GET_DETAILS_BY_TANK", getDetailsByTank),
  takeLatest("@company/CREATE_TANK", createTank),
  takeLatest("@company/GET_SUPPLIERS", getSuppliersAction),
  takeLatest("@company/GET_TEMPLATE_BY_SUPPLIER", getTemplateBySupplierAction),
  takeLatest("@company/START_TREATMENT", startTreatment),
  takeLatest("@company/GET_COMPANIES", getCompanies),
  takeLatest("@company/CREATE_COMPANY", creteCompany),
  takeLatest("@company/GET_COMPANY_BY_ID", getCompanyById),
  takeLatest("@company/CREATE_CONTRACT", createContract),
  takeLatest("@company/GET_FEEDERS", getFeeders),
  takeLatest("@company/CREATE_FEEDER", createFeeder),
  takeLatest("@company/GET_CONTRACT_BY_COMPANY", getContractByCompany),
  takeLatest("@company/LINK_FEEDER_TO_CONTRACT", linkFeederContract),
  takeLatest("@company/REPORT_DEAD_FISH", reportDeadFish),
  takeLatest("@company/GET_DATA_CHART", getDataChart),
  takeLatest("@company/REPORT_BIOMETRY", reportBiometry),
]);
