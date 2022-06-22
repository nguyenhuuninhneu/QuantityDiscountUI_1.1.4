import axios from "axios";
import config from "../../../config/config";
import * as actions from "./actions";

export const fetchSetting = () => {
    return (dispatch, getState) => {
        axios.get(config.rootLink + '/FrontEnd/GetSetting', {
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

export const fetchThemes = () => {
    return (dispatch, getState) => {
        dispatch(actions.setIsLoadingPage(true));
        axios.get(config.rootLink + '/FrontEnd/GetThemes', {
            params: {
                shop: getState().app.Shop?.Domain
            }
        })
            .then(function (response) {
                const result = response?.data;
                dispatch(actions.fetchThemesCompleted(result));
            })
            .catch(function (error) {
                const errorMsg = error.message;
                dispatch(actions.fetchThemesFailed(errorMsg));
            })

    };
};
export const saveActive = () => {
    return (dispatch, getState) => {
        // dispatch(actions.setIsLoadingPage(true));
        dispatch(actions.setIsSaveLoading(true));
        var settingState = getState().setting.ListSetting.Setting;
        axios.post(config.rootLink + '/FrontEnd/ChangeActive', {
            shop: config.shop,
            active: settingState.Active,
            token: config.token,

        })
            .then(function (response) {

                const result = response?.data;
                if (result.IsSuccess) {
                    dispatch(actions.saveActiveCompleted(result));
                } else {
                    dispatch(actions.saveActiveFailed(result));
                }

            })
            .catch(function (error) {
                const errorMsg = error.message;
                dispatch(actions.saveActiveFailed(errorMsg));
            })

    }
}
export const saveSetting = () => {
    return (dispatch, getState) => {
        // dispatch(actions.setIsLoadingPage(true));
        dispatch(actions.setIsSaveLoading(true));
        var settingState = getState().setting.ListSetting;
        axios.post(config.rootLink + '/FrontEnd/SaveSetting', {
            obj: settingState.Setting,
            obj2: settingState.Setting2,
            shop: config.shop,
            token: config.token,
        })
            .then(function (response) {
                const result = response?.data;
                if (result.IsSuccess) {
                    dispatch(actions.saveSettingCompleted(result));

                } else {
                    dispatch(actions.saveSettingFailed(result));
                }

            })
            .catch(function (error) {
                const errorMsg = error.message;
                dispatch(actions.saveSettingFailed(errorMsg));
            })

    }
}
export const installTheme = () => {
    return (dispatch, getState) => {
        dispatch(actions.setIsLoadingPage(true));
        var settingState = getState().setting.ListSetting;
        axios.post(config.rootLink + '/FrontEnd/InstallTheme', {
            shop: getState().app.Shop?.Domain,
            id: parseFloat(settingState.ThemeID)
        })
            .then(function (response) {

                const result = response?.data;
                if (result.IsSuccess) {
                    dispatch(actions.installThemeCompleted(result));

                } else {
                    dispatch(actions.installThemeFailed(result));
                }

            })
            .catch(function (error) {
                const errorMsg = error.message;
                dispatch(actions.installThemeFailed(errorMsg));
            })

    }
}
export const uninstallTheme = () => {
    return (dispatch, getState) => {
        dispatch(actions.setIsLoadingPage(true));
        var settingState = getState().setting.ListSetting;
        axios.post(config.rootLink + '/FrontEnd/UninstallTheme', {
            shop: getState().app.Shop?.Domain,
            id: settingState.ThemeID
        })
            .then(function (response) {

                const result = response?.data;
                if (result.IsSuccess) {
                    dispatch(actions.uninstallThemeCompleted(result));

                } else {
                    dispatch(actions.uninstallThemeFailed(result));
                }

            })
            .catch(function (error) {
                const errorMsg = error.message;
                dispatch(actions.uninstallThemeFailed(errorMsg));
            })

    }
}

export const loadProductByCampaign = (id) => {
    return (dispatch, getState) => {
        axios.get(config.rootLink + '/FrontEnd/GetListProductByCampaign', {
            params: {
                id: id,
                shop: getState().app.Shop?.Domain,
            }
        })
            .then(function (response) {
                const result = response?.data;
                dispatch(actions.loadProductByCampaignCompleted(result));
            })
            .catch(function (error) {
                const errorMsg = error.message;
                dispatch(actions.loadProductByCampaignFailed(errorMsg));
            })

    };
};

export const synchronizeData = () => {
    return (dispatch, getState) => {
        axios.get(config.rootLink + '/FrontEnd/SynchronizeData', {
            params: {
                shop: config.shop,
                token: config.token,
            }
        })
            .then(function (response) {
                const result = response?.data;
                dispatch(actions.synchronizeDataCompleted(result));
            })
            .catch(function (error) {
                const errorMsg = error.message;
                dispatch(actions.synchronizeDataFailed(errorMsg));
            })

    };
};

export const getProcess = (type) => {
    return (dispatch, getState) => {
        axios.get(config.rootLink + '/FrontEnd/GetProcess', {
            params: {
                shop: config.shop,
                type: type,
                token: config.token,
            }
        })
            .then(function (response) {
                const result = response?.data;
                dispatch(actions.getProcessCompleted(result));
            })
            .catch(function (error) {
                const errorMsg = error.message;
                dispatch(actions.getProcessFailed(errorMsg));
            })

    };
};

export const getProcessDiscountCode = (type) => {
    return (dispatch, getState) => {
        axios.get(config.rootLink + '/FrontEnd/GetProcess', {
            params: {
                shop: config.shop,
                type: type,
                token: config.token,
            }
        })
            .then(function (response) {
                const result = response?.data;
                dispatch(actions.getProcessDiscountCodeCompleted(result));
            })
            .catch(function (error) {
                const errorMsg = error.message;
                dispatch(actions.getProcessDiscountCodeFailed(errorMsg));
            })

    };
};
export const synchronizeDiscountFromShopify = () => {
    return (dispatch, getState) => {
        axios.get(config.rootLink + '/FrontEnd/SynchronizeDiscountFromShopify', {
            params: {
                shop: config.shop,
                token: config.token,
            }
        })
            .then(function (response) {
                const result = response?.data;
                dispatch(actions.synchronizeDiscountShopifyCompleted(result));
            })
            .catch(function (error) {
                const errorMsg = error.message;
                dispatch(actions.synchronizeDiscountShopifyFailed(errorMsg));
            })
    };
};
export const enableAppEmbed = (isEnable) => {
    return (dispatch, getState) => {
        axios.get(config.rootLink + '/FrontEnd/AppEmbed', {
            params: {
                isEnable: isEnable,
                shop: config.shop,
                token: config.token
            }
        })
            .then(function (response) {
                const result = response?.data;
                dispatch(actions.enableAppEmbed(result));
            })
            .catch(function (error) {
                const errorMsg = error.message;
                console.log(errorMsg);
                dispatch(actions.enableAppEmbed({ res: false, isEnable: !isEnable }));
            })

    };
};
export default {
    fetchSetting,
    fetchThemes,
    saveActive,
    saveSetting,
    installTheme,
    uninstallTheme,
    loadProductByCampaign,
    synchronizeData,
    synchronizeDiscountFromShopify,
    getProcess,
    enableAppEmbed,
    getProcessDiscountCode
};