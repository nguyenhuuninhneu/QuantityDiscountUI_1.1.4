import { Card, Badge, InlineError, Button, Modal, Toast, TextContainer, Icon, TextField, DataTable, List, Stack, Checkbox } from '@shopify/polaris';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateUpdateLimitCollection, setListLimitCollection, setSetting, setIsDeleteLoading, setIsPaginateLoading } from '../../state/modules/limitcollection/actions';
import config from '../../config/config';
import { createEditLimitCollection, fetchList, saveLimitCollection, saveBulkActionCollection } from '../../state/modules/limitcollection/operations';
import { DeleteMinor, EditMinor, QuestionMarkMajor } from '@shopify/polaris-icons';
import moreAppConfig from '../../config/moreAppConfig';
import '../../assets/css/paginate.css';
import '../../assets/css/modal.css';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import { withRouter } from "react-router-dom";
import SpinnerAbsolute from '../plugins/Spinner';

const LimitCollection = () => {
    const [IsOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [IsBulkUpdate, setIsBulkUpdate] = useState(false);
    const [LimitCollectionCurrent, setLimitCollectionCurrent] = useState(null);
    const [Alert, setAlert] = useState(null);
    const dispatch = useDispatch();
    const appState = useSelector((state) => state.app);
    const limitCollectionState = useSelector((state) => state.limitcollection.ListLimitCollection);
    const createLimitCollectionState = useSelector((state) => state.limitcollection.CreateUpdateLimitCollection);
    const [IsOpenAdSpecificCollectionModal, setIsOpenAddSpecificCollectionModal] = useState(false);
    //search by button and enter
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    const [BulkActionType, setBulkActionType] = useState("delete");
    const [isHover, setIsHover] = useState(false);
    const [isHoverAction, setIsHoverAction] = useState(false);
    useEffect(() => {

        dispatch(fetchList());
        getSettingOne();
        // Fetch items from another resources.
        // const endOffset = limitCollectionState.Paginate.Offset + moreAppConfig.ItemPerPage;
        // if (limitCollectionState.limitcollections != undefined && limitCollectionState.limitcollections != null) {
        //     dispatch(setListLimitCollection({
        //         ...limitCollectionState,
        //         Paginate: {
        //             ...limitCollectionState.Paginate,
        //             Offset: limitCollectionState.Paginate.Offset,
        //             CurrentItems: limitCollectionState.limitcollections.slice(limitCollectionState.Paginate.Offset, endOffset),
        //             TotalPage: limitCollectionState.limitcollections.length <= moreAppConfig.ItemPerPage ? 1 : Math.ceil(limitCollectionState.limitcollections.length / moreAppConfig.ItemPerPage)
        //         }
        //     }))
        // }

    }, [dispatch]);
    const validateNumber = (e) => {
        if (isNaN(e)) {
            return false;
        } else {
            return true;
        }
    }
    const getSettingOne = async () => {
        await axios.get(config.rootLink + '/FrontEnd/GetSettingOne', {
            params: {
                shop: config.shop,
                token: config.token,
            }
        })
            .then((res) => {
                const result = res?.data;
                dispatch(setSetting(result));
            })
            .catch(err => console.log(err))
    }

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        dispatch(setIsPaginateLoading(true));
        axios.get(config.rootLink + '/FrontEnd/GetLimitCollectionsPaginate', {
            params: {
                search: limitCollectionState.TextSearchCollection,
                typeselected: limitCollectionState.CollectionSelected,
                shop: config.shop,
                page: event.selected + 1,
                pagezise: 10,
                token: config.token,

            }
        })
            .then(function (response) {
                const result = response?.data;
                dispatch(setListLimitCollection({
                    ...limitCollectionState,
                    IsPaginateLoading: false,
                    Paginate: {
                        ...limitCollectionState.Paginate,
                        CurrentItems: result.list,
                        TotalPage: result.totalpage
                    },
                    IsCheckAllLimitCollection: false,
                    TotalLimitCollection: result.totalitem,
                    TotalHaveLimitCollection: result.totalitemhavelimit
                }))
            })
            .catch(function (error) {
                const errorMsg = error.message;
                console.log(errorMsg);
            })

    };

    const onClickDeleteLimitCollection = (limitcollection) => {
        setLimitCollectionCurrent(limitcollection);
        setIsOpenDeleteModal(true);
    }
    const onClickCreateUpdateLimitCollection = (limitcollection) => {

        dispatch(setCreateUpdateLimitCollection({
            ...createLimitCollectionState,
            limitcollection: limitcollection,
            IsOpenCreateUpdateModal: true
        }))
    }
    const onClickBulkUpdateLimitCollection = () => {
        dispatch(setCreateUpdateLimitCollection({
            ...createLimitCollectionState,
            BulkUpdate: {
                Min: 0,
                Max: 0,
                ListCollects: null
            },
            IsOpenCreateUpdateModal: true
        }))
    }
    const handleDeleteLimitCollection = () => {
        if (limitCollectionState.limitcollections != null && limitCollectionState.limitcollections.length > 0 && LimitCollectionCurrent != null && LimitCollectionCurrent.ID > 0) {
            dispatch(setIsDeleteLoading(true));
            axios.post(config.rootLink + '/FrontEnd/DeleteLimitCollection', { id: LimitCollectionCurrent.ID, shop: config.shop, token: config.token })
                .then(function (response) {
                    if (response.data.IsSuccess) {
                        axios.get(config.rootLink + '/FrontEnd/GetLimitCollectionsPaginate', {
                            params: {
                                search: limitCollectionState.TextSearchCollection,
                                typeselected: limitCollectionState.CollectionSelected,
                                shop: config.shop,
                                page: 1,
                                pagezise: 10,
                                token: config.token
                            }
                        })
                            .then(function (response) {
                                const result = response?.data;
                                //Set List + paging
                                dispatch(setListLimitCollection({
                                    ...limitCollectionState,
                                    Paginate: {
                                        ...limitCollectionState.Paginate,
                                        Offset: 0,
                                        CurrentItems: result.list,
                                        TotalPage: result.totalpage
                                    },
                                    IsDeleteLoading: false,
                                    IsCheckAllLimitCollection: false,
                                    TotalLimitCollection: result.totalitem,
                                    TotalHaveLimitCollection: result.totalitemhavelimit
                                }))
                                dispatch(setCreateUpdateLimitCollection({
                                    ...createLimitCollectionState,
                                    IsOpenSaveToolbar: false
                                }))
                                setAlert(<Toast content={'The limit collection: ' + LimitCollectionCurrent.CollectName + ' deleted successfully'} duration={2400} onDismiss={() => {
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
    const handleSearchCollectionLimit = (textSearch, productSelected) => {
        dispatch(setIsPaginateLoading(true));
        axios.get(config.rootLink + '/FrontEnd/GetLimitCollectionsPaginate', {
            params: {
                search: textSearch,
                typeselected: productSelected,
                shop: config.shop,
                page: 1,
                pagezise: 10,
                token: config.token
            }
        })
            .then(function (response) {
                const result = response?.data;
                //Set List + paging
                dispatch(setListLimitCollection({
                    ...limitCollectionState,
                    IsPaginateLoading: false,
                    TextSearchCollection: textSearch,
                    CollectionSelected: productSelected,
                    Paginate: {
                        ...limitCollectionState.Paginate,
                        Offset: 0,
                        CurrentItems: result.list,
                        TotalPage: result.totalpage
                    }, IsCheckAllLimitCollection: false,
                    TotalLimitCollection: result.totalitem,
                    //TotalHaveLimitCollection: result.totalitemhavelimit,
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
        if (createLimitCollectionState.limitcollection.CollectName === null || createLimitCollectionState.limitcollection.CollectName === undefined || createLimitCollectionState.limitcollection.CollectName === '') {
            dispatch(setCreateUpdateLimitCollection({
                ...createLimitCollectionState,
                CollectNameValidation: moreAppConfig.CollectNameValidationText
            }))
            return false;
        }
        if (createLimitCollectionState.limitcollection.Min === '') {
            dispatch(setCreateUpdateLimitCollection({
                ...createLimitCollectionState,
                MinValidation: moreAppConfig.MinValidationText
            }))
            return false;
        }
        if (createLimitCollectionState.limitcollection.Max === '') {
            dispatch(setCreateUpdateLimitCollection({
                ...createLimitCollectionState,
                MaxValidation: moreAppConfig.MaxValidationText
            }))
            return false;
        }
        if (createLimitCollectionState.limitcollection.Min != '' && createLimitCollectionState.limitcollection.Max != '') {
            let min = parseInt(createLimitCollectionState.limitcollection.Min);
            let max = parseInt(createLimitCollectionState.limitcollection.Max);
            if (max > 0) {
                if (min > max) {
                    dispatch(setCreateUpdateLimitCollection({
                        ...createLimitCollectionState,
                        MaxValidation: moreAppConfig.MaxGreateThanMinValidationText
                    }))
                    return false;
                }
                else {
                    dispatch(setCreateUpdateLimitCollection({
                        ...createLimitCollectionState,
                        MaxValidation: ''
                    }))
                }
            }

        }


        return true;
    }
    function ValidFormBulkUpdate() {
        if (createLimitCollectionState.BulkUpdate.ListCollects === null || createLimitCollectionState.BulkUpdate.ListCollects === undefined || createLimitCollectionState.BulkUpdate.ListCollects.length === 0) {
            dispatch(setCreateUpdateLimitCollection({
                ...createLimitCollectionState,
                LimitCollectionValidation: moreAppConfig.LimitCollectionCollectValidationText
            }))
            return false;
        }
        else {
            dispatch(setCreateUpdateLimitCollection({
                ...createLimitCollectionState,
                LimitCollectionValidation: ''
            }))
        }
        if (createLimitCollectionState.BulkUpdate.Min === '') {
            dispatch(setCreateUpdateLimitCollection({
                ...createLimitCollectionState,
                MinValidation: moreAppConfig.MinValidationText
            }))
            return false;
        }
        if (createLimitCollectionState.BulkUpdate.Max === '') {
            dispatch(setCreateUpdateLimitCollection({
                ...createLimitCollectionState,
                MaxValidation: moreAppConfig.MaxValidationText
            }))
            return false;
        }
        if (createLimitCollectionState.BulkUpdate.Min != '' && createLimitCollectionState.BulkUpdate.Max != '') {
            let min = parseInt(createLimitCollectionState.BulkUpdate.Min);
            let max = parseInt(createLimitCollectionState.BulkUpdate.Max);
            if (max > 0) {
                if (min > max) {
                    dispatch(setCreateUpdateLimitCollection({
                        ...createLimitCollectionState,
                        MaxValidation: moreAppConfig.MaxGreateThanMinValidationText
                    }))
                    return false;
                }
                else {
                    dispatch(setCreateUpdateLimitCollection({
                        ...createLimitCollectionState,
                        MaxValidation: ''
                    }))
                }
            }
        }


        return true;
    }

    function RemoveSpecificCollection(id) {
        var arrPro = createLimitCollectionState.BulkUpdate.ListCollects.filter(p => p.ID != id);
        dispatch(setCreateUpdateLimitCollection(
            {
                ...createLimitCollectionState,
                BulkUpdate:
                {
                    ...createLimitCollectionState.BulkUpdate,
                    ListCollects: arrPro
                },
                IsOpenSaveToolbar: true
            }));
    }

    const handleSelectChangeLimitTypeMin = (e) => {
        dispatch(setCreateUpdateLimitCollection({
            ...createLimitCollectionState,
            limitcollection: {
                ...createLimitCollectionState.limitcollection,
                LimitTypeMin: e.value,
            },
        }))
    };
    const handleSelectChangeLimitTypeMax = (e) => {
        dispatch(setCreateUpdateLimitCollection({
            ...createLimitCollectionState,
            limitcollection: {
                ...createLimitCollectionState.limitcollection,
                LimitTypeMax: e.value,
            },
        }))
    };


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
        dispatch(setCreateUpdateLimitCollection({
            ...createLimitCollectionState,
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
        dispatch(saveBulkActionCollection(type));
    }

    function UpdateEnabledStatus(limitcollection) {
        dispatch(setIsPaginateLoading(true));
        axios.post(config.rootLink + '/FrontEnd/UpdateLimitCollectionEnabled', { id: limitcollection.ID, shop: config.shop, status: limitcollection.IsEnabled })
            .then(function (response) {
                if (response.data.IsSuccess) {

                    dispatch(setListLimitCollection({
                        ...limitCollectionState,
                        Paginate: {
                            ...limitCollectionState.Paginate,
                            CurrentItems: limitCollectionState.Paginate.CurrentItems.map((p, i) => (p.CollectCode == limitcollection.CollectCode ? {
                                ...p,
                                IsEnabled: !limitcollection.IsEnabled,
                            } : p)),
                        },
                        IsPaginateLoading: false
                    }))
                    
                    setAlert(<Toast content={'The limit: ' + limitcollection.Title + ' update status successfully'} duration={2400} onDismiss={() => {
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
    return (

        <>
            <div className='campaign-products' style={{ margin: '10px 0' }}>
                <div className='campaign-products-list'>
                    <div className=''>
                        <div className='campaign-product-header'>
                            <div className='colLeft w50pt'>
                                <div className='colLeft w32pt'>
                                    <Select
                                        // placeholder={'Discount base on'}
                                        defaultValue={limitCollectionState.ListCollectionHaveLimit[0]}
                                        options={limitCollectionState.ListCollectionHaveLimit}
                                        onChange={(e) => {
                                            handleSearchCollectionLimit(limitCollectionState.TextSearchCollection, e.value);
                                        }}
                                        isSearchable={false}
                                    // value={limitCollectionState.CollectionSelected}
                                    />
                                </div>
                                <div className='colLeft w66pt ml-5'>
                                    {/* //search by button and enter */}
                                    <div className="Polaris-Connected"><div className="Polaris-Connected__Item Polaris-Connected__Item--primary"><div className="Polaris-TextField"><input id="TypeTag" placeholder="Typing the keyword for collection title and hit enter" className="Polaris-TextField__Input" type="text" aria-labelledby="TypeTagLabel" aria-invalid="false" value={limitCollectionState.TextSearchCollection}
                                        onChange={(e) => {
                                            dispatch(setListLimitCollection({
                                                ...limitCollectionState,
                                                TextSearchCollection: e.target.value,

                                            }))
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearchCollectionLimit(e.target.value, limitCollectionState.CollectionSelected);

                                            }
                                        }} /><div className="Polaris-TextField__Backdrop" ></div></div></div></div>
                                    {/* <TextField
                                        placeholder={'Search Collection Title'}
                                        value={limitCollectionState.TextSearchCollection}
                                        onChange={(e) => {
                                            handleSearchCollectionLimit(e, limitCollectionState.CollectionSelected)
                                        }}
                                        type="text"
                                    /> */}
                                </div>

                                <div className='cb'>
                                </div>
                            </div>
                            <div className='colRight w50pt'>
                                {/* //search by button and enter */}
                                <div className='colLeft ml-10'>
                                    <Button primary
                                        loading={isSearchLoading}
                                        onClick={() => {
                                            setIsSearchLoading(true);
                                            handleSearchCollectionLimit(limitCollectionState.TextSearchCollection, limitCollectionState.CollectionSelected)
                                        }}>Search</Button>
                                </div>
                                {/* <div className='colRight'>
                                    <Button primary onClick={() => {
                                        setIsBulkUpdate(true);
                                        onClickBulkUpdateLimitCollection();
                                    }}>Bulk Action</Button>
                                </div> */}
                                <div className='cb'>
                                </div>
                            </div>
                            <div className='cb'>
                            </div>
                        </div>
                    </div>
                    <p style={{ margin: '10px 0' }}>Total : {limitCollectionState.TotalLimitCollection} collections</p>

                    <div className='campaign-product-list-content'>
                        {
                            limitCollectionState.IsPaginateLoading ? <SpinnerAbsolute></SpinnerAbsolute> : null
                        }
                        <Card>

                            <div className="Polaris-DataTable--condensed">
                                {
                                    limitCollectionState.Paginate.CurrentItems.filter(p => p.IsChecked).length > 0 ? <>
                                        <div className="Polaris-IndexTable__StickyTable" role="presentation">
                                            <div>
                                                <div className="Polaris-IndexTable__BulkActionsWrapper">
                                                    <div>
                                                        <div className="Polaris-BulkActions__Group Polaris-BulkActions__Group--largeScreen Polaris-BulkActions__Group--entered">
                                                            <div className="Polaris-BulkActions__ButtonGroupWrapper">
                                                                <div className="Polaris-ButtonGroup Polaris-ButtonGroup--segmented" data-buttongroup-segmented="true">
                                                                    <div className="Polaris-ButtonGroup__Item" onMouseDown={(e) => {
                                                                        ;
                                                                        var e = !limitCollectionState.IsCheckAllLimitCollection;
                                                                        var result = limitCollectionState.Paginate.CurrentItems.map((p, i) => (true ? {
                                                                            ...p,
                                                                            IsChecked: e,
                                                                        } : p))
                                                                        dispatch(setListLimitCollection({
                                                                            ...limitCollectionState,
                                                                            Paginate: {
                                                                                ...limitCollectionState.Paginate,
                                                                                CurrentItems: result,
                                                                            },
                                                                            IsCheckAllLimitCollection: e
                                                                        }))
                                                                    }}>
                                                                        <div className="Polaris-CheckableButton Polaris-CheckableButton__CheckableButton--selectMode Polaris-CheckableButton__CheckableButton--selected">
                                                                            <div className="Polaris-CheckableButton__Checkbox">
                                                                                <label className="Polaris-Choice Polaris-Choice--labelHidden" for="PolarisCheckbox3">
                                                                                    <span className="Polaris-Choice__Control">
                                                                                        <span className="Polaris-Checkbox">
                                                                                            <input id="PolarisCheckbox3" type="checkbox" className="Polaris-Checkbox__Input" aria-invalid="false" role="checkbox" aria-checked="true" value="" checked={limitCollectionState.IsCheckAllLimitCollection}
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
                                                                            <span className="Polaris-CheckableButton__Label">{limitCollectionState.Paginate.CurrentItems.filter(p => p.IsChecked).length} selected</span>
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
                                                                <div id="Polarispopover17" tabindex="-1" className="Polaris-Popover__Content" style={{ minHeight: (45 * 3) + 'px' }}>
                                                                    <div className="Polaris-Popover__Pane Polaris-Scrollable Polaris-Scrollable--vertical" data-polaris-scrollable="true">
                                                                        <div className="Polaris-ActionList">
                                                                            <div className="Polaris-ActionList__Section--withoutTitle">
                                                                                <ul className="Polaris-ActionList__Actions" tabindex="-1">
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
                                                limitCollectionState.Paginate.CurrentItems.filter(p => p.IsChecked).length === 0 ? <>
                                                    <thead>
                                                        <tr>
                                                            <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--header" scope="col">
                                                                <Checkbox
                                                                    checked={limitCollectionState.IsCheckAllLimitCollection}
                                                                    onChange={(e) => {
                                                                        ;
                                                                        var result = limitCollectionState.Paginate.CurrentItems.map((p, i) => (true ? {
                                                                            ...p,
                                                                            IsChecked: e,
                                                                        } : p))
                                                                        dispatch(setListLimitCollection({
                                                                            ...limitCollectionState,
                                                                            Paginate: {
                                                                                ...limitCollectionState.Paginate,
                                                                                CurrentItems: result,
                                                                            },
                                                                            IsCheckAllLimitCollection: e
                                                                        }))
                                                                    }}
                                                                />
                                                            </th>
                                                            <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header" scope="col">Collections</th>
                                                            <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header" scope="col">Limit purchase</th>
                                                            <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header" scope="col">Status</th>
                                                            <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header" scope="col">Action</th>
                                                        </tr>
                                                    </thead>
                                                </>
                                                    : ''
                                            }

                                            <tbody>
                                                {limitCollectionState.Paginate.CurrentItems != null && limitCollectionState.Paginate.CurrentItems.length > 0 ? limitCollectionState.Paginate.CurrentItems.map((limitcollection, index) => {
                                                    return [
                                                        <>
                                                            <tr className="Polaris-DataTable__TableRow Polaris-DataTable--hoverable" style={{ background: limitcollection.IsChecked ? '#f2f7fe' : 'none' }}>
                                                                <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn" scope="row">
                                                                    <Checkbox
                                                                        checked={limitcollection.IsChecked}
                                                                        onChange={(e) => {
                                                                            ;
                                                                            var result = limitCollectionState.Paginate.CurrentItems.map((p, i) => (p.CollectCode == limitcollection.CollectCode ? {
                                                                                ...p,
                                                                                IsChecked: e,
                                                                            } : p));
                                                                            var checkall = result.length === result.filter(p => p.IsChecked).length;
                                                                            dispatch(setListLimitCollection({
                                                                                ...limitCollectionState,
                                                                                Paginate: {
                                                                                    ...limitCollectionState.Paginate,
                                                                                    CurrentItems: limitCollectionState.Paginate.CurrentItems.map((p, i) => (p.CollectCode == limitcollection.CollectCode ? {
                                                                                        ...p,
                                                                                        IsChecked: e,
                                                                                    } : p)),
                                                                                },
                                                                                IsCheckAllLimitCollection: checkall
                                                                            }))
                                                                        }}
                                                                    />
                                                                </th>
                                                                <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop">
                                                                    <p key={index}>
                                                                        {limitcollection.Title}
                                                                        {/* <a href={'https://' + appState?.Shop?.Domain + '/products/' + limitcollection.Handle} target="_blank"></a> */}
                                                                    </p>
                                                                </td>
                                                                <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop">
                                                                    {
                                                                       limitcollection.ID !== null && limitcollection.ID !== 0 &&   limitcollection.Min !== undefined && limitcollection.Min !== null && limitcollection.Max !== undefined && limitcollection.Max !== null ?
                                                                            <List type="bullet">
                                                                                <List.Item>Min: {limitcollection.Min} {limitcollection.LimitTypeMin === 0 ? 'items' : (limitCollectionState.Setting !== null && limitCollectionState.Setting !== undefined ? limitCollectionState.Setting.Currency : 'USD')}</List.Item>
                                                                                <List.Item>Max: {limitcollection.Max === 0 ? 'Unlimited' : limitcollection.Max + ' ' + (limitcollection.LimitTypeMax === 0 ? 'items' : (limitCollectionState.Setting !== null && limitCollectionState.Setting !== undefined ? limitCollectionState.Setting.Currency : 'USD'))} </List.Item>
                                                                                <>
                                                                                    {
                                                                                        limitcollection.ApplyLimitCustomerLifetime ? <List.Item>Limit to customer lifetime</List.Item> : ''
                                                                                    }

                                                                                </>
                                                                            </List> : null
                                                                    }
                                                                </td>
                                                                <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop">
                                                                    {
                                                                        limitcollection.ID === null || limitcollection.ID === 0 ? <>
                                                                            No Limit
                                                                        </> :
                                                                            <>
                                                                                <label className="switch">
                                                                                    <input type="checkbox" onClick={() => {
                                                                                        UpdateEnabledStatus(limitcollection);

                                                                                    }} className={limitcollection.IsEnabled ? 'active' : ''} id="togBtn" />
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
                                                                        limitcollection.ID === null || limitcollection.ID === 0 ? <>
                                                                            <Button
                                                                                onClick={() => { setIsBulkUpdate(false); onClickCreateUpdateLimitCollection(limitcollection); }} accessibilityLabel="Add limit">Add limit</Button>
                                                                        </> :
                                                                            <>
                                                                                <div className='group-button-merge'>
                                                                                    <Button icon={EditMinor}
                                                                                        onClick={() => { setIsBulkUpdate(false); onClickCreateUpdateLimitCollection(limitcollection); }} accessibilityLabel="Edit" />
                                                                                    <Button icon={DeleteMinor}
                                                                                        onClick={() => { setIsBulkUpdate(false); onClickDeleteLimitCollection(limitcollection) }} accessibilityLabel="Remove item" />
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


                            {limitCollectionState.Paginate.CurrentItems !== undefined && limitCollectionState.Paginate.CurrentItems !== null && limitCollectionState.Paginate.CurrentItems.length > 0
                                ? <>

                                </> : <>
                                    <div className="Polaris-Card">
                                        <div className="Polaris-IndexTable">
                                            <div className="Polaris-IndexTable__EmptySearchResultWrapper">
                                                <div className="Polaris-Stack Polaris-Stack--vertical Polaris-Stack--alignmentCenter">
                                                    <div className="Polaris-Stack__Item"><span className="Polaris-TextStyle--variationSubdued"><p>There is no limit collection</p></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </Card>
                        {
                            limitCollectionState.Paginate.CurrentItems !== undefined && limitCollectionState.Paginate.CurrentItems !== null && limitCollectionState.Paginate.CurrentItems.length > 0 ? <>
                                <div className='paging-area'>
                                    {/* paginate */}
                                    <ReactPaginate
                                        nextLabel=">"
                                        onPageChange={handlePageClick}
                                        pageRangeDisplayed={2}
                                        marginPagesDisplayed={2}
                                        pageCount={limitCollectionState.Paginate.TotalPage}
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
                title="Do you want to delete rule for this collection?"
                primaryAction={{
                    content: 'Delete',
                    loading: limitCollectionState.IsDeleteLoading,
                    onAction: handleDeleteLimitCollection,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: () => { setIsOpenDeleteModal(false) },
                    },
                ]}
            >
                {/* <Modal.Section>
                    <TextContainer>
                        <p>
                            Do you want to delete limit purchase "{LimitCollectionCurrent === null ? '' : LimitCollectionCurrent.Title}"?
                        </p>
                    </TextContainer>
                </Modal.Section> */}
            </Modal>
            <Modal
                open={createLimitCollectionState.IsOpenCreateUpdateModal}
                onClose={() => {

                    dispatch(setCreateUpdateLimitCollection({
                        ...createLimitCollectionState,
                        limitcollection: {
                            ...createLimitCollectionState.limitcollection,
                            CollectName: ''
                        },
                        IsOpenCreateUpdateModal: false
                    }))
                }}
                title={'Create limit purchase for this collection'}
                primaryAction={{
                    content: 'Save',
                    loading: limitCollectionState.IsSaveLoading,
                    onAction: () => {
                        if (ValidForm()) {
                            dispatch(saveLimitCollection());
                        }

                    },
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: () => {
                            dispatch(setCreateUpdateLimitCollection({
                                ...createLimitCollectionState,
                                IsOpenCreateUpdateModal: false
                            }))

                        },
                    },
                ]}
            >
                <Modal.Section>
                    <div className='create-update-limit-purchase'>
                        {
                            !IsBulkUpdate ? <>
                                <div className=''>Collection original name: <strong>{createLimitCollectionState.limitcollection.Title}</strong></div>
                                <div className='cb break-line-2'>
                                </div>
                                <div className='item w100'>
                                    <TextField
                                        value={createLimitCollectionState.limitcollection.CollectName}
                                        onChange={(e) => {
                                            dispatch(setCreateUpdateLimitCollection({
                                                ...createLimitCollectionState,
                                                limitcollection: {
                                                    ...createLimitCollectionState.limitcollection,
                                                    CollectName: e
                                                },
                                                IsOpenSaveToolbar: true,
                                                CollectNameValidation: e == '' ? moreAppConfig.CollectNameValidationText : null
                                            }))
                                        }}
                                        error={createLimitCollectionState.CollectNameValidation}
                                        type="text"
                                        label="Collection display name"
                                        placeholder='Collection display name'
                                    />
                                </div>

                                <div className='cb'>
                                </div>
                                <span className='rule-max-zero'>This name will be shown in alert popup for customer. For example “You have to choose minimum of 3 items in {createLimitCollectionState.limitcollection.CollectName}”</span>
                                <div style={{ marginBottom: '5px' }}>Min limit purchase</div>

                                <div className='item'>
                                    <Select
                                        label="Min limit purchase"
                                        options={moreAppConfig.LimitTypeMin}
                                        defaultValue={moreAppConfig.LimitTypeMin[0]}
                                        onChange={(e) => {
                                            // value = parseInt(value);
                                            handleSelectChangeLimitTypeMin(e);
                                        }}
                                        isSearchable={false}
                                        value={moreAppConfig.LimitTypeMin.filter(p => p.value == createLimitCollectionState.limitcollection.LimitTypeMin)[0] || moreAppConfig.LimitTypeMin[0]}
                                    />
                                </div>
                                <span className="text-is">is</span>
                                <div className='item'>
                                    <div className='price-discount'>


                                        {
                                            createLimitCollectionState.limitcollection.LimitTypeMin === 1 ?
                                                <>
                                                    <TextField
                                                        label=""
                                                        value={createLimitCollectionState.limitcollection.Min !== null && createLimitCollectionState.limitcollection.Min !== undefined ? createLimitCollectionState.limitcollection.Min.toString() : '0'}
                                                        onChange={(e) => {
                                                            dispatch(setCreateUpdateLimitCollection({
                                                                ...createLimitCollectionState,
                                                                limitcollection: {
                                                                    ...createLimitCollectionState.limitcollection,
                                                                    Min: validateNumber(e.trim()) ? e.trim() : "0"
                                                                },
                                                                MinValidation: e === '' ? moreAppConfig.MinValidationText : ''
                                                            }))
                                                        }}
                                                        error={createLimitCollectionState.MinValidation}
                                                        type="text"
                                                    />
                                                    <span className='unit3'>{limitCollectionState.Setting !== null && limitCollectionState.Setting !== undefined ? limitCollectionState.Setting.Currency : 'USD'}</span>
                                                </>
                                                :
                                                <TextField
                                                    value={createLimitCollectionState.limitcollection.Min !== null && createLimitCollectionState.limitcollection.Min !== undefined ? createLimitCollectionState.limitcollection.Min.toString() : '0'}
                                                    onChange={(e) => {
                                                        dispatch(setCreateUpdateLimitCollection({
                                                            ...createLimitCollectionState,
                                                            limitcollection: {
                                                                ...createLimitCollectionState.limitcollection,
                                                                Min: validateNumber(e.trim()) ? e.trim() : "0"
                                                            },
                                                            MinValidation: e === '' ? moreAppConfig.MinalidationText : ''
                                                        }))
                                                    }}
                                                    error={createLimitCollectionState.MinValidation}
                                                    type="number"
                                                    min={0}
                                                />

                                        }
                                    </div>


                                </div>
                                <div className='cb break-line-2'>
                                </div>
                                <div style={{ marginBottom: '5px' }}>Max limit purchase</div>
                                <div className='item'>
                                
                                    <Select
                                        label="Max limit purchase"
                                        options={moreAppConfig.LimitTypeMax}
                                        defaultValue={moreAppConfig.LimitTypeMax[0]}
                                        onChange={(e) => {
                                            // value = parseInt(value);
                                            handleSelectChangeLimitTypeMax(e);
                                        }}
                                        isSearchable={false}
                                        value={moreAppConfig.LimitTypeMax.filter(p => p.value == createLimitCollectionState.limitcollection.LimitTypeMax)[0] || moreAppConfig.LimitTypeMax[0]}
                                    />
                                </div>
                                <span className="text-is">is</span>
                                <div className='item'>
                                    <div className='price-discount'>


                                        {
                                            createLimitCollectionState.limitcollection.LimitTypeMax === 1 ?
                                                <>
                                                    <TextField
                                                        label=""
                                                        value={createLimitCollectionState.limitcollection.Max !== null && createLimitCollectionState.limitcollection.Max !== undefined ? createLimitCollectionState.limitcollection.Max.toString() : '0'}
                                                        onChange={(e) => {
                                                            dispatch(setCreateUpdateLimitCollection({
                                                                ...createLimitCollectionState,
                                                                limitcollection: {
                                                                    ...createLimitCollectionState.limitcollection,
                                                                    Max: validateNumber(e.trim()) ? e.trim() : "0"
                                                                },
                                                                MaxValidation: e === '' ? moreAppConfig.MaxValidationText : ''
                                                            }))
                                                        }}
                                                        error={createLimitCollectionState.MaxValidation}
                                                        type="text"
                                                    />
                                                    <span className='unit3'>{limitCollectionState.Setting !== null && limitCollectionState.Setting !== undefined ? limitCollectionState.Setting.Currency : 'USD'}</span>
                                                </>
                                                :
                                                <TextField
                                                    value={createLimitCollectionState.limitcollection.Max !== null && createLimitCollectionState.limitcollection.Max !== undefined ? createLimitCollectionState.limitcollection.Max.toString() : '0'}
                                                    onChange={(e) => {
                                                        dispatch(setCreateUpdateLimitCollection({
                                                            ...createLimitCollectionState,
                                                            limitcollection: {
                                                                ...createLimitCollectionState.limitcollection,
                                                                Max: validateNumber(e.trim()) ? e.trim() : "0"
                                                            },
                                                            MaxValidation: e === '' ? moreAppConfig.MaxValidationText : ''
                                                        }))
                                                    }}
                                                    error={createLimitCollectionState.MaxValidation}
                                                    type="number"
                                                    min={0}
                                                />

                                        }
                                    </div>

                                    <span className='rule-max-zero'>If you set this 0, it means unlimited</span>
                                </div>
                                <div className='cb'>
                                </div>
                                {/*  style={{ marginBottom: isHover ? '65px': '0' }} */}
                                <div className='item'>
                                    <Stack>
                                        <Checkbox
                                            label="Apply this limit to customer lifetime"
                                            checked={createLimitCollectionState.limitcollection.ApplyLimitCustomerLifetime}
                                            onChange={(e) => {
                                                dispatch(setCreateUpdateLimitCollection({
                                                    ...createLimitCollectionState,
                                                    limitcollection: {
                                                        ...createLimitCollectionState.limitcollection,
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

                    </div>
                </Modal.Section>
            </Modal>
            <Modal
                open={createLimitCollectionState.IsOpenBulkActionModal}
                onClose={() => {
                    dispatch(setCreateUpdateLimitCollection({
                        ...createLimitCollectionState,
                        IsOpenBulkActionModal: false
                    }))
                }}
                title={"Do you want to " + BulkActionType + " limit purchase for " + limitCollectionState.Paginate.CurrentItems.filter(p => p.IsChecked).length + " selected collections?"}
                primaryAction={{
                    content: BulkActionType.charAt(0).toUpperCase() + BulkActionType.slice(1),
                    loading: limitCollectionState.IsSaveLoading,
                    onAction: handleBulkAction,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: () => {
                            dispatch(setCreateUpdateLimitCollection({
                                ...createLimitCollectionState,
                                IsOpenBulkActionModal: false
                            }))
                        },
                    },
                ]}
            >

            </Modal>
            {Alert}
            {createLimitCollectionState.IsOpenSaveResult ? <Toast content={createLimitCollectionState.MessageSaveResult} duration={2400} onDismiss={() => {
                dispatch(setCreateUpdateLimitCollection({
                    ...createLimitCollectionState,
                    IsOpenSaveResult: false
                }))
            }} /> : null}
        </>

    )
}

export default withRouter(LimitCollection);