import axios from "axios";
import config from "../../../config/config";
import moreAppConfig from "../../../config/moreAppConfig";
import * as actions from "./actions";
import * as appAction from "../../modules/app/actions";
import * as settingAction from "../../modules/setting/actions";

export const fetchPlan = () => {
  return (dispatch, getState) => {
    dispatch(actions.setIsLoadingPage(true));
    axios.get(config.rootLink + '/FrontEnd/GetPlan', {
      params: {
        shop: config.shop,
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

export const Upgrade = (upgrade) => {
  return (dispatch, getState) => {
    dispatch(actions.setIsLoadingPage(true));
    axios.post(config.rootLink + '/FrontEnd/Upgrade', {
      shop: config.shop,
      upgrade: upgrade,
      token: config.token,
    })
      .then(function (response) {

        const result = response?.data;
        if (result.IsSuccess) {
          if (result.ConfirmationUrl != '' && result.ConfirmationUrl != undefined) {
            // window.open(result.ConfirmationUrl, "_blank");
            window.location.href = result.ConfirmationUrl;
          }
          if (upgrade) {
            dispatch(actions.setUpgradeCompleted(result));
          }
          //start free trial
          else {
            dispatch(actions.setFreeTrialCompleted(result));

          }
          // dispatch(appAction.setPlanNumber(1))

        } else {
          if (upgrade) {
            dispatch(actions.setUpgradeFailed(result));
          } else {
            dispatch(actions.setUpgradeFailed(result));
          }
        }

      })
      .catch(function (error) {
        const errorMsg = error.message;
        dispatch(actions.setFreeTrialFailed(errorMsg));
      })

  }
}
export const Downgrade = () => {
  return (dispatch, getState) => {
    dispatch(actions.setIsLoadingPage(true));
    axios.post(config.rootLink + '/FrontEnd/Downgrade', {
      shop: config.shop,
      token: config.token,
    })
      .then(function (response) {

        const result = response?.data;
        if (result.IsSuccess) {
          if (result.ConfirmationUrl != '' && result.ConfirmationUrl != undefined) {
            // window.open(result.ConfirmationUrl, "_blank");
            window.location.href = result.ConfirmationUrl;
          }
          dispatch(actions.setDowngradeCompleted(result));
          // dispatch(appAction.setPlanNumber(0))
        } else {
          dispatch(actions.setDowngradeFailed(result));
        }

      })
      .catch(function (error) {
        const errorMsg = error.message;
        dispatch(actions.setDowngradeFailed(errorMsg));
      })

  }
}

export const ChoosePlan = (plannumber) => {
  return (dispatch, getState) => {
    dispatch(actions.setIsLoadingPage(true));
    axios.post(config.rootLink + '/FrontEnd/ChoosePlan', {
      shop: config.shop,
      plannumber: plannumber,
      token: config.token,
    })
      .then(function (response) {

        const result = response?.data;
        if (result.IsSuccess) {
          if (result.ConfirmationUrl != '' && result.ConfirmationUrl != undefined) {
            // window.open(result.ConfirmationUrl, "_blank");
            window.location.href = result.ConfirmationUrl;
          }
          else{
            window.location.reload();
          }
          dispatch(actions.setChoosePlanCompleted(result));
          dispatch(appAction.setPlanNumber(plannumber));

        } else {
          dispatch(actions.setChoosePlanFailed(result));

        }

      })
      .catch(function (error) {
        const errorMsg = error.message;
        dispatch(actions.setChoosePlanFailed(errorMsg));
      })

  }
}
export default {
  fetchPlan,
  Upgrade,
  Downgrade,
  ChoosePlan,
};
