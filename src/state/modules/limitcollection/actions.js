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

export const setListLimitCollection = (data) => {
  return {
    type: types.SET_LISTLIMITCOLLECTION,
    payload: data,
  };
};

export const setCreateUpdateLimitCollection = (data) => {
  return {
    type: types.SET_CREATEUPDATELIMITCOLLECTION,
    payload: data,
  };
};

export const setIsSaveLoading = (data) => {
  return {
    type: types.SET_ISSAVELOADING,
    payload: data,
  };
};


export const saveLimitCollectionCompleted = (data) => {
  return {
    type: types.SAVE_LIMITCOLLECTIONCOMPLETED,
    payload: data,
  };
};


export const saveLimitCollectionFailed = (data) => {
  return {
    type: types.SAVE_LIMITCOLLECTIONFAILED,
    payload: data,
  };
};

export const saveBulkLimitCollectionCompleted = (data) => {
  return {
    type: types.SAVE_BULKLIMITCOLLECTIONCOMPLETED,
    payload: data,
  };
};


export const saveBulkLimitCollectionFailed = (data) => {
  return {
    type: types.SAVE_BULKLIMITCOLLECTIONFAILED,
    payload: data,
  };
};

export const setHaveLimitCollection = (data) => {
  return {
    type: types.SET_HAVELIMITCOLLECTION,
    payload: data,
  };
};

export const setSetting = (data) => {
  return {
    type: types.SET_SETTING,
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