import CreateUpdateCampaign from "../../../components/campaign/CreateUpdateCampaign";
import moreAppConfig from "../../../config/moreAppConfig";
import * as types from "./types";
// const dateObj = new Date();
// const month = String(dateObj.getMonth() + 1).padStart(2, '0');
// const day = String(dateObj.getDate()).padStart(2, '0');
// const year = dateObj.getFullYear();
// const todayStr = year + '-' + month + '-' + day;

const INITIAL_STATE = {
  ListCampaign: {
    campaigns: null,
    TextSearch: null,
    DiscountType: 0,
    DiscountTypeSelected: { lable: 'Discount based on', value: 0 },
    listLoading: false,
    IsDeleteLoading: false,
    IsPaginateLoading: false,
    Paginate: {
      CurrentItems: [],
      TotalPage: 1,
      Offset: 0,
    },
    TotalCampaign: 0,
    WholeCampaignNumber: 0,
    Process: 100,
    IsFullyLoaded: true,

  },
  CreateUpdateCampaign: {
    Products: null,
    Collections: null,
    InventoryBulkUpdate: null,
    DiscountBulkUpdate: null,
    IsEndDate: false,
    NumberAppliedDiscount: 0,
    campaign: {
      ID: 0,
      Title: '',
      StartDate: '',
      EndDate: '',
      StartDateEdit: '',
      EndDateEdit: '',
      EndDateEditEmpty: '',
      ShopID: 0,
      DiscountType: 1,
      PriceType: 1,
      AllProducts: false,
      Active: true,
      ListDetails: [
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
      ListProductsPost: [],
      ListCollects: [],
      ListVariants: [],
      StartDateStr: '',
      EndDateStr: '',
      IsSpecificCollect: false,
      IsSpecificProduct: false,
      IsVariantProduct: false,
      Step: 1,
      CreatedDate: null,
      LastModifiedDate: null,
      LimitNumberOfTime: false,
      NumberOfTime: 0,
      LimitCustomerLifetime: false,
      OnlyShowDiscountTaggedCustomer: false,
      ListTaggedCustomer: [],
      SetDiscountForMultiple: false,
      Multiple: 1
    },
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
      Currency: "USD",
      TextMinCollection: "You have to choose minimum of {minimum} for the {collection_name}",
      TextMaxCollection: "You can only choose maximum of {maximum} for the {collection_name}",
      TextMaxCollectionTotalPurchased: "You have already bought {total_purchased} of {collection_name} before. You can only buy maximum of {maximum} for the {collection_name}.",
    },
    Setting2: {
      ID: 0,
      ShopID: 0,
      CheckLimitProPage: true,
      CheckLimitCartPage: true,
      AutoUpSale: false,
      TextPurchaseLimit: "Purchase limit",
      TextMinimum: "Minimum",
      TextMaximum: "Maximum",
      TextQuantity: "Quantity",
      TextMinimumLimitText: "You have to choose minimum of {minimum} products",
      TextMaximumLimitText: "You can only choose maximum of {maximum} products",
      TextQuantityMaximumLimitText: "You already have {quantity} of this product in your cart. You can only choose maximum of {maximum} products in total.",
      TextOop: "Oops",
      TextMinMaxRequired: "{product} quantity must be from {minimum} and maximum is {maximum}",
      TextPleaseFix: "Please select a valid number of products before checking out!",
      TextDiscountedPrice: "Discounted price",
      TextUpdateCart: "Update Cart",
      CustomCssAlert: "15",
      CustomJsAlert: "15",
      FontSizeDiscountTitle: "15",
      TextColorDiscountTitle: "#000000",
      TextColorHeading: "#000000",
      BackgroundColorHeading: "#FFFFFF",
      CardTheme: 0,
      FontSizeItemInTable: "15",
      TextColorItemInTable: "#000000",
      BackgroundColorItemInTable: "#FFFFFF",
      TextGet: "get",
      TextOff: "off",
      FontSizeCard: "15",
      TextColorCard: "#000000",
      BackgroundColorCard: "#FFFFFF",
      TextMinimumProductTitle: "You have to choose minimum of {minimum} {product_title}",
      TextMaximumProductTitle: "You can only choose maximum of {maximum} {product_title}",

      TextMinimumCartQuantity: "This discount is applied to the total quantity of products in your cart",
      TextMinimumSameProductQuantity: "This discount is applied to the total quantity of this product in your cart",
      TextMinimumSameProductVariantQuantity: "This discount is applied to the total quantity of the same variant of this product in your cart",
      TextApply: "Apply",
      TextBaseOn: "Base on",
      TextDiscountCode: "Discount code",
      TextDiscountCodeNotAvailable: "Discount code isn’t available",
      FontSizeTitlePurchaseLimit: "16",
      TextColorTitlePurchaseLimit: "#000000",
      FontSizeLimitTable: "14",
      TextColorLimitTable: "#000000",
      BackgroundColorLimitTable: "#F7CA00",
      ShowDiscountedPriceEachCard: false,
      TextDiscountedPriceEachCard: "Total: {total_amount} ({price_per_item}/each)",
      LimitUsageTextMaximumProductsInTotal: "You have already bought {total_purchased} of this product. You can only buy maximum of {maximum} products in total.",
      LimitUsageTextMaximumProductTitle: "You have already bought {total_purchased} {product_title}. You can only buy maximum of {maximum} {product_title}.",
      ShowLimitTableOnCartPage: true,
    },
    TimeZone: 'America/New_York',
    IsEnabledAppLoading: false,
    YourName: '',
    YourEmail: '',
    DescribeYourProblem: '',
    YourNameValidation: null,
    YourEmailValidation: null,
    DescribeYourProblemValidation: null,
    IsOpenSaveToolbar: false,
    IsSaveLoading: false,
    IsOpenSaveResult: false,
    IsLoadingPage: false,
    IsShowSendSupport: false,
    MessageSaveResult: null,
    TitleValidation: null,
    StartTimeValidation: null,
    EndTimeValidation: null,
    ProductValidation: null,
    TextSearchProduct: null,
    CampaignDetailValidation: null,
    CheckTypeDiscountCollectValidation: null,
    CheckTypeDiscountProductValidation: null,
    CheckTypeDiscountVariantValidation: null,
    LimitCustomerLifetimeValidation: null,
    TypeTag: '',
    ListTaggedCustomerValidation: null,

  }
};


const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_LIST_LOADING:
      return {
        ...state,
        ListCampaign: {
          ...state.ListCampaign,
          listLoading: true,
        }
      };

    case types.FETCH_LIST_COMPLETED:
      return {
        ...state,
        ListCampaign: {
          ...state.ListCampaign,
          listLoading: false,
          Paginate: {
            ...state.ListCampaign.Paginate,
            CurrentItems: action.payload.campaigns,
            TotalPage: action.payload.totalpage
          },
          TotalCampaign: action.payload.totalitem,
          WholeCampaignNumber: action.payload.wholecampaignnumber,
        },
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          campaign: {
            ...state.CreateUpdateCampaign.campaign,
            ShopID: action.payload.shopID

          }
        }

      };

    case types.FETCH_LIST_FAILED:
      return {
        ...state,
        ListCampaign: {
          ...state.ListCampaign,
          listLoading: false,
          listFailed: action.payload,
        }

      };
    case types.SET_CREATEUPDATECAMPAIGN:
      return {
        ...state,
        CreateUpdateCampaign: action.payload
      };
    case types.SET_LISTCAMPAIGN:
      return {
        ...state,
        ListCampaign: action.payload
      };
    case types.SET_ISOPENSAVETOOLBAR:
      return {
        ...state,
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          IsOpenSaveToolbar: action.payload,
        }
      };
    case types.SET_ISSAVELOADING:
      return {
        ...state,
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          IsSaveLoading: action.payload,
        }
      };
    case types.SET_SETTING:
      return {
        ...state,
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          Setting: action.payload.setting,
          Setting2: action.payload.setting2,
          TimeZone: action.payload.timezone,
        }
      };
    case types.SET_LOADING_PAGE:
      return {
        ...state,
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          IsLoadingPage: action.payload,
        }
      };
    case types.SAVE_CAMPAIGNCOMPLETED:
      return {
        ...state,
        ListCampaign: {
          ...state.ListCampaign,
          listLoading: false,
          // Paginate: {
          //   Offset: 0,
          //   TotalPage: Math.ceil(action.payload.list.length, moreAppConfig.ItemPerPage),
          //   CurrentItems: [...state.ListCampaign,action.payload.campaign].slice(0, moreAppConfig.ItemPerPage)
          // },
          campaigns: [action.payload.campaign]
        },
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          IsOpenSaveToolbar: action.payload.isFirstCampaign ? true : !action.payload.IsSuccess,
          IsSaveLoading: false,
          IsLoadingPage: false,
          IsShowSendSupport: false,
          IsOpenSaveResult: true,
          IsEndDate: action.payload.isEndDate,
          MessageSaveResult: action.payload.IsSuccess ? 'Your campaign is saved successfully.' : action.payload.Message,
          campaign: {
            ...state.CreateUpdateCampaign.campaign,
            ID: action.payload.IsSuccess ? action.payload.campaign.ID : state.CreateUpdateCampaign.campaign.ID,
            ShopID: action.payload.shopid,
            Step: action.payload.IsSuccess ? action.payload.campaign.Step : 1
          }
        }
      };
    case types.SAVE_CAMPAIGNFAILED:
      return {
        ...state,
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          // IsOpenSaveToolbar: false,
          IsShowSendSupport: false,
          IsSaveLoading: false,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          MessageSaveResult: action.payload.Message,
        }
      };
    case types.SET_TITLEVALIDATION:
      return {
        ...state,
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          TitleValidation: action.payload
        }
      }
    case types.SET_STARTTIMEVALIDATION:
      return {
        ...state,
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          StartTimeValidation: action.payload
        }
      }
    case types.SET_ENDTIMEVALIDATION:
      return {
        ...state,
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          EndTimeValidation: action.payload
        }
      }
    case types.SET_PRODUCTVALIDATION:
      return {
        ...state,
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          ProductValidation: action.payload
        }
      }
    case types.SET_TEXTSEARCHPRODUCT:
      return {
        ...state,
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          TextSearchProduct: action.payload
        }
      }
    case types.SET_TEXTSEARCHPRODUCT:
      return {
        ...state,
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          TextSearchProduct: action.payload
        }
      }
    case types.SET_STEP:
      return {
        ...state,
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          campaign: {
            ...state.CreateUpdateCampaign.campaign,
            Step: action.payload
          }
        }
      };
    case types.ENABLE_APP_EMBED:
      return {
        ...state,
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          Setting: {
            ...state.CreateUpdateCampaign.Setting,
            IsEnableAppEmbed: action.payload.isEnable
          },
          IsEnabledAppLoading: false,
          IsOpenSaveResult: true,
          MessageSaveResult: action.payload.res ? "Successed" : "Failed",
        }

      };
    case types.SEND_SUPPORT_REQUEST_COMPLETED:
      return {
        ...state,
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          IsSaveLoading: false,
          IsLoadingPage: false,
          IsShowSendSupport: false,
          IsOpenSaveResult: !action.payload.IsSuccess,
          MessageSaveResult: action.payload.IsSuccess ? 'Send the support request is saved successfully.' : action.payload.Message,

        }
      };
    case types.SEND_SUPPORT_REQUEST_FAILED:
      return {
        ...state,
        CreateUpdateCampaign: {
          ...state.CreateUpdateCampaign,
          // IsOpenSaveToolbar: false,
          IsShowSendSupport: false,
          IsSaveLoading: false,
          MessageSaveResult: action.payload.Message,
        }
      };
    case types.SET_IS_DELETE_LOADING:
      return {
        ...state,
        ListCampaign: {
          ...state.ListCampaign,
          IsDeleteLoading: action.payload,
        },
      };
    case types.SET_IS_PAGINATE_LOADING:
      return {
        ...state,
        ListCampaign: {
          ...state.ListCampaign,
          IsPaginateLoading: action.payload,
        },

      };
    default:
      return state;
  }
};

export default reducer;
