import * as types from "./types";

export const fetchShopLoading = () => {
  return {
    type: types.FETCH_SHOP_LOADING,
  };
};

export const fetchShopCompleted = (data) => {
  return {
    type: types.FETCH_SHOP_COMPLETED,
    payload: data,
  };
};

export const fetchShopFailed = (data) => {
  return {
    type: types.FETCH_SHOP_FAILED,
    payload: data,
  };
};

export const setIsNoCampaign = (data) => {
  return {
    type: types.SET_IS_NO_CAMPAIGN,
    payload: data,
  };
};
export const setIsCreatingCampaign = (data) => {
  return {
    type: types.SET_IS_CREATING_CAMPAIGN,
    payload: data,
  };
};


export const setMenu = (data) => {
  return {
    type: types.SET_MENU,
    payload: data,
  };
};

export const setIsEditCampaign = (data) => {
  return {
    type: types.SET_IS_EDIT_CAMPAIGN,
    payload: data,
  };
};
export const setNoCallTwices = (data) => {
  return {
    type: types.SET_NO_CALL_TWICES,
    payload: data,
  };
};
export const getProcessCompleted = (data) => {
  return {
    type: types.GET_PROCESS_COMPLETED,
    payload: data,
  };
};

export const getProcessFailed = (data) => {
  return {
    type: types.GET_PROCESS_FAILED,
    payload: data,
  };
};

export const setPlanNumber = (data) => {
  return {
    type: types.SET_PLAN_NUMBER,
    payload: data,
  };
};

export const setURL = (data) => {
  return {
    type: types.SET_URL,
    payload: data,
  };
};

export const setExpandMenu = (data) => {
  return {
    type: types.SET_EXPAND_MENU,
    payload: data,
  };
};