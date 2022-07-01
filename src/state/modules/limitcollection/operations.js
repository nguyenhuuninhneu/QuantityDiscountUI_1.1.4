import axios from "axios";
import config from "../../../config/config";
import * as actions from "./actions";

export const fetchList = () => {
  return (dispatch, getState) => {
    dispatch(actions.fetchListLoading());
    axios.get(config.rootLink + '/FrontEnd/GetLimitCollectionsPaginate', {
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


export const createEditLimitCollection = (limitcollection) => {
  return (dispatch, getState) => {
    dispatch(actions.setCreateUpdateLimitCollection(
      {
        ...getState().limitcollection.CreateUpdateLimitCollection,
        limitcollection: limitcollection,
        IsOpenSaveResult: false
      }));
  }
}

export const saveLimitCollection = () => {
  return (dispatch, getState) => {
    dispatch(actions.setIsSaveLoading(true));
    var limitcollection = getState().limitcollection.CreateUpdateLimitCollection.limitcollection;
    limitcollection.ApplyLimitCustomerLifetime = limitcollection.ApplyLimitCustomerLifetime || false;
    limitcollection.LimitTypeMin = limitcollection.LimitTypeMin || 0;
    limitcollection.LimitTypeMax = limitcollection.LimitTypeMax || 0;
    limitcollection.Min = limitcollection.Min || 0;
    limitcollection.Max = limitcollection.Max || 0;
    axios.post(config.rootLink + '/FrontEnd/SaveLimitCollection', {
      limitCollection: limitcollection,
      shop: config.shop,
    })
      .then(function (response) {

        const result = response?.data;
        if (result.IsSuccess) {
          dispatch(actions.saveLimitCollectionCompleted(result));
        } else {
          dispatch(actions.saveLimitCollectionFailed(result));
        }

      })
      .catch(function (error) {
        const errorMsg = error.message;
        dispatch(actions.saveLimitCollectionFailed(errorMsg));
      })

  }
}
export const saveBulkLimitCollection = () => {
  return (dispatch, getState) => {
    dispatch(actions.setIsSaveLoading(true));
    var bulkUpdate = getState().limitcollection.CreateUpdateLimitCollection.BulkUpdate;
    if (bulkUpdate.Min === null) {
      bulkUpdate.Min = 0;
    }
    if (bulkUpdate.Max === null) {
      bulkUpdate.Max = 0;
    }
    axios.post(config.rootLink + '/FrontEnd/SaveBulkLimitCollection', {
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
          dispatch(actions.saveBulkLimitCollectionCompleted(result));
        } else {
          dispatch(actions.saveBulkLimitCollectionFailed(result));
        }

      })
      .catch(function (error) {
        const errorMsg = error.message;
        dispatch(actions.saveBulkLimitCollectionFailed(errorMsg));
      })

  }
}
export const saveBulkActionCollection = (type) => {
  return (dispatch, getState) => {
    dispatch(actions.setIsSaveLoading(true));
    var listCollect = getState().limitcollection.ListLimitCollection.Paginate.CurrentItems.filter(p=>p.IsChecked).map(p=>p.CollectCode);
    
    axios.post(config.rootLink + '/FrontEnd/BulkActionForLimitCollection', {
      listCollect: listCollect,
      shop: config.shop,
      BulkAction: type,
    })
      .then(function (response) {
        const result = response?.data;
        if (result.IsSuccess) {
          dispatch(actions.saveBulkActionCollectionCompleted(result));
        } else {
          dispatch(actions.saveBulkActionCollectionFailed(result));
        }

      })
      .catch(function (error) {
        const errorMsg = error.message;
        dispatch(actions.saveBulkActionCollectionFailed(errorMsg));
      })

  }
}
export default {
  fetchList,
  createEditLimitCollection,
  saveLimitCollection,
  saveBulkLimitCollection,
  saveBulkActionCollection
};
