import axios from "axios";
import config from "../../../config/config";
import * as actions from "./actions";

export const fetchLimitOrder = () => {
    return (dispatch, getState) => {
        axios.get(config.rootLink + '/FrontEnd/GetSettingLimitOrder', {
            params: {
                shop: config.shop,
                token: config.token,

            }
        })
            .then(function (response) {
                const result = response?.data;
                dispatch(actions.fetchCompleted(result));
                // dispatch(loadProductByCampaign(result.ListCampaign[0].ID));
            })
            .catch(function (error) {
                const errorMsg = error.message;
                dispatch(actions.fetchFailed(errorMsg));
            })

        // dispatch(actions.setIsLoadingPage(true));


    };
};

export const saveLimitOrder = () => {
    return (dispatch, getState) => {
        // dispatch(actions.setIsLoadingPage(true));
        dispatch(actions.setIsSaveLoading(true));
        var limitOrderState = getState().limitorder.ListLimitOrder;
        axios.post(config.rootLink + '/FrontEnd/SaveLimitOrder', {
            obj: limitOrderState.Setting,
            shop: config.shop,
            token: config.token,
        })
            .then(function (response) {
                const result = response?.data;
                if (result.IsSuccess) {
                    dispatch(actions.saveLimitOrderCompleted(result));

                } else {
                    dispatch(actions.saveLimitOrderFailed(result));
                }

            })
            .catch(function (error) {
                const errorMsg = error.message;
                dispatch(actions.saveLimitOrderFailed(errorMsg));
            })

    }
}
export default {
    fetchLimitOrder,
    saveLimitOrder,
};