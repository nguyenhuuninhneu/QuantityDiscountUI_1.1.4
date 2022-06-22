import axios from "axios";
import config from "../../../config/config";
import utils from "../../../config/utils";
import moreAppConfig from "../../../config/moreAppConfig";
import { setMenu, setIsEditCampaign, setNoCallTwices } from '../app/actions';
import * as actions from "./actions";




export const fetchList = () => {

  return (dispatch, getState) => {
    dispatch(actions.fetchListLoading());
    axios.get(config.rootLink + '/FrontEnd/SearchCampaignPaginate', {
      params: {
        search: '',
        discounttype: 0,
        shop: config.shop,
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
        console.log(errorMsg);
      })

  };
};

export const createCampaign = () => {
  
  return (dispatch, getState) => {
    let timezoneOffset = getState().app.TimezoneOffset == undefined ? 0 : getState().app.TimezoneOffset;
    let dateObj = new Date((new Date()).getTime() + (new Date()).getTimezoneOffset() * 60000 + (timezoneOffset*60*60*1000));
    let month = String(dateObj.getMonth() + 1).padStart(2, '0');
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    let todayStr = year + '-' + month + '-' + day;
    dispatch(actions.setCreateUpdateCampaign(
      {
        ...getState().campaign.CreateUpdateCampaign,
        campaign:
        {
          ID: 0,
          DiscountType: 1,
          PriceType: 1,
          Title: '',
          ShopID: getState().app.Shop?.ID,
          Active: true,
          ListDetails:
            [
              {
                ID: Math.floor(100000000 + Math.random() * 900000000),
                Quantity: 0,
                PercentOrPrice: 0
              },
              {
                ID: Math.floor(100000000 + Math.random() * 900000000),
                Quantity: 0,
                PercentOrPrice: 0
              }
            ],
          ListProducts: [],
          ListCollects: [],
          // ListVariants: getState().campaign.CreateUpdateCampaign.campaign.ListVariants,
          StartDate: todayStr,
          EndDate: todayStr,
          StartDateEdit: todayStr,
          EndDateEdit: todayStr,
          EndDateEditEmpty: '',
          IsSpecificCollect: false,
          IsSpecificProduct: false,
          IsVariantProduct: false,
          AllProducts: false,
          LimitNumberOfTime: false,
          NumberOfTime: 0,
          LimitCustomerLifetime: false,
          OnlyShowDiscountTaggedCustomer: false,
          ListTaggedCustomer: null,
          Step: 1
        },
        EndTimeValidation: null,
        IsOpenSaveResult: false,
        IsOpenSaveToolbar: false,
        IsEndDate: false,
        // IsLoadingPage: true

      }));

  };
}

export const editCampaign = (campaign) => {
  return (dispatch, getState) => {
    dispatch(actions.setCreateUpdateCampaign(
      {
        ...getState().campaign.CreateUpdateCampaign,
        campaign: campaign,
        IsEndDate: campaign.EndDate === 30000101 ? false : true,
        EndTimeValidation: null,
        IsOpenSaveResult: false
      }));
  }
}

export const saveCampaign = (isFirstCampaign = false, isEndDate = false, plannumber = 2) => {
  return (dispatch, getState) => {
    dispatch(actions.setIsSaveLoading(true));
    // dispatch(actions.setIsLoadingPage(true));
    var campaign = getState().campaign.CreateUpdateCampaign.campaign;
    axios.post(config.rootLink + '/FrontEnd/SaveCampaign', {
      campaign: {
        ...campaign,
        ListTaggedCustomer: campaign.ListTaggedCustomerArr !== null && campaign.ListTaggedCustomerArr != undefined && campaign.ListTaggedCustomerArr.length > 0 ? campaign.ListTaggedCustomerArr.join('|||') : [],
        CreatedDate: campaign.CreatedDate !== undefined && campaign.CreatedDate !== null ? new Date(parseFloat(campaign.CreatedDate.replace('/Date(', '').replace(')/', ''))) : new Date(),
        ListVariants: campaign.ListVariants !== undefined && campaign.ListVariants !== null ? campaign.ListVariants.map(function (p) { return { CampaignID: p.CampaignID, ListVariantSelected: p.ListVariantSelected, ProductID: p.ProductID, VariantID: p.VariantID, ID: p.ID } }) : []
      },
      shop: config.shop,
      isFirstCampaign: isFirstCampaign,
      isEndDate: isEndDate,
      plannumber: plannumber,
      token: config.token,
    })
      .then(function (response) {

        const result = response?.data;
        if (result.IsSuccess) {
          dispatch(actions.saveCampaignCompleted(result));
          if (result.isCreate) {
            var listOld = getState().campaign.ListCampaign.campaigns;
            listOld = listOld.push(campaign);
            dispatch(actions.setListCampaign(
              {
                ...getState().campaign.ListCampaign,
                TotalCampaign: getState().campaign.ListCampaign.TotalCampaign + 1,
                WholeCampaignNumber: getState().campaign.ListCampaign.WholeCampaignNumber + 1,
              }));

          }
          if (!result.isFirstCampaign) {
            dispatch(setMenu(moreAppConfig.Menu.MANAGECAMPAIGN));
            dispatch(setIsEditCampaign(false));
            dispatch(setNoCallTwices(false));

          }
          // dispatch(actions.setCreateUpdateCampaign(
          //   {
          //     ...getState().campaign.CreateUpdateCampaign.campaign,
          //     ShopID: result.shopid,
          //   }));
        } else {
          dispatch(actions.saveCampaignFailed(result));
        }

      })
      .catch(function (error) {
        const errorMsg = error.message;
        dispatch(actions.saveCampaignFailed(errorMsg));
      })

  }
}
export const enableAppEmbed = (isEnable) => {
  return (dispatch, getState) => {
    axios.get(config.rootLink + '/FrontEnd/AppEmbed', {
      params: {
        isEnable: isEnable,
        shop: config.shop,
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

export const sendSupportRequest = (yourname, youremail, describe) => {
  return (dispatch, getState) => {
    dispatch(actions.setIsSaveLoading(true));
    axios.post(config.rootLink + '/FrontEnd/SendSupportRequest', {
      shop: config.shop,
      yourname: yourname,
      youremail: youremail,
      describe: describe,
    })
      .then(function (response) {

        const result = response?.data;
        if (result.IsSuccess) {
          dispatch(actions.sendSupportRequestCompleted(result));
        } else {
          dispatch(actions.sendSupportRequestFailed(result));
        }

      })
      .catch(function (error) {
        const errorMsg = error.message;
        dispatch(actions.sendSupportRequestFailed({ IsSuccess: false, Message: errorMsg }));
      })

  }
}
export default {
  fetchList,
  createCampaign,
  saveCampaign,
  enableAppEmbed
};
