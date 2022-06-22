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

export const setDashboard = (data) => {
  return {
    type: types.SET_DASHBOARD,
    payload: data,
  };
};

export const setIsLoadingPage = (data) => {
  return {
    type: types.SET_LOADING_PAGE,
    payload: data,
  };
};