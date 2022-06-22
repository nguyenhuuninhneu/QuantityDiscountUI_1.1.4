import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageActions, Card, Layout, Heading, TextStyle, Button, Select, ButtonGroup, TextField, Toast, Icon, DataTable, Stack, Checkbox, ContextualSaveBar } from '@shopify/polaris';
import { DeleteMinor, QuestionMarkMajor, CircleInformationMajor, CircleRightMajor, ViewMinor, ConfettiMajor, MobileCancelMajor } from '@shopify/polaris-icons';
import Loading from '../../components/plugins/Loading';
import { setSetting } from '../../state/modules/setting/actions';
import { saveSetting } from '../../state/modules/setting/operations';
import {  withRouter } from "react-router-dom";

function LimitOrder() {
  const dispatch = useDispatch();
  const settingState = useSelector((state) => state.setting.ListSetting);

  const validateNumber = (e) => {
    if (isNaN(e)) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <>
      {
        settingState.IsLoadingPage ? <Loading></Loading>
          :
          <div className='limit-purchase-feature'>
            <div className="product-page">
              <div className='colLeft'>
                <div className='section product-page'>
                  <Layout>
                    <Layout.Section oneThird>
                      <Card>
                        <Card.Section>
                          <Heading size="small">1. Alert pop-up in cart page</Heading>
                          <div className='element-general'>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “Order is not valid”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    id='PopupLimitOrderIsNotValid'
                                    placeholder='Order is not valid'
                                    value={settingState.Setting.PopupLimitOrderIsNotValid}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          PopupLimitOrderIsNotValid: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                    maxLength={30}
                                    showCharacterCount
                                  />
                                </div>
                                <div className='cb'>
                                </div>
                              </div>

                            </div>
                          </div>

                        </Card.Section>
                        <Card.Section>
                          <div className='element-general'>
                            <p className='only-text'>Customize button</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “OK”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    id='LimitOrderTextButtonOK'
                                    placeholder='OK'
                                    value={settingState.Setting.LimitOrderTextButtonOK}
                                    onChange={(e) => {
                                      // var newRows = rowsPreview.map((p, i) =>
                                      //   (i == index ? { ...p, Quantity: e } : p)
                                      // )
                                      // setRowPreview(newRows);
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          LimitOrderTextButtonOK: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                  />
                                </div>
                                <div className='cb'>
                                </div>
                              </div>
                            </div>
                            <div className='group-col-half'>
                              <div className='item'>
                                <div className='itemLeft'>
                                  <p className='title'>Background color</p>
                                  <div className='flex flex-align-center'>
                                    <div className='w90pt'>
                                      <TextField
                                        id='LimitOrderBackgroundColorButtonOK'
                                        placeholder='Background color'
                                        value={settingState.Setting.LimitOrderBackgroundColorButtonOK}
                                        onChange={(e) => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting: {
                                              ...settingState.Setting,
                                              LimitOrderBackgroundColorButtonOK: e == '' ? '#000000' : e.trim(),
                                            },
                                            IsOpenSaveToolbar: true
                                          }))
                                        }}
                                      />

                                    </div>
                                    <input type="color" value={settingState.Setting.LimitOrderBackgroundColorButtonOK} onChange={e => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          LimitOrderBackgroundColorButtonOK: e.target.value == '' ? '#000000' : e.target.value.toUpperCase(),
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }} />
                                  </div>


                                </div>
                                <div className='itemRight'>
                                  <p className='title'>Text color</p>
                                  <div className='flex flex-align-center'>
                                    <div className='w90pt'>
                                      <TextField
                                        id='LimitOrderTextColorButtonOK'
                                        placeholder='Text color'
                                        value={settingState.Setting.LimitOrderTextColorButtonOK}
                                        onChange={(e) => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting: {
                                              ...settingState.Setting,
                                              LimitOrderTextColorButtonOK: e == '' ? '#FFFFFF' : e,
                                            },
                                            IsOpenSaveToolbar: true
                                          }))
                                        }}
                                      />
                                    </div>
                                    <input type="color" value={settingState.Setting.LimitOrderTextColorButtonOK} onChange={e => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          LimitOrderTextColorButtonOK: e.target.value == '' ? '#FFFFFF' : e.target.value.toUpperCase(),
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }} />
                                  </div>

                                </div>
                                <div className='cb'>

                                </div>
                              </div>
                            </div>
                          </div>

                        </Card.Section>
                        <Card.Section>
                          <div className='element-general'>
                            <p className='only-text'>When order value (subtotal) is greater than maximum:</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “You can only choose
                                  maximum of {"{maximum}"} for the subtotal value”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    id='TextMaxSubTotalValue'
                                    placeholder='You can only choose maximum of {maximum} for the subtotal value'
                                    value={ settingState.Setting.TextMaxSubTotalValue}
                                    onChange={(e) => {
                                      // var newRows = rowsPreview.map((p, i) =>
                                      //   (i == index ? { ...p, Quantity: e } : p)
                                      // )
                                      // setRowPreview(newRows);
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          TextMaxSubTotalValue: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                    multiline={4}
                                  />
                                </div>
                                <div className='cb'>
                                </div>
                              </div>
                            </div>
                            <div className="break-line"></div>
                            <p className='only-text'>When order value (subtotal) is less than minimum:</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “You have to choose minimum of {"{minimum}"} for the subtotal value”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    id='TextMinSubTotalValue'
                                    placeholder='You have to choose minimum of {"{minimum}"} for the subtotal value'
                                    value={settingState.Setting.TextMinSubTotalValue}
                                    onChange={(e) => {
                                      // var newRows = rowsPreview.map((p, i) =>
                                      //   (i == index ? { ...p, Quantity: e } : p)
                                      // )
                                      // setRowPreview(newRows);
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          TextMinSubTotalValue: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                    multiline={4}
                                  />
                                </div>
                                <div className='cb'>
                                </div>
                              </div>
                            </div>
                            <div className="break-line"></div>
                            <p className='only-text'>When total order quantity is greater than maximum:</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “You can only choose maximum of {"{maximum}"} products in total”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    id='TextMaxProductInTotal'
                                    placeholder='You can only choose maximum of {maximum} products in total'
                                    value={settingState.Setting.TextMaxProductInTotal}
                                    onChange={(e) => {
                                      // var newRows = rowsPreview.map((p, i) =>
                                      //   (i == index ? { ...p, Quantity: e } : p)
                                      // )
                                      // setRowPreview(newRows);
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          TextMaxProductInTotal: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                    multiline={4}
                                  />
                                </div>
                                <div className='cb'>
                                </div>
                              </div>
                            </div>
                            <div className="break-line"></div>
                            <p className='only-text'>When total order quantity is less than minimum:</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “You have to choose minimum of {"{minimum}"} products in total”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    id='TextMinProductInTotal'
                                    placeholder='You have to choose minimum of {minimum} products in total'
                                    value={settingState.Setting.TextMinProductInTotal}
                                    onChange={(e) => {
                                      // var newRows = rowsPreview.map((p, i) =>
                                      //   (i == index ? { ...p, Quantity: e } : p)
                                      // )
                                      // setRowPreview(newRows);
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          TextMinProductInTotal: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                    multiline={4}
                                  />
                                </div>
                                <div className='cb'>
                                </div>
                              </div>
                            </div>
                            <div className="break-line"></div>
                            <div className='group-col-half'>
                              <div className='item'>
                                <div className='itemLeft'>
                                  <p className='title'>Text color</p>
                                  <div className='flex flex-align-center'>
                                    <div className='w90pt'>
                                      <TextField
                                        id='PopupLitmitOrderTextColor'
                                        placeholder='Text color'
                                        value={settingState.Setting.PopupLitmitOrderTextColor}
                                        onChange={(e) => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting: {
                                              ...settingState.Setting,
                                              PopupLitmitOrderTextColor: e == '' ? '#000000' : e,
                                            },
                                            IsOpenSaveToolbar: true
                                          }))
                                        }}
                                      />
                                    </div>
                                    <input type="color" value={settingState.Setting.PopupLitmitOrderTextColor} onChange={e => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          PopupLitmitOrderTextColor: e.target.value == '' ? '#000000' : e.target.value.toUpperCase(),
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }} />
                                  </div>

                                </div>
                                <div className='itemRight'>


                                </div>
                                <div className='cb'>

                                </div>
                              </div>
                            </div>
                          </div>
                        </Card.Section>
                      </Card>
                    </Layout.Section>
                  </Layout>
                </div>
              </div>
              <div className='colRight' style={{ position: 'sticky', top: '0' }}>
                <div className='section section-preview bg-fff'>
                  <div className='preview'>
                    <h2 className="Polaris-Heading Heading-Icon Heading-Preview"> <Icon source={ViewMinor} color='base'></Icon> Preview of alert pop-up in your cart page
                    </h2>
                    <div className='bg-bound'>
                      <div className='preview-table'>
                        <div className='popup-custom'>
                          <div className='header'>
                            <div className='title'>{settingState.Setting.PopupLimitOrderIsNotValid}</div>
                            <div className='close-button'>
                              <Icon
                                source={MobileCancelMajor}
                                color="base" />
                            </div>
                          </div>
                          <div className='body'>
                            <ul style={{color: settingState.Setting.PopupLitmitOrderTextColor}}>
                              <li>
                                {settingState.Setting.TextMaxSubTotalValue != null && settingState.Setting.TextMaxSubTotalValue != undefined ? settingState.Setting.TextMaxSubTotalValue.replace('{maximum}', '500') : ''}
                              </li>
                              <li>
                              {settingState.Setting.TextMinSubTotalValue != null && settingState.Setting.TextMinSubTotalValue != undefined ? settingState.Setting.TextMinSubTotalValue.replace('{minimum}', '200') : ''}
                              </li>
                              <li>
                              {settingState.Setting.TextMinProductInTotal != null && settingState.Setting.TextMinProductInTotal != undefined ? settingState.Setting.TextMinProductInTotal.replace('{minimum}', '2') : ''}
                              </li>
                              <li>
                              {settingState.Setting.TextMaxProductInTotal != null && settingState.Setting.TextMaxProductInTotal != undefined ? settingState.Setting.TextMaxProductInTotal.replace('{maximum}', '5') : ''}
                              </li>
                            </ul>
                          </div>
                          <div className='footer'>
                            <div className='button-ok' style={{ backgroundColor: settingState.Setting.LimitOrderBackgroundColorButtonOK, color: settingState.Setting.LimitOrderTextColorButtonOK }}>{settingState.Setting.LimitOrderTextButtonOK}</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className='cb'>
              </div>
            </div>
            <div className="alert-cart-page">
              <div className='colLeft'>
                <div className='section cart-page'>
                  <Layout>
                    <Layout.Section oneThird>
                      <Card>
                        <Card.Section>
                          <Heading size="small">2. Button “Check-out”</Heading>
                          <div className='element-general'>
                            <div className="break-line"></div>
                            <p className='only-text'>When the order doesn’t meet the rules and customer try to click the button “Check-out”, there will be the alert pop-up again. Customize text in the button “Check-out”:</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “Order is not valid”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    id='CheckoutLimitOrderIsNotValid'
                                    placeholder='Order is not valid'
                                    value={settingState.Setting.CheckoutLimitOrderIsNotValid}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          CheckoutLimitOrderIsNotValid: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                    maxLength={30}
                                    showCharacterCount
                                  />
                                </div>
                                <div className='cb'>
                                </div>
                              </div>
                            </div>
                            <div className='group-col-half'>
                              <div className='item'>
                                <div className='itemLeft'>
                                  <p className='title'>Background color</p>
                                  <div className='flex flex-align-center'>
                                    <div className='w90pt'>
                                      <TextField
                                        id='LimitOrderBackgroundColorButtonCheckout'
                                        placeholder='Background color'
                                        value={settingState.Setting.LimitOrderBackgroundColorButtonCheckout}
                                        onChange={(e) => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting: {
                                              ...settingState.Setting,
                                              LimitOrderBackgroundColorButtonCheckout: e == '' ? '#000000' : e.trim(),
                                            },
                                            IsOpenSaveToolbar: true
                                          }))
                                        }}
                                      />

                                    </div>
                                    <input type="color" value={settingState.Setting.LimitOrderBackgroundColorButtonCheckout} onChange={e => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          LimitOrderBackgroundColorButtonCheckout: e.target.value == '' ? '#000000' : e.target.value.toUpperCase(),
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }} />
                                  </div>


                                </div>
                                <div className='itemRight'>
                                  <p className='title'>Text color</p>
                                  <div className='flex flex-align-center'>
                                    <div className='w90pt'>
                                      <TextField
                                        id='LimitOrderTextColorButtonCheckout'
                                        placeholder='Text color'
                                        value={settingState.Setting.LimitOrderTextColorButtonCheckout}
                                        onChange={(e) => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting: {
                                              ...settingState.Setting,
                                              LimitOrderTextColorButtonCheckout: e == '' ? '#FFFFFF' : e,
                                            },
                                            IsOpenSaveToolbar: true
                                          }))
                                        }}
                                      />
                                    </div>
                                    <input type="color" value={settingState.Setting.LimitOrderTextColorButtonCheckout} onChange={e => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          LimitOrderTextColorButtonCheckout: e.target.value == '' ? '#FFFFFF' : e.target.value.toUpperCase(),
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }} />
                                  </div>

                                </div>
                                <div className='cb'>

                                </div>
                              </div>
                            </div>
                          </div>
                        </Card.Section>
                      </Card>
                    </Layout.Section>
                  </Layout>
                </div>
              </div>

              <div className='cb'>
              </div>
            </div>
          </div>
      }
      {settingState.IsOpenSaveToolbar ?
        <div className='head'>
          <ContextualSaveBar
            message="Unsaved changes"
            saveAction={{
              content: "Save settings",
              onAction: () => {
                dispatch(saveSetting())
              },
              loading: settingState.IsSaveLoading,
            }}
            discardAction={{
              content: "Discard",
              onAction: () => {
                dispatch(setSetting({
                  ...settingState,
                  IsOpenSaveToolbar: false
                }))
              },
            }}
          />
        </div>
        : <></>}
      {settingState.IsOpenSaveToolbar ? <>
        <PageActions
          primaryAction={{
            content: 'Save settings',
            onAction: () => {
              dispatch(saveSetting())
            },
            loading: settingState.IsSaveLoading
          }}
          secondaryActions={[
            {
              content: 'Discard',
              onAction: () => {
                dispatch(setSetting({
                  ...settingState,
                  IsOpenSaveToolbar: false
                }))
              },
            },
          ]}
        />
      </> :
        <></>
      }
      {settingState.IsOpenSaveResult ? <Toast content={settingState.MessageSaveResult} duration={2400} onDismiss={() => {
        dispatch(setSetting({
          ...settingState,
          IsOpenSaveResult: false
        }))
      }} /> : null}

    </>
  )
}

export default withRouter(LimitOrder)