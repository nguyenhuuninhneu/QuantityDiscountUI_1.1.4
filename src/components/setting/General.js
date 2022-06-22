import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageActions, Card, Layout, Heading, TextStyle, Button, ButtonGroup, TextField, Toast, ContextualSaveBar, Spinner, Icon } from '@shopify/polaris';
import { CircleInformationMajor } from '@shopify/polaris-icons';
import Loading from '../../components/plugins/Loading';
import { setSetting } from '../../state/modules/setting/actions';
import { saveActive, loadProductByCampaign, synchronizeData, enableAppEmbed } from '../../state/modules/setting/operations';
import Select from 'react-select';
import config from '../../config/config';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import _ from "lodash";
import {  withRouter } from "react-router-dom";

function General() {
  const dispatch = useDispatch();
  const appState = useSelector((state) => state.app);
  const settingState = useSelector((state) => state.setting.ListSetting);
  const [options, setOption] = useState([]);
  const wait = 100;
  const loadOptions = inputValue => getAsyncOptions(inputValue);
  const debouncedLoadOptions = _.debounce(loadOptions, wait, {
    leading: true
  });
  const loadOptionsProduct = inputValue2 => getAsyncOptionsProduct(inputValue2);
  const debouncedLoadOptionsProduct = _.debounce(loadOptionsProduct, wait, {
    leading: true
  });
  const getAsyncOptions = (inputValue) => {
    return new Promise((resolve, reject) => {
      axios.get(config.rootLink + '/FrontEnd/SearchCampaignPaginateSetting', {
        params: {
          search: inputValue,
          shop: config.shop,
          page: 1,
          pagezise: 10,
          token: config.token,
        }
      })
        .then((res) => {
          const result = res?.data;
          resolve(result.campaigns);
        })
        .catch(err => console.log(err))

    });
  }
  const getAsyncOptionsProduct = (inputValue2) => {
    if (settingState.CampaignID > 0) {
      return new Promise((resolve, reject) => {
        axios.get(config.rootLink + '/FrontEnd/SearchProductPaginateSettingByCampaign', {
          params: {
            search: inputValue2,
            campaignID: settingState.CampaignID,
            shop: config.shop,
            page: 1,
            pagezise: 100,
            token: config.token,
          }
        })
          .then((res) => {
            dispatch(setSetting({
              ...settingState,
              IsLoadNewProduct: false
            }))
            const result = res?.data;
            resolve(result.listProduct);

          })
          .catch(err => console.log(err))

      });
    }

  }
  useEffect(() => {
    getAsyncOptions('');
  }, [dispatch]);

  return (
    <>
      {
        settingState.IsLoadingPage ? <Loading></Loading>
          :
          <>

            <div className='section general'>
              <div className='activate'>
                <div className="Polaris-Card" style={{ backgroundColor: '#EBF9FC', marginTop: '15px', marginBottom: '15px' }}>
                  <div className="Polaris-CalloutCard__Container">
                    <div className="Polaris-Card__Section">
                      <div className="Polaris-CalloutCard">
                        <div className="Polaris-CalloutCard__Content">
                          <div className="Polaris-CalloutCard__Title">
                            <h2 className="Polaris-Heading Heading-Icon"> <Icon source={CircleInformationMajor} color='red'></Icon> Activate app in the Shopify Editor
                            </h2>
                          </div>
                          <div className="Polaris-TextContainer">
                            <p>Our Quantity Discount app uses the new Shopify app embed feature. This can sometimes be disabled so you will have to verify this is toggled on before using the app.</p>
                          </div>
                          <div className="Polaris-CalloutCard__Buttons">
                            <Button primary={false}
                              loading={settingState.IsEnabledAppLoading}
                              onClick={() => {
                                dispatch(setSetting({
                                  ...settingState,
                                  IsEnabledAppLoading: true
                                }))
                                dispatch(enableAppEmbed(!settingState.Setting.IsEnableAppEmbed));
                                window.open('https://' + config.shop + '/admin/themes/current/editor?context=apps&activateAppId=3f38eaa3-2a3f-4e55-bcc9-df5d3f75e351%2Forichi-discount', "_blank");
                              }}>{settingState.Setting.IsEnableAppEmbed ? 'Disable' : 'Enable'} app embed</Button>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Layout>
                <Layout.Section oneThird>
                  <Card>
                    <Card.Section>
                      <Heading size="small">1. General</Heading>
                      <div className='element-general'>
                        <div className='colLeft'>
                          <p className='ptb8'>
                            App status
                          </p>
                          {
                            settingState.Setting.Active ?
                              <>
                                <ButtonGroup>
                                  <Button primary onClick={() => {
                                    dispatch(setSetting({
                                      ...settingState,
                                      Setting: {
                                        ...settingState.Setting,
                                        Active: true
                                      },
                                      IsOpenSaveToolbar: true
                                    }))
                                  }}>Enable</Button>
                                  <Button onClick={() => {
                                    dispatch(setSetting({
                                      ...settingState,
                                      Setting: {
                                        ...settingState.Setting,
                                        Active: false
                                      },
                                      IsOpenSaveToolbar: true
                                    }))
                                  }}>Disable</Button>

                                </ButtonGroup>

                              </>
                              :
                              <>
                                <ButtonGroup>
                                  <Button onClick={() => {
                                    dispatch(setSetting({
                                      ...settingState,
                                      Setting: {
                                        ...settingState.Setting,
                                        Active: true
                                      },
                                      IsOpenSaveToolbar: true
                                    }))
                                  }}>Enable</Button>
                                  <Button primary onClick={() => {
                                    dispatch(setSetting({
                                      ...settingState,
                                      Setting: {
                                        ...settingState.Setting,
                                        Active: false
                                      },
                                      IsOpenSaveToolbar: true
                                    }))
                                  }}>Disable</Button>

                                </ButtonGroup>
                              </>
                          }



                        </div>
                        <div className='colRight'>
                          <p className='ptb8'>
                            Synchronize data to app
                          </p>
                          <Button
                            disabled={appState.DisplayProcess || settingState.LoadingDiscountSync || settingState.LoadingDataSync}
                            primary
                            onClick={() => {
                              dispatch(synchronizeData());
                            }}>Synchronize data</Button>

                        </div>
                        <div className='cb'>
                        </div>
                      </div>

                    </Card.Section>
                  </Card>
                </Layout.Section>
              </Layout>
            </div>
            {/* <div className='section install-uninstall'>
              <Layout>
                <Layout.Section oneThird>
                  <Card>
                    <Card.Section>
                      <Heading size="small">2. Install & uninstall theme</Heading>
                      <div className='element-general'>
                        <div className='colLeft'>
                          <p className='ptb8'>
                            Using settings for theme
                          </p>
                          <div className='itemLeft'>
                            <Select
                              options={settingState.ListTheme}
                              defaultValue={settingState.ListTheme[0]}
                              onChange={(e) => {
                                dispatch(setSetting({
                                  ...settingState,
                                  ThemeID: e.value,
                                  IsInstall: true,
                                }))
                              }}
                              isSearchable={false}
                            // value={parseInt(settingState.ThemeID)}
                            />
                          </div>
                          <div className='itemRight'>
                            <Button onClick={() => {
                              if (settingState.IsInstall) {
                                dispatch(installTheme())
                              } else {
                                dispatch(uninstallTheme())
                              }
                            }}>{settingState.IsInstall ? "Install" : "Uninstall"}</Button>
                          </div>
                          <div className='cb'>
                          </div>
                        </div>

                        <div className='cb'>
                        </div>
                      </div>

                    </Card.Section>
                  </Card>
                </Layout.Section>
              </Layout>
            </div> */}
            <div className='section custom-rule'>
              <Layout>
                <Layout.Section oneThird>
                  <Card>
                    <Card.Section>
                      <Heading size="small">2. Custom display rule anywhere</Heading>
                      <div className='element-general'>
                        <div className='colLeft'>
                          <div className='itemLeft'>
                            Campaign
                          </div>
                          <div className='itemRight'>
                            <AsyncSelect cacheOptions defaultOptions loadOptions={inputValue => debouncedLoadOptions(inputValue)}
                              placeholder='Search'
                              onChange={(e) => {
                                dispatch(setSetting({
                                  ...settingState,
                                  CampaignID: e.value,
                                  IsLoadNewProduct: true
                                  // ListProduct: settingState.ListCampaign.filter(p => p.ID == parseInt(e))[0].ListProducts
                                }))
                                getAsyncOptionsProduct('');
                                // dispatch(loadProductByCampaign(e.value));
                              }}
                            />

                          </div>
                          <div className='cb'>
                          </div>
                          <div className='itemLeft'>
                            Product
                          </div>
                          <div className='itemRight'>
                            <div className='relative'>
                              <AsyncSelect loadOptions={inputValue2 => debouncedLoadOptionsProduct(inputValue2)}
                                placeholder='Search'
                                onChange={(e) => {
                                  dispatch(setSetting({
                                    ...settingState,
                                    ProductID: e.value
                                  }))
                                }}
                              />
                              {/* <Select
                                disabled={settingState.IsLoadNewProduct}
                                options={settingState.ListProduct}
                                onChange={(e) => {
                                  dispatch(setSetting({
                                    ...settingState,
                                    ProductID: e.value
                                  }))
                                }}
                                isSearchable={false}
                              // value={parseInt(settingState.ProductID)}
                              /> */}
                              {/* {
                                settingState.IsLoadNewProduct ?
                                  <>
                                    <div className="spinner">
                                      <Spinner accessibilityLabel="Small spinner example" size="small" />
                                    </div>
                                  </>
                                  : <></>
                              } */}
                            </div>

                          </div>
                          <div className='cb'>
                          </div>
                          <div className='itemLeft'>
                            Custom code
                          </div>
                          <div className='itemRight'>
                            <TextField
                              placeholder=""
                              value={'<div className="orichiCampaignCustom" data-productid="' + settingState.ProductID + '" data-campaignid="' + settingState.CampaignID + '"></div>'}
                              onChange={(e) => { }}
                              autoComplete="off"
                              multiline={4}
                            />
                          </div>
                          <div className='cb'>
                          </div>
                        </div>

                        <div className='cb'>
                        </div>

                      </div>

                    </Card.Section>
                  </Card>
                </Layout.Section>
              </Layout>
            </div>
          </>
      }
      {settingState.IsOpenSaveToolbar ?
        <div className='head'>
          <ContextualSaveBar
            message="Unsaved changes"
            saveAction={{
              content: "Save settings",
              onAction: () => {
                dispatch(saveActive());
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
              dispatch(saveActive());
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

export default withRouter(General);