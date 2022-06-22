import * as types from "./types";

const INITIAL_STATE = {
  Plan: {
    IsLoadingPage: true,
    PlanNumber: 0,
    StartFreeTrial: 0,
    StartFreeTrialAdvanced: 0,
    TypePlan: 0,
    IsOpenChoosePlan: false,
    IsOpenUpgrade: false,
    IsOpenStartFreeTrial: false,
    IsOpenDowngrade: false,
    IsOpenSaveToolbar: false,
    IsSaveLoading: false,
    IsOpenSaveResult: false,
    MessageSaveResult: null,
  },
};


const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_COMPLETED:
      return {
        ...state,
        Plan: {
          ...state.Plan,
          PlanNumber: action.payload.PlanNumber,
          StartFreeTrial: action.payload.StartFreeTrial,
          StartFreeTrialAdvanced: action.payload.StartFreeTrialAdvanced,
          IsLoadingPage: false,
        }
      };

    case types.FETCH_FAILED:
      return {
        ...state,
        Plan: {
          ...state.Plan,
          PlanNumber: 0,
          StartFreeTrial: 0,
          StartFreeTrialAdvanced: 0,
          IsLoadingPage: false,
        }
      };
    case types.SET_PLAN:
      return {
        ...state,
        Plan: action.payload
      };

    case types.SET_FREETRIALCOMPLETED:
      return {
        ...state,
        Plan: {
          ...state.Plan,
          StartFreeTrial: action.payload.StartFreeTrial,
          IsOpenStartFreeTrial: !action.payload.IsSuccess,
          IsOpenSaveToolbar: !action.payload.IsSuccess,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          MessageSaveResult: action.payload.Messenger,
        }

      };
    case types.SET_FREETRIALFAILED:
      return {
        ...state,
        Plan: {
          ...state.Plan,
          IsOpenSaveToolbar: false,
          IsOpenStartFreeTrial: false,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          MessageSaveResult: action.payload.Messenger,
        }
      };
    case types.SET_UPGRADECOMPLETED:
      return {
        ...state,
        Plan: {
          ...state.Plan,
          // PlanNumber: action.payload.PlanNumber,
          IsOpenSaveToolbar: !action.payload.IsSuccess,
          IsOpenUpgrade: !action.payload.IsSuccess,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          MessageSaveResult: action.payload.Messenger,
        }

      };
    case types.SET_UPGRADEFAILED:
      return {
        ...state,
        Plan: {
          ...state.Plan,
          IsOpenSaveToolbar: false,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          IsOpenUpgrade: false,
          MessageSaveResult: action.payload.Messenger,
        }
      };
    case types.SET_DOWNGRADECOMPLETED:
      return {
        ...state,
        Plan: {
          ...state.Plan,
          // PlanNumber: action.payload.PlanNumber,
          IsOpenSaveToolbar: !action.payload.IsSuccess,
          IsOpenDowngrade: !action.payload.IsSuccess,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          MessageSaveResult: action.payload.Messenger,
        }

      };
    case types.SET_DOWNGRADEFAILED:
      return {
        ...state,
        Plan: {
          ...state.Plan,
          IsOpenSaveToolbar: false,
          IsOpenDowngrade: false,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          MessageSaveResult: action.payload.Messenger,
        }
      };
      case types.SET_CHOOSE_PLAN_COMPLETED:
      return {
        ...state,
        Plan: {
          ...state.Plan,
          PlanNumber: action.payload.PlanNumber,
          IsOpenSaveToolbar: !action.payload.IsSuccess,
          IsOpenChoosePlan: !action.payload.IsSuccess,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          MessageSaveResult: action.payload.Messenger,
        }

      };
    case types.SET_CHOOSE_PLAN_FAILED:
      return {
        ...state,
        Plan: {
          ...state.Plan,
          IsOpenSaveToolbar: false,
          IsLoadingPage: false,
          IsOpenSaveResult: true,
          IsOpenChoosePlan: false,
          MessageSaveResult: action.payload.Messenger,
        }
      };
    default:
      return state;
  }
};

export default reducer;
