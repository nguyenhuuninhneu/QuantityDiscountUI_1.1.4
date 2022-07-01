import axios from "axios";
import config from "../../../config/config";
import * as actions from "./actions";

export const fetchList = () => {
  return (dispatch, getState) => {
    dispatch(actions.fetchListLoading());
    axios.get(config.rootLink + '/FrontEnd/GetLimitPurchasesPaginate', {
      params: {
        search: '',
        typeselected: 0,
        shop: config.shop,
        page: 1,
        pagezise: 10,
        token: config.token,
      }
    })
      .then(function (response) {
        const result = response?.data;
        dispatch(actions.fetchListCompleted(result));
      })
      .catch(function (error) {
        const errorMsg = error.message;
        dispatch(actions.fetchListFailed(errorMsg));
      })

  };
};

// export const createEditLimitPurchase = (limitpurchase) => {
//   return (dispatch, getState) => {
//     dispatch(actions.setCreateUpdateLimitPurchase(
//       {
//         ...getState().limitpurchase.CreateUpdateLimitPurchase,
//         limitpurchase: limitpurchase,
//         IsOpenSaveResult: false
//       }));
//   }
// }

export const createEditLimitPurchase = (limitpurchase) => {
  return (dispatch, getState) => {
    axios.get(config.rootLink + '/FrontEnd/GetLimitPurchaseByProductID', {
      params: {
        productid: limitpurchase.ProductCode,
        shop : config.shop,
        token: config.token,
      }
    })
      .then(function (response) {
        const result = response?.data;
        dispatch(actions.getLimitPurchase(result));
      })
      .catch(function (error) {
        const errorMsg = error.message;
        dispatch(actions.fetchListFailed(errorMsg));
      })
     

  }
}

export const saveLimitPurchase = () => {
  return (dispatch, getState) => {
    dispatch(actions.setIsSaveLoading(true));
    var limitpurchase = getState().limitpurchase.CreateUpdateLimitPurchase.limitpurchase;
    if (limitpurchase.Min === null) {
      limitpurchase.Min = 0;
    }
    if (limitpurchase.Max === null) {
      limitpurchase.Max = 0;
    }
    if (limitpurchase.ApplyLimitCustomerLifetime === null || limitpurchase.ApplyLimitCustomerLifetime === undefined) {
      limitpurchase.ApplyLimitCustomerLifetime = false;
    }
    if (limitpurchase.IsLimitPurchaseVariant === null || limitpurchase.IsLimitPurchaseVariant === undefined) {
      limitpurchase.IsLimitPurchaseVariant = false;
    }
    if (limitpurchase.IsLimitPurchaseWholeProduct === null || limitpurchase.IsLimitPurchaseWholeProduct === undefined) {
      limitpurchase.IsLimitPurchaseWholeProduct = false;
    }
    axios.post(config.rootLink + '/FrontEnd/SaveLimitPurchase', {
      limitPurchase: limitpurchase,
      shop: config.shop,
      token: config.token,
    })
      .then(function (response) {

        const result = response?.data;
        if (result.IsSuccess) {
          dispatch(actions.saveLimitPurchaseCompleted(result));
        } else {
          dispatch(actions.saveLimitPurchaseFailed(result));
        }

      })
      .catch(function (error) {
        const errorMsg = error.message;
        dispatch(actions.saveLimitPurchaseFailed(errorMsg));
      })

  }
}
export const saveBulkLimitPurchase = () => {
  return (dispatch, getState) => {
    dispatch(actions.setIsSaveLoading(true));
    var bulkUpdate = getState().limitpurchase.CreateUpdateLimitPurchase.BulkUpdate;
    if (bulkUpdate.Min === null) {
      bulkUpdate.Min = 0;
    }
    if (bulkUpdate.Max === null) {
      bulkUpdate.Max = 0;
    }
    if (bulkUpdate.ApplyLimitCustomerLifetime === null || bulkUpdate.ApplyLimitCustomerLifetime === undefined) {
      bulkUpdate.ApplyLimitCustomerLifetime = false;
    }
    axios.post(config.rootLink + '/FrontEnd/SaveBulkLimitPurchase', {
      listCollect: bulkUpdate.ListCollects.map(p => p.CollectID),
      min: bulkUpdate.Min,
      max: bulkUpdate.Max,
      applyLimitCustomerLifetime: bulkUpdate.ApplyLimitCustomerLifetime,
      shop: config.shop,
      token: config.token,
    })
      .then(function (response) {

        const result = response?.data;
        if (result.IsSuccess) {
          dispatch(actions.saveBulkLimitPurchaseCompleted(result));
        } else {
          dispatch(actions.saveBulkLimitPurchaseFailed(result));
        }

      })
      .catch(function (error) {
        const errorMsg = error.message;
        dispatch(actions.saveBulkLimitPurchaseFailed(errorMsg));
      })

  }
}
export const saveBulkActionPurchase = (type) => {
  return (dispatch, getState) => {
    dispatch(actions.setIsSaveLoading(true));
    var listProduct = getState().limitpurchase.ListLimitPurchase.Paginate.CurrentItems.filter(p=>p.IsChecked).map(p=>p.ProductCode);
    var bulkUpdate = getState().limitpurchase.CreateUpdateLimitPurchase.BulkUpdate;
    if (bulkUpdate.Min === null) {
      bulkUpdate.Min = 0;
    }
    if (bulkUpdate.Max === null) {
      bulkUpdate.Max = 0;
    }
    if (bulkUpdate.ApplyLimitCustomerLifetime === null || bulkUpdate.ApplyLimitCustomerLifetime === undefined) {
      bulkUpdate.ApplyLimitCustomerLifetime = false;
    }
    axios.post(config.rootLink + '/FrontEnd/BulkActionForLimitPurchase', {
      listProduct: listProduct,
      shop: config.shop,
      BulkAction: type,
      min: bulkUpdate.Min,
      max: bulkUpdate.Max,
      applyLimitCustomerLifetime: bulkUpdate.ApplyLimitCustomerLifetime,
    })
      .then(function (response) {
        const result = response?.data;
        if (result.IsSuccess) {
          dispatch(actions.saveBulkActionPurchaseCompleted(result));
        } else {
          dispatch(actions.saveBulkActionPurchaseFailed(result));
        }

      })
      .catch(function (error) {
        const errorMsg = error.message;
        dispatch(actions.saveBulkActionPurchaseFailed(errorMsg));
      })

  }
}
export default {
  fetchList,
  createEditLimitPurchase,
  saveLimitPurchase,
  saveBulkLimitPurchase,
  saveBulkActionPurchase
};
