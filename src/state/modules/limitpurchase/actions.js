import * as types from "./types";

export const fetchListLoading = () => {
  return {
    type: types.FETCH_LIST_LOADING,
  };
};

export const fetchListCompleted = (data) => {
  return {
    type: types.FETCH_LIST_COMPLETED,
    payload: data,
  };
};

export const fetchListFailed = (data) => {
  return {
    type: types.FETCH_LIST_FAILED,
    payload: data,
  };
};

export const setListLimitPurchase = (data) => {
  return {
    type: types.SET_LISTLIMITPURCHASE,
    payload: data,
  };
};

export const setCreateUpdateLimitPurchase = (data) => {
  return {
    type: types.SET_CREATEUPDATELIMITPURCHASE,
    payload: data,
  };
};

export const setIsSaveLoading = (data) => {
  return {
    type: types.SET_ISSAVELOADING,
    payload: data,
  };
};


export const saveLimitPurchaseCompleted = (data) => {
  return {
    type: types.SAVE_LIMITPURCHASECOMPLETED,
    payload: data,
  };
};


export const saveLimitPurchaseFailed = (data) => {
  return {
    type: types.SAVE_LIMITPURCHASEFAILED,
    payload: data,
  };
};

export const saveBulkLimitPurchaseCompleted = (data) => {
  return {
    type: types.SAVE_BULKLIMITPURCHASECOMPLETED,
    payload: data,
  };
};


export const saveBulkLimitPurchaseFailed = (data) => {
  return {
    type: types.SAVE_BULKLIMITPURCHASEFAILED,
    payload: data,
  };
};

export const setHaveLimitPurchase = (data) => {
  return {
    type: types.SET_HAVELIMITPURCHASE,
    payload: data,
  };
};

export const getLimitPurchase = (data) => {
  return {
    type: types.GET_LIMITPURCHASE,
    payload: data,
  };
};


export const setIsDeleteLoading = (data) => {
  return {
    type: types.SET_IS_DELETE_LOADING,
    payload: data,
  };
};

export const setIsPaginateLoading = (data) => {
  return {
    type: types.SET_IS_PAGINATE_LOADING,
    payload: data,
  };
};