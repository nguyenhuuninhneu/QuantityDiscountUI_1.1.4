import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageActions, Card, Layout, Heading, TextStyle, Button, Select, ButtonGroup, TextField, Toast, Icon, DataTable, Stack, Checkbox, ContextualSaveBar } from '@shopify/polaris';
import { DeleteMinor, QuestionMarkMajor, CircleInformationMajor, CircleRightMajor, ViewMinor, ConfettiMajor, MobileCancelMajor } from '@shopify/polaris-icons';
import Loading from '../../components/plugins/Loading';
import { setSetting } from '../../state/modules/setting/actions';
import { saveSetting } from '../../state/modules/setting/operations';
import { withRouter } from "react-router-dom";

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
                            <p className='only-text'>When the purchase is greater than maximum:</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                “You can only choose maximum of {"{maximum}"} for the {"{collection_name}"}”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    id='TextMaxCollection'
                                    placeholder='You can only choose maximum of {maximum} for the {collection_name}'
                                    value={settingState.Setting.TextMaxCollection}
                                    onChange={(e) => {
                                      // var newRows = rowsPreview.map((p, i) =>
                                      //   (i == index ? { ...p, Quantity: e } : p)
                                      // )
                                      // setRowPreview(newRows);
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          TextMaxCollection: e,
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
                            <p className='only-text'>When the purchase is less than minimum:</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                “You have to choose minimum of {"{minimum}"} for the {"{collection_name}"}”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    id='TextMinCollection'
                                    placeholder='You have to choose minimum of {minimum} for the {collection_name}'
                                    value={settingState.Setting.TextMinCollection}
                                    onChange={(e) => {
                                      // var newRows = rowsPreview.map((p, i) =>
                                      //   (i == index ? { ...p, Quantity: e } : p)
                                      // )
                                      // setRowPreview(newRows);
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          TextMinCollection: e,
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
                            <p className='only-text'>When customer choose within the allowed range but already bought some products in this collection before and total product purchased all time exceeds maximum (only works if you choose “Limit to customer lifetime” in each limit collection)</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                “You have already bought {"{total_purchased}"} of {"{collection_name}"} before. You can only buy maximum of {"{maximum}"} for the {"{collection_name}"}.
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    id='TextMaxCollectionTotalPurchased'
                                    placeholder='You have already bought {total_purchased} of {collection_name} before. You can only buy maximum of {maximum} for the {collection_name}.'
                                    value={settingState.Setting.TextMaxCollectionTotalPurchased}
                                    onChange={(e) => {
                                      // var newRows = rowsPreview.map((p, i) =>
                                      //   (i == index ? { ...p, Quantity: e } : p)
                                      // )
                                      // setRowPreview(newRows);
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          TextMaxCollectionTotalPurchased: e,
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
                            <ul style={{ color: settingState.Setting.PopupLitmitOrderTextColor }}>
                              <li>
                                {settingState.Setting.TextMaxCollection != null && settingState.Setting.TextMaxCollection != undefined ? settingState.Setting.TextMaxCollection.replace('{maximum}', '500').replace('{collection_name}', 'Summer T-shirt') : ''}
                              </li>
                              <li>
                                {settingState.Setting.TextMinCollection != null && settingState.Setting.TextMinCollection != undefined ? settingState.Setting.TextMinCollection.replace('{minimum}', '200').replace('{collection_name}', 'Summer T-shirt') : ''}
                              </li>
                              <li>
                                {settingState.Setting.TextMaxCollectionTotalPurchased != null && settingState.Setting.TextMaxCollectionTotalPurchased != undefined ? settingState.Setting.TextMaxCollectionTotalPurchased.replace('{total_purchased}', '5').replaceAll('{collection_name}', 'Summer T-shirt').replace('{maximum}', '6') : ''}
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