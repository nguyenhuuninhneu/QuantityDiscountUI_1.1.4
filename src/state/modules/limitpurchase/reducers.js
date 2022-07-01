import moreAppConfig from "../../../config/moreAppConfig";
import * as types from "./types";
const INITIAL_STATE = {
  ListLimitPurchase: {
    limitpurchases: null,
    TextSearchProduct: null,
    Collections: null,
    ListProductHaveLimit: [{ label: 'All products', value: 0 }, { label: 'Product have limit', value: 1 }],
    ListCollection: [],
    ListCollectionSelected: [],
    TextSearchCollection: '',
    ListLimitPurcharseSelected: [],
    IsCheckAllLimitPurcharse: false,
    IsOpenSearchCollection:false,
    ProductSelected: 0,
    IsLoadingPage: false,
    IsSaveLoading: false,
    IsDeleteLoading: false,
    IsPaginateLoading: false,
    Paginate: {
      CurrentItems: [],
      TotalPage: 1,
      Offset: 0,
    },
    TotalLimitPurchase: 0,
    TotalHaveLimitPurchase: 0,
  },
  CreateUpdateLimitPurchase: {
    BulkUpdate: {
      ListCollects: [],
      Min: 0,
      Max: 0,
      ApplyLimitCustomerLifetime: false
    },
    IsOpenCreateUpdateModal: false,
    IsOpenSetLimitBulkActionModal: false,
    IsOpenBulkActionModal: false,
    IsLoadingCreateUpdate: false,
    limitpurchase: {
      ID: 0,
      Title: '',
      Handle: '',
      ShopID: 0,
      ProductID: 0,
      ProductCode: 0,
      Min: 0,
      Max: 0,
      ApplyLimitCustomerLifetime: false,
      IsLimitPurchaseWholeProduct: true,
      IsLimitPurchaseVariant: false,
      ListLimitPurchaseVariant: [],
      ListVariant: [],
      IsCheckAll: false,
    },
    IsOpenSaveToolbar: false,
    IsOpenSaveResult: false,
    IsLoadingPage: false,
    MessageSaveResult: null,
    MinValidation: null,
    MaxValidation: null,
    VariantValidation: null,
    LimitPurchaseCollectValidation: null,
  }
};


const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_LIST_LOADING:
      return {
        ...state,
        ListLimitPurchase: {
          ...state.ListLimitPurchase,
          IsLoadingPage: true,
        }
      };

    case types.FETCH_LIST_COMPLETED:
      return {
        ...state,
        ListLimitPurchase: {
          ...state.ListLimitPurchase,
          IsLoadingPage: false,
          limitpurchases: action.payload.list,
          Collections: action.payload.collects,
          Paginate: {
            Offset: 0,
            TotalPage: action.payload.totalpage,
            CurrentItems: action.payload.list
          },
          TotalLimitPurchase: action.payload.totalitem,
          TotalHaveLimitPurchase: action.payload.totalitemhavelimit,

        },
        CreateUpdateLimitPurchase: {
          ...state.CreateUpdateLimitPurchase,
          limitpurchase: {
            ...state.CreateUpdateLimitPurchase.limitpurchase,
            ShopID: action.payload.shopID

          }
        }

      };

    case types.FETCH_LIST_FAILED:
      return {
        ...state,
        ListLimitPurchase: {
          ...state.ListLimitPurchase,
          IsLoadingPage: false,
          listFailed: action.payload,
        }

      };
    case types.SET_CREATEUPDATELIMITPURCHASE:
      return {
        ...state,
        CreateUpdateLimitPurchase: action.payload
      };
    case types.SET_LISTLIMITPURCHASE:
      return {
        ...state,
        ListLimitPurchase: action.payload
      };
    // case types.SET_ISOPENSAVETOOLBAR:
    //   return {
    //     ...state,
    //     CreateUpdateLimitPurchase: {
    //       ...state.CreateUpdateLimitPurchase,
    //       IsOpenSaveToolbar: action.payload,
    //     }
    //   };
    case types.SET_ISSAVELOADING:
      return {
        ...state,
        ListLimitPurchase: {
          ...state.ListLimitPurchase,
          IsSaveLoading: action.payload,
        }
      };
    case types.SET_LOADING_PAGE:
      return {
        ...state,
        CreateUpdateLimitPurchase: {
          ...state.CreateUpdateLimitPurchase,
          IsLoadingPage: action.payload,
        }
      };
    case types.SAVE_LIMITPURCHASECOMPLETED:
      // var obj = {label: action.payload.limitPurchase.Title, value: action.payload.limitPurchase.ProductCode};
      // var isExist = state.ListLimitPurchase.ListProductHaveLimit.filter(p=>p.value == obj.value).length > 0 ;
      return {
        ...state,
        ListLimitPurchase: {
          ...state.ListLimitPurchase,
          // ListProductHaveLimit: isExist ? state.ListLimitPurchase.ListProductHaveLimit : [...state.ListLimitPurchase.ListProductHaveLimit, obj],
          IsLoadingPage: false,
          IsSaveLoading: false,

          Paginate: {
            ...state.ListLimitPurchase.Paginate,
            CurrentItems: state.ListLimitPurchase.Paginate.CurrentItems.map((p, i) => (p.ProductCode == action.payload.limitPurchase.ProductCode ? {
              ...p,
              ID: action.payload.limitPurchase.ID,
              Min: action.payload.limitPurchase.Min,
              Max: action.payload.limitPurchase.Max,
              ApplyLimitCustomerLifetime: action.payload.limitPurchase.ApplyLimitCustomerLifetime,
              IsLimitPurchaseWholeProduct: action.payload.limitPurchase.IsLimitPurchaseWholeProduct,
              IsLimitPurchaseVariant: action.payload.limitPurchase.IsLimitPurchaseVariant,
              ListLimitPurchaseVariant: action.payload.limitPurchase.ListLimitPurchaseVariant,
              ListVariant: action.payload.limitPurchase.ListVariant,
              IsCheckAll: action.payload.limitPurchase.IsCheckAll,
            } : p)),
          },
          limitpurchases: state.ListLimitPurchase.limitpurchases.map((p, i) => (p.ProductCode == action.payload.limitPurchase.ProductCode ? {
            ...p,
            ID: action.payload.limitPurchase.ID,
            Min: action.payload.limitPurchase.Min,
            Max: action.payload.limitPurchase.Max,
            ApplyLimitCustomerLifetime: action.payload.limitPurchase.ApplyLimitCustomerLifetime,
            IsLimitPurchaseWholeProduct: action.payload.limitPurchase.IsLimitPurchaseWholeProduct,
            IsLimitPurchaseVariant: action.payload.limitPurchase.IsLimitPurchaseVariant,
            ListLimitPurchaseVariant: action.payload.limitPurchase.ListLimitPurchaseVariant,
            ListVariant: action.payload.limitPurchase.ListVariant,
            IsCheckAll: action.payload.limitPurchase.IsCheckAll,
          } : p))
        },
        CreateUpdateLimitPurchase: {
          ...state.CreateUpdateLimitPurchase,
          IsOpenSaveToolbar: !action.payload.IsSuccess,
          IsOpenSaveResult: true,
          IsLoadingCreateUpdate: true,
          IsOpenCreateUpdateModal: false,
          MessageSaveResult: action.payload.IsSuccess ? 'Limit purchase is saved successfully.' : action.payload.Message,
          limitpurchase: {
            ...state.CreateUpdateLimitPurchase.limitpurchase,
            ID: action.payload.IsSuccess ? action.payload.limitPurchase.ID : state.CreateUpdateLimitPurchase.limitPurchase.ID,
          }
        }
      };
    case types.SAVE_LIMITPURCHASEFAILED:
      return {
        ...state,
        ListLimitPurchase: {
          ...state.ListLimitPurchase,
          IsSaveLoading: false,
        },
        CreateUpdateLimitPurchase: {
          ...state.CreateUpdateLimitPurchase,
          IsOpenSaveToolbar: false,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          IsOpenCreateUpdateModal: false,
          MessageSaveResult: action.payload.Message,
        }
      };
    case types.SAVE_BULKLIMITPURCHASECOMPLETED:
      // var listProductHaveLimitBUlk = action.payload.listProduct.filter(p=> !state.ListLimitPurchase.ListProductHaveLimit.map(k=> k.value).includes(p.ProductCode));
      // var arr = [];
      // if (listProductHaveLimitBUlk != null && listProductHaveLimitBUlk != undefined) {
      //   listProductHaveLimitBUlk.map((element) => {
      //     arr.push({label: element.TitleProduct, value: element.ProductCode});
      //   });
      // }
      var listProductCodeAdd = action.payload.listLimitPurchaseUpdate.map(k => k.ProductID);

      // var newArray = state.ListLimitPurchase.ListProductHaveLimit.concat(arr);
      return {
        ...state,
        ListLimitPurchase: {
          ...state.ListLimitPurchase,
          // ListProductHaveLimit: newArray,
          IsLoadingPage: false,
          IsSaveLoading: false,
          Paginate: {
            ...state.ListLimitPurchase.Paginate,
            CurrentItems: state.ListLimitPurchase.Paginate.CurrentItems.map((p, i) =>
            (listProductCodeAdd.includes(p.ProductCode) ?
              {
                ...p,
                ID: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.ID,
                Min: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.Min,
                Max: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.Max,
                ApplyLimitCustomerLifetime: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.ApplyLimitCustomerLifetime,
                IsLimitPurchaseWholeProduct: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.IsLimitPurchaseWholeProduct
              }
              : p)
            ),
          },
          limitpurchases: state.ListLimitPurchase.limitpurchases.map((p, i) => (listProductCodeAdd.includes(p.ProductCode) ?
            {
              ...p,
              ID: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.ID,
              Min: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.Min,
              Max: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.Max,
              ApplyLimitCustomerLifetime: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.ApplyLimitCustomerLifetime,
              IsLimitPurchaseWholeProduct: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.IsLimitPurchaseWholeProduct,
            }
            : p))
        },
        CreateUpdateLimitPurchase: {
          ...state.CreateUpdateLimitPurchase,
          IsOpenSaveToolbar: !action.payload.IsSuccess,
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
    case types.SAVE_BULKLIMITPURCHASEFAILED:
      return {
        ...state,
        ListLimitPurchase: {
          ...state.ListLimitPurchase,
          IsSaveLoading: false,
        },
        CreateUpdateLimitPurchase: {
          ...state.CreateUpdateLimitPurchase,
          IsOpenSaveToolbar: false,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          IsOpenCreateUpdateModal: false,
          MessageSaveResult: action.payload.Message,
        }
      };
    case types.SAVE_BULKACTIONPURCHASECOMPLETED:
      var listProductCodeAdd = action.payload.listProduct;
      var CurrentItems = [];
      var ListLimit = [];
      switch (action.payload.BulkAction) {
        case moreAppConfig.BulkAction.SetLimitPurchase:
          CurrentItems = state.ListLimitPurchase.Paginate.CurrentItems.map((p, i) =>
          (listProductCodeAdd.includes(p.ProductCode) ?
            {
              ...p,
              ID: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.ID,
              Min: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.Min,
              Max: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.Max,
              ApplyLimitCustomerLifetime: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.ApplyLimitCustomerLifetime,
              IsLimitPurchaseWholeProduct: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.IsLimitPurchaseWholeProduct,
              IsChecked: false,
            }
            : p)
          );
          ListLimit = state.ListLimitPurchase.limitpurchases.map((p, i) => (listProductCodeAdd.includes(p.ProductCode) ?
            {
              ...p,
              ID: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.ID,
              Min: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.Min,
              Max: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.Max,
              ApplyLimitCustomerLifetime: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.ApplyLimitCustomerLifetime,
              IsLimitPurchaseWholeProduct: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.IsLimitPurchaseWholeProduct,
              IsChecked: false,
            }
            : p));
          break;
        case moreAppConfig.BulkAction.DisabledSelected:
          CurrentItems = state.ListLimitPurchase.Paginate.CurrentItems.map((p, i) =>
          (listProductCodeAdd.includes(p.ProductCode) ?
            {
              ...p,
              ID: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.ID,
              IsEnabled: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.IsEnabled,
              IsChecked: false,
            }
            : p)
          );
          ListLimit = state.ListLimitPurchase.limitpurchases.map((p, i) => (listProductCodeAdd.includes(p.ProductCode) ?
            {
              ...p,
              ID: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.ID,
              IsEnabled: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.IsEnabled,
              IsChecked: false,
            }
            : p));
          break;
        case moreAppConfig.BulkAction.EnabledSelected:
          CurrentItems = state.ListLimitPurchase.Paginate.CurrentItems.map((p, i) =>
          (listProductCodeAdd.includes(p.ProductCode) ?
            {
              ...p,
              ID: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.ID,
              IsEnabled: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.IsEnabled,
              IsChecked: false,
            }
            : p)
          );
          ListLimit = state.ListLimitPurchase.limitpurchases.map((p, i) => (listProductCodeAdd.includes(p.ProductCode) ?
            {
              ...p,
              ID: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.ID,
               IsEnabled: action.payload.listLimitPurchaseUpdate.filter(k => k.ProductID == p.ProductCode)[0]?.IsEnabled,
               IsChecked: false,
            }
            : p));
          break;
        case moreAppConfig.BulkAction.DeleteAllSelected:
          CurrentItems = state.ListLimitPurchase.Paginate.CurrentItems.map((p, i) =>
          (listProductCodeAdd.includes(p.ProductCode) ?
            {
              ...p,
              ID: null,
              Min: null,
              Max: null,
              ApplyLimitCustomerLifetime: false,
              IsLimitPurchaseWholeProduct: true,
              IsLimitPurchaseVariant: false,
              IsChecked: false,
            }
            : p)
          );
          ListLimit = state.ListLimitPurchase.limitpurchases.map((p, i) => (listProductCodeAdd.includes(p.ProductCode) ?
            {
              ...p,
              ID: null,
              Min: null,
              Max: null,
              ApplyLimitCustomerLifetime: false,
              IsLimitPurchaseWholeProduct: true,
              IsLimitPurchaseVariant: false,
              IsChecked: false,
            }
            : p));
          break;
        default:
          break;
      }
      return {
        ...state,
        ListLimitPurchase: {
          ...state.ListLimitPurchase,
          // ListProductHaveLimit: newArray,
          IsLoadingPage: false,
          IsSaveLoading: false,
          IsCheckAllLimitPurcharse: false,
          Paginate: {
            ...state.ListLimitPurchase.Paginate,
            CurrentItems: CurrentItems,
          },
          limitpurchases: ListLimit
        },
        CreateUpdateLimitPurchase: {
          ...state.CreateUpdateLimitPurchase,
          IsOpenSaveToolbar: !action.payload.IsSuccess,
          IsOpenSaveResult: true,
          IsOpenCreateUpdateModal: false,
          IsOpenSetLimitBulkActionModal: false,
          IsOpenBulkActionModal: false,
          BulkUpdate: {
            ListCollects: null,
            Min: 0,
            Max: 0,
            ApplyLimitCustomerLifetime: false
          },
          MessageSaveResult: action.payload.IsSuccess ? 'Bulk action is saved successfully.' : action.payload.Message,
        }
      };
    case types.SAVE_BULKACTIONPURCHASEFAILED:
      return {
        ...state,
        ListLimitPurchase: {
          ...state.ListLimitPurchase,
          IsSaveLoading: false,
        },
        CreateUpdateLimitPurchase: {
          ...state.CreateUpdateLimitPurchase,
          IsOpenSaveToolbar: false,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          IsOpenCreateUpdateModal: false,
          MessageSaveResult: action.payload.Message,
        }
      };


    case types.SET_HAVELIMITPURCHASE:
      return {
        ...state,
        ListLimitPurchase: {
          ...state.ListLimitPurchase,
          TotalHaveLimitPurchase: action.payload.totalitemhavelimit,
        }
      };
    case types.GET_LIMITPURCHASE:
      var limitpurchase = action.payload.limitpurchase;
      limitpurchase.ListVariant = action.payload.listVariant.map((p, i) => (action.payload.limitpurchase.ListLimitPurchaseVariant.map(p => p.VariantID).includes(p.VariantID) ? {
        ...p,
        IsDisabled: false,
      } : {
        ...p,
        IsDisabled: true,
      }));

      return {
        ...state,
        CreateUpdateLimitPurchase: {
          ...state.CreateUpdateLimitPurchase,
          IsOpenCreateUpdateModal: true,
          IsLoadingCreateUpdate: false,
          limitpurchase: limitpurchase,
          VariantValidation: '',
        }

      };
    case types.SET_IS_DELETE_LOADING:
      return {
        ...state,
        ListLimitPurchase: {
          ...state.ListLimitPurchase,
          IsDeleteLoading: action.payload,
        },
      };
    case types.SET_IS_PAGINATE_LOADING:
      return {
        ...state,
        ListLimitPurchase: {
          ...state.ListLimitPurchase,
          IsPaginateLoading: action.payload,
        },

      };

    default:
      return state;
  }
};

export default reducer;
