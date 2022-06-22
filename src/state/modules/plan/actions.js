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
export const setPlan = (data) => {
  return {
    type: types.SET_PLAN,
    payload: data,
  };
};
export const setFreeTrialCompleted = (data) => {
  return {
    type: types.SET_FREETRIALCOMPLETED,
    payload: data,
  };
};

export const setFreeTrialFailed = (data) => {
  return {
    type: types.SET_FREETRIALFAILED,
    payload: data,
  };
};
export const setUpgradeCompleted = (data) => {
  return {
    type: types.SET_UPGRADECOMPLETED,
    payload: data,
  };
};
export const setUpgradeFailed = (data) => {
  return {
    type: types.SET_UPGRADEFAILED,
    payload: data,
  };
};

export const setDowngradeCompleted = (data) => {
  return {
    type: types.SET_DOWNGRADECOMPLETED,
    payload: data,
  };
};
export const setDowngradeFailed = (data) => {
  return {
    type: types.SET_DOWNGRADEFAILED,
    payload: data,
  };
};

export const setIsLoadingPage = (data) => {
  return {
    type: types.SET_LOADING_PAGE,
    payload: data,
  };
};

export const setChoosePlanCompleted = (data) => {
  return {
    type: types.SET_CHOOSE_PLAN_COMPLETED,
    payload: data,
  };
};

export const setChoosePlanFailed = (data) => {
  return {
    type: types.SET_CHOOSE_PLAN_FAILED,
    payload: data,
  };
};