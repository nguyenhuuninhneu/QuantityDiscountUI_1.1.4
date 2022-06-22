import axios from "axios";
import config from "../../../config/config";
import * as actions from "./actions";

export const fetchList = (start, end) => {
  return (dispatch, getState) => {
    dispatch(actions.setIsLoadingPage());
    axios.get(config.rootLink + '/FrontEnd/GetReports', {
      params: {
        shop: config.shop,
        startDate: start,
        endDate: end,
        page: 1,
        pagezise: 10,
        token: config.token,

      }
    })
      .then(function (response) {
        const result = response?.data;
        dispatch(actions.fetchListCompleted(result));
      })
      .catch(function (error) {
        const errorMsg = error.message;
        dispatch(actions.fetchListFailed(errorMsg));
      })

  };
};

export const reportDetail = (campaignid, start, end) => {
  return (dispatch, getState) => {
    axios.get(config.rootLink + '/FrontEnd/ReportDetail', {
      params: {
        shop: config.shop,
        startDate: start,
        endDate: end,
        campaignID: campaignid,
        token: config.token,

      }
    })
      .then(function (response) {
        const result = response?.data;
        dispatch(actions.fetchReportDetailCompleted(result));
      })
      .catch(function (error) {
        const errorMsg = error.message;
        dispatch(actions.fetchReportDetailFailed(errorMsg));
      })


  };
};

export default {
  fetchList
};
