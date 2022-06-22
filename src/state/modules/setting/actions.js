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

export const fetchThemesCompleted = (data) => {
  return {
    type: types.FETCH_THEMES_COMPLETED,
    payload: data,
  };
};

export const fetchThemesFailed = (data) => {
  return {
    type: types.FETCH_THEMES_FAILED,
    payload: data,
  };
};

export const saveActiveCompleted = (data) => {
  return {
    type: types.SAVE_ACTIVECOMPLETED,
    payload: data,
  };
};

export const saveActiveFailed = (data) => {
  return {
    type: types.SAVE_ACTIVEFAILED,
    payload: data,
  };
};

export const setSetting = (data) => {
  return {
    type: types.SET_SETTING,
    payload: data,
  };
};


export const saveSettingCompleted = (data) => {
  return {
    type: types.SAVE_SETTINGCOMPLETED,
    payload: data,
  };
};

export const saveSettingFailed = (data) => {
  return {
    type: types.SAVE_SETTINGFAILED,
    payload: data,
  };
};

export const setSelectedTab = (data) => {
  return {
    type: types.SET_SELECTED_TAB,
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

export const installThemeCompleted = (data) => {
  return {
    type: types.INSTALL_THEME_COMPLETED,
    payload: data,
  };
};

export const installThemeFailed = (data) => {
  return {
    type: types.INSTALL_THEME_FAILED,
    payload: data,
  };
};

export const uninstallThemeCompleted = (data) => {
  return {
    type: types.UNINSTALL_THEME_COMPLETE,
    payload: data,
  };
};

export const uninstallThemeFailed = (data) => {
  return {
    type: types.UNINSTALL_THEME_FAILED,
    payload: data,
  };
};

export const loadProductByCampaignCompleted = (data) => {
  return {
    type: types.LOAD_PRODUCT_BY_CAMPAIGN_COMPLETED,
    payload: data,
  };
};

export const loadProductByCampaignFailed = (data) => {
  return {
    type: types.LOAD_PRODUCT_BY_CAMPAIGN_FAILED,
    payload: data,
  };
};

export const setOpenSaveToolBar = (data) => {
  return {
    type: types.SET_OPENSAVETOOLBAR,
    payload: data,
  };
};


export const synchronizeDataCompleted = (data) => {
  return {
    type: types.SYNCHRONIZE_DATA_COMPLETED,
    payload: data,
  };
};

export const synchronizeDataFailed = (data) => {
  return {
    type: types.SYNCHRONIZE_DATA_FAILED,
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


export const getProcessDiscountCodeCompleted = (data) => {
  return {
    type: types.GET_PROCESS_DISCOUNT_CODE_COMPLETED,
    payload: data,
  };
};

export const getProcessDiscountCodeFailed = (data) => {
  return {
    type: types.GET_PROCESS_DISCOUNT_CODE_FAILED,
    payload: data,
  };
};
export const synchronizeDiscountShopifyCompleted = (data) => {
  return {
    type: types.SYNCHRONIZE_DISCOUNT_SHOPIFY_COMPLETED,
    payload: data,
  };
};

export const synchronizeDiscountShopifyFailed = (data) => {
  return {
    type: types.SYNCHRONIZE_DISCOUNT_SHOPIFY_FAILED,
    payload: data,
  };
};


export const enableAppEmbed = (data) => {
  return {
    type: types.ENABLE_APP_EMBED,
    payload: data,
  };
};