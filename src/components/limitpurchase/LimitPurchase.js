import { Card, Badge, InlineError, Button, Modal, Toast, TextContainer, Icon, TextField, DataTable, List, Stack, Checkbox, FormLayout, PageActions } from '@shopify/polaris';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateUpdateLimitPurchase, setListLimitPurchase, setIsSaveLoading, setIsPaginateLoading, setIsDeleteLoading } from '../../state/modules/limitpurchase/actions';
import config from '../../config/config';
import { createEditLimitPurchase, fetchList, saveLimitPurchase, saveBulkLimitPurchase, saveBulkActionPurchase } from '../../state/modules/limitpurchase/operations';
import { DeleteMinor, EditMinor, QuestionMarkMajor } from '@shopify/polaris-icons';
import moreAppConfig from '../../config/moreAppConfig';
import '../../assets/css/paginate.css';
import '../../assets/css/modal.css';
import ReactPaginate from 'react-paginate';
import TableCollection from './TableCollection';
import SpinnerAbsolute from '../plugins/Spinner';
import Select from 'react-select';
import { withRouter } from "react-router-dom";
import '../../assets/css/table-common.css'

const LimitPurchase = () => {
    const [IsOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [IsBulkUpdate, setIsBulkUpdate] = useState(false);
    const [LimitPurchaseCurrent, setLimitPurchaseCurrent] = useState(null);
    const [Alert, setAlert] = useState(null);
    const dispatch = useDispatch();
    const appState = useSelector((state) => state.app);
    const limitPurchaseState = useSelector((state) => state.limitpurchase.ListLimitPurchase);
    const createLimitPurchaseState = useSelector((state) => state.limitpurchase.CreateUpdateLimitPurchase);
    const [IsOpenAdSpecificCollectionModal, setIsOpenAddSpecificCollectionModal] = useState(false);

    const [BulkActionType, setBulkActionType] = useState("delete");
    const [isHover, setIsHover] = useState(false);
    const [isHoverAction, setIsHoverAction] = useState(false);

    //search by button and enter
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [textSearchCollection, setTextSearchCollection] = useState('');
    useEffect(() => {

        dispatch(fetchList());
        var checkselect = limitPurchaseState.ListCollectionSelected !== undefined && limitPurchaseState.ListCollectionSelected !== null ? limitPurchaseState.ListCollectionSelected.toString() : '';

        axios.get(config.rootLink + '/FrontEnd/GetCollectPaginate', {
            params: {
                search: textSearchCollection,
                shop: config.shop,
                selectedstr: checkselect,
                page: 1,
                pagezise: 1000,
                token: config.token,

            }
        })
            .then(function (response) {
                const result = response?.data;
                dispatch(setListLimitPurchase({
                    ...limitPurchaseState,
                    ListCollection: result.collects.map((p, i) => (limitPurchaseState.ListCollectionSelected.includes(p.CollectID) ? {
                        ...p,
                        IsChecked: true,
                    } : p)),
                }))
            })
            .catch(function (error) {
                const errorMsg = error.message;
                console.log(errorMsg);
            })

    }, [dispatch]);
    const validateNumber = (e) => {
        if (isNaN(e)) {
            return false;
        } else {
            return true;
        }
    }
    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        dispatch(setIsPaginateLoading(true));
        axios.get(config.rootLink + '/FrontEnd/GetLimitPurchasesPaginate', {
            params: {
                search: limitPurchaseState.TextSearchProduct,
                typeselected: limitPurchaseState.ProductSelected,
                shop: config.shop,
                collectstr: limitPurchaseState.ListCollectionSelected.toString(),
                page: event.selected + 1,
                pagezise: 10,
                token: config.token,

            }
        })
            .then(function (response) {
                const result = response?.data;
                dispatch(setListLimitPurchase({
                    ...limitPurchaseState,
                    IsPaginateLoading: false,
                    Paginate: {
                        ...limitPurchaseState.Paginate,
                        CurrentItems: result.list,
                        TotalPage: result.totalpage
                    },
                    IsCheckAllLimitPurcharse: false,
                    TotalLimitPurchase: result.totalitem,
                    TotalHaveLimitPurchase: result.totalitemhavelimit
                }))
            })
            .catch(function (error) {
                const errorMsg = error.message;
                console.log(errorMsg);
            })

    };

    const onClickDeleteLimitPurchase = (limitpurchase) => {
        setLimitPurchaseCurrent(limitpurchase);
        setIsOpenDeleteModal(true);
    }
    const onClickCreateUpdateLimitPurchase = (limitpurchase) => {
        if (limitpurchase.ID === null || limitpurchase.ID === 0) {
            limitpurchase.IsLimitPurchaseWholeProduct = true;
        }
        dispatch(setCreateUpdateLimitPurchase({
            ...createLimitPurchaseState,
            limitpurchase: limitpurchase,
            IsOpenCreateUpdateModal: true
        }))
    }
    const onClickBulkUpdateLimitPurchase = () => {
        dispatch(setCreateUpdateLimitPurchase({
            ...createLimitPurchaseState,
            BulkUpdate: {
                Min: 0,
                Max: 0,
                ListCollects: null
            },
            IsOpenCreateUpdateModal: true
        }))
    }
    const handleDeleteLimitPurchase = () => {
        if (limitPurchaseState.limitpurchases != null && limitPurchaseState.limitpurchases.length > 0 && LimitPurchaseCurrent != null && LimitPurchaseCurrent.ID > 0) {
            dispatch(setIsDeleteLoading(true));
            axios.post(config.rootLink + '/FrontEnd/DeleteLimitPurchase', { id: LimitPurchaseCurrent.ID, productid: LimitPurchaseCurrent.ProductCode, shop: config.shop, token: config.token })
                .then(function (response) {
                    if (response.data.IsSuccess) {
                        axios.get(config.rootLink + '/FrontEnd/GetLimitPurchasesPaginate', {
                            params: {
                                search: limitPurchaseState.TextSearchProduct,
                                typeselected: limitPurchaseState.ProductSelected,
                                shop: config.shop,
                                page: 1,
                                pagezise: 10,
                                token: config.token
                            }
                        })
                            .then(function (response) {
                                const result = response?.data;
                                //Set List + paging
                                dispatch(setListLimitPurchase({
                                    ...limitPurchaseState,
                                    IsSaveLoading: false,
                                    IsDeleteLoading: false,
                                    Paginate: {
                                        ...limitPurchaseState.Paginate,
                                        Offset: 0,
                                        CurrentItems: result.list,
                                        TotalPage: result.totalpage
                                    },
                                    TotalLimitPurchase: result.totalitem,
                                    TotalHaveLimitPurchase: result.totalitemhavelimit
                                }))
                                dispatch(setCreateUpdateLimitPurchase({
                                    ...createLimitPurchaseState,
                                    IsOpenSaveToolbar: false,
                                }))
                                setAlert(<Toast content={'The limit purchase: ' + LimitPurchaseCurrent.Title + ' deleted successfully'} duration={2400} onDismiss={() => {
                                    setAlert(null);
                                }} />);
                            })
                            .catch(function (error) {
                                const errorMsg = error.message;
                                console.log(errorMsg);
                            })
                    }
                    else {
                        setAlert(null);
                    }
                    setIsOpenDeleteModal(false);

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        }
    }
    const handleSearchProductLimit = (textSearch, productSelected) => {
        dispatch(setIsPaginateLoading(true));
        ;
        axios.get(config.rootLink + '/FrontEnd/GetLimitPurchasesPaginate', {
            params: {
                search: textSearch,
                typeselected: productSelected,
                shop: config.shop,
                page: 1,
                pagezise: 10,
                collectstr: limitPurchaseState.ListCollectionSelected.toString(),
                token: config.token
            }
        })
            .then(function (response) {
                const result = response?.data;
                //Set List + paging
                dispatch(setListLimitPurchase({
                    ...limitPurchaseState,
                    IsPaginateLoading: false,
                    TextSearchProduct: textSearch,
                    ProductSelected: productSelected,
                    Paginate: {
                        ...limitPurchaseState.Paginate,
                        Offset: 0,
                        CurrentItems: result.list,
                        TotalPage: result.totalpage
                    },
                    IsCheckAllLimitPurcharse: false,
                    TotalLimitPurchase: result.totalitem,
                    TotalHaveLimitPurchase: result.totalitemhavelimit,
                }))
                //search by button and enter
                setIsSearchLoading(false);
            })
            .catch(function (error) {
                const errorMsg = error.message;
                console.log(errorMsg);
                //search by button and enter
                setIsSearchLoading(false);
            })
    };

    function ValidForm() {
        if (createLimitPurchaseState.limitpurchase.Min === '') {
            dispatch(setCreateUpdateLimitPurchase({
                ...createLimitPurchaseState,
                MinValidation: moreAppConfig.MinValidationText
            }))
            return false;
        }
        if (createLimitPurchaseState.limitpurchase.Max === '') {
            dispatch(setCreateUpdateLimitPurchase({
                ...createLimitPurchaseState,
                MaxValidation: moreAppConfig.MaxValidationText
            }))
            return false;
        }
        if (createLimitPurchaseState.limitpurchase.Min != '' && createLimitPurchaseState.limitpurchase.Max != '') {
            let min = parseInt(createLimitPurchaseState.limitpurchase.Min);
            let max = parseInt(createLimitPurchaseState.limitpurchase.Max);
            if (max > 0) {
                if (min > max) {
                    dispatch(setCreateUpdateLimitPurchase({
                        ...createLimitPurchaseState,
                        MaxValidation: moreAppConfig.MaxGreateThanMinValidationText
                    }))
                    return false;
                }
                else {
                    dispatch(setCreateUpdateLimitPurchase({
                        ...createLimitPurchaseState,
                        MaxValidation: ''
                    }))
                }
            }

        }
        if (createLimitPurchaseState.limitpurchase.IsLimitPurchaseVariant && createLimitPurchaseState.limitpurchase.ListLimitPurchaseVariant.length === 0) {
            dispatch(setCreateUpdateLimitPurchase({
                ...createLimitPurchaseState,
                VariantValidation: moreAppConfig.VariantValidationText
            }))
            return false;
        }

        if (createLimitPurchaseState.limitpurchase.IsLimitPurchaseVariant && createLimitPurchaseState.limitpurchase.ListLimitPurchaseVariant != undefined && createLimitPurchaseState.limitpurchase.ListLimitPurchaseVariant.length > 0) {
            var checkQuantityNull = createLimitPurchaseState.limitpurchase.ListLimitPurchaseVariant.filter(p => p.Min === '').length > 0 ? false : true;
            if (!checkQuantityNull) {
                // dispatch(setCreateUpdateLimitPurchase({
                //     ...createLimitPurchaseState,
                //     IsOpenSaveToolbar: false,
                //     VariantValidation: "Minimum is required"
                // }))
                return false;
            }
            // var checkQuantityZero = createLimitPurchaseState.limitpurchase.ListLimitPurchaseVariant.filter(p => parseInt(p.Min) === 0).length > 0 ? false : true;
            // if (!checkQuantityZero) {
            //     dispatch(setCreateUpdateLimitPurchase({
            //         ...createLimitPurchaseState,
            //         IsOpenSaveToolbar: false,
            //         VariantValidation: "Minimum quantity must be greater than 0"
            //     }))
            //     return false;
            // }
            //checkQuantityZero && 
            if (checkQuantityNull) {
                dispatch(setCreateUpdateLimitPurchase({
                    ...createLimitPurchaseState,
                    VariantValidation: ""
                }))
            }
            var checkPriceNull = createLimitPurchaseState.limitpurchase.ListLimitPurchaseVariant.filter(p => p.Max === '').length > 0 ? false : true;
            if (!checkPriceNull) {
                // dispatch(setCreateUpdateLimitPurchase({
                //     ...createLimitPurchaseState,
                //     IsOpenSaveToolbar: false,
                //     VariantValidation: "Maximum is required"
                // }))
                return false;
            }
            // var checkPriceZero = createLimitPurchaseState.limitpurchase.ListLimitPurchaseVariant.filter(p => parseInt(p.Max) === 0).length > 0 ? false : true;
            // if (!checkPriceZero) {
            //     dispatch(setCreateUpdateLimitPurchase({
            //         ...createLimitPurchaseState,
            //         IsOpenSaveToolbar: false,
            //         VariantValidation: "Maximum value must be greater than 0"
            //     }))
            //     return false;
            // }
            //checkPriceZero &&
            if (checkPriceNull) {
                dispatch(setCreateUpdateLimitPurchase({
                    ...createLimitPurchaseState,
                    VariantValidation: ""
                }))
            }
        }

        return true;
    }
    function ValidFormBulkUpdate() {
        if (createLimitPurchaseState.BulkUpdate.Min === '') {
            dispatch(setCreateUpdateLimitPurchase({
                ...createLimitPurchaseState,
                MinValidation: moreAppConfig.MinValidationText
            }))
            return false;
        }
        if (createLimitPurchaseState.BulkUpdate.Max === '') {
            dispatch(setCreateUpdateLimitPurchase({
                ...createLimitPurchaseState,
                MaxValidation: moreAppConfig.MaxValidationText
            }))
            return false;
        }
        if (createLimitPurchaseState.BulkUpdate.Min != '' && createLimitPurchaseState.BulkUpdate.Max != '') {
            let min = parseInt(createLimitPurchaseState.BulkUpdate.Min);
            let max = parseInt(createLimitPurchaseState.BulkUpdate.Max);
            if (max > 0) {
                if (min > max) {
                    dispatch(setCreateUpdateLimitPurchase({
                        ...createLimitPurchaseState,
                        MaxValidation: moreAppConfig.MaxGreateThanMinValidationText
                    }))
                    return false;
                }
                else {
                    dispatch(setCreateUpdateLimitPurchase({
                        ...createLimitPurchaseState,
                        MaxValidation: ''
                    }))
                }
            }
        }


        return true;
    }

    function RemoveSpecificCollection(id) {
        var arrPro = createLimitPurchaseState.BulkUpdate.ListCollects.filter(p => p.ID != id);
        dispatch(setCreateUpdateLimitPurchase(
            {
                ...createLimitPurchaseState,
                BulkUpdate:
                {
                    ...createLimitPurchaseState.BulkUpdate,
                    ListCollects: arrPro
                },
                IsOpenSaveToolbar: true
            }));
    }

    const openDialogBulkAction = (type) => {
        setIsHoverAction(false);
        let str = 'delete';
        switch (type) {
            case moreAppConfig.BulkAction.SetLimitPurchase:
                str = 'setlimit';
                break;
            case moreAppConfig.BulkAction.DisabledSelected:
                str = 'disable';
                break;
            case moreAppConfig.BulkAction.EnabledSelected:
                str = 'enable';
                break;
            case moreAppConfig.BulkAction.DeleteAllSelected:
                str = 'delete';
                break;
            default:
                break;
        }
        setBulkActionType(str);
        dispatch(setCreateUpdateLimitPurchase({
            ...createLimitPurchaseState,
            IsOpenBulkActionModal: true
        }))

    }

    function handleBulkAction() {
        let type = moreAppConfig.BulkAction.DisabledSelected;
        switch (BulkActionType) {
            case 'setlimit':
                type = moreAppConfig.BulkAction.SetLimitPurchase;
                break;
            case 'disable':
                type = moreAppConfig.BulkAction.DisabledSelected;
                break;
            case 'enable':
                type = moreAppConfig.BulkAction.EnabledSelected;
                break;
            case 'delete':
                type = moreAppConfig.BulkAction.DeleteAllSelected;
                break;
            default:
                break;
        }
        dispatch(saveBulkActionPurchase(type));
    }
    function UpdateEnabledStatus(limitpurchase) {
        dispatch(setIsPaginateLoading(true));
        axios.post(config.rootLink + '/FrontEnd/UpdateLimitPurchasreEnabled', { id: limitpurchase.ID, shop: config.shop, status: limitpurchase.IsEnabled })
            .then(function (response) {
                if (response.data.IsSuccess) {

                    dispatch(setListLimitPurchase({
                        ...limitPurchaseState,
                        Paginate: {
                            ...limitPurchaseState.Paginate,
                            CurrentItems: limitPurchaseState.Paginate.CurrentItems.map((p, i) => (p.ProductCode == limitpurchase.ProductCode ? {
                                ...p,
                                IsEnabled: !limitpurchase.IsEnabled,
                            } : p)),
                        },
                        IsPaginateLoading: false
                    }))

                    setAlert(<Toast content={'The limit: ' + limitpurchase.Title + ' update status successfully'} duration={2400} onDismiss={() => {
                        setAlert(null);
                    }} />);
                } else {
                    setAlert(<Toast content={response.data.Messenger} duration={2400} onDismiss={() => {
                        setAlert(null);
                    }} />);
                    dispatch(setIsPaginateLoading(false));
                }

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }
    const handleChangeTextCollectionSearch = (e) => {
        var checkselect = limitPurchaseState.ListCollectionSelected !== undefined && limitPurchaseState.ListCollectionSelected !== null ? limitPurchaseState.ListCollectionSelected.toString() : '';

        axios.get(config.rootLink + '/FrontEnd/GetCollectPaginate', {
            params: {
                search: e,
                shop: config.shop,
                selectedstr: checkselect,
                page: 1,
                pagezise: 1000,
                token: config.token,

            }
        })
            .then(function (response) {
                const result = response?.data;
                dispatch(setListLimitPurchase({
                    ...limitPurchaseState,
                    ListCollection: result.collects.map((p, i) => (limitPurchaseState.ListCollectionSelected.includes(p.CollectID) ? {
                        ...p,
                        IsChecked: true,
                    } : p)),
                    ListCollectionSelected: []
                }))
            })
            .catch(function (error) {
                const errorMsg = error.message;
                console.log(errorMsg);
            })
    };
    return (

        <>
            <div className='campaign-products' style={{ margin: '10px 0' }}>
                <div className='campaign-products-list'>
                    <div className=''>
                        <div className='campaign-product-header'>
                            <div className='colLeft w66pt'>
                                <div className='colLeft w30pt'>
                                    <Select
                                        // placeholder={'Discount base on'}
                                        defaultValue={limitPurchaseState.ListProductHaveLimit[0]}
                                        options={limitPurchaseState.ListProductHaveLimit}
                                        onChange={(e) => {
                                            handleSearchProductLimit(limitPurchaseState.TextSearchProduct, e.value);
                                        }}
                                        isSearchable={false}
                                    // value={limitPurchaseState.ProductSelected}
                                    />
                                </div>
                                <div className='colLeft w30pt ml-5'>
                                    <div className=" css-1s2u09g-control input-relative collection-search-component">
                                        <div className=" css-319lph-ValueContainer" onClick={() => {
                                            dispatch(setListLimitPurchase({
                                                ...limitPurchaseState,
                                                IsOpenSearchCollection: true
                                            }))

                                        }}>
                                            <div className=" css-qc6sy-singleValue">Collections ({limitPurchaseState.ListCollectionSelected.length})</div>
                                        </div>
                                        <div className=" css-1hb7zxy-IndicatorsContainer" onClick={() => {
                                            dispatch(setListLimitPurchase({
                                                ...limitPurchaseState,
                                                IsOpenSearchCollection: true
                                            }))

                                        }}>
                                            <span className=" css-1okebmr-indicatorSeparator"></span>
                                            <div className=" css-tlfecz-indicatorContainer" aria-hidden="true">
                                                <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="css-tj5bde-Svg"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>
                                            </div>
                                        </div>
                                        {
                                            limitPurchaseState.IsOpenSearchCollection ? <>
                                                <div className='collection-absolute'>
                                                    <div className="Polaris-Modal-Header" style={{ backgroundColor: '#fff' }}>
                                                        <div id="Polarismodal-header2" className="Polaris-Modal-Header__Title">
                                                            <h2 className="Polaris-DisplayText Polaris-DisplayText--sizeSmall">Choose collection to filter</h2>
                                                        </div>
                                                        <button className="Polaris-Modal-CloseButton" aria-label="" onClick={() => {
                                                            dispatch(setListLimitPurchase({
                                                                ...limitPurchaseState,
                                                                IsOpenSearchCollection: false
                                                            }))

                                                        }}>
                                                            <span className="Polaris-Icon Polaris-Icon--colorBase Polaris-Icon--applyColor">
                                                                <svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
                                                                    <path d="m11.414 10 6.293-6.293a1 1 0 1 0-1.414-1.414L10 8.586 3.707 2.293a1 1 0 0 0-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 1 0 1.414 1.414L10 11.414l6.293 6.293A.998.998 0 0 0 18 17a.999.999 0 0 0-.293-.707L11.414 10z"></path>
                                                                </svg>
                                                            </span>
                                                        </button>
                                                    </div>
                                                    <Card>
                                                        <Card.Section>
                                                            <div className='start-end-date'>
                                                                <div className='search-sticky'>
                                                                    <div className="Polaris-Connected">
                                                                        <div className="Polaris-Connected__Item Polaris-Connected__Item--primary"><div className="Polaris-TextField"><input id="TypeTag"
                                                                            placeholder="Typing the keyword for collection title and hit enter" className="Polaris-TextField__Input" type="text" aria-labelledby="TypeTagLabel"
                                                                            aria-invalid="false"
                                                                            value={textSearchCollection}
                                                                            onChange={(e) => {
                                                                                setTextSearchCollection(e.target.value);
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    handleChangeTextCollectionSearch(e.target.value);
                                                                                }
                                                                            }} /><div className="Polaris-TextField__Backdrop" >
                                                                            </div>
                                                                        </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="selected-item">
                                                                        {limitPurchaseState.ListCollectionSelected.length} collection selected
                                                                    </div>

                                                                </div>
                                                                <div className='list-collection' style={limitPurchaseState.ListCollection.length > 12 ? { overflowY: 'scroll' } : {}}>
                                                                    {
                                                                        limitPurchaseState.ListCollection != null && limitPurchaseState.ListCollection.length > 0 ? limitPurchaseState.ListCollection.map((collection, index) => {
                                                                            return <>
                                                                                <Checkbox
                                                                                    label={collection.Title}
                                                                                    checked={collection.IsChecked}
                                                                                    onChange={(e) => {
                                                                                        var selectedcollection = limitPurchaseState.ListCollectionSelected;
                                                                                        if (e) {
                                                                                            selectedcollection.push(collection.CollectID);
                                                                                        }
                                                                                        else {
                                                                                            selectedcollection = selectedcollection.filter(p => p != collection.CollectID);
                                                                                        }
                                                                                        dispatch(setListLimitPurchase({
                                                                                            ...limitPurchaseState,
                                                                                            ListCollection: limitPurchaseState.ListCollection.map((p, i) => (p.CollectID == collection.CollectID ? {
                                                                                                ...p,
                                                                                                IsChecked: e,
                                                                                            } : p)),
                                                                                            ListCollectionSelected: selectedcollection,
                                                                                        }))
                                                                                    }}
                                                                                />
                                                                                <br />
                                                                            </>
                                                                        }) : ''}

                                                                </div>
                                                            </div>
                                                            <div className='cb'>
                                                            </div>

                                                            <PageActions
                                                                primaryAction={{
                                                                    content: 'Done',
                                                                    onAction: () => {
                                                                        dispatch(setListLimitPurchase({
                                                                            ...limitPurchaseState,
                                                                            IsOpenSearchCollection: false
                                                                        }))
                                                                    }
                                                                }}
                                                                secondaryActions={[
                                                                    {
                                                                        content: 'Cancel',
                                                                        onAction: () => {
                                                                            dispatch(setListLimitPurchase({
                                                                                ...limitPurchaseState,
                                                                                IsOpenSearchCollection: false
                                                                            }))
                                                                        }
                                                                    },
                                                                ]}
                                                            />
                                                        </Card.Section>
                                                    </Card>

                                                </div>
                                            </> : null
                                        }
                                    </div>
                                </div>
                                <div className='colLeft w38pt ml-5'>
                                    {/* //search by button and enter */}
                                    <div className="Polaris-Connected">
                                        <div className="Polaris-Connected__Item Polaris-Connected__Item--primary"><div className="Polaris-TextField"><input id="TypeTag" placeholder="Typing the keyword for product title and hit enter" className="Polaris-TextField__Input" type="text" aria-labelledby="TypeTagLabel" aria-invalid="false" value={limitPurchaseState.TextSearchProduct}
                                            onChange={(e) => {
                                                dispatch(setListLimitPurchase({
                                                    ...limitPurchaseState,
                                                    TextSearchProduct: e.target.value,

                                                }))
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSearchProductLimit(e.target.value, limitPurchaseState.ProductSelected);

                                                }
                                            }} /><div className="Polaris-TextField__Backdrop" ></div></div></div></div>
                                    {/* <TextField
                                        placeholder={'Search Product Title'}
                                        value={limitPurchaseState.TextSearchProduct}
                                        onChange={(e) => {
                                            handleSearchProductLimit(e, limitPurchaseState.ProductSelected)
                                        }}
                                        type="text"
                                    /> */}
                                </div>

                                <div className='cb'>
                                </div>
                            </div>
                            <div className='colRight w34pt'>
                                {/* //search by button and enter */}
                                <div className='colLeft ml-10'>
                                    <Button primary
                                        loading={isSearchLoading}
                                        onClick={() => {
                                            setIsSearchLoading(true);
                                            handleSearchProductLimit(limitPurchaseState.TextSearchProduct, limitPurchaseState.ProductSelected)
                                        }}>Search</Button>
                                </div>
                                {/* <div className='colRight'>
                                    <Button primary onClick={() => {
                                        setIsBulkUpdate(true);
                                        onClickBulkUpdateLimitPurchase();
                                    }}>Bulk Action</Button>
                                </div> */}
                                <div className='cb'>
                                </div>
                            </div>
                            <div className='cb'>
                            </div>
                        </div>
                    </div>
                    <p style={{ margin: '10px 0' }}>Total : {limitPurchaseState.TotalLimitPurchase} products</p>

                    <div className='campaign-product-list-content'>
                        {
                            limitPurchaseState.IsPaginateLoading ? <SpinnerAbsolute></SpinnerAbsolute> : null
                        }
                        <Card>

                            <div className="Polaris-DataTable--condensed">
                                {
                                    limitPurchaseState.Paginate.CurrentItems.filter(p => p.IsChecked).length > 0 ? <>
                                        <div className="Polaris-IndexTable__StickyTable" role="presentation">
                                            <div>
                                                <div className="Polaris-IndexTable__BulkActionsWrapper">
                                                    <div>
                                                        <div className="Polaris-BulkActions__Group Polaris-BulkActions__Group--largeScreen Polaris-BulkActions__Group--entered">
                                                            <div className="Polaris-BulkActions__ButtonGroupWrapper">
                                                                <div className="Polaris-ButtonGroup Polaris-ButtonGroup--segmented" data-buttongroup-segmented="true">
                                                                    <div className="Polaris-ButtonGroup__Item" onMouseDown={(e) => {
                                                                        var e = !limitPurchaseState.IsCheckAllLimitPurcharse;
                                                                        var result = limitPurchaseState.Paginate.CurrentItems.map((p, i) => (true ? {
                                                                            ...p,
                                                                            IsChecked: e,
                                                                        } : p))
                                                                        dispatch(setListLimitPurchase({
                                                                            ...limitPurchaseState,
                                                                            Paginate: {
                                                                                ...limitPurchaseState.Paginate,
                                                                                CurrentItems: result,
                                                                            },
                                                                            IsCheckAllLimitPurcharse: e
                                                                        }))
                                                                    }}>
                                                                        <div className="Polaris-CheckableButton Polaris-CheckableButton__CheckableButton--selectMode Polaris-CheckableButton__CheckableButton--selected">
                                                                            <div className="Polaris-CheckableButton__Checkbox">
                                                                                <label className="Polaris-Choice Polaris-Choice--labelHidden" for="PolarisCheckbox3">
                                                                                    <span className="Polaris-Choice__Control">
                                                                                        <span className="Polaris-Checkbox">
                                                                                            <input id="PolarisCheckbox3" type="checkbox" className="Polaris-Checkbox__Input" aria-invalid="false" role="checkbox" aria-checked="true" value="" checked={limitPurchaseState.IsCheckAllLimitPurcharse}
                                                                                            /><span className="Polaris-Checkbox__Backdrop"></span>
                                                                                            <span className="Polaris-Checkbox__Icon">
                                                                                                <span className="Polaris-Icon">
                                                                                                    <span className="Polaris-VisuallyHidden"></span>
                                                                                                    <svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
                                                                                                        <path d="M14.723 6.237a.94.94 0 0 1 .053 1.277l-5.366 6.193a.834.834 0 0 1-.611.293.83.83 0 0 1-.622-.264l-2.927-3.097a.94.94 0 0 1 0-1.278.82.82 0 0 1 1.207 0l2.297 2.43 4.763-5.498a.821.821 0 0 1 1.206-.056Z"></path>
                                                                                                    </svg>
                                                                                                </span>
                                                                                            </span>
                                                                                        </span>
                                                                                    </span>
                                                                                </label>
                                                                            </div>
                                                                            <span className="Polaris-CheckableButton__Label">{limitPurchaseState.Paginate.CurrentItems.filter(p => p.IsChecked).length} selected</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="Polaris-ButtonGroup__Item" onMouseEnter={() => { setIsHoverAction(true) }} onMouseLeave={() => { setIsHoverAction(false) }}>
                                                                        <div>
                                                                            <div>
                                                                                <div className="Polaris-BulkActions__BulkActionButton">
                                                                                    <button className="Polaris-Button" type="button" tabindex="0" aria-controls="Polarispopover17" aria-owns="Polarispopover17" aria-expanded="false">
                                                                                        <span className="Polaris-Button__Content">
                                                                                            <span className="Polaris-Button__Text">Actions</span>
                                                                                            <span className="Polaris-Button__Icon">
                                                                                                <div className="">
                                                                                                    <span className="Polaris-Icon">
                                                                                                        <span className="Polaris-VisuallyHidden"></span>
                                                                                                        <svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
                                                                                                            <path d="M13.098 8h-6.196c-.751 0-1.172.754-.708 1.268l3.098 3.432c.36.399 1.055.399 1.416 0l3.098-3.433c.464-.513.043-1.267-.708-1.267Z"></path>
                                                                                                        </svg>
                                                                                                    </span>
                                                                                                </div>
                                                                                            </span>
                                                                                        </span>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="PolarisPortalsContainer" style={{ display: isHoverAction ? 'block' : 'none' }}>
                                            <div data-portal-id="popover-Polarisportal17" onMouseEnter={() => { setIsHoverAction(true) }} onMouseLeave={() => { setIsHoverAction(false) }}>
                                                <div className="Polaris-PositionedOverlay Polaris-Popover__PopoverOverlay Polaris-Popover__PopoverOverlay--open" style={{ top: '42px', left: '122px' }}>
                                                    <div className="Polaris-Popover" data-polaris-overlay="true">
                                                        <div className="Polaris-Popover__FocusTracker" tabindex="0"></div>
                                                        <div p-color-scheme="light">
                                                            <div className="Polaris-Popover__Wrapper">
                                                                <div id="Polarispopover17" tabindex="-1" className="Polaris-Popover__Content" style={{ minHeight: (45 * 4) + 'px' }}>
                                                                    <div className="Polaris-Popover__Pane Polaris-Scrollable Polaris-Scrollable--vertical" data-polaris-scrollable="true">
                                                                        <div className="Polaris-ActionList">
                                                                            <div className="Polaris-ActionList__Section--withoutTitle">
                                                                                <ul className="Polaris-ActionList__Actions" tabindex="-1">
                                                                                    <li><button type="button" className="Polaris-ActionList__Item" onClick={() => {
                                                                                        setIsHoverAction(false);
                                                                                        setBulkActionType('setlimit');
                                                                                        dispatch(setCreateUpdateLimitPurchase({
                                                                                            ...createLimitPurchaseState,
                                                                                            IsOpenSetLimitBulkActionModal: true
                                                                                        }))
                                                                                    }}><span className="Polaris-ActionList__Content"><span className="Polaris-ActionList__Text">Set limit purchase</span></span></button></li>
                                                                                    <li><button type="button" className="Polaris-ActionList__Item" onClick={() => {
                                                                                        openDialogBulkAction(moreAppConfig.BulkAction.DeleteAllSelected);

                                                                                    }}><span className="Polaris-ActionList__Content"><span className="Polaris-ActionList__Text"
                                                                                    >Delete limit purchase</span></span></button></li>
                                                                                    <li><button type="button" className="Polaris-ActionList__Item" onClick={() => {
                                                                                        openDialogBulkAction(moreAppConfig.BulkAction.EnabledSelected);
                                                                                    }}><span className="Polaris-ActionList__Content"><span className="Polaris-ActionList__Text">Enable all limit purchase</span></span></button></li>
                                                                                    <li><button type="button" className="Polaris-ActionList__Item" onClick={() => {
                                                                                        openDialogBulkAction(moreAppConfig.BulkAction.DisabledSelected);
                                                                                    }}><span className="Polaris-ActionList__Content"><span className="Polaris-ActionList__Text">Disable all limit purchase</span></span></button></li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="Polaris-Popover__FocusTracker" tabindex="0"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </> : ''}

                                <div className="Polaris-DataTable Polaris-DataTable--condensed">
                                    <div className="Polaris-DataTable__ScrollContainer">
                                        <table className="Polaris-DataTable__Table">
                                            {
                                                limitPurchaseState.Paginate.CurrentItems.filter(p => p.IsChecked).length === 0 ? <>
                                                    <thead>
                                                        <tr>
                                                            <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--header" scope="col">
                                                                <Checkbox
                                                                    checked={limitPurchaseState.IsCheckAllLimitPurcharse}
                                                                    onChange={(e) => {
                                                                        var result = limitPurchaseState.Paginate.CurrentItems.map((p, i) => (true ? {
                                                                            ...p,
                                                                            IsChecked: e,
                                                                        } : p))
                                                                        dispatch(setListLimitPurchase({
                                                                            ...limitPurchaseState,
                                                                            Paginate: {
                                                                                ...limitPurchaseState.Paginate,
                                                                                CurrentItems: result,
                                                                            },
                                                                            IsCheckAllLimitPurcharse: e
                                                                        }))
                                                                    }}
                                                                />
                                                            </th>
                                                            <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header" scope="col">Product Title</th>
                                                            <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header" scope="col">Quantity Limit</th>
                                                            <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header" scope="col">Status</th>
                                                            <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header" scope="col">Action</th>
                                                        </tr>
                                                    </thead>
                                                </>
                                                    : ''
                                            }

                                            <tbody>
                                                {limitPurchaseState.Paginate.CurrentItems != null && limitPurchaseState.Paginate.CurrentItems.length > 0 ? limitPurchaseState.Paginate.CurrentItems.map((limitpurchase, index) => {
                                                    return [
                                                        <>
                                                            <tr className="Polaris-DataTable__TableRow Polaris-DataTable--hoverable" style={{ background: limitpurchase.IsChecked ? '#f2f7fe' : 'none' }}>
                                                                <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn" scope="row">
                                                                    <Checkbox
                                                                        checked={limitpurchase.IsChecked}
                                                                        onChange={(e) => {
                                                                            var result = limitPurchaseState.Paginate.CurrentItems.map((p, i) => (p.ProductCode == limitpurchase.ProductCode ? {
                                                                                ...p,
                                                                                IsChecked: e,
                                                                            } : p));
                                                                            var checkall = result.length === result.filter(p => p.IsChecked).length;
                                                                            dispatch(setListLimitPurchase({
                                                                                ...limitPurchaseState,
                                                                                Paginate: {
                                                                                    ...limitPurchaseState.Paginate,
                                                                                    CurrentItems: limitPurchaseState.Paginate.CurrentItems.map((p, i) => (p.ProductCode == limitpurchase.ProductCode ? {
                                                                                        ...p,
                                                                                        IsChecked: e,
                                                                                    } : p)),
                                                                                },
                                                                                IsCheckAllLimitPurcharse: checkall
                                                                            }))
                                                                        }}
                                                                    />
                                                                </th>
                                                                <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop">
                                                                    <p key={index}>
                                                                        <a href={'https://' + appState?.Shop?.Domain + '/products/' + limitpurchase.Handle} target="_blank">{limitpurchase.Title}</a>
                                                                    </p>
                                                                </td>
                                                                <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop">
                                                                    <List type="bullet">
                                                                        {
                                                                            limitpurchase.IsLimitPurchaseWholeProduct && limitpurchase.Min !== undefined && limitpurchase.Min !== null && limitpurchase.Max !== undefined && limitpurchase.Max !== null ?
                                                                                <> <List.Item>Min: {limitpurchase.Min}</List.Item>
                                                                                    <List.Item>Max: {limitpurchase.Max === 0 ? 'Unlimited' : limitpurchase.Max}</List.Item>

                                                                                </>
                                                                                : null
                                                                        }
                                                                        {
                                                                            limitpurchase.IsLimitPurchaseVariant ? <List.Item>Limit for specific variants</List.Item> : ''
                                                                        }
                                                                        {
                                                                            limitpurchase.ApplyLimitCustomerLifetime ? <List.Item>Limit to customer lifetime</List.Item> : ''
                                                                        }
                                                                    </List>
                                                                </td>
                                                                <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop">
                                                                    {
                                                                        limitpurchase.ID === null || limitpurchase.ID === 0 ? <>
                                                                            No Limit
                                                                        </> :
                                                                            <>
                                                                                <label className="switch">
                                                                                    <input type="checkbox" onClick={() => {
                                                                                        UpdateEnabledStatus(limitpurchase);

                                                                                    }} className={limitpurchase.IsEnabled ? 'active' : ''} id="togBtn" />
                                                                                    <div className="slider round">
                                                                                        <span className="on">ON</span>
                                                                                        <span className="off">OFF</span>
                                                                                    </div>
                                                                                </label>

                                                                            </>
                                                                    }
                                                                </td>
                                                                <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop">
                                                                    {
                                                                        limitpurchase.ID === null || limitpurchase.ID === 0 ? <>
                                                                            <Button
                                                                                onClick={() => {
                                                                                    setIsBulkUpdate(false);
                                                                                    // dispatch(createEditLimitPurchase(limitpurchase));
                                                                                    onClickCreateUpdateLimitPurchase(limitpurchase);
                                                                                }} accessibilityLabel="Add limit">Add limit</Button>
                                                                        </> :
                                                                            <>
                                                                                <div className='group-button-merge'>
                                                                                    <Button icon={EditMinor}
                                                                                        onClick={() => {
                                                                                            setIsBulkUpdate(false);
                                                                                            // dispatch(createEditLimitPurchase(limitpurchase)); 
                                                                                            onClickCreateUpdateLimitPurchase(limitpurchase);
                                                                                        }} accessibilityLabel="Edit" />
                                                                                    <Button icon={DeleteMinor}
                                                                                        onClick={() => { setIsBulkUpdate(false); onClickDeleteLimitPurchase(limitpurchase) }} accessibilityLabel="Remove item" />
                                                                                </div>

                                                                            </>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        </>
                                                    ];
                                                }) : []}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {limitPurchaseState.Paginate.CurrentItems !== undefined && limitPurchaseState.Paginate.CurrentItems !== null && limitPurchaseState.Paginate.CurrentItems.length > 0
                                ? <>

                                </> : <>
                                    <div className="Polaris-Card">
                                        <div className="Polaris-IndexTable">
                                            <div className="Polaris-IndexTable__EmptySearchResultWrapper">
                                                <div className="Polaris-Stack Polaris-Stack--vertical Polaris-Stack--alignmentCenter">
                                                    <div className="Polaris-Stack__Item"><span className="Polaris-TextStyle--variationSubdued"><p>There is no limit purchase</p></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </Card>
                        {
                            limitPurchaseState.Paginate.CurrentItems !== undefined && limitPurchaseState.Paginate.CurrentItems !== null && limitPurchaseState.Paginate.CurrentItems.length > 0 ? <>
                                <div className='paging-area'>
                                    {/* paginate */}
                                    <ReactPaginate
                                        nextLabel=">"
                                        onPageChange={handlePageClick}
                                        pageRangeDisplayed={2}
                                        marginPagesDisplayed={2}
                                        pageCount={limitPurchaseState.Paginate.TotalPage}
                                        previousLabel="<"
                                        pageClassName="page-item"
                                        pageLinkClassName="page-link"
                                        previousClassName="page-item"
                                        previousLinkClassName="page-link"
                                        nextClassName="page-item"
                                        nextLinkClassName="page-link"
                                        breakLabel="..."
                                        breakClassName="page-item"
                                        breakLinkClassName="page-link"
                                        containerClassName="pagination"
                                        activeClassName="active"
                                        renderOnZeroPageCount={null}
                                    />
                                </div>
                            </> : null
                        }

                    </div>
                </div>

            </div>
            <Modal
                open={IsOpenDeleteModal}
                onClose={() => { setIsOpenDeleteModal(false) }}
                title="Do you want to delete rule for this product?"
                primaryAction={{
                    content: 'Delete',
                    loading: limitPurchaseState.IsDeleteLoading,
                    onAction: handleDeleteLimitPurchase,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: () => {
                            setIsOpenDeleteModal(false);
                        },
                    },
                ]}
            >
                {/* <Modal.Section>
                    <TextContainer>
                        <p>
                            Do you want to delete limit purchase "{LimitPurchaseCurrent === null ? '' : LimitPurchaseCurrent.Title}"?
                        </p>
                    </TextContainer>
                </Modal.Section> */}
            </Modal>
            <Modal
                open={createLimitPurchaseState.IsOpenBulkActionModal}
                onClose={() => {
                    dispatch(setCreateUpdateLimitPurchase({
                        ...createLimitPurchaseState,
                        IsOpenBulkActionModal: false
                    }))
                }}
                title={"Do you want to " + BulkActionType + " limit purchase for " + limitPurchaseState.Paginate.CurrentItems.filter(p => p.IsChecked).length + " selected products?"}
                primaryAction={{
                    content: BulkActionType.charAt(0).toUpperCase() + BulkActionType.slice(1),
                    loading: limitPurchaseState.IsPaginateLoading,
                    onAction: handleBulkAction,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: () => {
                            dispatch(setCreateUpdateLimitPurchase({
                                ...createLimitPurchaseState,
                                IsOpenBulkActionModal: false
                            }))
                        },
                    },
                ]}
            >

            </Modal>

            <Modal
                open={createLimitPurchaseState.IsOpenSetLimitBulkActionModal}
                onClose={() => {
                    dispatch(setCreateUpdateLimitPurchase({
                        ...createLimitPurchaseState,
                        IsOpenSetLimitBulkActionModal: false
                    }))
                }}
                title="Create limit purchase for all selected products"
                primaryAction={{
                    content: 'Save',
                    loading: limitPurchaseState.IsSaveLoading,
                    onAction: () => {
                        if (ValidFormBulkUpdate()) {
                            handleBulkAction();
                        }
                    },
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: () => {
                            dispatch(setCreateUpdateLimitPurchase({
                                ...createLimitPurchaseState,
                                IsOpenSetLimitBulkActionModal: false,
                            }));

                        },
                    },
                ]}
            >
                <Modal.Section>
                    <div className='create-update-limit-purchase'>

                        <div className='item'>
                            <TextField
                                label="Min limit purchase"
                                value={createLimitPurchaseState.BulkUpdate.Min !== null && createLimitPurchaseState.BulkUpdate.Min !== undefined ? createLimitPurchaseState.BulkUpdate.Min.toString() : '0'}
                                onChange={(e) => {
                                    dispatch(setCreateUpdateLimitPurchase({
                                        ...createLimitPurchaseState,
                                        BulkUpdate: {
                                            ...createLimitPurchaseState.BulkUpdate,
                                            Min: validateNumber(e.trim()) ? e.trim() : "0"
                                        },
                                        MinValidation: e === '' ? moreAppConfig.MinValidationText : ''
                                    }))
                                }}
                                error={createLimitPurchaseState.MinValidation}
                                type="text"
                            />
                        </div>
                        <div className='item' style={{ marginLeft: '30px' }}>
                            <TextField
                                label="Max limit purchase"
                                value={createLimitPurchaseState.BulkUpdate.Max !== null && createLimitPurchaseState.BulkUpdate.Max !== undefined ? createLimitPurchaseState.BulkUpdate.Max.toString() : '0'}
                                onChange={(e) => {
                                    dispatch(setCreateUpdateLimitPurchase({
                                        ...createLimitPurchaseState,
                                        BulkUpdate: {
                                            ...createLimitPurchaseState.BulkUpdate,
                                            Max: validateNumber(e.trim()) ? e.trim() : "0"
                                        },
                                        MaxValidation: e === '' ? moreAppConfig.MaxValidationText : ''
                                    }))
                                }}
                                error={createLimitPurchaseState.MaxValidation}
                                type="text"
                            />
                            <span className='rule-max-zero'>If you set this 0, it means unlimited</span>
                        </div>
                        <div className='cb'>
                        </div>
                        {/*  style={{ marginBottom: isHover ? '65px' : '0' }}  */}
                        <div className='item'>
                            <Stack>
                                <Checkbox
                                    label="Apply this limit to customer lifetime"
                                    checked={createLimitPurchaseState.BulkUpdate.ApplyLimitCustomerLifetime}
                                    onChange={(e) => {
                                        dispatch(setCreateUpdateLimitPurchase({
                                            ...createLimitPurchaseState,
                                            BulkUpdate: {
                                                ...createLimitPurchaseState.BulkUpdate,
                                                ApplyLimitCustomerLifetime: e
                                            },
                                        }))
                                    }}
                                />

                            </Stack>
                        </div>
                        <div className="item">
                            <span className='show-tooltip show-tooltip-2' onMouseEnter={() => { setIsHover(true) }} onMouseLeave={() => { setIsHover(false) }}>
                                <Icon source={QuestionMarkMajor} color='base' />
                                <span className='tooltip2'>For example, if the max limit is 5, customer can only buy 5 products for one time. If they try to make the 2nd order with this product again, they will be failed.</span>
                            </span>
                        </div>
                        <div className='cb'>
                        </div>

                    </div>
                </Modal.Section>
            </Modal>

            <Modal
                open={createLimitPurchaseState.IsOpenCreateUpdateModal}
                onClose={() => {
                    dispatch(setCreateUpdateLimitPurchase({
                        ...createLimitPurchaseState,
                        IsOpenCreateUpdateModal: false
                    }))
                }}
                title={!IsBulkUpdate ? (LimitPurchaseCurrent !== null && LimitPurchaseCurrent != undefined && LimitPurchaseCurrent.ID > 0 ? 'Update' : 'Create') + " limit purchase for this product" : "Create limit purchase for every products in collections"}
                primaryAction={{
                    content: 'Save',
                    loading: limitPurchaseState.IsSaveLoading,
                    onAction: () => {
                        if (IsBulkUpdate) {
                            if (ValidFormBulkUpdate()) {
                                dispatch(saveBulkLimitPurchase());
                            }
                        }
                        else {
                            if (ValidForm()) {
                                dispatch(saveLimitPurchase());
                            }
                        }

                    },
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: () => {
                            if (IsBulkUpdate) {
                                dispatch(setCreateUpdateLimitPurchase({
                                    ...createLimitPurchaseState,
                                    IsOpenCreateUpdateModal: false
                                }));
                            }
                            else {
                                dispatch(setCreateUpdateLimitPurchase({
                                    ...createLimitPurchaseState,
                                    IsOpenCreateUpdateModal: false,
                                    VariantValidation: ''
                                }));
                            }

                        },
                    },
                ]}
            >
                <Modal.Section>
                    <div className='create-update-limit-purchase'>
                        {
                            IsBulkUpdate ?
                                <><div className="tags-input-wrapper" onClick={() => {
                                    setIsOpenAddSpecificCollectionModal(true);
                                    dispatch(setCreateUpdateLimitPurchase({
                                        ...createLimitPurchaseState,
                                        LimitPurchaseCollectValidation: ''
                                    }))
                                }}>
                                    <span className="search">Search collections
                                    </span>
                                </div>
                                    {
                                        createLimitPurchaseState.BulkUpdate.ListCollects !== null && createLimitPurchaseState.BulkUpdate.ListCollects !== undefined && createLimitPurchaseState.BulkUpdate.ListCollects.length > 0 ?
                                            <div className={createLimitPurchaseState.BulkUpdate.ListCollects.length > 10 ? "tags-input-wrapper tags-input-wrapper-scroll" : "tags-input-wrapper"}>
                                                {
                                                    createLimitPurchaseState.BulkUpdate.ListCollects.map((item, index) => {

                                                        return (
                                                            <span className="tag" key={index}>{item.Title}
                                                                <a title='Remove' onClick={() => {
                                                                    setIsOpenAddSpecificCollectionModal(false);
                                                                    RemoveSpecificCollection(item.ID)
                                                                }}>×</a>
                                                            </span>
                                                        )
                                                    })
                                                }
                                            </div>
                                            :
                                            <>


                                            </>
                                    }
                                    <div className='error'>
                                        {createLimitPurchaseState.LimitPurchaseCollectValidation != null ? <>
                                            <InlineError message={createLimitPurchaseState.LimitPurchaseCollectValidation} fieldID="collect" />
                                            <div className='cb'>
                                            </div></> : <><div className='cb'>
                                            </div></>}

                                    </div>

                                    <div className='item'>
                                        <TextField
                                            label="Min limit purchase"
                                            value={createLimitPurchaseState.BulkUpdate.Min !== null && createLimitPurchaseState.BulkUpdate.Min !== undefined ? createLimitPurchaseState.BulkUpdate.Min.toString() : '0'}
                                            onChange={(e) => {
                                                dispatch(setCreateUpdateLimitPurchase({
                                                    ...createLimitPurchaseState,
                                                    BulkUpdate: {
                                                        ...createLimitPurchaseState.BulkUpdate,
                                                        Min: validateNumber(e.trim()) ? e.trim() : "0"
                                                    },
                                                    MinValidation: e === '' ? moreAppConfig.MinValidationText : ''
                                                }))
                                            }}
                                            error={createLimitPurchaseState.MinValidation}
                                            type="text"
                                        />
                                    </div>
                                    <div className='item' style={{ marginLeft: '30px' }}>
                                        <TextField
                                            label="Max limit purchase"
                                            value={createLimitPurchaseState.BulkUpdate.Max !== null && createLimitPurchaseState.BulkUpdate.Max !== undefined ? createLimitPurchaseState.BulkUpdate.Max.toString() : '0'}
                                            onChange={(e) => {
                                                dispatch(setCreateUpdateLimitPurchase({
                                                    ...createLimitPurchaseState,
                                                    BulkUpdate: {
                                                        ...createLimitPurchaseState.BulkUpdate,
                                                        Max: validateNumber(e.trim()) ? e.trim() : "0"
                                                    },
                                                    MaxValidation: e === '' ? moreAppConfig.MaxValidationText : ''
                                                }))
                                            }}
                                            error={createLimitPurchaseState.MaxValidation}
                                            type="text"
                                        />
                                        <span className='rule-max-zero'>If you set this 0, it means unlimited</span>
                                    </div>
                                    <div className='cb'>
                                    </div>
                                    {/*  style={{ marginBottom: isHover ? '65px' : '0' }}  */}
                                    <div className='item'>
                                        <Stack>
                                            <Checkbox
                                                label="Apply this limit to customer lifetime"
                                                checked={createLimitPurchaseState.BulkUpdate.ApplyLimitCustomerLifetime}
                                                onChange={(e) => {
                                                    dispatch(setCreateUpdateLimitPurchase({
                                                        ...createLimitPurchaseState,
                                                        BulkUpdate: {
                                                            ...createLimitPurchaseState.BulkUpdate,
                                                            ApplyLimitCustomerLifetime: e
                                                        },
                                                    }))
                                                }}
                                            />

                                        </Stack>
                                    </div>
                                    <div className="item">
                                        <span className='show-tooltip show-tooltip-2' onMouseEnter={() => { setIsHover(true) }} onMouseLeave={() => { setIsHover(false) }}>
                                            <Icon source={QuestionMarkMajor} color='base' />
                                            <span className='tooltip2'>For example, if the max limit is 5, customer can only buy 5 products for one time. If they try to make the 2nd order with this product again, they will be failed.</span>
                                        </span>
                                    </div>
                                    <div className='cb'>
                                    </div>
                                </> : <></>
                        }
                        {
                            !IsBulkUpdate ? <>
                                <Stack>
                                    <Checkbox
                                        label="Limit purchase for the whole product"
                                        checked={createLimitPurchaseState.limitpurchase.IsLimitPurchaseWholeProduct}
                                        onChange={(e) => {
                                            dispatch(setCreateUpdateLimitPurchase({
                                                ...createLimitPurchaseState,
                                                limitpurchase: {
                                                    ...createLimitPurchaseState.limitpurchase,
                                                    IsLimitPurchaseWholeProduct: e
                                                },
                                            }))
                                        }}
                                    />

                                </Stack>
                                {
                                    createLimitPurchaseState.limitpurchase.IsLimitPurchaseWholeProduct ?
                                        <>
                                            <div className="break-line"></div>

                                            <div className='item'>
                                                <TextField
                                                    label="Min limit purchase"
                                                    value={createLimitPurchaseState.limitpurchase.Min !== null && createLimitPurchaseState.limitpurchase.Min !== undefined ? createLimitPurchaseState.limitpurchase.Min.toString() : '0'}
                                                    onChange={(e) => {
                                                        dispatch(setCreateUpdateLimitPurchase({
                                                            ...createLimitPurchaseState,
                                                            limitpurchase: {
                                                                ...createLimitPurchaseState.limitpurchase,
                                                                Min: validateNumber(e.trim()) ? e.trim() : "0"
                                                            },
                                                            MinValidation: e === '' ? moreAppConfig.MinValidationText : ''
                                                        }))
                                                    }}
                                                    error={createLimitPurchaseState.MinValidation}
                                                    type="text"
                                                />
                                            </div>
                                            <div className='item' style={{ marginLeft: '30px' }}>
                                                <TextField
                                                    label="Max limit purchase"
                                                    value={createLimitPurchaseState.limitpurchase.Max !== null && createLimitPurchaseState.limitpurchase.Max !== undefined ? createLimitPurchaseState.limitpurchase.Max.toString() : '0'}
                                                    onChange={(e) => {
                                                        dispatch(setCreateUpdateLimitPurchase({
                                                            ...createLimitPurchaseState,
                                                            limitpurchase: {
                                                                ...createLimitPurchaseState.limitpurchase,
                                                                Max: validateNumber(e.trim()) ? e.trim() : "0"
                                                            },
                                                            MaxValidation: e === '' ? moreAppConfig.MaxValidationText : ''
                                                        }))
                                                    }}
                                                    error={createLimitPurchaseState.MaxValidation}
                                                    type="text"
                                                />
                                                <span className='rule-max-zero'>If you set this 0, it means unlimited</span>
                                            </div>

                                            <div className='cb'>
                                            </div>
                                        </> : null
                                }


                                <div className='item' style={{ marginBottom: '0' }}>
                                    <Stack>
                                        <Checkbox
                                            label="Limit purchase for specific variants"
                                            checked={createLimitPurchaseState.limitpurchase.IsLimitPurchaseVariant}
                                            onChange={(e) => {
                                                dispatch(setCreateUpdateLimitPurchase({
                                                    ...createLimitPurchaseState,
                                                    limitpurchase: {
                                                        ...createLimitPurchaseState.limitpurchase,
                                                        IsLimitPurchaseVariant: e
                                                    },
                                                }))
                                            }}
                                        />

                                    </Stack>
                                </div>
                                <div className='cb'>
                                </div>
                                {
                                    createLimitPurchaseState.limitpurchase.IsLimitPurchaseVariant ?
                                        <>
                                            <div className='table-name'>
                                                <div className='header'>
                                                    <div className='item-table'>
                                                        <div className='col col1'>
                                                            <Checkbox
                                                                checked={createLimitPurchaseState.limitpurchase.IsCheckAll}
                                                                onChange={(e) => {
                                                                    var result = createLimitPurchaseState.limitpurchase.ListVariant.map((p, i) => (true ? {
                                                                        ...p,
                                                                        IsChecked: e,
                                                                        IsDisabled: !e,
                                                                    } : p))
                                                                    dispatch(setCreateUpdateLimitPurchase({
                                                                        ...createLimitPurchaseState,
                                                                        limitpurchase: {
                                                                            ...createLimitPurchaseState.limitpurchase,
                                                                            ListVariant: result,
                                                                            IsCheckAll: e,
                                                                            ListLimitPurchaseVariant: result.filter(p => p.IsChecked),
                                                                        },
                                                                    }))
                                                                }}
                                                            />
                                                        </div>
                                                        <div className='col col2'>
                                                            Variants
                                                        </div>
                                                        <div className='col col3'>
                                                            Min limit purchase
                                                        </div>
                                                        <div className='col col4'>
                                                            Max limit purchase
                                                        </div>
                                                    </div>
                                                    <div className='cb'></div>

                                                </div>
                                                <div className='body'>
                                                    {createLimitPurchaseState.limitpurchase != null && createLimitPurchaseState.limitpurchase != undefined && createLimitPurchaseState.limitpurchase.ListVariant
                                                        .map(
                                                            ({ ID, ProductID, VariantID, VariantName, Min, Max, MinValidation, MaxValidation, IsDisabled, IsChecked }, index) => (
                                                                <>
                                                                    <div className='item-table' key={index}>
                                                                        <div className='col col1'>
                                                                            <Checkbox
                                                                                checked={IsChecked}
                                                                                onChange={(e) => {
                                                                                    var result = createLimitPurchaseState.limitpurchase.ListVariant.map((p, i) => (p.VariantID == VariantID ? {
                                                                                        ...p,
                                                                                        IsChecked: e,
                                                                                        IsDisabled: !e,
                                                                                    } : p));
                                                                                    var checkall = result.length === result.filter(p => p.IsChecked).length;
                                                                                    dispatch(setCreateUpdateLimitPurchase({
                                                                                        ...createLimitPurchaseState,
                                                                                        limitpurchase: {
                                                                                            ...createLimitPurchaseState.limitpurchase,
                                                                                            ListVariant: result,
                                                                                            ListLimitPurchaseVariant: result.filter(p => p.IsChecked),
                                                                                            IsCheckAll: checkall
                                                                                        },
                                                                                        VariantValidation: ''
                                                                                    }))
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className='col col2'>
                                                                            {VariantName}
                                                                        </div>
                                                                        <div className='col col3'>
                                                                            <TextField
                                                                                disabled={IsDisabled}
                                                                                value={Min.toString()}
                                                                                onChange={(e) => {
                                                                                    dispatch(setCreateUpdateLimitPurchase({
                                                                                        ...createLimitPurchaseState,
                                                                                        limitpurchase: {
                                                                                            ...createLimitPurchaseState.limitpurchase,
                                                                                            ListVariant: createLimitPurchaseState.limitpurchase.ListVariant.map((p, i) => (p.VariantID == VariantID ? {
                                                                                                ...p,
                                                                                                Min: validateNumber(e.trim()) ? e.trim() : "0",
                                                                                                MinValidation: e === '' ? moreAppConfig.MinValidationText : ''
                                                                                            } : p)),
                                                                                            ListLimitPurchaseVariant: createLimitPurchaseState.limitpurchase.ListLimitPurchaseVariant.map((p, i) => (p.VariantID == VariantID ? {
                                                                                                ...p,
                                                                                                Min: validateNumber(e.trim()) ? e.trim() : "0",
                                                                                            } : p))
                                                                                        },

                                                                                    }))
                                                                                    // profileState.setMinVariant(e, row.VariantID);
                                                                                }}
                                                                                error={!IsDisabled ? MinValidation : ''}
                                                                                type="number"
                                                                            />
                                                                        </div>
                                                                        <div className='col col4'>
                                                                            <TextField
                                                                                disabled={IsDisabled}
                                                                                value={Max.toString()}
                                                                                onChange={(e) => {
                                                                                    dispatch(setCreateUpdateLimitPurchase({
                                                                                        ...createLimitPurchaseState,
                                                                                        limitpurchase: {
                                                                                            ...createLimitPurchaseState.limitpurchase,
                                                                                            ListVariant: createLimitPurchaseState.limitpurchase.ListVariant.map((p, i) => (p.VariantID == VariantID ? {
                                                                                                ...p,
                                                                                                Max: validateNumber(e.trim()) ? e.trim() : "0",
                                                                                                MaxValidation: e === '' ? moreAppConfig.MaxValidationText : ''
                                                                                            } : p)),
                                                                                            ListLimitPurchaseVariant: createLimitPurchaseState.limitpurchase.ListLimitPurchaseVariant.map((p, i) => (p.VariantID == VariantID ? {
                                                                                                ...p,
                                                                                                Max: validateNumber(e.trim()) ? e.trim() : "0",
                                                                                            } : p))
                                                                                        },

                                                                                    }))
                                                                                }}
                                                                                error={!IsDisabled ? MaxValidation : ''}
                                                                                type="number"
                                                                            />
                                                                        </div>
                                                                        <div className='cb'></div>
                                                                    </div>
                                                                </>

                                                            ))}

                                                </div>
                                            </div>
                                            <div style={{ marginLeft: '10px' }}>

                                                {/* <TableVariant ListVariant={createLimitPurchaseState.limitpurchase.ListVariant} ItemSelected={createLimitPurchaseState.limitpurchase.ListLimitPurchaseVariant} setVariant={setVariant} setMinVariant={setMinVariant} setMaxVariant={setMaxVariant} ProductCode={createLimitPurchaseState.limitpurchase.ProductCode}></TableVariant> */}
                                                <InlineError message={createLimitPurchaseState.VariantValidation} fieldID="collect" />

                                            </div>
                                        </> : null
                                }
                                <div className='cb'>
                                </div>
                                <div className='item' style={{ marginTop: '12px' }}>
                                    <Stack>
                                        <Checkbox
                                            label="Apply this limit to customer lifetime"
                                            checked={createLimitPurchaseState.limitpurchase.ApplyLimitCustomerLifetime}
                                            onChange={(e) => {
                                                dispatch(setCreateUpdateLimitPurchase({
                                                    ...createLimitPurchaseState,
                                                    limitpurchase: {
                                                        ...createLimitPurchaseState.limitpurchase,
                                                        ApplyLimitCustomerLifetime: e
                                                    },
                                                }))
                                            }}
                                        />

                                    </Stack>
                                </div>
                                <div className="item" style={{ marginTop: '15px' }}>
                                    <span className='show-tooltip show-tooltip-2' onMouseEnter={() => { setIsHover(true) }} onMouseLeave={() => { setIsHover(false) }}>
                                        <Icon source={QuestionMarkMajor} color='base' />
                                        <span className='tooltip2'>For example, if the max limit is 5, customer can only buy 5 products for one time. If they try to make the 2nd order with this product again, they will be failed.</span>
                                    </span>
                                </div>
                                <div className='cb'>
                                </div>
                            </> : <></>
                        }

                    </div>
                </Modal.Section>
            </Modal>
            {
                IsOpenAdSpecificCollectionModal ? <>
                    <TableCollection Collections={limitPurchaseState.Collections} IsOpenAdSpecificCollectionModal={IsOpenAdSpecificCollectionModal} setIsOpenAddSpecificCollectionModal={setIsOpenAddSpecificCollectionModal} ItemSelected={createLimitPurchaseState.BulkUpdate.ListCollects}></TableCollection>

                </> : <></>
            }
            {Alert}
            {
                createLimitPurchaseState.IsOpenSaveResult ? <Toast content={createLimitPurchaseState.MessageSaveResult} duration={2400} onDismiss={() => {
                    dispatch(setCreateUpdateLimitPurchase({
                        ...createLimitPurchaseState,
                        IsOpenSaveResult: false
                    }))
                }} /> : null
            }
        </>

    )
}

export default withRouter(LimitPurchase);