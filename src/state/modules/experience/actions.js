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


export const setExperience = (data) => {
  return {
    type: types.SET_EXPERIENCE,
    payload: data,
  };
};


export const saveExperienceCompleted = (data) => {
  return {
    type: types.SAVE_EXPERIENCE_COMPLETED,
    payload: data,
  };
};

export const saveExperienceFailed = (data) => {
  return {
    type: types.SAVE_EXPERIENCE_FAILED,
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


