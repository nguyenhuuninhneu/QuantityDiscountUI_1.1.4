import * as types from "./types";

const INITIAL_STATE = {
  ListExperience: {
    IsLoadingPage: true,
    Experience: {
      ID: 0,
      ShopID: 0,
      Email: '',
      DescribeExperience: '',
      CreatedDate: null,
      LastModifiedDate: null,
    },
    
    Step: 1,
    IsShowSwitchApp: false,
    IsSaveLoading: false,
    IsOpenSaveResult: false,
    MessageSaveResult: null,
    EmailValidation: null,
    DescribeExperienceValidation: null,
  },
};


const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_COMPLETED:
      return {
        ...state,
        ListExperience: {
          ...state.ListExperience,
          IsLoadingPage: false,
          Experience: action.payload.setting,
          // Setting2: action.payload.setting2,
          // ListCampaign: action.payload.listCampaign,
          // ListProduct: action.payload.listProduct,
          // CampaignID: action.payload.listCampaign.length > 0 ? action.payload.listCampaign[0]?.ID : 0,
          // ProductID: action.payload.listProduct.length > 0 ? action.payload.listProduct[0]?.ProductCode : 0,
          // DiscountDetail: action.payload.discountDetail,
          // TotalDiscountCode: action.payload.discountDetail.length,
        }
      };

    case types.FETCH_FAILED:
      return {
        ...state,
        ListExperience: {
          ...state.ListExperience,
          IsLoadingPage: false,
        }

      };


    case types.SET_EXPERIENCE:
      return {
        ...state,
        ListExperience: action.payload
      };
    case types.SET_ISSAVELOADING:
      return {
        ...state,
        ListExperience: {
          ...state.ListExperience,
          IsSaveLoading: action.payload,
        }
      };
    case types.SET_LOADING_PAGE:
      return {
        ...state,
        ListExperience: {
          ...state.ListExperience,
          IsLoadingPage: action.payload,
        }
      };

    case types.SAVE_EXPERIENCE_COMPLETED:
      return {
        ...state,
        ListExperience: {
          ...state.ListExperience,
          Experience: {
            ...state.ListExperience.Experience,
            Email: '',
            DescribeExperience: '',
          },
          IsShowSwitchApp: false,
          Step: 1,
          IsOpenSaveToolbar: !action.payload.IsSuccess,
          IsSaveLoading: false,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          MessageSaveResult: action.payload.IsSuccess ? 'Your App is moved successfully.' : action.payload.Message,
        }

      };
    case types.SAVE_EXPERIENCE_FAILED:
      return {
        ...state,
        ListExperience: {
          ...state.ListExperience,
          IsOpenSaveToolbar: false,
          IsSaveLoading: false,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          MessageSaveResult: action.payload.Message,
        }
      };

    case types.SET_OPENSAVETOOLBAR:
      return {
        ...state,
        ListExperience: {
          ...state.ListExperience,
          IsOpenSaveToolbar: action.payload
        }
      };

    default:
      return state;
  }
};

export default reducer;
