import * as types from "./types";

export const setIsLoadingPage = () => {
  return {
    type: types.SET_LOADING_PAGE,
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

export const setListReport= (data) => {
  return {
    type: types.SET_LISTREPORT,
    payload: data,
  };
};


export const fetchReportDetailCompleted = (data) => {
  return {
    type: types.FETCH_REPORTDETAIL_COMPLETED,
    payload: data,
  };
};

export const fetchReportDetailFailed = (data) => {
  return {
    type: types.FETCH_REPORTDETAIL_FAILED,
    payload: data,
  };
};

