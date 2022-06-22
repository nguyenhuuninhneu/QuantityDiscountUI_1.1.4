import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, Card, } from '@shopify/polaris';
import { settingOperations } from "../../state/modules/setting";
import Loading from '../.././components/plugins/Loading';
import General from '../.././components/setting/General';
import DiscountFeature from '../.././components/setting/DiscountFeature';
import LimitPurchaseFeaure from '../.././components/setting/LimitPurchaseFeaure';
import LimitOrder from '../.././components/setting/LimitOrder';
import LimitCollection from '../.././components/setting/LimitCollection';
import { setSelectedTab } from '../../state/modules/setting/actions';
import '../../assets/css/setting.css'
import { getProcess } from '../../state/modules/setting/operations';
import Process from '../../components/plugins/Process';
import ReactInterval from 'react-interval';
import { withRouter } from "react-router-dom";
import moreAppConfig from '../../config/moreAppConfig';
import { setURL } from '../../state/modules/app/actions';
import config from '../../config/config';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useHistory
} from "react-router-dom";
const tabs = [
  {
    id: 'general',
    content: 'General'
  },
  {
    id: 'discountfeature',
    content: 'Discount feature'
  },
  {
    id: 'limitorder',
    content: 'Limit order'
  },
  {
    id: 'limitcollection',
    content: 'Limit collection'
  },
  {
    id: 'limitpurchasefeature',
    content: 'Limit product'
  }
]
const tabsNoLimitOrder = [
  {
    id: 'general',
    content: 'General'
  },
  {
    id: 'discountfeature',
    content: 'Discount feature'
  },
  {
    id: 'limitpurchasefeature',
    content: 'Limit product'
  }
]
function Setting(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const settingState = useSelector((state) => state.setting);
  const appState = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(settingOperations.fetchSetting());
    if (appState.URL.includes('general')) {
      dispatch(setSelectedTab(0))
    }
    else if (appState.URL.includes('quantity-discount')) {
      dispatch(setSelectedTab(1))
    }
    else if (appState.URL.includes('settings/limit-order')) {
      dispatch(setSelectedTab(2))
    }
    else if (appState.URL.includes('settings/limit-collection')) {
      dispatch(setSelectedTab(3))
    }
    else if (appState.URL.includes('settings/limit-product-quantity')) {
      dispatch(setSelectedTab(4))
    }
    // else {
    //   // if (appState.PlanNumber === moreAppConfig.PlanNumber.Free) {

    //   //   if (appState.URL.includes('settings/limit-product-quantity')) {
    //   //     dispatch(setSelectedTab(2))
    //   //   }
    //   // }
    //   // else {
    //   //   if (appState.URL.includes('settings/limit-order')) {
    //   //     dispatch(setSelectedTab(2))
    //   //   }
    //   //   else if (appState.URL.includes('settings/limit-product-quantity')) {
    //   //     dispatch(setSelectedTab(3))
    //   //   }
    //   // }
    // }

  }, [dispatch]);
  // appState.PlanNumber === moreAppConfig.PlanNumber.Free ? <General></General> : 
  let content = <Loading></Loading>;
  switch (settingState.ListSetting.selectedTab) {
    case 0:
      content = <General></General>;
      break;
    case 1:
      content = <DiscountFeature></DiscountFeature>;
      break;
    case 2:
      content = <LimitOrder></LimitOrder>;
      break;
    case 3:
      content = <LimitCollection></LimitCollection>;
      break;
    case 4:
      content = <LimitPurchaseFeaure></LimitPurchaseFeaure>;
      break;
    default:
      content = <General></General>;
      break;
  }
  return (
    settingState.IsLoadingPage ? <Loading></Loading> :
      <>
        <ReactInterval timeout={500} enabled={settingState.ListSetting.DisplayProcess}
          callback={() => {
            dispatch(getProcess("Update"))
            // else if(settingState.ListSetting.DisplayProcessShopify){
            //   dispatch(getProcess("UpdateDiscountCode"))
            // }
          }} />
        {
          settingState.ListSetting.DisplayProcess ? <Process Process={settingState.ListSetting.Process}></Process> : null
        }
        {/* appState.PlanNumber === moreAppConfig.PlanNumber.Free ? tabsNoLimitOrder :  */}
        <Tabs
          tabs={tabs}
          selected={settingState.ListSetting.selectedTab}
          onSelect={(selected) => {
            ;
            dispatch(setSelectedTab(selected));
            var urlSet = 'general';
            if (selected == 0) {
              urlSet = 'general';
            }
            else if (selected == 1) {
              urlSet = 'quantity-discount';
            }
            else if (selected == 2) {
              urlSet = 'limit-order';
            }
            else if (selected == 3) {
              urlSet = 'limit-collection';
            }   
            else if (selected == 4) {
              urlSet = 'limit-product-quantity';
            }            // else {
            //   if (appState.PlanNumber === moreAppConfig.PlanNumber.Free) {
            //     if (selected == 2) {
            //       urlSet = 'limit-product-quantity';
            //     }
            //   }
            //   else {
            //     if (selected == 2) {
            //       urlSet = 'limit-order';
            //     }
            //     else if (selected == 3) {
            //       urlSet = 'limit-product-quantity';
            //     }
            //   }
            // }

            history.push('/settings/' + urlSet + '?shop=' + config.shop + '&token=' + config.token);
            dispatch(setURL('settings/' + urlSet));
          }}
        >
          <>

            <div className='setting'>
              {content}
            </div>
          </>
        </Tabs>
      </>

  )
}

export default withRouter(Setting);