import * as types from "./types";

export const fetchCompleted = (data) => {
  return {
    type: types.FETCH_COMPLETED,
    payload: data,
  };
};

export const fetchFailed = (data) => {
  return {
    type: types.FETCH_FAILED,
    payload: data,
  };
};


export const setLimitOrder = (data) => {
  return {
    type: types.SET_LIMIT_ORDER,
    payload: data,
  };
};


export const saveLimitOrderCompleted = (data) => {
  return {
    type: types.SAVE_LIMIT_ORDER_COMPLETED,
    payload: data,
  };
};

export const saveLimitOrderFailed = (data) => {
  return {
    type: types.SAVE_LIMIT_ORDER_FAILED,
    payload: data,
  };
};

export const setIsSaveLoading = (data) => {
  return {
    type: types.SET_ISSAVELOADING,
    payload: data,
  };
};

export const setIsLoadingPage = (data) => {
  return {
    type: types.SET_LOADING_PAGE,
    payload: data,
  };
};

export const setOpenSaveToolBar = (data) => {
  return {
    type: types.SET_OPENSAVETOOLBAR,
    payload: data,
  };
};

