import * as types from "./types";
var today = new Date();
var options = { year: 'numeric', month: 'short', day: 'numeric' };

var dateBefore = new Date(today.setDate(today.getDate() - 30))
var strDateBefore = dateBefore.getFullYear() + '-' + (dateBefore.getMonth() < 9 ? '0' + (dateBefore.getMonth() + 1) : dateBefore.getMonth() + 1) + '-' + (dateBefore.getDate() < 10 ? '0' + dateBefore.getDate() : dateBefore.getDate());
var strDateToday = today.getFullYear() + '-' + (today.getMonth() < 9 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate());
const INITIAL_STATE = {
  Dashboard: {
    IsLoadingPage: true,
    IsOpenDateRange: false,
    DateRange: {
      InputValue: 'Dec 18, 2021 - Jan 13, 2022',
      StartDate: strDateBefore,
      StartDateStr: dateBefore.toLocaleDateString("en-US", options),
      EndDate: strDateToday,
      EndDateStr: today.toLocaleDateString("en-US", options),
      // SelectedTypeRange: '0',
      SelectedTypeRange: 1,
    },
    DashboardData: {
      TotalCampaign: 0,
      TotalViewProductPage: 0,
      TotalViewCartPage: 0,
      TotalViewCheckoutPage: 0,
      TotalOrders: 0,
      OrdersAppliedDiscount: 0,
      TotalOrdersAppliedDiscount: 0,
      OrdersAppliedDiscountPercentage: 0,
      ProductsAppliedDiscount: 0,
      TotalProduct: 0,
      TotalProductsAppliedDiscount: 0,
      ProductsAppliedDiscountPercentage: 0,
      TotalDiscount: 0,
      TotalOrderValue: 0,
      FormatMoney: '${{amount}} USD'
    },
    DataChart: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Total orders",
          data: [33, 53, 85, 41, 44, 65],
          fill: false,
          borderColor: "#BABFC3",
          tension: 0.1
        },
        {
          label: "Applied discount orders",
          data: [33, 25, 35, 51, 54, 76],
          fill: true,
          borderColor: "#008060",
          backgroundColor: "#F8F7FD",
          tension: 0.1
        }
      ]
    },
    TimeZone: 'America/New_York'
  },
};


const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_COMPLETED:
      return {
        ...state,
        Dashboard: {
          ...state.Dashboard,
          DashboardData: action.payload.dashboard,
          DataChart: action.payload.datachart,
          TimeZone: action.payload.timezone,
          IsLoadingPage: false,
          IsOpenDateRange: false,
          Currency: action.payload.Currency,
        }
      };

    case types.FETCH_FAILED:
      return {
        ...state,
        Dashboard: {
          ...state.Dashboard,
          IsLoadingPage: false,
          IsOpenDateRange: false
        }
      };
    case types.SET_DASHBOARD:
      return {
        ...state,
        Dashboard: action.payload
      };
    case types.SET_LOADING_PAGE:
      return {
        ...state,
        Dashboard: {
          ...state.Dashboard,
          IsLoadingPage: action.payload,
        }
      };
    default:
      return state;
  }
};

export default reducer;
