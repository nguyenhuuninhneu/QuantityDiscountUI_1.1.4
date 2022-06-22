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

export const setListCampaign = (data) => {
  return {
    type: types.SET_LISTCAMPAIGN,
    payload: data,
  };
};

export const setCreateUpdateCampaign = (data) => {
  return {
    type: types.SET_CREATEUPDATECAMPAIGN,
    payload: data,
  };
};

export const setIsSaveLoading = (data) => {
  return {
    type: types.SET_ISSAVELOADING,
    payload: data,
  };
};


export const saveCampaignCompleted = (data) => {
  return {
    type: types.SAVE_CAMPAIGNCOMPLETED,
    payload: data,
  };
};


export const saveCampaignFailed = (data) => {
  return {
    type: types.SAVE_CAMPAIGNFAILED,
    payload: data,
  };
};

export const setStep = (data) => {
  return {
    type: types.SET_STEP,
    payload: data,
  };
};
export const setIsLoadingPage = (data) => {
  return {
    type: types.SET_LOADING_PAGE,
    payload: data,
  };
};

export const setSetting = (data) => {
  return {
    type: types.SET_SETTING,
    payload: data,
  };
};

export const enableAppEmbed = (data) => {
  return {
    type: types.ENABLE_APP_EMBED,
    payload: data,
  };
};

export const sendSupportRequestCompleted = (data) => {
  return {
    type: types.SEND_SUPPORT_REQUEST_COMPLETED,
    payload: data,
  };
};


export const sendSupportRequestFailed = (data) => {
  return {
    type: types.SEND_SUPPORT_REQUEST_FAILED,
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
}
// export const fetchCreateCampaignFailed = (data) => {
//   return {
//     type: types.FETCH_CREATE_CAMPAIGN_FAILED,
//     payload: data,
//   };
// };
// export const fetchEditCampaignCompleted = (data, data2) => {
//   return {
//     type: types.FETCH_EDIT_CAMPAIGN_COMPLETED,
//     payload: data,
//     payload2: data2,
//   };
// };

// export const fetchEditCampaignFailed = (data) => {
//   return {
//     type: types.FETCH_EDIT_CAMPAIGN_FAILED,
//     payload: data,
//   };
// };
