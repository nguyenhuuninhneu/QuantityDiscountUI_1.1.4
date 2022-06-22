import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageActions, Card, Layout, Heading, TextStyle, Button, Select, ButtonGroup, TextField, Toast, Icon, DataTable, Stack, Checkbox, ContextualSaveBar } from '@shopify/polaris';
import { DeleteMinor, QuestionMarkMajor, CircleInformationMajor, CircleRightMajor, ViewMinor, ConfettiMajor } from '@shopify/polaris-icons';
import Loading from '../../components/plugins/Loading';
import { setLimitOrder } from '../../state/modules/limitorder/actions';
import { saveLimitOrder, fetchLimitOrder } from '../../state/modules/limitorder/operations';
import moreAppConfig from '../../config/moreAppConfig';

function LimitOrder() {
  const dispatch = useDispatch();
  const limitOrderState = useSelector((state) => state.limitorder.ListLimitOrder);
  useEffect(() => {
    dispatch(fetchLimitOrder());

  }, [dispatch]);
  const validateNumber = (e) => {
    if (isNaN(e)) {
      return false;
    } else {
      return true;
    }
  }
  function ValidForm() {

    if (limitOrderState.Setting.MinTotalOrderValue === '') {
      dispatch(setLimitOrder({
        ...limitOrderState,
        MinTotalOrderValidation: moreAppConfig.MinValidationText
      }))
      return false;
    }
    else {
      let min = parseInt(limitOrderState.Setting.MinTotalOrderValue);
      if (min < 0) {
        dispatch(setLimitOrder({
          ...limitOrderState,
          MinTotalOrderValidation: "Min limit greater or equals than 0"
        }))
        return false;
      }

    }
    if (limitOrderState.Setting.MaxTotalOrderValue === '') {
      dispatch(setLimitOrder({
        ...limitOrderState,
        MaxTotalOrderValidation: moreAppConfig.MaxValidationText
      }))
      return false;
    }
    else {
      let max = parseInt(limitOrderState.Setting.MaxTotalOrderValue);
      if (max < 0) {
        dispatch(setLimitOrder({
          ...limitOrderState,
          MaxTotalOrderValidation: "Max limit greater or equals than 0"
        }))
        return false;
      }

    }
    if (limitOrderState.Setting.MinTotalOrderValue != '' && limitOrderState.Setting.MaxTotalOrderValue != '') {
      let min = parseInt(limitOrderState.Setting.MinTotalOrderValue);
      let max = parseInt(limitOrderState.Setting.MaxTotalOrderValue);
      if(max > 0){
        if (min > max) {
          dispatch(setLimitOrder({
            ...limitOrderState,
            MaxTotalOrderValidation: moreAppConfig.MaxGreateThanMinValidationText
          }))
          return false;
        }
        else {
          dispatch(setLimitOrder({
            ...limitOrderState,
            MaxTotalOrderValidation: ''
          }))
        }
      }
     
    }
    if (limitOrderState.Setting.MinTotalQuantityValue === '') {
      dispatch(setLimitOrder({
        ...limitOrderState,
        MinTotalQuantityValidation: moreAppConfig.MinValidationText
      }))
      return false;
    }
    else {
      let min = parseInt(limitOrderState.Setting.MinTotalQuantityValue);
      if (min < 0) {
        dispatch(setLimitOrder({
          ...limitOrderState,
          MinTotalQuantityValidation: "Min limit greater or equals than 0"
        }))
        return false;
      }

    }
    if (limitOrderState.Setting.MaxTotalQuantityValue === '') {
      dispatch(setLimitOrder({
        ...limitOrderState,
        MaxTotalQuantityValidation: moreAppConfig.MaxValidationText
      }))
      return false;
    }
    else {
      let max = parseInt(limitOrderState.Setting.MaxTotalQuantityValue);
      if (max < 0) {
        dispatch(setLimitOrder({
          ...limitOrderState,
          MaxTotalQuantityValue: "Max limit greater or equals than 0"
        }))
        return false;
      }

    }
    if (limitOrderState.Setting.MinTotalQuantityValue != '' && limitOrderState.Setting.MaxTotalQuantityValue != '') {
      let min = parseInt(limitOrderState.Setting.MinTotalQuantityValue);
      let max = parseInt(limitOrderState.Setting.MaxTotalQuantityValue);
      if (max > 0) {
        if (min > max) {
          dispatch(setLimitOrder({
            ...limitOrderState,
            MaxTotalQuantityValidation: moreAppConfig.MaxGreateThanMinValidationText
          }))
          return false;
        }
        else {
          dispatch(setLimitOrder({
            ...limitOrderState,
            MaxTotalQuantityValidation: ''
          }))
        }
      }
    }

    return true;
  }
  return (
    <>
      {
        limitOrderState.IsLoadingPage ? <Loading></Loading>
          :
          <div className='limit-purchase-feature'>

            <div className="alert-cart-page">
              <div className='section cart-page'>
                <Layout>
                  <Layout.Section oneThird>
                    <Card>
                      <Card.Section>
                        <Heading size="small">1. Limit order value</Heading>
                        <div className='element-general'>
                          <div className="break-line"></div>
                          <div className='flex mt-10'>
                            <span style={{ marginRight: '15px' }}>Status</span>
                            <label className="switch">
                              <input
                                type="checkbox" onClick={() => {
                                  dispatch(setLimitOrder({
                                    ...limitOrderState,
                                    Setting: {
                                      ...limitOrderState.Setting,
                                      LimitOrderValueStatus: !limitOrderState.Setting.LimitOrderValueStatus
                                    },
                                    IsOpenSaveToolbar: true
                                  }))
                                }} className={limitOrderState.Setting.LimitOrderValueStatus ? 'active' : ''} id="togBtn" />
                              <div className="slider round">
                                <span className="on">ON</span>
                                <span className="off">OFF</span>
                              </div>
                            </label>
                          </div>
                          <div className="break-line"></div>
                          <div className="break-line"></div>
                          <div className='create-update-limit-purchase'>

                            <div className='item'>
                              <div className='price-discount'>
                                <TextField
                                  label="Min total order value"
                                  id='MinTotalOrderValue'
                                  value={limitOrderState.Setting.MinTotalOrderValue !== null && limitOrderState.Setting.MinTotalOrderValue !== undefined ? limitOrderState.Setting.MinTotalOrderValue.toString() : '0'}
                                  onChange={(e) => {
                                    dispatch(setLimitOrder({
                                      ...limitOrderState,
                                      Setting: {
                                        ...limitOrderState.Setting,
                                        MinTotalOrderValue: validateNumber(e.trim()) ? e.trim() : "0"
                                      },
                                      MinTotalOrderValidation: e === '' ? moreAppConfig.MinValidationText : '',
                                      IsOpenSaveToolbar: true
                                    }))
                                  }}
                                  error={limitOrderState.MinTotalOrderValidation}
                                  type="text"
                                />
                                <span className='unit2'>{limitOrderState.Setting.Currency}</span>

                              </div>

                            </div>
                            <div className='item price-discount' style={{ marginLeft: '30px' }}>
                              <div className='price-discount'>
                                <TextField
                                  label="Max total order value"
                                  id='MaxTotalOrderValue'
                                  value={limitOrderState.Setting.MaxTotalOrderValue !== null  && limitOrderState.Setting.MaxTotalOrderValue !== undefined ? limitOrderState.Setting.MaxTotalOrderValue.toString() : '0'}
                                  onChange={(e) => {
                                    dispatch(setLimitOrder({
                                      ...limitOrderState,
                                      Setting: {
                                        ...limitOrderState.Setting,
                                        MaxTotalOrderValue: validateNumber(e.trim()) ? e.trim() : "0"
                                      },
                                      MaxTotalOrderValidation: e === '' ? moreAppConfig.MaxValidationText : '',
                                      IsOpenSaveToolbar: true
                                    }))
                                  }}
                                  error={limitOrderState.MaxTotalOrderValidation}
                                  type="text"
                                />
                                <span className='unit2'>{limitOrderState.Setting.Currency}</span>
                              </div>

                              <span className='rule-max-zero'>If you set this 0, it means unlimited</span>
                            </div>
                            <div className='cb'>
                            </div>
                            <p style={{ fontStyle: 'italic', marginTop: '5px' }}>
                              “Order value” means the cart subtotal, doesn’t include shipping and taxes
                            </p>
                          </div>

                        </div>

                      </Card.Section>
                    </Card>
                  </Layout.Section>
                </Layout>
              </div>
            </div>

            <div className="alert-cart-page">
              <div className='section cart-page'>
                <Layout>
                  <Layout.Section oneThird>
                    <Card>
                      <Card.Section>
                        <Heading size="small">2. Limit order quantity</Heading>
                        <div className='element-general'>
                          <div className="break-line"></div>
                          <div className='flex mt-10'>
                            <span style={{ marginRight: '15px' }}>Status</span>
                            <label className="switch">
                              <input type="checkbox" onClick={() => {
                                dispatch(setLimitOrder({
                                  ...limitOrderState,
                                  Setting: {
                                    ...limitOrderState.Setting,
                                    LimitOrderQuantityStatus: !limitOrderState.Setting.LimitOrderQuantityStatus
                                  },
                                  IsOpenSaveToolbar: true
                                }))
                              }} className={limitOrderState.Setting.LimitOrderQuantityStatus ? 'active' : ''} id="togBtn" />
                              <div className="slider round">
                                <span className="on">ON</span>
                                <span className="off">OFF</span>
                              </div>
                            </label>
                          </div>
                          <div className="break-line"></div>
                          <div className="break-line"></div>
                          <div className='create-update-limit-purchase'>

                            <div className='item'>
                              <TextField
                                label="Min total order quantity"
                                id='MinTotalQuantityValue'
                                value={limitOrderState.Setting.MinTotalQuantityValue !== null && limitOrderState.Setting.MinTotalQuantityValue !== undefined  ? limitOrderState.Setting.MinTotalQuantityValue.toString() : '0'}
                                onChange={(e) => {
                                  dispatch(setLimitOrder({
                                    ...limitOrderState,
                                    Setting: {
                                      ...limitOrderState.Setting,
                                      MinTotalQuantityValue: validateNumber(e.trim()) ? e.trim() : "0"
                                    },
                                    MinTotalQuantityValidation: e === '' ? moreAppConfig.MinValidationText : '',
                                    IsOpenSaveToolbar: true
                                  }))
                                }}
                                error={limitOrderState.MinTotalQuantityValidation}
                                type="number"
                                min={0}
                              />
                            </div>
                            <div className='item' style={{ marginLeft: '30px' }}>
                              <TextField
                                label="Max total order quantity"
                                id='MaxTotalQuantityValue'
                                value={limitOrderState.Setting.MaxTotalQuantityValue !== null  && limitOrderState.Setting.MaxTotalQuantityValue !== undefined? limitOrderState.Setting.MaxTotalQuantityValue.toString() : '0'}
                                onChange={(e) => {
                                  dispatch(setLimitOrder({
                                    ...limitOrderState,
                                    Setting: {
                                      ...limitOrderState.Setting,
                                      MaxTotalQuantityValue: validateNumber(e.trim()) ? e.trim() : "0"
                                    },
                                    MaxTotalQuantityValidation: e === '' ? moreAppConfig.MaxValidationText : '',
                                    IsOpenSaveToolbar: true
                                  }))
                                }}
                                error={limitOrderState.MaxTotalQuantityValidation}
                                type="number"
                                min={0}
                              />
                              <span className='rule-max-zero'>If you set this 0, it means unlimited</span>
                            </div>
                            <div className='cb'>
                            </div>
                            <p style={{ fontStyle: 'italic', marginTop: '5px' }}>
                            “Order quantity” means total items in the cart
                            </p>
                          </div>

                        </div>

                      </Card.Section>
                    </Card>
                  </Layout.Section>
                </Layout>
              </div>
            </div>
          </div>
      }
      {limitOrderState.IsOpenSaveToolbar ?
        <div className='head'>
          <ContextualSaveBar
            message="Unsaved changes"
            saveAction={{
              content: "Save settings",
              onAction: () => {
                if (ValidForm()) {
                  dispatch(saveLimitOrder())
                }

              },
              loading: limitOrderState.IsSaveLoading,
            }}
            discardAction={{
              content: "Discard",
              onAction: () => {
                dispatch(setLimitOrder({
                  ...limitOrderState,
                  IsOpenSaveToolbar: false
                }))
              },
            }}
          />
        </div>
        : <></>}
      {limitOrderState.IsOpenSaveToolbar ? <>
        <PageActions
          primaryAction={{
            content: 'Save settings',
            onAction: () => {
              if (ValidForm()) {
                dispatch(saveLimitOrder())
              }
            },
            loading: limitOrderState.IsSaveLoading
          }}
          secondaryActions={[
            {
              content: 'Discard',
              onAction: () => {
                dispatch(setLimitOrder({
                  ...limitOrderState,
                  IsOpenSaveToolbar: false
                }))
              },
            },
          ]}
        />
      </> :
        <></>
      }
      {limitOrderState.IsOpenSaveResult ? <Toast content={limitOrderState.MessageSaveResult} duration={2400} onDismiss={() => {
        dispatch(setLimitOrder({
          ...limitOrderState,
          IsOpenSaveResult: false
        }))
      }} /> : null}

    </>
  )
}

export default LimitOrder