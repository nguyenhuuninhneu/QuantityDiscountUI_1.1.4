import axios from "axios";
import config from "../../../config/config";
import * as actions from "./actions";

export const fetchExperience = () => {
    return (dispatch, getState) => {
        axios.get(config.rootLink + '/FrontEnd/GetSettingExperience', {
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

export const saveExperience = (email, describe) => {
    return (dispatch, getState) => {
        // dispatch(actions.setIsLoadingPage(true));
        dispatch(actions.setIsSaveLoading(true));
        axios.post(config.rootLink + '/FrontEnd/SaveExperience', {
            email: email,
            describe: describe,
            shop: config.shop,
        })
            .then(function (response) {
                const result = response?.data;
                if (result.IsSuccess) {
                    dispatch(actions.saveExperienceCompleted(result));

                } else {
                    dispatch(actions.saveExperienceFailed(result));
                }

            })
            .catch(function (error) {
                const errorMsg = error.message;
                dispatch(actions.saveExperienceFailed(errorMsg));
            })

    }
}
export default {
    fetchExperience,
    saveExperience,
};