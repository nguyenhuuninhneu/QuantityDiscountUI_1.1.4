import moreAppConfig from "../../../config/moreAppConfig";
import * as types from "./types";
const INITIAL_STATE = {
  ListLimitCollection: {
    limitcollections: null,
    TextSearchCollection: null,
    Collections: null,
    ListCollectionHaveLimit: [{ label: 'All collections', value: 0 }, { label: 'Collection have limit', value: 1 }],
    CollectionSelected: 0,
    IsLoadingPage: false,
    IsSaveLoading: false,
    IsDeleteLoading: false,
    IsPaginateLoading: false,

    Paginate: {
      CurrentItems: [],
      TotalPage: 1,
      Offset: 0,
    },
    TotalLimitCollection: 0,
    TotalHaveLimitCollection: 0,
  },
  CreateUpdateLimitCollection: {
    BulkUpdate: {
      ListCollects: [],
      Min: 0,
      Max: 0,
      ApplyLimitCustomerLifetime: false
    },
    IsOpenCreateUpdateModal: false,
    limitcollection: {
      ID: 0,
      Title: '',
      Handle: '',
      ShopID: 0,
      CollectID: 0,
      CollectCode: 0,
      Min: 0,
      Max: 0,
      LimitTypeMin: 0,
      LimitTypeMax: 0,
      ApplyLimitCustomerLifetime: false
    },
    IsOpenSaveToolbar: false,
    IsOpenSaveResult: false,
    IsLoadingPage: false,
    MessageSaveResult: null,
    MinValidation: null,
    MaxValidation: null,
    CollectNameValidation: null,
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
};


const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_LIST_LOADING:
      return {
        ...state,
        ListLimitCollection: {
          ...state.ListLimitCollection,
          IsLoadingPage: true,
        }
      };

    case types.FETCH_LIST_COMPLETED:
      return {
        ...state,
        ListLimitCollection: {
          ...state.ListLimitCollection,
          IsLoadingPage: false,
          limitcollections: action.payload.list,
          Collections: action.payload.collects,
          Paginate: {
            Offset: 0,
            TotalPage: action.payload.totalpage,
            CurrentItems: action.payload.list
          },
          TotalLimitCollection: action.payload.totalitem,
          TotalHaveLimitCollection: action.payload.totalitemhavelimit,

        },
        CreateUpdateLimitCollection: {
          ...state.CreateUpdateLimitCollection,
          limitcollection: {
            ...state.CreateUpdateLimitCollection.limitcollection,
            ShopID: action.payload.shopID

          }
        }

      };

    case types.FETCH_LIST_FAILED:
      return {
        ...state,
        ListLimitCollection: {
          ...state.ListLimitCollection,
          IsLoadingPage: false,
          listFailed: action.payload,
        }

      };
    case types.SET_CREATEUPDATELIMITCOLLECTION:
      return {
        ...state,
        CreateUpdateLimitCollection: action.payload
      };
    case types.SET_LISTLIMITCOLLECTION:
      return {
        ...state,
        ListLimitCollection: action.payload
      };
    // case types.SET_ISOPENSAVETOOLBAR:
    //   return {
    //     ...state,
    //     CreateUpdateLimitCollection: {
    //       ...state.CreateUpdateLimitCollection,
    //       IsOpenSaveToolbar: action.payload,
    //     }
    //   };
    case types.SET_ISSAVELOADING:
      return {
        ...state,
        ListLimitCollection: {
          ...state.ListLimitCollection,
          IsSaveLoading: action.payload,
        }
      };
    case types.SET_LOADING_PAGE:
      return {
        ...state,
        CreateUpdateLimitCollection: {
          ...state.CreateUpdateLimitCollection,
          IsLoadingPage: action.payload,
        }
      };
    case types.SAVE_LIMITCOLLECTIONCOMPLETED:
      // var obj = {label: action.payload.limitCollection.Title, value: action.payload.limitCollection.CollectCode};
      // var isExist = state.ListLimitCollection.ListCollectionHaveLimit.filter(p=>p.value == obj.value).length > 0 ;
      return {
        ...state,
        ListLimitCollection: {
          ...state.ListLimitCollection,
          // ListCollectionHaveLimit: isExist ? state.ListLimitCollection.ListCollectionHaveLimit : [...state.ListLimitCollection.ListCollectionHaveLimit, obj],
          IsLoadingPage: false,
          IsSaveLoading: false,

          Paginate: {
            ...state.ListLimitCollection.Paginate,
            CurrentItems: state.ListLimitCollection.Paginate.CurrentItems.map((p, i) => (p.CollectCode == action.payload.limitCollection.CollectCode ? {
              ...p,
              ID: action.payload.limitCollection.ID,
              Min: action.payload.limitCollection.Min,
              Max: action.payload.limitCollection.Max,
              CollectName: action.payload.limitCollection.CollectName,
              LimitTypeMin: action.payload.limitCollection.LimitTypeMin,
              LimitTypeMax: action.payload.limitCollection.LimitTypeMax,
              ApplyLimitCustomerLifetime: action.payload.limitCollection.ApplyLimitCustomerLifetime
            } : p)),
          },
          limitcollections: state.ListLimitCollection.limitcollections.map((p, i) => (p.CollectCode == action.payload.limitCollection.CollectCode ? {
            ...p,
            ID: action.payload.limitCollection.ID,
            Min: action.payload.limitCollection.Min,
            Max: action.payload.limitCollection.Max,
            CollectName: action.payload.limitCollection.CollectName,
            LimitTypeMin: action.payload.limitCollection.LimitTypeMin,
            LimitTypeMax: action.payload.limitCollection.LimitTypeMax,
            ApplyLimitCustomerLifetime: action.payload.limitCollection.ApplyLimitCustomerLifetime
          } : p))
        },
        CreateUpdateLimitCollection: {
          ...state.CreateUpdateLimitCollection,
          IsOpenSaveToolbar: !action.payload.IsSuccess,
          IsOpenSaveResult: true,
          IsOpenCreateUpdateModal: false,
          MessageSaveResult: action.payload.IsSuccess ? 'Limit collection is saved successfully.' : action.payload.Message,
          limitcollection: {
            ...state.CreateUpdateLimitCollection.limitcollection,
            ID: action.payload.IsSuccess ? action.payload.limitCollection.ID : state.CreateUpdateLimitCollection.limitCollection.ID,
            CollectName: action.payload.IsSuccess ? action.payload.limitCollection.CollectName : state.CreateUpdateLimitCollection.limitCollection.CollectName,
          }
        }
      };
    case types.SAVE_LIMITCOLLECTIONFAILED:
      return {
        ...state,
        ListLimitCollection: {
          ...state.ListLimitCollection,
          IsSaveLoading: false,
        },
        CreateUpdateLimitCollection: {
          ...state.CreateUpdateLimitCollection,
          IsOpenSaveToolbar: false,
          IsSaveLoading: false,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          IsOpenCreateUpdateModal: true,
          MessageSaveResult: action.payload.Message,
        }
      };
    case types.SAVE_BULKLIMITCOLLECTIONCOMPLETED:
      // var listCollectionHaveLimitBUlk = action.payload.listCollection.filter(p=> !state.ListLimitCollection.ListCollectionHaveLimit.map(k=> k.value).includes(p.CollectCode));
      // var arr = [];
      // if (listCollectionHaveLimitBUlk != null && listCollectionHaveLimitBUlk != undefined) {
      //   listCollectionHaveLimitBUlk.map((element) => {
      //     arr.push({label: element.TitleCollection, value: element.CollectCode});
      //   });
      // }
      var listCollectCodeAdd = action.payload.listLimitCollectionUpdate.map(k => k.CollectCode);

      // var newArray = state.ListLimitCollection.ListCollectionHaveLimit.concat(arr);
      return {
        ...state,
        ListLimitCollection: {
          ...state.ListLimitCollection,
          // ListCollectionHaveLimit: newArray,
          IsLoadingPage: false,
          Paginate: {
            ...state.ListLimitCollection.Paginate,
            CurrentItems: state.ListLimitCollection.Paginate.CurrentItems.map((p, i) =>
            (listCollectCodeAdd.includes(p.CollectCode) ?
              {
                ...p,
                ID: action.payload.listLimitCollectionUpdate.filter(k => k.CollectCode == p.CollectCode)[0]?.ID,
                Min: action.payload.listLimitCollectionUpdate.filter(k => k.CollectCode == p.CollectCode)[0]?.Min,
                Max: action.payload.listLimitCollectionUpdate.filter(k => k.CollectCode == p.CollectCode)[0]?.Max,
                CollectName: action.payload.listLimitCollectionUpdate.filter(k => k.CollectCode == p.CollectCode)[0]?.CollectName,
                LimitTypeMin: action.payload.listLimitCollectionUpdate.filter(k => k.CollectCode == p.CollectCode)[0]?.LimitTypeMin,
                LimitTypeMax: action.payload.listLimitCollectionUpdate.filter(k => k.CollectCode == p.CollectCode)[0]?.LimitTypeMax,
                ApplyLimitCustomerLifetime: action.payload.listLimitCollectionUpdate.filter(k => k.CollectCode == p.CollectCode)[0]?.ApplyLimitCustomerLifetime
              }
              : p)
            ),
          },
          limitcollections: state.ListLimitCollection.limitcollections.map((p, i) => (listCollectCodeAdd.includes(p.CollectCode) ?
            {
              ...p,
              ID: action.payload.listLimitCollectionUpdate.filter(k => k.CollectCode == p.CollectCode)[0]?.ID,
              Min: action.payload.listLimitCollectionUpdate.filter(k => k.CollectCode == p.CollectCode)[0]?.Min,
              Max: action.payload.listLimitCollectionUpdate.filter(k => k.CollectCode == p.CollectCode)[0]?.Max,
              CollectName: action.payload.listLimitCollectionUpdate.filter(k => k.CollectCode == p.CollectCode)[0]?.CollectName,
              LimitTypeMin: action.payload.listLimitCollectionUpdate.filter(k => k.CollectCode == p.CollectCode)[0]?.LimitTypeMin,
              LimitTypeMax: action.payload.listLimitCollectionUpdate.filter(k => k.CollectCode == p.CollectCode)[0]?.LimitTypeMax,
              ApplyLimitCustomerLifetime: action.payload.listLimitCollectionUpdate.filter(k => k.CollectCode == p.CollectCode)[0]?.ApplyLimitCustomerLifetime,
            }
            : p))
        },
        CreateUpdateLimitCollection: {
          ...state.CreateUpdateLimitCollection,
          IsOpenSaveToolbar: !action.payload.IsSuccess,
          IsSaveLoading: false,
          IsOpenSaveResult: true,
          IsOpenCreateUpdateModal: false,
          BulkUpdate: {
            ListCollects: null,
            Min: 0,
            Max: 0,
            ApplyLimitCustomerLifetime: false
          },
          MessageSaveResult: action.payload.IsSuccess ? 'Bulk action is saved successfully.' : action.payload.Message,
        }
      };
    case types.SAVE_BULKLIMITCOLLECTIONFAILED:
      return {
        ...state,
        CreateUpdateLimitCollection: {
          ...state.CreateUpdateLimitCollection,
          IsOpenSaveToolbar: false,
          IsSaveLoading: false,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          IsOpenCreateUpdateModal: false,
          MessageSaveResult: action.payload.Message,
        }
      };
    case types.SET_HAVELIMITCOLLECTION:
      return {
        ...state,
        ListLimitCollection: {
          ...state.ListLimitCollection,
          TotalHaveLimitCollection: action.payload.totalitemhavelimit,
        }
      };
    case types.SET_SETTING:
      return {
        ...state,
        CreateUpdateLimitCollection: {
          ...state.CreateUpdateLimitCollection,
          Setting: action.payload.setting,
        }
      };
    case types.SET_IS_DELETE_LOADING:
      return {
        ...state,
        ListLimitCollection: {
          ...state.ListLimitCollection,
          IsDeleteLoading: action.payload,
        }
      };
    case types.SET_IS_PAGINATE_LOADING:
      return {
        ...state,
        ListLimitCollection: {
          ...state.ListLimitCollection,
          IsPaginateLoading: action.payload,
        }
      };
    default:
      return state;
  }
};

export default reducer;
