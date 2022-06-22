import axios from "axios";
import config from "../../../config/config";
import * as actions from "./actions";

export const fetchDashboard = (start, end) => {
  return (dispatch, getState) => {
    dispatch(actions.setIsLoadingPage(true));
    axios.get(config.rootLink + '/FrontEnd/Dashboard', {
      params: {
        shop: config.shop,
        startDate: start,
        endDate: end,
        token: config.token,
      }
    })
      .then(function (response) {
        const result = response?.data;
        dispatch(actions.fetchCompleted(result));
      })
      .catch(function (error) {
        const errorMsg = error.message;
        dispatch(actions.fetchFailed(errorMsg));
      })

  };
};

export default {
  fetchDashboard,
};
