import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageActions, Card, Layout, Heading, TextStyle, Button, Select, ButtonGroup, TextField, Toast, Icon, DataTable, Stack, Checkbox, ContextualSaveBar } from '@shopify/polaris';
import { DeleteMinor, QuestionMarkMajor, CircleInformationMajor, CircleRightMajor, ViewMinor, ConfettiMajor } from '@shopify/polaris-icons';
import Loading from '../../components/plugins/Loading';
import { setSetting } from '../../state/modules/setting/actions';
import { saveSetting } from '../../state/modules/setting/operations';
import { withRouter } from "react-router-dom";

function LimitPurchaseFeature() {
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
                          <Heading size="small">1. Status</Heading>
                          <div className='element-general'>
                            <div className="break-line"></div>
                            <Stack>
                              <Checkbox
                                label="Check limit on product page"
                                checked={settingState.Setting2.CheckLimitProPage}
                                onChange={(e) => {
                                  dispatch(setSetting({
                                    ...settingState,
                                    Setting2: {
                                      ...settingState.Setting2,
                                      CheckLimitProPage: e,
                                    },
                                    IsOpenSaveToolbar: true
                                  }))

                                }}
                              />
                            </Stack>
                            <div className="break-line"></div>
                            <Stack>
                              <Checkbox
                                label="Check limit on cart page"
                                checked={settingState.Setting2.CheckLimitCartPage}
                                onChange={(e) => {
                                  dispatch(setSetting({
                                    ...settingState,
                                    Setting2: {
                                      ...settingState.Setting2,
                                      CheckLimitCartPage: e,
                                    },
                                    IsOpenSaveToolbar: true
                                  }))

                                }}
                              />
                            </Stack>
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
            <div className="product-page">
              <div className='colLeft'>
                <div className='section product-page'>
                  <Layout>
                    <Layout.Section oneThird>
                      <Card>
                        <Card.Section>
                          <Heading size="small">2. Limit table</Heading>
                          <div className='element-general'>
                          <div className="break-line"></div>
                          <Checkbox
                                id='ShowLimitTableOnCartPage'
                                label="Show limit table on cart page"
                                checked={settingState.Setting2.ShowLimitTableOnCartPage}
                                onChange={(e) => {
                                  dispatch(setSetting({
                                    ...settingState,
                                    Setting2: {
                                      ...settingState.Setting2,
                                      ShowLimitTableOnCartPage: e,
                                    },
                                    IsOpenSaveToolbar: true
                                  }))

                                }}
                              />
                            <p className='only-text'>Customize limit title</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “Purchase limit”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    placeholder='Purchase limit'
                                    value={settingState.Setting2.TextPurchaseLimit}
                                    onChange={(e) => {
                                      // var newRows = rowsPreview.map((p, i) =>
                                      //   (i == index ? { ...p, Quantity: e } : p)
                                      // )
                                      // setRowPreview(newRows);
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          TextPurchaseLimit: e,
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
                                  <p className='title'>Font size</p>
                                  <div className="relative">
                                    <TextField
                                      id='FontSizeTitlePurchaseLimit'
                                      placeholder='Font size'
                                      value={settingState.Setting2.FontSizeTitlePurchaseLimit}
                                      onChange={(e) => {
                                        dispatch(setSetting({
                                          ...settingState,
                                          Setting2: {
                                            ...settingState.Setting2,
                                            FontSizeTitlePurchaseLimit: e == '' ? '11' : validateNumber(e.trim()) ? e.trim() : "11",
                                          },
                                          IsOpenSaveToolbar: true
                                        }))
                                      }}
                                      type="number"
                                      min={11}
                                      max={25}
                                    />
                                    <div className='background-disabled'></div>
                                  </div>

                                </div>
                                <div className='itemRight'>
                                  <p className='title'>Text color</p>
                                  <div className='flex flex-align-center'>
                                    <div className='w90pt'>
                                      <TextField
                                        id='TextColorTitlePurchaseLimit'
                                        placeholder='Text color'
                                        value={settingState.Setting2.TextColorTitlePurchaseLimit}
                                        onChange={(e) => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting2: {
                                              ...settingState.Setting2,
                                              TextColorTitlePurchaseLimit: e == '' ? '#FFFFFF' : e.trim(),
                                            },
                                            IsOpenSaveToolbar: true
                                          }))
                                        }}
                                      />
                                    </div>
                                    <input type="color" value={settingState.Setting2.TextColorTitlePurchaseLimit} onChange={e => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          TextColorTitlePurchaseLimit: e.target.value == '' ? '#FFFFFF' : e.target.value.toUpperCase(),
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
                            <div className="break-line"></div>
                            <p className='only-text'>Customize first table row</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “Minimum”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    placeholder='Minimum'
                                    value={settingState.Setting2.TextMinimum}
                                    onChange={(e) => {
                                      // var newRows = rowsPreview.map((p, i) =>
                                      //   (i == index ? { ...p, Quantity: e } : p)
                                      // )
                                      // setRowPreview(newRows);
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          TextMinimum: e,
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
                              <div className='item'>
                                <div className='col col1'>
                                  “Maximum”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    placeholder='Maximum'
                                    value={settingState.Setting2.TextMaximum}
                                    onChange={(e) => {
                                      // var newRows = rowsPreview.map((p, i) =>
                                      //   (i == index ? { ...p, Quantity: e } : p)
                                      // )
                                      // setRowPreview(newRows);
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          TextMaximum: e,
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
                              {/* <div className='item'>
                                <div className='col col1'>
                                  “Quantity”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    placeholder='Quantity'
                                    value={settingState.Setting2.TextQuantity}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          TextQuantity: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                  />
                                </div>
                                <div className='cb'>
                                </div>
                              </div> */}
                            </div>
                            <div className='group-col-half'>
                              <div className='item'>
                                <div className='itemLeft'>
                                  <p className='title'>Font size</p>
                                  <div className="relative">
                                    <TextField
                                      id='FontSizeLimitTable'
                                      placeholder='Font size'
                                      value={settingState.Setting2.FontSizeLimitTable}
                                      onChange={(e) => {
                                        dispatch(setSetting({
                                          ...settingState,
                                          Setting2: {
                                            ...settingState.Setting2,
                                            FontSizeLimitTable: e == '' ? '11' : validateNumber(e.trim()) ? e.trim() : "11",
                                          },
                                          IsOpenSaveToolbar: true
                                        }))
                                      }}
                                      type="number"
                                      min={11}
                                      max={25}
                                    />
                                    <div className='background-disabled'></div>
                                  </div>

                                </div>
                                <div className='cb'>

                                </div>
                              </div>
                              <div className='item'>
                                <div className='itemLeft'>
                                  <p className='title'>Text color</p>
                                  <div className='flex flex-align-center'>
                                    <div className='w90pt'>
                                      <TextField
                                        id='TextColorLimitTable'
                                        placeholder='Text color'
                                        value={settingState.Setting2.TextColorLimitTable}
                                        onChange={(e) => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting2: {
                                              ...settingState.Setting2,
                                              TextColorLimitTable: e == '' ? '#000000' : e,
                                            },
                                            IsOpenSaveToolbar: true
                                          }))
                                        }}
                                      />
                                    </div>
                                    <input type="color" value={settingState.Setting2.TextColorLimitTable} onChange={e => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          TextColorLimitTable: e.target.value == '' ? '#000000' : e.target.value.toUpperCase(),
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }} />
                                  </div>

                                </div>
                                <div className='itemRight'>
                                  <p className='title'>Background color</p>
                                  <div className='flex flex-align-center'>
                                    <div className='w90pt'>
                                      <TextField
                                        id='BackgroundColorLimitTable'
                                        placeholder='Background color'
                                        value={settingState.Setting2.BackgroundColorLimitTable}
                                        onChange={(e) => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting2: {
                                              ...settingState.Setting2,
                                              BackgroundColorLimitTable: e == '' ? '#F7CA00' : e.trim(),
                                            },
                                            IsOpenSaveToolbar: true
                                          }))
                                        }}
                                      />

                                    </div>
                                    <input type="color" value={settingState.Setting2.BackgroundColorLimitTable} onChange={e => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          BackgroundColorLimitTable: e.target.value == '' ? '#F7CA00' : e.target.value.toUpperCase(),
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
              <div className='colRight'>
                <div className='section section-preview bg-fff'>
                  <div className='preview'>
                    <h2 className="Polaris-Heading Heading-Icon Heading-Preview"> <Icon source={ViewMinor} color='base'></Icon> How will it look on your product page
                    </h2>
                    <div className='bg-bound'>
                      <div className='preview-table'>
                        <h2 className="Polaris-Heading Heading-Bottom-10 Heading-Icon-Right" style={{ fontSize: settingState.Setting2.FontSizeTitlePurchaseLimit + 'px', color: settingState.Setting2.TextColorTitlePurchaseLimit }}> {settingState.Setting2.TextPurchaseLimit}
                        </h2>
                        <Card>
                          <div className="item-center">
                            <div className=""><div className="Polaris-DataTable__Navigation">
                              <button className="Polaris-Button Polaris-Button--disabled Polaris-Button--plain Polaris-Button--iconOnly" aria-label="" type="button" disabled=""><span className="Polaris-Button__Content">
                                <span className="Polaris-Button__Icon"><span className="Polaris-Icon"><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M12 16a.997.997 0 0 1-.707-.293l-5-5a.999.999 0 0 1 0-1.414l5-5a.999.999 0 1 1 1.414 1.414L8.414 10l4.293 4.293A.999.999 0 0 1 12 16z"></path></svg></span></span></span></button><button className="Polaris-Button Polaris-Button--plain Polaris-Button--iconOnly" aria-label="" type="button"><span className="Polaris-Button__Content"><span className="Polaris-Button__Icon"><span className="Polaris-Icon"><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M8 16a.999.999 0 0 1-.707-1.707L11.586 10 7.293 5.707a.999.999 0 1 1 1.414-1.414l5 5a.999.999 0 0 1 0 1.414l-5 5A.997.997 0 0 1 8 16z"></path></svg></span></span></span></button></div><div className="Polaris-DataTable"><div className="Polaris-DataTable__ScrollContainer">
                                  <table className="Polaris-DataTable__Table">
                                    <thead>
                                      <tr>
                                        <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--header" scope="col" style={{ fontSize: settingState.Setting2.FontSizeLimitTable + 'px', color: settingState.Setting2.TextColorLimitTable, backgroundColor: settingState.Setting2.BackgroundColorLimitTable }}>{settingState.Setting2.TextMinimum}</th>
                                        <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header" scope="col" style={{ fontSize: settingState.Setting2.FontSizeLimitTable + 'px', color: settingState.Setting2.TextColorLimitTable, backgroundColor: settingState.Setting2.BackgroundColorLimitTable }}>{settingState.Setting2.TextMaximum}</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr className="Polaris-DataTable__TableRow Polaris-DataTable--hoverable">
                                        <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn" scope="row">3</th>
                                        <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop">5</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>

                          </div>
                        </Card>
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
                          <Heading size="small">3. Alert text in product page</Heading>
                          <div className='element-general'>
                            <div className="break-line"></div>
                            <p className='only-text'>When customer choose more than maximum:</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “You can only choose maximum of {"{maximum}"} products”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    placeholder='“You can only choose maximum of {maximum} products”'
                                    value={settingState.Setting2.TextMaximumLimitText}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          TextMaximumLimitText: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                    multiline={2}
                                  />
                                </div>
                                <div className='cb'>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='element-general'>
                            <div className="break-line"></div>
                            <p className='only-text'>When customer choose less than minimum:</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “You can only choose minimum of {"{minimum}"} products”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    placeholder='“You can only choose minimum of {minimum} products”'
                                    value={settingState.Setting2.TextMinimumLimitText}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          TextMinimumLimitText: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                    multiline={2}
                                  />
                                </div>
                                <div className='cb'>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='element-general'>
                            <div className="break-line"></div>
                            <p className='only-text'>When customer choose within the allowed range but total product in cart exceeds maximum:</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “You already have {"{quantity}"} of this product in your cart. You can only choose maximum of {"{maximum}"} products in total. ”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    placeholder='“You already have {quantity} of this product in your cart. You can only choose maximum of {maximum} products in total”'
                                    value={settingState.Setting2.TextQuantityMaximumLimitText}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          TextQuantityMaximumLimitText: e,
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
                          <div className='element-general'>
                            <div className="break-line"></div>
                            <p className='only-text'>When customer choose within the allowed range but already bought this product before and total product purchased all time exceeds maximum (only works if you choose “Limit to customer lifetime” in each limit)</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “You have already bought {"{total_purchased}"} of this product. You can only buy maximum of {"{maximum}"} products in total.”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    id='LimitUsageTextMaximumProductsInTotal'
                                    placeholder='“You have already bought {total_purchased} of this product. You can only buy maximum of {maximum} products in total.”'
                                    value={settingState.Setting2.LimitUsageTextMaximumProductsInTotal}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          LimitUsageTextMaximumProductsInTotal: e,
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
                          <Heading size="small">4. Alert text in cart page</Heading>
                          <div className='element-general'>
                            <div className="break-line"></div>
                            <p className='only-text'>When customer update quantity and total quantity exceeds maximum:</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “You can only choose maximum of {"{maximum}"} {"{product_title}"}”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    placeholder='“You can only choose maximum of {maximum} {product_title}”'
                                    value={settingState.Setting2.TextMaximumProductTitle}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          TextMaximumProductTitle: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                    multiline={2}
                                  />
                                </div>
                                <div className='cb'>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='element-general'>
                            <div className="break-line"></div>
                            <p className='only-text'>When customer update quantity and total quantity is less than minimum:</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “You have to choose minimum of {"{minimum}"} {"{product_title}"}”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    placeholder='“You have to choose minimum of {minimum} {product_title}”'
                                    value={settingState.Setting2.TextMinimumProductTitle}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          TextMinimumProductTitle: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                    multiline={2}
                                  />
                                </div>
                                <div className='cb'>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='element-general'>
                            <div className="break-line"></div>
                            <p className='only-text'>When customer update quantity but already bought this product before and total product purchased all time exceeds maximum (only works if you choose “Limit to customer lifetime” in each limit)</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “You have already bought {"{total_purchased}"} {"{product_title}"}. You can only buy maximum of {"{maximum}"} {"{product_title}"}”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    id='LimitUsageTextMaximumProductTitle'
                                    placeholder='You have already bought {total_purchased} {product_title}. You can only buy maximum of {maximum} {product_title}.'
                                    value={settingState.Setting2.LimitUsageTextMaximumProductTitle}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          LimitUsageTextMaximumProductTitle: e,
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

export default withRouter(LimitPurchaseFeature);