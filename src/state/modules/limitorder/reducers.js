import * as types from "./types";

const INITIAL_STATE = {
  ListLimitOrder: {
    IsLoadingPage: true,
    Setting: {
      ID: 0,
      ShopID: 0,
      Active: true,
      ShowDescription: true,
      ShowDiscountProductPage: true,
      ShowDiscountedPrice: true,
      LayoutInProductPage: 4,
      ShowColumnTotal: true,
      TextQuantityBreaks: "🔥 Buy more, save more! 🔥",
      TextQuantity: "Quantity",
      TextDiscount: "Discount",
      TextDiscountPrice: "Discounted price",
      TextPlus: "+",
      TextPrice: "Price",
      TextBuy: "Buy",
      TextEach: "Each",
      TableFontSizeHeading: "16",
      WidthLayout: 0,
      TablePadding: "10",
      TableBorderSize: "1",
      CustomCssProductPage: "",
      CustomJsProductPage: "",
      UseAjaxCart: true,
      ShowNotiOnCart: true,
      TextNotiOnCart: "Buy {Quantity} + discount {PercentOrPrice}",
      UseDiscountCodeOnCart: true,
      DisCountCodePrefix: "",
      UseUpdateOnCartPage: true,
      CustomCssCart: "",
      CustomJsCart: "",
      IsEnableAppEmbed: false,
      LimitOrderValueStatus: false,
      MinTotalOrderValue: 0,
      MaxTotalOrderValue: 0,
      LimitOrderQuantityStatus: false,
      MinTotalQuantityValue: 0,
      MaxTotalQuantityValue: 0,
      PopupLimitOrderIsNotValid: "Order is not valid",
      LimitOrderTextButtonOK: "OK",
      LimitOrderBackgroundColorButtonOK: "#000000",
      LimitOrderTextColorButtonOK: "#FFFFFF",
      TextMaxSubTotalValue: "You can only choose maximum of {maximum} for the subtotal value",
      TextMinSubTotalValue: "You have to choose minimum of {minimum} for the subtotal value",
      TextMaxProductInTotal: "You can only choose maximum of {maximum} products in total",
      TextMinProductInTotal: "You have to choose minimum of {minimum} products in total",
      PopupLitmitOrderTextColor: "#000000",
      CheckoutLimitOrderIsNotValid: "Order is not valid",
      LimitOrderBackgroundColorButtonCheckout: "#000000",
      LimitOrderTextColorButtonCheckout: "#FFFFFF",
      Currency: 'USD',
      
    },
    
    IsOpenSaveToolbar: false,
    IsSaveLoading: false,
    IsOpenSaveResult: false,
    MessageSaveResult: null,
    MinTotalOrderValidation: null,
    MaxTotalOrderValidation: null,
    MinTotalQuantityValidation: null,
    MaxTotalQuantityValidation: null,
  },
};


const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_COMPLETED:
      return {
        ...state,
        ListLimitOrder: {
          ...state.ListLimitOrder,
          IsLoadingPage: false,
          Setting: action.payload.setting,
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
        ListLimitOrder: {
          ...state.ListLimitOrder,
          IsLoadingPage: false,
        }

      };


    case types.SET_LIMIT_ORDER:
      return {
        ...state,
        ListLimitOrder: action.payload
      };
    case types.SET_ISSAVELOADING:
      return {
        ...state,
        ListLimitOrder: {
          ...state.ListLimitOrder,
          IsSaveLoading: action.payload,
        }
      };
    case types.SET_LOADING_PAGE:
      return {
        ...state,
        ListLimitOrder: {
          ...state.ListLimitOrder,
          IsLoadingPage: action.payload,
        }
      };

    case types.SAVE_LIMIT_ORDER_COMPLETED:
      return {
        ...state,
        ListLimitOrder: {
          ...state.ListLimitOrder,
          Setting: action.payload.setting,
          IsOpenSaveToolbar: !action.payload.IsSuccess,
          IsSaveLoading: false,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          MessageSaveResult: action.payload.IsSuccess ? 'Your Limit order is saved successfully.' : action.payload.Messenger,
        }

      };
    case types.SAVE_LIMIT_ORDER_FAILED:
      return {
        ...state,
        ListLimitOrder: {
          ...state.ListLimitOrder,
          IsOpenSaveToolbar: false,
          IsSaveLoading: false,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          MessageSaveResult: action.payload.Messenger,
        }
      };

    case types.SET_OPENSAVETOOLBAR:
      return {
        ...state,
        ListLimitOrder: {
          ...state.ListLimitOrder,
          IsOpenSaveToolbar: action.payload
        }
      };

    default:
      return state;
  }
};

export default reducer;
