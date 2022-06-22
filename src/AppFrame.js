import './App.css';
import './assets/css/App.css';
import React, { useEffect, useState } from 'react';

import { Icon, Button, Modal, TextField, Toast } from '@shopify/polaris';
import { AnalyticsMajor, QuestionMarkMajor, CircleRightMajor, ChevronDownMinor, ChevronRightMinor, LockMajor } from '@shopify/polaris-icons';
import moreAppConfig from './config/moreAppConfig';
import Loading from './components/plugins/Loading';
import { appOperations } from "./state/modules/app";
import { useSelector, useDispatch } from "react-redux";
import ListCampaign from './components/campaign/ListCampaign';
import CreateUpdateCampaign from './components/campaign/CreateUpdateCampaign';
import { setIsCreatingCampaign, setIsNoCampaign, setMenu, setIsEditCampaign, setNoCallTwices, setURL, setExpandMenu } from './state/modules/app/actions';
import { createCampaign, fetchList } from './state/modules/campaign/operations';
import { ChoosePlan } from './state/modules/plan/operations';
import { saveExperience } from './state/modules/experience/operations';
import { setCreateUpdateCampaign } from './state/modules/campaign/actions';
import { setSetting } from './state/modules/setting/actions';
import { setLimitOrder } from './state/modules/limitorder/actions';
import { setExperience } from './state/modules/experience/actions';
import { setPlan } from './state/modules/plan/actions';
import { setCreateUpdateLimitPurchase } from './state/modules/limitpurchase/actions';
import Dashboard from './components/dashboard/Dashboard';
import Report from './components/dashboard/Report';
import LimitPurchase from './components/limitpurchase/LimitPurchase';
import LimitCollection from './components/limitcollection/LimitCollection';
import Plan from './components/plan/Plan';
import Setting from './components/setting/Setting';
import URLNotFound from './components/plugins/URLNotFound';
import LimitOrder from './components/limitorder/LimitOrder';
import Suggestion from './components/suggestion/Suggestion';
import IconSettingsMajor from './assets/images/ico_settings_major.svg';
import IconImagesMajor from './assets/images/ico_images_major.svg';
import IconLimitPurchaseMajor from './assets/images/ico_limit_purchase.svg';
import IconDiscountCodeMajor from './assets/images/ico_discount_code_major.svg';
import IconAnalyticsMajor from './assets/images/ico_analytics_major.svg';
import IconTransactionMajor from './assets/images/ico_transaction_major.svg';
import IconPlanTag from './assets/images/ico_plan_tag.png';
import IconAddMajor from './assets/images/add_major.svg';
import IconComposeMajor from './assets/images/compose_major.svg';
import Switch1 from './assets/images/Switch1.png';
import Switch2 from './assets/images/Switch2.png';
import { getProcess } from './state/modules/app/operations';
import Process from './components/plugins/Process';
import ReactInterval from 'react-interval';
import config from './config/config';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useHistory
} from "react-router-dom";
import axios from 'axios';

const AppFrame = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const appState = useSelector((state) => state.app);
  const campaignListState = useSelector((state) => state.campaign.ListCampaign);
  const campaignState = useSelector((state) => state.campaign.CreateUpdateCampaign);
  const settingState = useSelector((state) => state.setting.ListSetting);
  const limitOrderState = useSelector((state) => state.limitorder.ListLimitOrder);
  const planState = useSelector((state) => state.plan.Plan);
  const limitPurchaseState = useSelector((state) => state.limitpurchase.ListLimitPurchase);
  const limitCollectionState = useSelector((state) => state.limitcollection.ListLimitCollection);
  const createLimitPurchaseState = useSelector((state) => state.limitpurchase.CreateUpdateLimitPurchase);
  const experienceState = useSelector((state) => state.experience.ListExperience);
  const [isShowPopupUpgrade, setIsShowPopupUpgrade] = useState(false);
  const [isShowPopupUpgradeCreateCampaign, setIsShowPopupUpgradeCreateCampaign] = useState(false);
  const [isShowSuggestion, setIsShowSuggestion] = useState(false);
  useEffect(() => {
    dispatch(appOperations.fetchShop());
    if (config.token != '1') {
      loadChatPlugin();
    }

    if (appState.URL.includes('update-campaign')) {
      dispatch(setIsEditCampaign(true))
    }
  }, [dispatch]);
  const setActiveMenu = (menu) => {

    dispatch(setIsEditCampaign(false))
    //ResetStateHideMessageBar();
    if (menu !== moreAppConfig.Menu.CREATECAMPAIGN) {
      dispatch(setNoCallTwices(false));
      if (campaignListState.TotalCampaign > 0) {
        dispatch(setIsNoCampaign(false))
      }
    }
    window.localStorage.setItem('menu', menu);
    dispatch(setMenu(menu));

  }
  const ResetStateHideMessageBar = () => {
    dispatch(setCreateUpdateCampaign({
      ...campaignState,
      IsOpenSaveResult: false
    }))
    dispatch(setSetting({
      ...settingState,
      IsOpenSaveResult: false
    }))
    dispatch(setLimitOrder({
      ...limitOrderState,
      IsOpenSaveResult: false
    }))
    dispatch(setPlan({
      ...planState,
      IsOpenSaveResult: false,
    }))
    dispatch(setCreateUpdateLimitPurchase({
      ...createLimitPurchaseState,
      IsOpenSaveResult: false
    }))
  }
  const ResetCallTwiceAndCreateCampaign = () => {
    dispatch(setNoCallTwices(false));
    dispatch(setIsEditCampaign(false));
    dispatch(setIsCreatingCampaign(true));
    dispatch(createCampaign());
  }

  const loadChatPlugin = () => {
    const script2 = document.createElement("script");
    script2.innerHTML = `
    window.$crisp=[];window.CRISP_WEBSITE_ID="07faab23-2cce-4034-93cd-5361030881aa";CRISP_TOKEN_ID = btoa("${config.shop}");
    (function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
    $crisp.push(["set", "user:nickname", ["${config.shop}"]]);
    $crisp.push(["set", "session:segments", [["QuantityDiscountTest"]]]);` ;
    document.body.appendChild(script2);

  }

  function ValidFormSwitchApp() {
    var isValidEmail = true;
    var isValidDescribe = true;
    var strValidEmail = '';
    var strValidDescribe = '';
    if (experienceState.Experience.Email.toString() == '' || experienceState.Experience.Email.toString() === null) {
      strValidEmail = 'Email is required';
      isValidEmail = false;
    } else {
      // var regexMail = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(experienceState.Experience.Email)
      // if (!regexMail) {
      //   strValidEmail = 'Email is not valid';
      //   isValidEmail = false;
      // }
    }
    if (experienceState.Experience.DescribeExperience.toString() == '' || experienceState.Experience.DescribeExperience.toString() === null) {
      strValidDescribe = 'Describe is required';
      isValidDescribe = false;
    }
    if (!isValidEmail || !isValidDescribe) {
      dispatch(setExperience({
        ...experienceState,
        EmailValidation: strValidEmail,
        DescribeExperienceValidation: strValidDescribe
      }))
      return false;
    }
    return true;
  }
  function ReloadExpandMenu(key, expand) {
    var newValue = appState.ExpandMenu || ',';
    if (!expand) {
      newValue += ',' + key + ',';
    }
    else {
      if (newValue !== null && newValue !== undefined && newValue.includes(',' + key + ',')) {
        newValue = newValue.replace(',' + key + ',', '');
      }
    }

    dispatch(setExpandMenu(newValue))
    window.localStorage.setItem('expand_menu', newValue);
  }
  return (
    <>
      {/* <div style={(appState.Menu == moreAppConfig.Menu.CREATECAMPAIGN && campaignState.IsOpenSaveToolbar) || (appState.Menu == moreAppConfig.Menu.SETTING && settingState.IsOpenSaveToolbar) || (appState.Menu == moreAppConfig.Menu.LIMITORDER && limitOrderState.IsOpenSaveToolbar) ? { marginTop: '65px' } : {}}></div> */}
      <div style={((appState.URL.includes('create-campaign') || appState.URL.includes('update-campaign')) && campaignState.IsOpenSaveToolbar) || (appState.URL.includes('settings') && settingState.IsOpenSaveToolbar) || (appState.URL.includes('limit-order') && limitOrderState.IsOpenSaveToolbar) ? { marginTop: '65px' } : {}}></div>
      <div className='orichi-quantity-discount'>

        <>
          <div className='menuLeft'>
            <div className="Polaris-Navigation__PrimaryNavigation Polaris-Scrollable Polaris-Scrollable--vertical" data-polaris-scrollable="true" style={{ paddingTop: 0 }}>
              <ul className="Polaris-Navigation__Section" style={{ height: (window.innerHeight - 10) + 'px', position: 'relative' }}>
                <li className="Polaris-Navigation__ListItem menu-top">
                  <div className="Polaris-Navigation__ItemWrapper">
                    <> <div onClick={() => {
                      // if (appState.PlanNumber !== moreAppConfig.PlanNumber.Advanced) {
                      //   setIsShowPopupUpgrade(true)
                      // }
                      // else {
                      //   ResetCallTwiceAndCreateCampaign();
                      //   history.push('/dashboard?shop=' + config.shop + '&token=' + config.token);
                      //   dispatch(setURL('dashboard'));
                      //   setActiveMenu(moreAppConfig.Menu.DASHBOARD)
                      // }
                    }}
                      className="Polaris-Navigation__Item Polaris-Navigation--subNavigationActive menu-top-hover" style={{ alignItems: 'center' }}
                      data-polaris-unstyled="true">
                      <div className="Polaris-Navigation__Icon" style={{ width: '50px' }}>
                        <img src={IconPlanTag} alt="" className='img-tag-plan' />
                      </div>
                      <span className="Polaris-Navigation__Text">Your plan
                        <span className="Polaris-Navigation__Text free-menu-text">{
                          appState.PlanNumber === moreAppConfig.PlanNumber.Free ? 'Free' : appState.PlanNumber === moreAppConfig.PlanNumber.Basic ? 'Basic' : appState.PlanNumber === moreAppConfig.PlanNumber.Advanced ? 'Advanced' : 'Free'
                        } </span>
                      </span>
                      {
                        appState.PlanNumber === moreAppConfig.PlanNumber.Free || appState.PlanNumber === moreAppConfig.PlanNumber.Basic ? <>
                          <Button onClick={() => {
                            // dispatch(setPlan({
                            //   ...planState,
                            //   IsOpenChoosePlan: true,
                            //   TypePlan: moreAppConfig.PlanNumber.Free
                            // }))
                            history.push('/plan?shop=' + config.shop + '&token=' + config.token);
                            dispatch(setURL('plan'));
                            setActiveMenu(moreAppConfig.Menu.PLAN)
                          }}>Upgrade</Button>
                        </> : <></>
                      }
                    </div>

                    </>
                  </div>
                  <div className='gray-line'></div>
                </li>
                <li className="Polaris-Navigation__ListItem">
                  <div className="Polaris-Navigation__ItemWrapper">
                    <> <a onClick={() => {
                      // if (appState.PlanNumber !== moreAppConfig.PlanNumber.Advanced) {
                      //   setIsShowPopupUpgrade(true)
                      // }
                      // else {
                      //   ResetCallTwiceAndCreateCampaign();
                      //   history.push('/dashboard?shop=' + config.shop + '&token=' + config.token);
                      //   dispatch(setURL('dashboard'));
                      //   setActiveMenu(moreAppConfig.Menu.DASHBOARD)
                      // }
                      ReloadExpandMenu(moreAppConfig.KeyExpandMenu.Dashboard, appState.ExpandMenu.includes(moreAppConfig.KeyExpandMenu.Dashboard));
                    }}
                      className="Polaris-Navigation__Item Polaris-Navigation--subNavigationActive"
                      data-polaris-unstyled="true">
                      <div className="Polaris-Navigation__Icon">
                        <img src={IconAnalyticsMajor} alt="" />
                      </div>
                      <span className="Polaris-Navigation__Text">Dashboard</span>
                      <div target="_blank" class="Polaris-Navigation__SecondaryAction ico-lock-padding" tabindex="0" aria-label="Expand" onClick={() => {
                        ReloadExpandMenu(moreAppConfig.KeyExpandMenu.Dashboard, appState.ExpandMenu.includes(moreAppConfig.KeyExpandMenu.Dashboard));
                      }
                      } rel="noopener noreferrer" data-polaris-unstyled="true">

                        {
                          appState.ExpandMenu.includes(moreAppConfig.KeyExpandMenu.Dashboard) ?
                            <Icon
                              source={ChevronDownMinor}
                              color="base" /> :
                            <Icon
                              source={ChevronRightMinor}
                              color="base" />
                        }
                      </div>
                    </a>
                    </>
                  </div>
                  {
                    appState.ExpandMenu.includes(moreAppConfig.KeyExpandMenu.Dashboard) ?
                      <>
                        <div className="Polaris-Navigation__SecondaryNavigation Polaris-Navigation--isExpanded animated">
                          <div id="PolarisSecondaryNavigation1" className="Polaris-Collapsible" aria-expanded="true" style={{ transitionDuration: '0ms', transitionTimingFunction: 'linear', maxHeight: 'none', overflow: 'visible' }}>
                            <ul className="Polaris-Navigation__List">
                              <li className="Polaris-Navigation__ListItem">
                                <div className="Polaris-Navigation__ItemWrapper">
                                  <> <a onClick={() => {
                                    if (appState.PlanNumber !== moreAppConfig.PlanNumber.Advanced) {
                                      setIsShowPopupUpgrade(true)
                                    }
                                    else {
                                      ResetCallTwiceAndCreateCampaign();
                                      history.push('/dashboard?shop=' + config.shop + '&token=' + config.token);
                                      dispatch(setURL('dashboard'));
                                      setActiveMenu(moreAppConfig.Menu.DASHBOARD)
                                    }

                                  }}
                                    className={appState.URL.includes('dashboard') ? "Polaris-Navigation__Item Polaris-Navigation__Item--selected Polaris-Navigation--subNavigationActive" : "Polaris-Navigation__Item"}
                                    //className={appState.Menu === moreAppConfig.Menu.DASHBOARD ? "Polaris-Navigation__Item Polaris-Navigation__Item--selected Polaris-Navigation--subNavigationActive" : "Polaris-Navigation__Item"}
                                    data-polaris-unstyled="true">
                                    <span className="Polaris-Navigation__Text">Dashboard
                                      {
                                        appState.PlanNumber !== moreAppConfig.PlanNumber.Advanced ?
                                          <>
                                            <div className="Polaris-Navigation__SecondaryAction ico-lock-padding ico-lock-padding-2">
                                              <Icon
                                                source={LockMajor}
                                                color="base" /></div>
                                          </>
                                          :
                                          <></>
                                      }
                                    </span>

                                  </a>

                                  </>
                                </div>
                              </li>
                              <li className="Polaris-Navigation__ListItem">
                                <div className="Polaris-Navigation__ItemWrapper">
                                  <> <a
                                    onClick={() => {
                                      if (appState.PlanNumber !== moreAppConfig.PlanNumber.Advanced) {
                                        setIsShowPopupUpgrade(true)
                                      }
                                      else {
                                        ResetCallTwiceAndCreateCampaign();
                                        history.push('/report?shop=' + config.shop + '&token=' + config.token);
                                        dispatch(setURL('report'));
                                        setActiveMenu(moreAppConfig.Menu.REPORT)
                                      }

                                    }}
                                    className={appState.URL.includes('report') ? "Polaris-Navigation__Item Polaris-Navigation__Item--selected Polaris-Navigation--subNavigationActive" : "Polaris-Navigation__Item"}
                                    //className={appState.Menu === moreAppConfig.Menu.REPORT ? "Polaris-Navigation__Item Polaris-Navigation__Item--selected Polaris-Navigation--subNavigationActive" : "Polaris-Navigation__Item"}
                                    data-polaris-unstyled="true">
                                    <span className="Polaris-Navigation__Text">Report
                                      {
                                        appState.PlanNumber !== moreAppConfig.PlanNumber.Advanced ?
                                          <>
                                            <div className="Polaris-Navigation__SecondaryAction ico-lock-padding ico-lock-padding-2">
                                              <Icon
                                                source={LockMajor}
                                                color="base" /></div>
                                          </>
                                          :
                                          <></>
                                      }
                                    </span>

                                  </a></>

                                </div>
                              </li>
                            </ul>
                          </div>
                        </div></> :
                      <></>
                  }

                </li>
                <li className="Polaris-Navigation__ListItem">
                  <div className="Polaris-Navigation__ItemWrapper">
                    <a className="Polaris-Navigation__Item Polaris-Navigation--subNavigationActive" onClick={() => {

                      ReloadExpandMenu(moreAppConfig.KeyExpandMenu.DiscountCampaign, appState.ExpandMenu.includes(moreAppConfig.KeyExpandMenu.DiscountCampaign));
                    }} aria-expanded="true" aria-controls="PolarisSecondaryNavigation5" data-polaris-unstyled="true">
                      <div className="Polaris-Navigation__Icon">
                        <img src={IconDiscountCodeMajor} alt="" />
                      </div>
                      <span className="Polaris-Navigation__Text">Discount campaign</span>
                      <div target="_blank" class="Polaris-Navigation__SecondaryAction ico-lock-padding" tabindex="0" aria-label="Expand" onClick={() => {
                        ReloadExpandMenu(moreAppConfig.KeyExpandMenu.DiscountCampaign, appState.ExpandMenu.includes(moreAppConfig.KeyExpandMenu.DiscountCampaign));
                      }
                      } rel="noopener noreferrer" data-polaris-unstyled="true">

                        {
                          appState.ExpandMenu.includes(moreAppConfig.KeyExpandMenu.DiscountCampaign) ?
                            <Icon
                              source={ChevronDownMinor}
                              color="base" /> :
                            <Icon
                              source={ChevronRightMinor}
                              color="base" />
                        }
                      </div>
                    </a>

                  </div>
                  {
                    appState.ExpandMenu.includes(moreAppConfig.KeyExpandMenu.DiscountCampaign) ?
                      <>
                        <div className="Polaris-Navigation__SecondaryNavigation Polaris-Navigation--isExpanded animated">
                          <div id="PolarisSecondaryNavigation5" className="Polaris-Collapsible" aria-expanded="true" style={{ transitionDuration: '0ms', transitionTimingFunction: 'linear', maxHeight: 'none', overflow: 'visible' }}>
                            <ul className="Polaris-Navigation__List">
                              <li className="Polaris-Navigation__ListItem">
                                <div className="Polaris-Navigation__ItemWrapper">
                                  <> <a onClick={() => {
                                    if (appState.NoCallTwiceTime == false) {
                                      if (campaignListState.WholeCampaignNumber >= 1 && appState.PlanNumber === moreAppConfig.PlanNumber.Free) {
                                        setIsShowPopupUpgradeCreateCampaign(true);
                                      }
                                      else if (campaignListState.WholeCampaignNumber >= 5 && appState.PlanNumber === moreAppConfig.PlanNumber.Basic) {
                                        setIsShowPopupUpgradeCreateCampaign(true);
                                      }
                                      else {
                                        if (campaignListState.TotalCampaign === 0) {
                                          dispatch(setIsNoCampaign(true))
                                        }
                                        dispatch(setIsCreatingCampaign(true));
                                        // dispatch(setIsEditCampaign(false));
                                        dispatch(setNoCallTwices(true));
                                        dispatch(createCampaign());
                                        history.push('/create-campaign?shop=' + config.shop + '&token=' + config.token);
                                        dispatch(setURL('create-campaign'));
                                        setActiveMenu(moreAppConfig.Menu.CREATECAMPAIGN);
                                      }

                                    }
                                  }}
                                    className={appState.URL.includes('create-campaign') || appState.URL.includes('update-campaign') ? "Polaris-Navigation__Item Polaris-Navigation__Item--selected Polaris-Navigation--subNavigationActive" : "Polaris-Navigation__Item"}
                                    data-polaris-unstyled="true">
                                    <span className="Polaris-Navigation__Text">{appState.IsEditCampaign || appState.URL.includes('update-campaign') ? 'Update' : 'Create'} campaign
                                      {
                                        (campaignListState.WholeCampaignNumber >= 1 && appState.PlanNumber === moreAppConfig.PlanNumber.Free) || (campaignListState.WholeCampaignNumber >= 5 && appState.PlanNumber === moreAppConfig.PlanNumber.Basic) ?
                                          <>
                                            <div className="Polaris-Navigation__SecondaryAction ico-lock-padding ico-lock-padding-2">
                                              <Icon
                                                source={LockMajor}
                                                color="base" /></div>
                                          </>
                                          :
                                          <></>
                                      }
                                    </span>
                                    {/* className={appState.Menu === moreAppConfig.Menu.CREATECAMPAIGN ? "Polaris-Navigation__Item Polaris-Navigation__Item--selected Polaris-Navigation--subNavigationActive" : "Polaris-Navigation__Item"}
                               data-polaris-unstyled="true"> <span className="Polaris-Navigation__Text">{appState.IsEditCampaign ? 'Update' : 'Create'} campaign</span>
                              */}

                                  </a></>

                                </div>
                              </li>
                              <li className="Polaris-Navigation__ListItem">
                                <div className="Polaris-Navigation__ItemWrapper">
                                  <> <NavLink to={'/manage-campaign?shop=' + config.shop + '&token=' + config.token}
                                    onClick={() => {
                                      ResetCallTwiceAndCreateCampaign();
                                      dispatch(setURL('manage-campaign'));
                                      setActiveMenu(moreAppConfig.Menu.MANAGECAMPAIGN)
                                    }}
                                    className={appState.URL.includes('manage-campaign') ? "Polaris-Navigation__Item Polaris-Navigation__Item--selected Polaris-Navigation--subNavigationActive" : "Polaris-Navigation__Item"}
                                    data-polaris-unstyled="true">
                                    <span className="Polaris-Navigation__Text">Manage campaign</span>
                                    <div className="Polaris-Navigation__Badge"><span className="Polaris-Badge Polaris-Badge--statusNew Polaris-Badge--sizeSmall" style={appState.Menu === moreAppConfig.Menu.MANAGECAMPAIGN ? { backgroundColor: '#008060', color: '#fff' } : {}}><>{campaignListState.TotalCampaign}</></span></div></NavLink ></>
                                  {/* <a className={appState.Menu === moreAppConfig.Menu.MANAGECAMPAIGN ? "Polaris-Navigation__Item Polaris-Navigation__Item--selected Polaris-Navigation--subNavigationActive" : "Polaris-Navigation__Item"} onClick={() => {
                              // ResetCallTwiceAndCreateCampaign();
                              setActiveMenu(moreAppConfig.Menu.MANAGECAMPAIGN)

                            }} data-polaris-unstyled="true">
                              <span className="Polaris-Navigation__Text">Manage campaign</span>
                              <div className="Polaris-Navigation__Badge"><span className="Polaris-Badge Polaris-Badge--statusNew Polaris-Badge--sizeSmall" style={appState.Menu === moreAppConfig.Menu.MANAGECAMPAIGN ? { backgroundColor: '#008060', color: '#fff' } : {}}><>{campaignListState.TotalCampaign}</></span></div>
                            </a> */}
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </> :
                      <></>
                  }

                </li>
                <li className="Polaris-Navigation__ListItem">
                  <div className="Polaris-Navigation__ItemWrapper">
                    <a className="Polaris-Navigation__Item Polaris-Navigation--subNavigationActive" onClick={() => {

                      ReloadExpandMenu(moreAppConfig.KeyExpandMenu.LimitPurchase, appState.ExpandMenu.includes(moreAppConfig.KeyExpandMenu.LimitPurchase));

                    }} aria-expanded="true" aria-controls="PolarisSecondaryNavigation5" data-polaris-unstyled="true">
                      <div className="Polaris-Navigation__Icon">
                        <img src={IconLimitPurchaseMajor} alt="" />
                      </div>
                      <span className="Polaris-Navigation__Text">Limit purchase</span>
                      <div target="_blank" class="Polaris-Navigation__SecondaryAction ico-lock-padding" tabindex="0" aria-label="Expand" onClick={() => {
                        ReloadExpandMenu(moreAppConfig.KeyExpandMenu.LimitPurchase, appState.ExpandMenu.includes(moreAppConfig.KeyExpandMenu.LimitPurchase));
                      }
                      } rel="noopener noreferrer" data-polaris-unstyled="true">

                        {
                          appState.ExpandMenu.includes(moreAppConfig.KeyExpandMenu.LimitPurchase) ?
                            <Icon
                              source={ChevronDownMinor}
                              color="base" /> :
                            <Icon
                              source={ChevronRightMinor}
                              color="base" />
                        }
                      </div>
                    </a>

                  </div>
                  {
                    appState.ExpandMenu.includes(moreAppConfig.KeyExpandMenu.LimitPurchase) ?
                      <>
                        <div className="Polaris-Navigation__SecondaryNavigation Polaris-Navigation--isExpanded animated">
                          <div id="PolarisSecondaryNavigation5" className="Polaris-Collapsible" aria-expanded="true" style={{ transitionDuration: '0ms', transitionTimingFunction: 'linear', maxHeight: 'none', overflow: 'visible' }}>
                            <ul className="Polaris-Navigation__List">
                              <li className="Polaris-Navigation__ListItem">
                                <div className="Polaris-Navigation__ItemWrapper">
                                  <> <NavLink to={'/limit-product-quantity?shop=' + config.shop + '&token=' + config.token}
                                    onClick={() => {
                                      ResetCallTwiceAndCreateCampaign();
                                      dispatch(setURL('limit-product-quantity'));
                                    }}
                                    className={appState.URL.includes('limit-product-quantity') && !appState.URL.includes('settings') ? "Polaris-Navigation__Item Polaris-Navigation__Item--selected Polaris-Navigation--subNavigationActive" : "Polaris-Navigation__Item"}
                                    data-polaris-unstyled="true">
                                    <span className="Polaris-Navigation__Text">Limit product</span>
                                    <div className="Polaris-Navigation__Badge"><span className="Polaris-Badge Polaris-Badge--statusNew Polaris-Badge--sizeSmall"><>{limitPurchaseState.TotalHaveLimitPurchase}</></span></div></NavLink ></>

                                </div>
                              </li>
                              <li className="Polaris-Navigation__ListItem">
                                <div className="Polaris-Navigation__ItemWrapper">
                                  <> <NavLink to={'/limit-collection?shop=' + config.shop + '&token=' + config.token}
                                    onClick={() => {
                                      ResetCallTwiceAndCreateCampaign();
                                      dispatch(setURL('limit-collection'));
                                    }}
                                    className={appState.URL.includes('limit-collection') && !appState.URL.includes('settings') ? "Polaris-Navigation__Item Polaris-Navigation__Item--selected Polaris-Navigation--subNavigationActive" : "Polaris-Navigation__Item"}
                                    data-polaris-unstyled="true">
                                    <span className="Polaris-Navigation__Text">Limit collection</span>
                                    <div className="Polaris-Navigation__Badge"><span className="Polaris-Badge Polaris-Badge--statusNew Polaris-Badge--sizeSmall"><>{limitCollectionState.TotalHaveLimitCollection}</></span></div></NavLink ></>

                                </div>
                              </li>
                              <li className="Polaris-Navigation__ListItem">
                                <div className="Polaris-Navigation__ItemWrapper">
                                  <> <a
                                    onClick={() => {

                                      ResetCallTwiceAndCreateCampaign();
                                      history.push('/limit-order?shop=' + config.shop + '&token=' + config.token);
                                      dispatch(setURL('limit-order'));

                                    }}
                                    className={appState.URL.includes('limit-order') && !appState.URL.includes('settings') ? "Polaris-Navigation__Item Polaris-Navigation__Item--selected Polaris-Navigation--subNavigationActive" : "Polaris-Navigation__Item"}
                                    data-polaris-unstyled="true">
                                    <span className="Polaris-Navigation__Text">Limit order</span>
                                  </a ></>

                                </div>
                              </li>

                            </ul>
                          </div>
                        </div>
                      </> :
                      <></>
                  }


                </li>

                <li className="Polaris-Navigation__ListItem">
                  <div className="Polaris-Navigation__ItemWrapper">
                    <> <NavLink to={'/plan?shop=' + config.shop + '&token=' + config.token}
                      onClick={() => {
                        ResetCallTwiceAndCreateCampaign();
                        dispatch(setURL('plan'));
                      }}
                      className={appState.URL.includes('plan') ? "Polaris-Navigation__Item Polaris-Navigation__Item--selected Polaris-Navigation--subNavigationActive" : "Polaris-Navigation__Item"}
                      data-polaris-unstyled="true">
                      <div className="Polaris-Navigation__Icon">
                        <img src={IconImagesMajor} alt="" />
                      </div>
                      <span className="Polaris-Navigation__Text">Plan</span></NavLink></>

                  </div>
                </li>
                <li className="Polaris-Navigation__ListItem">
                  <div className="Polaris-Navigation__ItemWrapper">

                    <> <Link to={'/settings?shop=' + config.shop + '&token=' + config.token}
                      onClick={() => {
                        ResetCallTwiceAndCreateCampaign();
                        dispatch(setURL('settings'));
                      }}
                      className={appState.URL.includes('settings') ? "Polaris-Navigation__Item Polaris-Navigation__Item--selected Polaris-Navigation--subNavigationActive" : "Polaris-Navigation__Item"}
                      data-polaris-unstyled="true">
                      <div className="Polaris-Navigation__Icon">
                        <img src={IconSettingsMajor} alt="" />
                      </div>
                      <span className="Polaris-Navigation__Text">Settings</span></Link></>

                  </div>
                </li>
                <div className="bottom-menu">
                  <div className='gray-line'></div>

                  {
                    appState.MoveStore ? <>
                      <li className="Polaris-Navigation__ListItem">
                        <div className="Polaris-Navigation__ItemWrapper">


                          <a className='Polaris-Navigation__Item' onClick={() => {
                            // ResetCallTwiceAndCreateCampaign();
                            dispatch(setExperience({
                              ...experienceState,
                              IsShowSwitchApp: true
                            }))
                          }} data-polaris-unstyled="true">
                            <div className="Polaris-Navigation__Icon">
                              <img src={IconTransactionMajor} alt="" />
                            </div>
                            <span className="Polaris-Navigation__Text">Back to old App version</span>
                          </a>
                        </div>
                      </li></> : <></>
                  }
                  <li className="Polaris-Navigation__ListItem">
                    <div className="Polaris-Navigation__ItemWrapper">
                      <> <div onClick={() => {
                        window.open('https://forms.gle/eC5qR3xmUr45c7A58', '_blank')
                      }}
                        className="Polaris-Navigation__Item"
                        data-polaris-unstyled="true">
                        <div className="Polaris-Navigation__Icon">
                          <img src={IconComposeMajor} alt="" />
                        </div>
                        <span className="Polaris-Navigation__Text">Leave feedback
                        </span>
                      </div>
                      </>
                    </div>
                  </li>
                  <li className="Polaris-Navigation__ListItem">
                    <div className="Polaris-Navigation__ItemWrapper">
                      <> <div onClick={() => {
                        setIsShowSuggestion(true);
                      }}
                        className="Polaris-Navigation__Item"
                        data-polaris-unstyled="true">
                        <div className="Polaris-Navigation__Icon">
                          <img src={IconAddMajor} alt="" />
                        </div>
                        <span className="Polaris-Navigation__Text">Request new feature
                        </span>
                      </div>

                      </>
                    </div>
                  </li>

                </div>

              </ul>
            </div>
          </div>
          <div className='main-container'>
            <>
              <ReactInterval timeout={500} enabled={appState.DisplayProcess}
                callback={() => { dispatch(getProcess("Create")) }} />
              {
                appState.DisplayProcess ? <Process Process={appState.Process}></Process> : null
              }
              {/* {content} */}
              <Switch>
                <Route exact path='/dashboard'>
                  <Dashboard />
                </Route>
                <Route exact path='/report'>
                  <Report />
                </Route>
                <Route exact
                  path='/limit-order' >
                  <LimitOrder />
                </Route>
                <Route exact
                  path='/limit-product-quantity' >
                  <LimitPurchase />
                </Route>
                <Route exact
                  path='/limit-collection' >
                  <LimitCollection />
                </Route>
                <Route exact
                  path='/create-campaign' >
                  <CreateUpdateCampaign IsNoCampaign={appState.IsNoCampaign} />
                </Route>
                <Route exact
                  path='/update-campaign/:slug' >
                  <CreateUpdateCampaign />
                </Route>
                <Route exact
                  path='/manage-campaign' >
                  <ListCampaign />
                </Route>
                <Route exact
                  path='/plan'>
                  <Plan />
                </Route>
                <Route exact
                  path='/settings'>
                  <Setting />
                </Route>
                <Route exact
                  path='/settings/general'>
                  <Setting />
                </Route>
                <Route exact
                  path='/settings/quantity-discount'>
                  <Setting />
                </Route>
                <Route exact
                  path='/settings/limit-product-quantity'>
                  <Setting />
                </Route>
                <Route exact
                  path='/settings/limit-order'>
                  <Setting />
                </Route>
                <Route exact
                  path='/settings/limit-collection'>
                  <Setting />
                </Route>
                <Route
                  path="*"
                >
                  <URLNotFound />
                </Route>
              </Switch>


            </>
          </div>
          <div className='cb'>
          </div>
          {/* <div className='button-support'>
            <Button primary onClick={() => {
              loadChatPlugin();
            }}>
              <>
                <span className='flex flex-align-center'>
                  <Icon
                    source={QuestionMarkMajor}
                    color="white" /> <span className='text'>Support</span>
                </span>
              </>
            </Button>

          </div> */}

          <Modal
            open={isShowPopupUpgrade}
            onClose={() => {
              setIsShowPopupUpgrade(false)

            }}
            title="This feature is only available in higher plan. Do you want to upgrade?"
            primaryAction={{
              content: 'Upgrade',
              onAction: () => {
                setIsShowPopupUpgrade(false)
                history.push('/plan?shop=' + config.shop + '&token=' + config.token);
                dispatch(setURL('plan'));
                setActiveMenu(moreAppConfig.Menu.PLAN)
              },
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: () => {
                  setIsShowPopupUpgrade(false)
                },
              },
            ]}
          >

          </Modal>
          <Modal
            open={isShowPopupUpgradeCreateCampaign}
            onClose={() => {
              setIsShowPopupUpgradeCreateCampaign(false)

            }}
            title={"You are on the " + (appState.PlanNumber === moreAppConfig.PlanNumber.Free ? "Free" : "Basic") + " plan with maximum of " + (appState.PlanNumber === moreAppConfig.PlanNumber.Free ? "1 campaign" : "5 campaigns") + ". Do you want to upgrade?"}
            primaryAction={{
              content: 'Upgrade',
              onAction: () => {
                setIsShowPopupUpgradeCreateCampaign(false)
                history.push('/plan?shop=' + config.shop + '&token=' + config.token);
                dispatch(setURL('plan'));
                setActiveMenu(moreAppConfig.Menu.PLAN)
              },
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: () => {
                  setIsShowPopupUpgradeCreateCampaign(false)
                },
              },
            ]}
          >

          </Modal>
          <Modal
            open={experienceState.IsShowSwitchApp}
            onClose={() => {
              dispatch(setExperience({
                ...experienceState,
                Experience:
                {
                  ...experienceState.Experience,
                  Email: '',
                  DescribeExperience: '',
                },
                Step: 1,
                IsShowSwitchApp: false
              }))
            }}
            title="Switch to the old App version"
            primaryAction={{
              content: 'Switch',
              loading: experienceState.IsSaveLoading,
              onAction: () => {
                if (experienceState.Step === 1) {
                  if (ValidFormSwitchApp()) {
                    dispatch(setExperience({
                      ...experienceState,
                      Step: 2
                    }))
                  }

                }
                else {
                  axios.get(config.rootLink + '/Home/RollbackOldVersion', {
                    params: {
                      shop: config.shop,
                      shopid: 1,
                      token: config.token,

                    }
                  })
                    .then(function (response) {
                      const result = response?.data;
                      if (result.url != '') {
                        dispatch(saveExperience(experienceState.Experience.Email, experienceState.Experience.DescribeExperience));
                        window.location.href = result.url;
                      }
                      else {
                        alert('There is an error when switching to old App version. Please contact supporter to solve this problem');
                      }

                    })
                    .catch(function (error) {
                      const errorMsg = error.message;
                    })


                }
              },
            }}
            secondaryActions={[
              {
                content: experienceState.Step === 1 ? 'Cancel' : 'Disable app embed',
                onAction: () => {
                  if (experienceState.Step === 1) {
                    dispatch(setExperience({
                      ...experienceState,
                      IsShowSwitchApp: false,
                      Step: 1
                    }))
                  }
                  else {
                    //disable app
                    window.open('https://' + config.shop + '/admin/themes/current/editor?context=apps&activateAppId=3f38eaa3-2a3f-4e55-bcc9-df5d3f75e351%2Forichi-discount', "_blank");
                  }

                },
              },
            ]}
          >
            <Modal.Section>

              {
                experienceState.Step === 1 ? <>
                  <p>We are so sorry if the new App version doesn't perform well or makes you feel uncomfortable. Before moving back to the old App version, please note that:</p>
                  <p>- All data created in this new version will not be kept</p>
                  <p>- All old data from the old App version (before you switch to this new App version) will be fully retained.</p>
                  <div className="break-line"></div>
                  <p>And if you don't mind, could you please share with us more details about your experience with the new App version, so that we can improve it much better in the near future. Your experience and your voice really matter to us!</p>

                  <div className="break-line"></div>
                  <TextField
                    label="Your email"
                    value={experienceState.Experience.Email}
                    onChange={(e) => {

                      dispatch(setExperience({
                        ...experienceState,
                        Experience:
                        {
                          ...experienceState.Experience,
                          Email: e,
                        },
                        EmailValidation: e == '' ? 'Email is required' : ''
                      }))
                    }}
                    error={experienceState.EmailValidation}
                    type="text"
                  />
                  <div className="break-line"></div>
                  <TextField
                    label="Describe your experience with the new App version"
                    value={experienceState.Experience.DescribeExperience}
                    onChange={(e) => {
                      dispatch(setExperience({
                        ...experienceState,
                        Experience:
                        {
                          ...experienceState.Experience,
                          DescribeExperience: e,
                        },
                        DescribeExperienceValidation: e == '' ? 'Describe is required' : ''
                      }))
                    }}
                    multiline={4}
                    error={experienceState.DescribeExperienceValidation}
                    type="text"
                  />
                </> : <>

                  <p>One more thing before you switch: please make sure that you've disabled the "App embbed" in Shop Editor so that the old app can work correctly!</p>
                  <div className='group-fill-text group-fill-text2'>
                    <div className='item item2'>
                      <div className='col col1' style={{ width: 'calc(46% - 10px)' }}>
                        <img src={Switch1} alt="" className="Polaris-CalloutCard__Image" />
                      </div>
                      <div className='col col2'>
                        <Icon
                          source={CircleRightMajor}
                          color="base" />
                      </div>
                      <div className='col col3' style={{ width: 'calc(46% - 10px)' }}>
                        <img src={Switch2} alt="" className="Polaris-CalloutCard__Image" />
                      </div>
                      <div className='cb'>
                      </div>
                    </div>
                  </div>

                </>
              }

            </Modal.Section>
          </Modal>
          <Modal
            open={planState.IsOpenChoosePlan}
            onClose={() => {
              dispatch(setPlan({
                ...planState,
                IsOpenChoosePlan: false
              }))

            }}
            title={"Do you want to change your plan to " + (planState.TypePlan == moreAppConfig.PlanNumber.Free ? "Basic" : planState.TypePlan == moreAppConfig.PlanNumber.Basic ? "Advanced" : "Advanced")}
            primaryAction={{
              content: 'OK',
              onAction: () => {
                dispatch(ChoosePlan(planState.TypePlan))
              },
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: () => {
                  dispatch(setPlan({
                    ...planState,
                    IsOpenChoosePlan: false
                  }))
                },
              },
            ]}
          ></Modal>
        </>


      </div>


      {experienceState.IsOpenSaveResult ? <Toast content={experienceState.MessageSaveResult} duration={2400} onDismiss={() => {
        dispatch(setExperience({
          ...experienceState,
          IsOpenSaveResult: false
        }))
      }} /> : null}
      <div>
        <>
          <div className='suggestion'>
            <div className={isShowSuggestion ? 'feature-fixed feature-show' : 'feature-fixed feature-hide'}>
              {isShowSuggestion ?
                <>
                  <Suggestion isShowSuggestion={isShowSuggestion} setIsShowSuggestion={setIsShowSuggestion} />

                </>
                : null}

            </div>
          </div>
        </>
      </div>

    </>


  );

}
export default AppFrame;	