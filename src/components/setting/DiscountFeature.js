import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageActions, Card, Layout, Heading, TextStyle, Button, ButtonGroup, TextField, Toast, Icon, DataTable, Stack, Checkbox, ContextualSaveBar, Modal } from '@shopify/polaris';
import { DeleteMinor, QuestionMarkMajor, CircleInformationMajor, CircleRightMajor, ViewMinor, ConfettiMajor } from '@shopify/polaris-icons';
import Loading from '../../components/plugins/Loading';
import { setSetting } from '../../state/modules/setting/actions';
import { saveSetting, fetchSetting, synchronizeDiscountFromShopify, getProcessDiscountCode } from '../../state/modules/setting/operations';
import { setMenu, setURL } from '../../state/modules/app/actions';
import Select from 'react-select';
import config from '../../config/config';
import axios from 'axios';
import moreAppConfig from '../../config/moreAppConfig';
import ReactInterval from 'react-interval';
import { withRouter, useHistory } from "react-router-dom";


function DiscountFeature() {
  const dispatch = useDispatch();
  const history = useHistory();
  const appState = useSelector((state) => state.app);
  const settingState = useSelector((state) => state.setting.ListSetting);

  const dataRowPreview = [
    ['3', '10', '270'],
    ['4', '15', '320'],
    ['5', '20', '350']
  ]
  const dataRowCardPreview = [
    ['3', '10', '270'],
    ['4', '15', '320'],
  ]
  const [rowsPreview, setRowPreview] = useState(dataRowPreview);
  const [rowsCardPreview, setRowCardPreview] = useState(dataRowCardPreview);
  const [isOpenDiscountCode, setIsOpenDiscountCode] = useState(false);
  const [isShowPopupUpgrade, setIsShowPopupUpgrade] = useState(false);
  const getDiscountCode = async () => {
    await axios.get(config.rootLink + '/FrontEnd/GetDiscountCode', {
      params: {
        shop: config.shop,
        token: config.token,
      }
    })
      .then((res) => {
        const result = res?.data;
        dispatch(setSetting({
          ...settingState,
          DiscountDetail: result.discountDetail,
          TotalDiscountCode: result.discountDetail.length,
          IsLoadingPage: false
        }))

      })
      .catch(err => console.log(err))
  }
  useEffect(() => {
    getDiscountCode();
  }, []);
  const validateNumber = (e) => {
    if (isNaN(e)) {
      return false;
    } else {
      return true;
    }
  }
  const handleSelectLayoutType = (value) => {
    dispatch(setSetting({
      ...settingState,
      Setting: {
        ...settingState.Setting,
        LayoutInProductPage: value.value
      },
      IsOpenSaveToolbar: true
    }))
  };
  return (
    <>
      {
        settingState.IsLoadingPage ? <Loading></Loading>
          :
          <>
            <ReactInterval timeout={500} enabled={settingState.DisplayProcessShopify}
              callback={() => {
                dispatch(getProcessDiscountCode("UpdateDiscountCode"))
              }} />

            <div className='discount-feature'>
              <div className='colLeft'>
                <div className='section product-page'>
                  <Layout>
                    <Layout.Section oneThird>
                      <Card>
                        <Card.Section>
                          <Heading size="small">1. Product page</Heading>
                          <div className='element-general'>
                            <div className="break-line"></div>
                            <Stack>
                              <Checkbox
                                id='ShowDiscountProductPage'
                                label="Show discount in product page"
                                checked={settingState.Setting.ShowDiscountProductPage}
                                onChange={(e) => {
                                  dispatch(setSetting({
                                    ...settingState,
                                    Setting: {
                                      ...settingState.Setting,
                                      ShowDiscountProductPage: e,
                                    },
                                    IsOpenSaveToolbar: true
                                  }))

                                }}
                              />
                            </Stack>
                            <div className="break-line"></div>
                            <Stack>
                              <Checkbox
                                id='ShowDescription'
                                label="Show description"
                                checked={settingState.Setting.ShowDescription}
                                onChange={(e) => {
                                  dispatch(setSetting({
                                    ...settingState,
                                    Setting: {
                                      ...settingState.Setting,
                                      ShowDescription: e,
                                    },
                                    IsOpenSaveToolbar: true
                                  }))

                                }}
                              />
                            </Stack>
                            {
                              settingState.Setting.ShowDescription ? <>
                                <div className="break-line"></div>
                                <div className='element-general-child'>
                                  <p className='only-text'>For “Minimum cart quantity” condition</p>
                                  <TextField
                                    id='TextMinimumCartQuantity'
                                    placeholder='This discount is applied to the total quantity of products in your cart'
                                    value={settingState.Setting2.TextMinimumCartQuantity}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          TextMinimumCartQuantity: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                    multiline={2}
                                  />
                                </div>
                                <div className="break-line"></div>
                                <div className='element-general-child'>
                                  <p className='only-text'>For “Minimum same product quantity” condition</p>
                                  <TextField
                                    id='TextMinimumSameProductQuantity'
                                    placeholder='This discount is applied to the total quantity of this product in your cart'
                                    value={settingState.Setting2.TextMinimumSameProductQuantity}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          TextMinimumSameProductQuantity: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                    multiline={2}
                                  />
                                </div>
                                <div className="break-line"></div>

                                <div className='element-general-child'>
                                  <p className='only-text'>For “Minimum same product variant quantity” condition</p>
                                  <TextField
                                    id='TextMinimumSameProductVariantQuantity'
                                    placeholder='This discount is applied to the total quantity of the same variant of this product in your cart'
                                    value={settingState.Setting2.TextMinimumSameProductVariantQuantity}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          TextMinimumSameProductVariantQuantity: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                    multiline={2}
                                  />
                                </div>
                              </> : <></>
                            }

                          </div>

                        </Card.Section>
                        {/* Custome discount title */}
                        <Card.Section>
                          <div className='element-general'>
                            <p className='only-text'>Customize discount title</p>
                            <div className='group-fill-text'>
                              <div className='item'>
                                <div className='col col1'>
                                  “🔥 Buy more, save more! 🔥”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    id='TextQuantityBreaks'
                                    placeholder='🔥 Buy more, save more! 🔥'
                                    value={settingState.Setting.TextQuantityBreaks}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          TextQuantityBreaks: e,
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
                                      id='FontSizeDiscountTitle'
                                      placeholder='Font size'
                                      value={settingState.Setting2.FontSizeDiscountTitle}
                                      onChange={(e) => {
                                        dispatch(setSetting({
                                          ...settingState,
                                          Setting2: {
                                            ...settingState.Setting2,
                                            FontSizeDiscountTitle: e == '' ? '11' : validateNumber(e.trim()) ? e.trim() : "11",
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
                                        id='TextColorDiscountTitle'
                                        placeholder='Text color'
                                        value={settingState.Setting2.TextColorDiscountTitle}
                                        onChange={(e) => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting2: {
                                              ...settingState.Setting2,
                                              TextColorDiscountTitle: e == '' ? '#FFFFFF' : e.trim(),
                                            },
                                            IsOpenSaveToolbar: true
                                          }))
                                        }}
                                      />
                                    </div>
                                    <input type="color" value={settingState.Setting2.TextColorDiscountTitle} onChange={e => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          TextColorDiscountTitle: e.target.value == '' ? '#FFFFFF' : e.target.value.toUpperCase(),
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
                        {/* Layout in Page */}
                        <Card.Section>
                          <div className='element-general'>
                            <p className='only-text'>Layout in product page</p>
                            <Select
                              id='LayoutInProductPage'
                              // label="Discount based on"
                              defaultValue={settingState.ListLayout[2]}
                              options={settingState.ListLayout}
                              onChange={(value) => {
                                handleSelectLayoutType(value);
                              }}
                              isSearchable={false}
                              value={settingState.ListLayout.filter(p => p.value == settingState.Setting.LayoutInProductPage)[0] || settingState.ListLayout[2]}
                            />
                            <div className="break-line"></div>
                            {
                              settingState.Setting.LayoutInProductPage === 3 ? <>
                                <p className='only-text'>Select card theme</p>

                                <div className='group-card-theme'>
                                  <div className={settingState.Setting2.CardTheme == 0 ? 'item-card-theme active' : 'item-card-theme'} style={{ color: settingState.Setting2.TextColorCard, fontSize: settingState.Setting2.FontSizeCard + 'px' }}>
                                    <Button onClick={() => {

                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          CardTheme: 0,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}>
                                      <div className="card-left-right" style={{ backgroundColor: settingState.Setting2.BackgroundColorCard }}>
                                        <div className="card-inside">
                                          <p className="buy" style={{ color: settingState.Setting2.TextColorCard, fontSize: settingState.Setting2.FontSizeCard + 'px' }}>{settingState.Setting.TextBuy} {rowsCardPreview[1][0]}{settingState.Setting.TextPlus}</p>
                                          <p className="get" style={{ color: settingState.Setting2.TextColorCard, fontSize: settingState.Setting2.FontSizeCard + 'px' }}>{settingState.Setting2.TextGet}</p>
                                          <p className="off-card" style={{ color: settingState.Setting2.TextColorCard, fontSize: settingState.Setting2.FontSizeCard + 'px' }}>{rowsCardPreview[1][1]}% {settingState.Setting2.TextOff}</p>
                                        </div>
                                        <div className="corner-left" style={{ backgroundColor: settingState.Setting2.BackgroundColorCard }}>
                                          <div style={{
                                            content: '',
                                            position: 'absolute',
                                            top: '0',
                                            left: '-10%',
                                            width: '60%',
                                            height: '100%',
                                            backgroundColor: '#fff'
                                          }}></div>

                                          <div className="half-circle">
                                            <div style={{
                                              content: '',
                                              position: 'absolute',
                                              top: '-3px',
                                              left: '50%',
                                              width: '5px',
                                              height: '5px',
                                              backgroundColor: settingState.Setting2.BackgroundColorCard
                                            }}></div>
                                            <div style={{
                                              content: '',
                                              position: 'absolute',
                                              top: '18px',
                                              left: '50%',
                                              width: '5px',
                                              height: '5px',
                                              backgroundColor: settingState.Setting2.BackgroundColorCard
                                            }}></div>
                                          </div>
                                        </div>
                                        <div className="corner-right" style={{ backgroundColor: settingState.Setting2.BackgroundColorCard }}>
                                          <div style={{
                                            content: '',
                                            position: 'absolute',
                                            top: '0',
                                            right: '-10%',
                                            width: '60%',
                                            height: '100%',
                                            backgroundColor: '#fff'
                                          }}></div>
                                          <div className="half-circle">
                                            <div style={{
                                              content: '',
                                              position: 'absolute',
                                              top: '-3px',
                                              right: '50%',
                                              width: '5px',
                                              height: '5px',
                                              backgroundColor: settingState.Setting2.BackgroundColorCard
                                            }}></div>
                                            <div style={{
                                              content: '',
                                              position: 'absolute',
                                              top: '18px',
                                              right: '50%',
                                              width: '5px',
                                              height: '5px',
                                              backgroundColor: settingState.Setting2.BackgroundColorCard
                                            }}></div>
                                          </div>
                                        </div>
                                      </div>

                                    </Button>
                                  </div>
                                  <div className={settingState.Setting2.CardTheme == 1 ? 'item-card-theme active' : 'item-card-theme'}>
                                    <Button onClick={() => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          CardTheme: 1,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}>
                                      {/* <img src={CardOrange3} style={{ filter: filterBackgroundColorCard.replace(';', '') }} alt="" />
                                      <img src={CardBorder3} className="card-border" alt="" /> */}
                                      <div className="card-four-side" style={{ backgroundColor: settingState.Setting2.BackgroundColorCard }}>
                                        <div className="card-inside">
                                          <p className="buy" style={{ color: settingState.Setting2.TextColorCard, fontSize: settingState.Setting2.FontSizeCard + 'px' }}>{settingState.Setting.TextBuy} {rowsPreview[1][0]}{settingState.Setting.TextPlus}</p>
                                          <p className="get" style={{ color: settingState.Setting2.TextColorCard, fontSize: settingState.Setting2.FontSizeCard + 'px' }}>{settingState.Setting2.TextGet}</p>
                                          <p className="off-card" style={{ color: settingState.Setting2.TextColorCard, fontSize: settingState.Setting2.FontSizeCard + 'px' }}>{rowsPreview[1][1]}% {settingState.Setting2.TextOff}</p>
                                        </div>
                                        <div className="corner-1" style={{
                                          position: 'absolute',
                                          display: 'flex',
                                          alignItems: 'center',
                                          width: '20px',
                                          height: '20px',
                                          top: '-1px',
                                          left: '-1px',
                                          backgroundColor: settingState.Setting2.BackgroundColorCard,
                                          borderRadius: '50%',
                                          backgroundClip: 'content-box',
                                          borderRight: '3px dashed #fff',
                                          borderTopRightRadius: '50%',
                                          borderTopLeftRadius: '50%',
                                          transform: 'rotate(45deg)'
                                        }}>
                                          <div className="half-circle">
                                            <div style={{ "content": "", "position": "absolute", "top": "7px", "left": "10px", "width": "5px", "height": "5px", "background": settingState.Setting2.BackgroundColorCard }}></div>
                                            <div style={{ "content": "''", "position": "absolute", "top": "-5px", "left": "-3px", "width": "5px", "height": "5px", "background": settingState.Setting2.BackgroundColorCard }}></div>
                                          </div>
                                        </div>
                                        <div className="corner-2" style={{ "position": "absolute", "display": "flex", "alignItems": "center", "width": "20px", "height": "20px", "top": "1px", "right": "-1px", "backgroundColor": settingState.Setting2.BackgroundColorCard, "borderRadius": "50%", "backgroundClip": "content-box", "borderRight": "3px dashed #fff", "borderTopRightRadius": "50%", "borderTopLeftRadius": "50%", "transform": "rotate(135deg)" }}>
                                          <div className="half-circle">
                                            <div style={{ "content": "", "position": "absolute", "top": "-5px", "right": "7px", "width": "5px", "height": "5px", "background": settingState.Setting2.BackgroundColorCard }}></div>
                                            <div style={{ "content": "''", "position": "absolute", "top": "9px", "right": "-5px", "width": "5px", "height": "5px", "background": settingState.Setting2.BackgroundColorCard }}></div>
                                          </div>
                                        </div>
                                        <div className="corner-3" style={{ "position": "absolute", "display": "flex", "alignItems": "center", "width": "20px", "height": "20px", "bottom": "1px", "right": "-2px", "borderRadius": "50%", "backgroundClip": "content-box", "borderRight": "3px dashed #fff", "borderTopRightRadius": "50%", "borderTopLeftRadius": "50%", "transform": "rotate(210deg)", "backgroundColor": settingState.Setting2.BackgroundColorCard }}>
                                          <div className="half-circle">
                                            <div style={{ "content": "''", "position": "absolute", "top": "-5px", "right": "9px", "width": "5px", "height": "5px", "background": settingState.Setting2.BackgroundColorCard }}></div>
                                            <div style={{ "content": "''", "position": "absolute", "top": "7px", "right": "-5px", "width": "5px", "height": "5px", "background": settingState.Setting2.BackgroundColorCard }}></div>
                                          </div>
                                        </div>
                                        <div className="corner-4" style={{ "position": "absolute", "display": "flex", "alignItems": "center", "width": "22px", "height": "22px", "bottom": "1px", "left": "-2px", "borderRadius": "50%", "backgroundClip": "content-box", "borderRight": "3px dashed #fff", "borderTopRightRadius": "50%", "borderTopLeftRadius": "50%", "transform": "rotate(300deg)", "backgroundColor": settingState.Setting2.BackgroundColorCard }}>
                                          <div className="half-circle">
                                            <div style={{ "content": "''", "position": "absolute", "top": "-5px", "right": "8px", "width": "5px", "height": "5px", "background": settingState.Setting2.BackgroundColorCard }}></div>
                                            <div style={{ "content": "''", "position": "absolute", "top": "10px", "right": "-5px", "width": "5px", "height": "5px", "background": settingState.Setting2.BackgroundColorCard }}></div>
                                          </div>
                                        </div>
                                      </div>

                                    </Button>
                                  </div>
                                  <div className='cb'></div>
                                </div>
                              </>
                                : <>
                                  <Stack>
                                    <Checkbox
                                      id='ShowDiscountedPrice'
                                      label={"Show " + (settingState.Setting.LayoutInProductPage === 1 ? 'row' : 'column') + " “Discounted price”"}
                                      checked={settingState.Setting.ShowDiscountedPrice}
                                      onChange={(e) => {
                                        dispatch(setSetting({
                                          ...settingState,
                                          Setting: {
                                            ...settingState.Setting,
                                            ShowDiscountedPrice: e,
                                          },
                                          IsOpenSaveToolbar: true
                                        }))

                                      }}
                                    />
                                  </Stack>
                                </>
                            }
                          </div>

                        </Card.Section>
                        {/* Custom first table row */}
                        {
                          settingState.Setting.LayoutInProductPage === 3 ? <></> : <>
                            <Card.Section>
                              <div className='element-general'>
                                <p className='only-text'>{settingState.Setting.LayoutInProductPage === 1 ? 'Customize first table column' : settingState.Setting.LayoutInProductPage === 3 ? 'Customize card' : 'Customize first table row'}</p>
                                <div className='group-fill-text'>
                                  <div className='item'>
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
                                        id='TextQuantity'
                                        placeholder='Quantity'
                                        value={settingState.Setting.TextQuantity}
                                        onChange={(e) => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting: {
                                              ...settingState.Setting,
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
                                  </div>
                                  <div className='item'>
                                    <div className='col col1'>
                                      “Discount”
                                    </div>
                                    <div className='col col2'>
                                      <Icon
                                        source={CircleRightMajor}
                                        color="base" />
                                    </div>
                                    <div className='col col3'>
                                      <TextField
                                        id='TextDiscount'
                                        placeholder='Discount'
                                        value={settingState.Setting.TextDiscount}
                                        onChange={(e) => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting: {
                                              ...settingState.Setting,
                                              TextDiscount: e,
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
                                      “Discounted price”
                                    </div>
                                    <div className='col col2'>
                                      <Icon
                                        source={CircleRightMajor}
                                        color="base" />
                                    </div>
                                    <div className='col col3'>
                                      <TextField
                                        id='TextDiscountPrice'
                                        placeholder='Discounted price'
                                        value={settingState.Setting.TextDiscountPrice}
                                        onChange={(e) => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting: {
                                              ...settingState.Setting,
                                              TextDiscountPrice: e,
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
                                          id='TableFontSizeHeading'
                                          placeholder='Font size'
                                          value={settingState.Setting.TableFontSizeHeading}
                                          onChange={(e) => {
                                            dispatch(setSetting({
                                              ...settingState,
                                              Setting: {
                                                ...settingState.Setting,
                                                TableFontSizeHeading: e == '' ? '11' : validateNumber(e.trim()) ? e.trim() : "11",
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
                                            id='TextColorHeading'
                                            placeholder='Text color'
                                            value={settingState.Setting2.TextColorHeading}
                                            onChange={(e) => {
                                              dispatch(setSetting({
                                                ...settingState,
                                                Setting2: {
                                                  ...settingState.Setting2,
                                                  TextColorHeading: e == '' ? '#000000' : e,
                                                },
                                                IsOpenSaveToolbar: true
                                              }))
                                            }}
                                          />
                                        </div>
                                        <input type="color" value={settingState.Setting2.TextColorHeading} onChange={e => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting2: {
                                              ...settingState.Setting2,
                                              TextColorHeading: e.target.value == '' ? '#000000' : e.target.value.toUpperCase(),
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
                                            id='BackgroundColorHeading'
                                            placeholder='Background color'
                                            value={settingState.Setting2.BackgroundColorHeading}
                                            onChange={(e) => {
                                              dispatch(setSetting({
                                                ...settingState,
                                                Setting2: {
                                                  ...settingState.Setting2,
                                                  BackgroundColorHeading: e == '' ? '#FFFFFF' : e.trim(),
                                                },
                                                IsOpenSaveToolbar: true
                                              }))
                                            }}
                                          />

                                        </div>
                                        <input type="color" value={settingState.Setting2.BackgroundColorHeading} onChange={e => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting2: {
                                              ...settingState.Setting2,
                                              BackgroundColorHeading: e.target.value == '' ? '#FFFFFF' : e.target.value.toUpperCase(),
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
                          </>
                        }

                        {/* Custom table */}
                        <Card.Section>
                          <div className='element-general'>
                            <p className='only-text'>{settingState.Setting.LayoutInProductPage === 3 ? 'Customize card' : 'Customize table'}</p>

                            <div className='group-fill-text'>

                              <div className='item'>
                                <div className='col col1'>
                                  “Buy”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    id='TextBuy'
                                    placeholder='Buy'
                                    value={settingState.Setting.TextBuy}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          TextBuy: e,
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
                                  “+”
                                </div>
                                <div className='col col2'>
                                  <Icon
                                    source={CircleRightMajor}
                                    color="base" />
                                </div>
                                <div className='col col3'>
                                  <TextField
                                    id='TextPlus'
                                    placeholder='+'
                                    value={settingState.Setting.TextPlus}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          TextPlus: e,
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
                              {
                                settingState.Setting.LayoutInProductPage === 3 ? <>
                                  <div className='item'>
                                    <div className='col col1'>
                                      “get”
                                    </div>
                                    <div className='col col2'>
                                      <Icon
                                        source={CircleRightMajor}
                                        color="base" />
                                    </div>
                                    <div className='col col3'>
                                      <TextField
                                        id='TextGet'
                                        placeholder='get'
                                        value={settingState.Setting2.TextGet}
                                        onChange={(e) => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting2: {
                                              ...settingState.Setting2,
                                              TextGet: e,
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
                                      “off”
                                    </div>
                                    <div className='col col2'>
                                      <Icon
                                        source={CircleRightMajor}
                                        color="base" />
                                    </div>
                                    <div className='col col3'>
                                      <TextField
                                        id='TextOff'
                                        placeholder='off'
                                        value={settingState.Setting2.TextOff}
                                        onChange={(e) => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting2: {
                                              ...settingState.Setting2,
                                              TextOff: e,
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
                                      each
                                    </div>
                                    <div className='col col2'>
                                      <Icon
                                        source={CircleRightMajor}
                                        color="base" />
                                    </div>
                                    <div className='col col3'>
                                      <TextField
                                        id='TextEach'
                                        placeholder='off'
                                        value={settingState.Setting.TextEach}
                                        onChange={(e) => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting: {
                                              ...settingState.Setting,
                                              TextEach: e,
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
                                </> :
                                  <></>}
                            </div>
                            {
                              settingState.Setting.LayoutInProductPage === 3 ? <>
                                <div className='group-col-half'>
                                  <div className='item'>
                                    <div className='itemLeft'>
                                      <p className='title'>Font size</p>
                                      <div className="relative">
                                        <TextField
                                          id='FontSizeCard'
                                          placeholder='Font size'
                                          value={settingState.Setting2.FontSizeCard}
                                          onChange={(e) => {
                                            dispatch(setSetting({
                                              ...settingState,
                                              Setting2: {
                                                ...settingState.Setting2,
                                                FontSizeCard: e == '' ? '11' : validateNumber(e.trim()) ? e.trim() : "11",
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
                                  <div className="break-line"></div>
                                  <div className='item'>
                                    <div className='itemLeft'>
                                      <p className='title'>Text color</p>
                                      <div className='flex flex-align-center'>
                                        <div className='w90pt'>
                                          <TextField
                                            id='TextColorCard'
                                            placeholder='Text color'
                                            value={settingState.Setting2.TextColorCard}
                                            onChange={(e) => {
                                              dispatch(setSetting({
                                                ...settingState,
                                                Setting2: {
                                                  ...settingState.Setting2,
                                                  TextColorCard: e == '' ? '#000000' : e,
                                                },
                                                IsOpenSaveToolbar: true
                                              }))
                                            }}
                                          />
                                        </div>

                                        <input type="color" value={settingState.Setting2.TextColorCard} onChange={e => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting2: {
                                              ...settingState.Setting2,
                                              TextColorCard: e.target.value == '' ? '#000000' : e.target.value.toUpperCase(),
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
                                            id='BackgroundColorCard'
                                            placeholder='Background color'
                                            value={settingState.Setting2.BackgroundColorCard}
                                            onChange={(e) => {
                                              dispatch(setSetting({
                                                ...settingState,
                                                Setting2: {
                                                  ...settingState.Setting2,
                                                  BackgroundColorCard: e == '' ? '#FFFFFF' : e.trim(),
                                                },
                                                IsOpenSaveToolbar: true
                                              }))
                                            }}
                                          />

                                        </div>
                                        <input type="color" value={settingState.Setting2.BackgroundColorCard} onChange={e => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting2: {
                                              ...settingState.Setting2,
                                              BackgroundColorCard: e.target.value == '' ? '#FFFFFF' : e.target.value.toUpperCase(),
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
                              </> : <>
                                <div className='group-col-half'>
                                  <div className='item'>
                                    <div className='itemLeft'>
                                      <p className='title'>Font size</p>
                                      <div className="relative">
                                        <TextField
                                          id='FontSizeItemInTable'
                                          placeholder='Font size'
                                          value={settingState.Setting2.FontSizeItemInTable}
                                          onChange={(e) => {
                                            dispatch(setSetting({
                                              ...settingState,
                                              Setting2: {
                                                ...settingState.Setting2,
                                                FontSizeItemInTable: e == '' ? '11' : validateNumber(e.trim()) ? e.trim() : "11",
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
                                      <p className='title'>Border size table</p>
                                      <div className="relative">
                                        <TextField
                                          id='TableBorderSize'
                                          placeholder='Border size table'
                                          value={settingState.Setting.TableBorderSize}
                                          onChange={(e) => {
                                            dispatch(setSetting({
                                              ...settingState,
                                              Setting: {
                                                ...settingState.Setting,
                                                TableBorderSize: e == '' ? '0' : validateNumber(e.trim()) ? e.trim() : "0",
                                              },
                                              IsOpenSaveToolbar: true
                                            }))
                                          }}
                                          type="number"
                                          min={1}
                                          max={25}
                                        />
                                        <div className='background-disabled'></div>
                                      </div>

                                    </div>
                                    <div className='cb'>

                                    </div>
                                  </div>
                                  <div className="break-line"></div>
                                  <div className='item'>
                                    <div className='itemLeft'>
                                      <p className='title'>Text color</p>
                                      <div className='flex flex-align-center'>
                                        <div className='w90pt'>
                                          <TextField
                                            id='TextColorItemInTable'
                                            placeholder='Text color'
                                            value={settingState.Setting2.TextColorItemInTable}
                                            onChange={(e) => {
                                              dispatch(setSetting({
                                                ...settingState,
                                                Setting2: {
                                                  ...settingState.Setting2,
                                                  TextColorItemInTable: e == '' ? '#000000' : e,
                                                },
                                                IsOpenSaveToolbar: true
                                              }))
                                            }}
                                          />
                                        </div>

                                        <input type="color" value={settingState.Setting2.TextColorItemInTable} onChange={e => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting2: {
                                              ...settingState.Setting2,
                                              TextColorItemInTable: e.target.value == '' ? '#000000' : e.target.value.toUpperCase(),
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
                                            id='BackgroundColorItemInTable'
                                            placeholder='Background color'
                                            value={settingState.Setting2.BackgroundColorItemInTable}
                                            onChange={(e) => {
                                              dispatch(setSetting({
                                                ...settingState,
                                                Setting2: {
                                                  ...settingState.Setting2,
                                                  BackgroundColorItemInTable: e == '' ? '#FFFFFF' : e.trim(),
                                                },
                                                IsOpenSaveToolbar: true
                                              }))
                                            }}
                                          />

                                        </div>
                                        <input type="color" value={settingState.Setting2.BackgroundColorItemInTable} onChange={e => {
                                          dispatch(setSetting({
                                            ...settingState,
                                            Setting2: {
                                              ...settingState.Setting2,
                                              BackgroundColorItemInTable: e.target.value == '' ? '#FFFFFF' : e.target.value.toUpperCase(),
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
                              </>
                            }
                          </div>
                        </Card.Section>
                        {
                          settingState.Setting.LayoutInProductPage === 3 ? <>
                            <Card.Section>
                              <div className='element-general'>
                                <div className="break-line"></div>
                                <Stack>
                                  <Checkbox
                                    id='ShowDiscountedPriceEachCard'
                                    label="Show discounted price below after select each card"
                                    checked={settingState.Setting2.ShowDiscountedPriceEachCard}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          ShowDiscountedPriceEachCard: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))

                                    }}
                                  />
                                </Stack>
                                <div className="break-line"></div>
                                <div className='element-general-child'>
                                  <TextField
                                    id='TextDiscountedPriceEachCard'
                                    placeholder='Total: {total_amount} ({price_per_item}/each)'
                                    disabled={!settingState.Setting2.ShowDiscountedPriceEachCard}
                                    value={settingState.Setting2.TextDiscountedPriceEachCard}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting2: {
                                          ...settingState.Setting2,
                                          TextDiscountedPriceEachCard: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                  />
                                </div>
                              </div>
                            </Card.Section>
                          </> : <>

                          </>
                        }
                        {/* CSS JS */}
                        <Card.Section>
                          <div className='element-general'>
                            <div className='group-col-half'>

                              <div className='item'>
                                <div className='itemLeft'>
                                  <p className='title'>Custom css</p>
                                  <TextField
                                    id='CustomCssProductPage'
                                    placeholder=''
                                    value={settingState.Setting.CustomCssProductPage}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          CustomCssProductPage: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                    multiline={4}
                                  />
                                </div>
                                <div className='itemRight'>
                                  <p className='title'>Custom js</p>
                                  <TextField
                                    id='CustomJsProductPage'
                                    placeholder=''
                                    value={settingState.Setting.CustomJsProductPage}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          CustomJsProductPage: e,
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
                <div className='section cart-page'>
                  <Layout>
                    <Layout.Section oneThird>
                      <Card>
                        <Card.Section>
                          <Heading size="small">2. Cart page</Heading>
                          <div className='element-general'>
                            {/* <Stack>
                              <Checkbox
                                label="Use ajax cart"
                                checked={settingState.Setting.UseAjaxCart}
                                onChange={(e) => {
                                  dispatch(setSetting({
                                    ...settingState,
                                    Setting: {
                                      ...settingState.Setting,
                                      UseAjaxCart: e,
                                    },
                                    IsOpenSaveToolbar: true
                                  }))

                                }}
                              />
                            </Stack>
                            */}
                            <div className="break-line"></div>
                            <Stack>
                              <Checkbox
                                id='ShowNotiOnCart'
                                label="Show notification on cart page"
                                checked={settingState.Setting.ShowNotiOnCart}
                                onChange={(e) => {
                                  dispatch(setSetting({
                                    ...settingState,
                                    Setting: {
                                      ...settingState.Setting,
                                      ShowNotiOnCart: e,
                                    },
                                    IsOpenSaveToolbar: true
                                  }))

                                }}
                              />
                            </Stack>
                            <div className='element-general-child'>
                              <p className='only-text'>Text notification on cart page</p>
                              <TextField
                                id='TextNotiOnCart'
                                placeholder='Buy {Quantity} + discount {Percent or price}'
                                value={settingState.Setting.TextNotiOnCart}
                                onChange={(e) => {
                                  dispatch(setSetting({
                                    ...settingState,
                                    Setting: {
                                      ...settingState.Setting,
                                      TextNotiOnCart: e,
                                    },
                                    IsOpenSaveToolbar: true
                                  }))
                                }}
                                type="text"
                              />
                            </div>
                            <div className="break-line"></div>
                            <Stack>
                              <Checkbox
                                id='UseDiscountCodeOnCart'
                                label="Use discount code on cart page"
                                checked={settingState.Setting.UseDiscountCodeOnCart}
                                onChange={(e) => {
                                  dispatch(setSetting({
                                    ...settingState,
                                    Setting: {
                                      ...settingState.Setting,
                                      UseDiscountCodeOnCart: e,
                                    },
                                    IsOpenSaveToolbar: true
                                  }))

                                }}
                              />
                            </Stack>
                            <div className="break-line"></div>
                            <div className='element-general-child'>
                              {
                                settingState.Setting.UseDiscountCodeOnCart ? <>
                                  <div className="flex flex-align-center">
                                    <Button
                                      disabled={appState.DisplayProcessShopify || settingState.LoadingDiscountSync || settingState.LoadingDataSync}
                                      primary
                                      onClick={() => {
                                        dispatch(synchronizeDiscountFromShopify());
                                      }}>Sync discounts from Shopify</Button>
                                    {
                                      settingState.TextProcessShopifyCompleted != '' ? <span className="ml-10"> {settingState.TextProcessShopifyCompleted}</span> : settingState.DisplayProcessShopify ? <span className="ml-10" style={{ fontStyle: 'italic' }}>Loading {settingState.Process}%</span> : null
                                    }

                                  </div>

                                  <div className="break-line"></div>
                                  <div className="flex flex-align-center">
                                    <span className="mr-10"> Total: {settingState.TotalDiscountCode} discount codes</span> <Button onClick={() => {
                                      setIsOpenDiscountCode(true);
                                    }}
                                    >Detail</Button>
                                  </div>
                                  <div className="break-line"></div>
                                  <p className='only-text'>Discount code prefix</p>
                                  <TextField
                                    id='DisCountCodePrefix'
                                    placeholder=''
                                    disabled={!settingState.Setting.UseDiscountCodeOnCart}
                                    value={settingState.Setting.DisCountCodePrefix}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          DisCountCodePrefix: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                  />
                                  <div className="break-line"></div>

                                  <p className='only-text'>Customize text</p>

                                  <div className='group-fill-text'>

                                    <div className='item'>
                                      <div className='col col1'>
                                        “Apply”
                                      </div>
                                      <div className='col col2'>
                                        <Icon
                                          source={CircleRightMajor}
                                          color="base" />
                                      </div>
                                      <div className='col col3'>
                                        <TextField
                                          id='TextApply'
                                          placeholder='Apply'
                                          disabled={!settingState.Setting.UseDiscountCodeOnCart}
                                          value={settingState.Setting2.TextApply}
                                          onChange={(e) => {
                                            dispatch(setSetting({
                                              ...settingState,
                                              Setting2: {
                                                ...settingState.Setting2,
                                                TextApply: e,
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
                                        “Base on”
                                      </div>
                                      <div className='col col2'>
                                        <Icon
                                          source={CircleRightMajor}
                                          color="base" />
                                      </div>
                                      <div className='col col3'>
                                        <TextField
                                          id='TextBaseOn'
                                          placeholder='Base on'
                                          disabled={!settingState.Setting.UseDiscountCodeOnCart}
                                          value={settingState.Setting2.TextBaseOn}
                                          onChange={(e) => {
                                            dispatch(setSetting({
                                              ...settingState,
                                              Setting2: {
                                                ...settingState.Setting2,
                                                TextBaseOn: e,
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
                                        “Discount code”
                                      </div>
                                      <div className='col col2'>
                                        <Icon
                                          source={CircleRightMajor}
                                          color="base" />
                                      </div>
                                      <div className='col col3'>
                                        <TextField
                                          id='TextDiscountCode'
                                          placeholder='Discount code'
                                          disabled={!settingState.Setting.UseDiscountCodeOnCart}
                                          value={settingState.Setting2.TextDiscountCode}
                                          onChange={(e) => {
                                            dispatch(setSetting({
                                              ...settingState,
                                              Setting2: {
                                                ...settingState.Setting2,
                                                TextDiscountCode: e,
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
                                        “Discount code isn’t available”
                                      </div>
                                      <div className='col col2'>
                                        <Icon
                                          source={CircleRightMajor}
                                          color="base" />
                                      </div>
                                      <div className='col col3'>
                                        <TextField
                                          id='TextDiscountCodeNotAvailable'
                                          placeholder='Discount code isn’t available'
                                          disabled={!settingState.Setting.UseDiscountCodeOnCart}
                                          value={settingState.Setting2.TextDiscountCodeNotAvailable}
                                          onChange={(e) => {
                                            dispatch(setSetting({
                                              ...settingState,
                                              Setting2: {
                                                ...settingState.Setting2,
                                                TextDiscountCodeNotAvailable: e,
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
                                    <div className="break-line"></div>
                                  </div>
                                </> : <></>
                              }


                            </div>

                            <Stack>
                              <Checkbox
                                id='AutoUpSale'
                                label="Use upsale on cart page"
                                checked={settingState.Setting2.AutoUpSale}
                                onChange={(e) => {
                                  if (appState.PlanNumber !== moreAppConfig.PlanNumber.Advanced) {
                                    setIsShowPopupUpgrade(true);
                                  }
                                  else {
                                    dispatch(setSetting({
                                      ...settingState,
                                      Setting2: {
                                        ...settingState.Setting2,
                                        AutoUpSale: e,
                                      },
                                      IsOpenSaveToolbar: true
                                    }))
                                  }


                                }}
                              />
                            </Stack>
                            <div className="break-line"></div>
                            <div className='group-col-half'>
                              <div className='item'>
                                <div className='itemLeft'>
                                  <p className='title'>Custom css</p>
                                  <div className="break-line"></div>
                                  <TextField
                                    id='CustomCssCart'
                                    placeholder='Custom css'
                                    value={settingState.Setting.CustomCssCart}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          CustomCssCart: e,
                                        },
                                        IsOpenSaveToolbar: true
                                      }))
                                    }}
                                    type="text"
                                    multiline={4}
                                  />
                                </div>
                                <div className='itemRight'>
                                  <p className='title'>Custom js</p>
                                  <div className="break-line"></div>
                                  <TextField
                                    id='CustomJsCart'
                                    placeholder='Custom js'
                                    value={settingState.Setting.CustomJsCart}
                                    onChange={(e) => {
                                      dispatch(setSetting({
                                        ...settingState,
                                        Setting: {
                                          ...settingState.Setting,
                                          CustomJsCart: e,
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
              <div className='colRight'>
                <div className='section section-preview bg-fff'>
                  <div className='preview'>
                    <h2 className="Polaris-Heading Heading-Icon Heading-Preview"> <Icon source={ViewMinor} color='base'></Icon> How will it look on your product page
                    </h2>
                    <div className='bg-bound'>
                      <div className='preview-table'>
                        <h2 className="Polaris-Heading Heading-Bottom-10 Heading-Icon-Right" style={{ fontSize: settingState.Setting2.FontSizeDiscountTitle + 'px', color: settingState.Setting2.TextColorDiscountTitle }}> {settingState.Setting.TextQuantityBreaks}
                          {/* <Icon source={ConfettiMajor} color='base'></Icon> */}

                        </h2>
                        <Card>
                          {
                            settingState.Setting.LayoutInProductPage === 4 ? <>
                              <div className=""><div className="Polaris-DataTable__Navigation">
                                <button className="Polaris-Button Polaris-Button--disabled Polaris-Button--plain Polaris-Button--iconOnly" aria-label="" type="button" disabled=""><span className="Polaris-Button__Content">
                                  <span className="Polaris-Button__Icon"><span className="Polaris-Icon"><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M12 16a.997.997 0 0 1-.707-.293l-5-5a.999.999 0 0 1 0-1.414l5-5a.999.999 0 1 1 1.414 1.414L8.414 10l4.293 4.293A.999.999 0 0 1 12 16z"></path></svg></span></span></span></button><button className="Polaris-Button Polaris-Button--plain Polaris-Button--iconOnly" aria-label="" type="button"><span className="Polaris-Button__Content"><span className="Polaris-Button__Icon"><span className="Polaris-Icon"><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M8 16a.999.999 0 0 1-.707-1.707L11.586 10 7.293 5.707a.999.999 0 1 1 1.414-1.414l5 5a.999.999 0 0 1 0 1.414l-5 5A.997.997 0 0 1 8 16z"></path></svg></span></span></span></button></div><div className="Polaris-DataTable"><div className="Polaris-DataTable__ScrollContainer">
                                    <table className="Polaris-DataTable__Table" style={{ padding: settingState.Setting.TablePadding + 'px', border: settingState.Setting.TableBorderSize + 'px solid #fff' }}>
                                      <thead style={{ fontSize: settingState.Setting.TableFontSizeHeading + 'px' }}>
                                        <tr>
                                          <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--header" scope="col" style={{ fontSize: settingState.Setting.TableFontSizeHeading + 'px', color: settingState.Setting2.TextColorHeading, backgroundColor: settingState.Setting2.BackgroundColorHeading }}>{settingState.Setting.TextQuantity}</th>
                                          <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header" scope="col" style={{ fontSize: settingState.Setting.TableFontSizeHeading + 'px', color: settingState.Setting2.TextColorHeading, backgroundColor: settingState.Setting2.BackgroundColorHeading }}>{settingState.Setting.TextDiscount}</th>

                                          {
                                            settingState.Setting.ShowDiscountedPrice ? <>
                                              <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header" scope="col" style={{ fontSize: settingState.Setting.TableFontSizeHeading + 'px', color: settingState.Setting2.TextColorHeading, backgroundColor: settingState.Setting2.BackgroundColorHeading }}>{settingState.Setting.TextDiscountPrice}</th>
                                            </> : <></>
                                          }
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {
                                          rowsPreview.map((item, index) => {
                                            return (
                                              <tr className="Polaris-DataTable__TableRow Polaris-DataTable--hoverable" key={index}>
                                                <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn" scope="row" style={{ fontSize: settingState.Setting2.FontSizeItemInTable + 'px', color: settingState.Setting2.TextColorItemInTable, backgroundColor: settingState.Setting2.BackgroundColorItemInTable }}>{settingState.Setting.TextBuy + ' ' + item[0] + settingState.Setting.TextPlus}</th>
                                                <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ fontSize: settingState.Setting2.FontSizeItemInTable + 'px', color: settingState.Setting2.TextColorItemInTable, backgroundColor: settingState.Setting2.BackgroundColorItemInTable }}>{item[1] + '%'}</td>
                                                {
                                                  settingState.Setting.ShowDiscountedPrice ? <>
                                                    <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ fontSize: settingState.Setting2.FontSizeItemInTable + 'px', color: settingState.Setting2.TextColorItemInTable, backgroundColor: settingState.Setting2.BackgroundColorItemInTable }}>{item[2] + ' ' + settingState.Setting.Currency}</td>
                                                  </> : <></>
                                                }

                                              </tr>
                                            )
                                          })
                                        }

                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </> :
                              settingState.Setting.LayoutInProductPage === 1 ? <>
                                <div className=""><div className="Polaris-DataTable__Navigation">
                                  <button className="Polaris-Button Polaris-Button--disabled Polaris-Button--plain Polaris-Button--iconOnly" aria-label="" type="button" disabled=""><span className="Polaris-Button__Content">
                                    <span className="Polaris-Button__Icon"><span className="Polaris-Icon"><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M12 16a.997.997 0 0 1-.707-.293l-5-5a.999.999 0 0 1 0-1.414l5-5a.999.999 0 1 1 1.414 1.414L8.414 10l4.293 4.293A.999.999 0 0 1 12 16z"></path></svg></span></span></span></button><button className="Polaris-Button Polaris-Button--plain Polaris-Button--iconOnly" aria-label="" type="button"><span className="Polaris-Button__Content"><span className="Polaris-Button__Icon"><span className="Polaris-Icon"><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M8 16a.999.999 0 0 1-.707-1.707L11.586 10 7.293 5.707a.999.999 0 1 1 1.414-1.414l5 5a.999.999 0 0 1 0 1.414l-5 5A.997.997 0 0 1 8 16z"></path></svg></span></span></span></button></div><div className="Polaris-DataTable"><div className="Polaris-DataTable__ScrollContainer">
                                      <table className="Polaris-DataTable__Table" style={{ padding: settingState.Setting.TablePadding + 'px', border: settingState.Setting.TableBorderSize + 'px solid #fff' }}>

                                        <tbody>
                                          <tr className="Polaris-DataTable__TableRow Polaris-DataTable--hoverable">
                                            <th style={{ fontSize: settingState.Setting.TableFontSizeHeading + 'px', color: settingState.Setting2.TextColorHeading, backgroundColor: settingState.Setting2.BackgroundColorHeading }} data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--header Polaris-DataTable__Cell--header-border-none" scope="col">{settingState.Setting.TextQuantity}</th>
                                            <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn" scope="row" style={{ fontSize: settingState.Setting2.FontSizeItemInTable + 'px', color: settingState.Setting2.TextColorItemInTable, backgroundColor: settingState.Setting2.BackgroundColorItemInTable }}>{settingState.Setting.TextBuy + ' ' + rowsPreview[0][0] + settingState.Setting.TextPlus}</th>
                                            <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn" scope="row" style={{ fontSize: settingState.Setting2.FontSizeItemInTable + 'px', color: settingState.Setting2.TextColorItemInTable, backgroundColor: settingState.Setting2.BackgroundColorItemInTable }}>{settingState.Setting.TextBuy + ' ' + rowsPreview[1][0] + settingState.Setting.TextPlus}</th>
                                            <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn" scope="row" style={{ fontSize: settingState.Setting2.FontSizeItemInTable + 'px', color: settingState.Setting2.TextColorItemInTable, backgroundColor: settingState.Setting2.BackgroundColorItemInTable }}>{settingState.Setting.TextBuy + ' ' + rowsPreview[2][0] + settingState.Setting.TextPlus}</th>
                                          </tr>
                                          <tr className="Polaris-DataTable__TableRow Polaris-DataTable--hoverable">
                                            <th style={{ fontSize: settingState.Setting.TableFontSizeHeading + 'px', color: settingState.Setting2.TextColorHeading, backgroundColor: settingState.Setting2.BackgroundColorHeading }} data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--header Polaris-DataTable__Cell--header-border-none" scope="col">{settingState.Setting.TextDiscount}</th>
                                            <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ fontSize: settingState.Setting2.FontSizeItemInTable + 'px', color: settingState.Setting2.TextColorItemInTable, backgroundColor: settingState.Setting2.BackgroundColorItemInTable }}>{rowsPreview[0][1] + '%'}</td>
                                            <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ fontSize: settingState.Setting2.FontSizeItemInTable + 'px', color: settingState.Setting2.TextColorItemInTable, backgroundColor: settingState.Setting2.BackgroundColorItemInTable }}>{rowsPreview[1][1] + '%'}</td>
                                            <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ fontSize: settingState.Setting2.FontSizeItemInTable + 'px', color: settingState.Setting2.TextColorItemInTable, backgroundColor: settingState.Setting2.BackgroundColorItemInTable }}>{rowsPreview[2][1] + '%'}</td>
                                          </tr>
                                          {
                                            settingState.Setting.ShowDiscountedPrice ? <>
                                              <tr className="Polaris-DataTable__TableRow Polaris-DataTable--hoverable">
                                                <th style={{ fontSize: settingState.Setting.TableFontSizeHeading + 'px', color: settingState.Setting2.TextColorHeading, backgroundColor: settingState.Setting2.BackgroundColorHeading }} data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--header Polaris-DataTable__Cell--header-border-none" scope="col">{settingState.Setting.TextDiscountPrice}</th>
                                                <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ fontSize: settingState.Setting2.FontSizeItemInTable + 'px', color: settingState.Setting2.TextColorItemInTable, backgroundColor: settingState.Setting2.BackgroundColorItemInTable }}>{rowsPreview[0][2] + ' ' + settingState.Setting.Currency}</td>
                                                <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ fontSize: settingState.Setting2.FontSizeItemInTable + 'px', color: settingState.Setting2.TextColorItemInTable, backgroundColor: settingState.Setting2.BackgroundColorItemInTable }}>{rowsPreview[1][2] + ' ' + settingState.Setting.Currency}</td>
                                                <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ fontSize: settingState.Setting2.FontSizeItemInTable + 'px', color: settingState.Setting2.TextColorItemInTable, backgroundColor: settingState.Setting2.BackgroundColorItemInTable }}>{rowsPreview[2][2] + ' ' + settingState.Setting.Currency}</td>
                                              </tr>

                                            </> : <></>
                                          }



                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </>

                                :
                                <>

                                </>
                          }
                        </Card>
                        {

                          settingState.Setting.LayoutInProductPage == 3 ? <>
                            <div className="Polaris-CalloutCard__Buttons" style={{ display: 'flex', marginTop: 0 }}>

                              <div className={rowsCardPreview.length > 2 ? "list-card-scroll" : 'list-card'}>
                                {
                                  rowsCardPreview.map((item, index) => {
                                    return (
                                      settingState.Setting2.CardTheme == 0 ? <>
                                        <div className='card-orange' key={index} style={{ color: settingState.Setting2.TextColorCard, fontSize: settingState.Setting2.FontSizeCard + 'px' }}>
                                          <div className="card-left-right" style={{ backgroundColor: settingState.Setting2.BackgroundColorCard }}>
                                            <div className="card-inside">
                                              <p className="buy" style={{ color: settingState.Setting2.TextColorCard, fontSize: settingState.Setting2.FontSizeCard + 'px' }}>{settingState.Setting.TextBuy} {item[0]}{settingState.Setting.TextPlus}</p>
                                              <p className="get" style={{ color: settingState.Setting2.TextColorCard, fontSize: settingState.Setting2.FontSizeCard + 'px' }}>{settingState.Setting2.TextGet}</p>
                                              <p className="off-card" style={{ color: settingState.Setting2.TextColorCard, fontSize: settingState.Setting2.FontSizeCard + 'px' }}>{item[1]}% {settingState.Setting2.TextOff}</p>
                                            </div>
                                            <div className="corner-left" style={{ backgroundColor: settingState.Setting2.BackgroundColorCard }}>
                                              <div style={{
                                                content: '',
                                                position: 'absolute',
                                                top: '0',
                                                left: '-10%',
                                                width: '60%',
                                                height: '100%',
                                                backgroundColor: '#F4F6F8'
                                              }}></div>

                                              <div className="half-circle" style={{
                                                backgroundColor: '#F4F6F8'
                                              }}>
                                                <div style={{
                                                  content: '',
                                                  position: 'absolute',
                                                  top: '-3px',
                                                  left: '50%',
                                                  width: '5px',
                                                  height: '5px',
                                                  backgroundColor: settingState.Setting2.BackgroundColorCard
                                                }}></div>
                                                <div style={{
                                                  content: '',
                                                  position: 'absolute',
                                                  top: '18px',
                                                  left: '50%',
                                                  width: '5px',
                                                  height: '5px',
                                                  backgroundColor: settingState.Setting2.BackgroundColorCard
                                                }}></div>
                                              </div>
                                            </div>
                                            <div className="corner-right" style={{ backgroundColor: settingState.Setting2.BackgroundColorCard }}>
                                              <div style={{
                                                content: '',
                                                position: 'absolute',
                                                top: '0',
                                                right: '-10%',
                                                width: '60%',
                                                height: '100%',
                                                backgroundColor: '#F4F6F8'
                                              }}></div>
                                              <div className="half-circle" style={{
                                                backgroundColor: '#F4F6F8'
                                              }}>
                                                <div style={{
                                                  content: '',
                                                  position: 'absolute',
                                                  top: '-3px',
                                                  right: '50%',
                                                  width: '5px',
                                                  height: '5px',
                                                  backgroundColor: settingState.Setting2.BackgroundColorCard
                                                }}></div>
                                                <div style={{
                                                  content: '',
                                                  position: 'absolute',
                                                  top: '18px',
                                                  right: '50%',
                                                  width: '5px',
                                                  height: '5px',
                                                  backgroundColor: settingState.Setting2.BackgroundColorCard
                                                }}></div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                      </> : <>
                                        <div className='card-orange' style={{ color: settingState.Setting2.TextColorCard, fontSize: settingState.Setting2.FontSizeCard + 'px' }}>
                                          <div className="card-four-side" style={{ backgroundColor: settingState.Setting2.BackgroundColorCard }}>
                                            <div className="card-inside">
                                              <p className="buy" style={{ color: settingState.Setting2.TextColorCard, fontSize: settingState.Setting2.FontSizeCard + 'px' }}>{settingState.Setting.TextBuy} {item[0]}{settingState.Setting.TextPlus}</p>
                                              <p className="get" style={{ color: settingState.Setting2.TextColorCard, fontSize: settingState.Setting2.FontSizeCard + 'px' }}>{settingState.Setting2.TextGet}</p>
                                              <p className="off-card" style={{ color: settingState.Setting2.TextColorCard, fontSize: settingState.Setting2.FontSizeCard + 'px' }}>{item[1]}% {settingState.Setting2.TextOff}</p>
                                            </div>
                                            <div className="corner-1" style={{
                                              position: 'absolute',
                                              display: 'flex',
                                              alignItems: 'center',
                                              width: '20px',
                                              height: '20px',
                                              top: '-1px',
                                              left: '-1px',
                                              backgroundColor: settingState.Setting2.BackgroundColorCard,
                                              borderRadius: '50%',
                                              backgroundClip: 'content-box',
                                              borderRight: '3px dashed #fff',
                                              borderTopRightRadius: '50%',
                                              borderTopLeftRadius: '50%',
                                              transform: 'rotate(45deg)'
                                            }}>
                                              <div style={{ "content": "''", "position": "absolute", "top": "0", "left": "-10%", "width": "60%", "height": "100%", "background": "#F4F6F8" }}></div>
                                              <div className="half-circle" style={{
                                                backgroundColor: '#F4F6F8'
                                              }}>
                                                <div style={{ "content": "", "position": "absolute", "top": "7px", "left": "10px", "width": "5px", "height": "5px", "background": settingState.Setting2.BackgroundColorCard }}></div>
                                                <div style={{ "content": "''", "position": "absolute", "top": "-5px", "left": "-3px", "width": "5px", "height": "5px", "background": settingState.Setting2.BackgroundColorCard }}></div>
                                              </div>
                                            </div>
                                            <div className="corner-2" style={{ "position": "absolute", "display": "flex", "alignItems": "center", "width": "20px", "height": "20px", "top": "1px", "right": "-1px", "backgroundColor": settingState.Setting2.BackgroundColorCard, "borderRadius": "50%", "backgroundClip": "content-box", "borderRight": "3px dashed #fff", "borderTopRightRadius": "50%", "borderTopLeftRadius": "50%", "transform": "rotate(135deg)" }}>
                                              <div style={{ "content": "''", "position": "absolute", "top": "0", "left": "-10%", "width": "60%", "height": "100%", "background": "#F4F6F8" }}></div>
                                              <div className="half-circle" style={{
                                                backgroundColor: '#F4F6F8'
                                              }}>
                                                <div style={{ "content": "", "position": "absolute", "top": "-5px", "right": "7px", "width": "5px", "height": "5px", "background": settingState.Setting2.BackgroundColorCard }}></div>
                                                <div style={{ "content": "''", "position": "absolute", "top": "9px", "right": "-5px", "width": "5px", "height": "5px", "background": settingState.Setting2.BackgroundColorCard }}></div>
                                              </div>
                                            </div>
                                            <div className="corner-3" style={{ "position": "absolute", "display": "flex", "alignItems": "center", "width": "20px", "height": "20px", "bottom": "1px", "right": "-2px", "borderRadius": "50%", "backgroundClip": "content-box", "borderRight": "3px dashed #fff", "borderTopRightRadius": "50%", "borderTopLeftRadius": "50%", "transform": "rotate(210deg)", "backgroundColor": settingState.Setting2.BackgroundColorCard }}>
                                              <div style={{ "content": "''", "position": "absolute", "top": "0", "left": "-10%", "width": "60%", "height": "100%", "background": "#F4F6F8" }}></div>
                                              <div className="half-circle" style={{
                                                backgroundColor: '#F4F6F8'
                                              }}>
                                                <div style={{ "content": "''", "position": "absolute", "top": "-5px", "right": "9px", "width": "5px", "height": "5px", "background": settingState.Setting2.BackgroundColorCard }}></div>
                                                <div style={{ "content": "''", "position": "absolute", "top": "7px", "right": "-5px", "width": "5px", "height": "5px", "background": settingState.Setting2.BackgroundColorCard }}></div>
                                              </div>
                                            </div>
                                            <div className="corner-4" style={{ "position": "absolute", "display": "flex", "alignItems": "center", "width": "22px", "height": "22px", "bottom": "1px", "left": "-2px", "borderRadius": "50%", "backgroundClip": "content-box", "borderRight": "3px dashed #fff", "borderTopRightRadius": "50%", "borderTopLeftRadius": "50%", "transform": "rotate(300deg)", "backgroundColor": settingState.Setting2.BackgroundColorCard }}>
                                              <div style={{ "content": "''", "position": "absolute", "top": "0", "left": "-10%", "width": "60%", "height": "100%", "background": "#F4F6F8" }}></div>
                                              <div className="half-circle" style={{
                                                backgroundColor: '#F4F6F8'
                                              }}>
                                                <div style={{}}></div>
                                                <div style={{ "content": "''", "position": "absolute", "top": "-5px", "right": "8px", "width": "5px", "height": "5px", "background": settingState.Setting2.BackgroundColorCard }}></div>
                                                <div style={{ "content": "''", "position": "absolute", "top": "10px", "right": "-5px", "width": "5px", "height": "5px", "background": settingState.Setting2.BackgroundColorCard }}></div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </>

                                    )
                                  })
                                }

                              </div>
                            </div>

                          </>
                            : <></>
                        }
                        {settingState.Setting.LayoutInProductPage == 3 && settingState.Setting2.ShowDiscountedPriceEachCard ? <>
                          <p style={{ marginTop: '10px' }}>{(settingState.Setting2.TextDiscountedPriceEachCard == null ? '' : settingState.Setting2.TextDiscountedPriceEachCard).replace('{total_amount}', (rowsCardPreview[0][0] * (100 - rowsCardPreview[0][1])) + ' ' + settingState.Setting.Currency).replace('{price_per_item}', (100 - rowsCardPreview[0][1]) + ' ' + settingState.Setting.Currency)}</p>

                        </> : <></>}
                        {settingState.Setting.ShowDescription ? <>
                          <p style={{ marginTop: '10px' }}>This discount is applied to the total quantity of products in your cart</p>

                        </> : <></>}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className='cb'>

              </div>
            </div>
          </>
      }
      <>
        <div className='modal-order-detail item-center'>
          <Modal
            open={isOpenDiscountCode}
            onClose={() => {
              setIsOpenDiscountCode(false)
            }}
            title="Discount codes from Shopify"
            secondaryActions={[
              {
                content: 'Close',
                onAction: () => {
                  setIsOpenDiscountCode(false)
                },
              },
            ]}
          >
            <Modal.Section>
              <>
                <div className='order-detail item-center'>
                  <DataTable
                    columnContentTypes={[
                      'text',
                      'text',
                      'text',
                      'text',
                      'text',
                    ]}
                    headings={[
                      'Discount code',
                      'Discount type',
                      'Discount value',
                      'Minimum requirement',
                      'Target type',
                    ]}
                    // footerContent={`Showing ${currentItems.length} of ${reportState..length} results`}
                    rows={settingState.DiscountDetail != null && settingState.DiscountDetail.length > 0 ? settingState.DiscountDetail.map((discount, index) => {
                      return [
                        discount.DiscountCode,
                        discount.DiscountType,
                        discount.Value,
                        discount.MinimumOrderAmount,
                        moreAppConfig.TargetType[discount.TargetType],

                      ];
                    }) : []}
                  />
                  {
                    settingState.TotalDiscountCode === 0 ? <>
                      <div className="Polaris-Card">
                        <div className="Polaris-IndexTable">
                          <div className="Polaris-IndexTable__EmptySearchResultWrapper">
                            <div className="Polaris-Stack Polaris-Stack--vertical Polaris-Stack--alignmentCenter">
                              <div className="Polaris-Stack__Item"><span className="Polaris-TextStyle--variationSubdued"><p>There is no discount code</p></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </> : <></>
                  }
                </div>
              </>
            </Modal.Section>
          </Modal>
        </div>
      </>
      {
        settingState.IsOpenSaveToolbar ?
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
          : <></>
      }
      {
        settingState.IsOpenSaveToolbar ? <>
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
      {
        settingState.IsOpenSaveResult ? <Toast content={settingState.MessageSaveResult} duration={2400} onDismiss={() => {
          dispatch(setSetting({
            ...settingState,
            IsOpenSaveResult: false
          }))
        }} /> : null
      }
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
            dispatch(setMenu(moreAppConfig.Menu.PLAN))
            history.push('/plan?shop=' + config.shop + '&token=' + config.token);
            dispatch(setURL('plan'));
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
    </>
  )
}

export default withRouter(DiscountFeature);