import { Card, Badge, InlineError, Button, Modal, Toast, TextContainer, Icon, TextField, DataTable, List, Stack, Checkbox, FormLayout, TextStyle } from '@shopify/polaris';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateUpdateLimitPurchase, setListLimitPurchase, setIsSaveLoading, setIsPaginateLoading, setIsDeleteLoading } from '../../state/modules/limitpurchase/actions';
import config from '../../config/config';
import { createEditLimitPurchase, fetchList, saveLimitPurchase, saveBulkLimitPurchase } from '../../state/modules/limitpurchase/operations';
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
    const [isHover, setIsHover] = useState(false);

    //search by button and enter
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    useEffect(() => {

        dispatch(fetchList());
        // Fetch items from another resources.
        // const endOffset = limitPurchaseState.Paginate.Offset + moreAppConfig.ItemPerPage;
        // if (limitPurchaseState.limitpurchases != undefined && limitPurchaseState.limitpurchases != null) {
        //     dispatch(setListLimitPurchase({
        //         ...limitPurchaseState,
        //         Paginate: {
        //             ...limitPurchaseState.Paginate,
        //             Offset: limitPurchaseState.Paginate.Offset,
        //             CurrentItems: limitPurchaseState.limitpurchases.slice(limitPurchaseState.Paginate.Offset, endOffset),
        //             TotalPage: limitPurchaseState.limitpurchases.length <= moreAppConfig.ItemPerPage ? 1 : Math.ceil(limitPurchaseState.limitpurchases.length / moreAppConfig.ItemPerPage)
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
    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        dispatch(setIsPaginateLoading(true));
        axios.get(config.rootLink + '/FrontEnd/GetLimitPurchasesPaginate', {
            params: {
                search: limitPurchaseState.TextSearchProduct,
                typeselected: limitPurchaseState.ProductSelected,
                shop: config.shop,
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
        axios.get(config.rootLink + '/FrontEnd/GetLimitPurchasesPaginate', {
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
        if (createLimitPurchaseState.BulkUpdate.ListCollects === null || createLimitPurchaseState.BulkUpdate.ListCollects === undefined || createLimitPurchaseState.BulkUpdate.ListCollects.length === 0) {
            dispatch(setCreateUpdateLimitPurchase({
                ...createLimitPurchaseState,
                LimitPurchaseCollectValidation: moreAppConfig.LimitPurchaseCollectValidationText
            }))
            return false;
        }
        else {
            dispatch(setCreateUpdateLimitPurchase({
                ...createLimitPurchaseState,
                LimitPurchaseCollectValidation: ''
            }))
        }
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
                                        defaultValue={limitPurchaseState.ListProductHaveLimit[0]}
                                        options={limitPurchaseState.ListProductHaveLimit}
                                        onChange={(e) => {
                                            handleSearchProductLimit(limitPurchaseState.TextSearchProduct, e.value);
                                        }}
                                        isSearchable={false}
                                    // value={limitPurchaseState.ProductSelected}
                                    />
                                </div>
                                <div className='colLeft w66pt ml-5'>
                                    {/* //search by button and enter */}
                                    <div className="Polaris-Connected"><div className="Polaris-Connected__Item Polaris-Connected__Item--primary"><div className="Polaris-TextField"><input id="TypeTag" placeholder="Typing the keyword for product title and hit enter" className="Polaris-TextField__Input" type="text" aria-labelledby="TypeTagLabel" aria-invalid="false" value={limitPurchaseState.TextSearchProduct}
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
                            <div className='colRight w50pt'>
                                {/* //search by button and enter */}
                                <div className='colLeft ml-10'>
                                    <Button primary
                                        loading={isSearchLoading}
                                        onClick={() => {
                                            setIsSearchLoading(true);
                                            handleSearchProductLimit(limitPurchaseState.TextSearchProduct, limitPurchaseState.ProductSelected)
                                        }}>Search</Button>
                                </div>
                                <div className='colRight'>
                                    <Button primary onClick={() => {
                                        setIsBulkUpdate(true);
                                        onClickBulkUpdateLimitPurchase();
                                    }}>Bulk Action</Button>
                                </div>
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
                            <DataTable
                                columnContentTypes={[
                                    'text',
                                    'text',
                                    '',
                                ]}
                                headings={[
                                    'Product Title',
                                    'Quantity Limit',
                                    'Action'
                                ]}
                                // footerContent={`Showing ${currentItems.length} of ${limitPurchaseState..length} results`}
                                rows={limitPurchaseState.Paginate.CurrentItems != null && limitPurchaseState.Paginate.CurrentItems.length > 0 ? limitPurchaseState.Paginate.CurrentItems.map((limitpurchase, index) => {
                                    return [
                                        <>
                                            <p key={index}>
                                                <a href={'https://' + appState?.Shop?.Domain + '/products/' + limitpurchase.Handle} target="_blank">{limitpurchase.Title}</a>
                                            </p>
                                        </>
                                        ,
                                        <>

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
                                        </>
                                        ,
                                        <>
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

                                        </>

                                    ];
                                }) : []}
                            />
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
            {createLimitPurchaseState.IsOpenSaveResult ? <Toast content={createLimitPurchaseState.MessageSaveResult} duration={2400} onDismiss={() => {
                dispatch(setCreateUpdateLimitPurchase({
                    ...createLimitPurchaseState,
                    IsOpenSaveResult: false
                }))
            }} /> : null}
        </>

    )
}

export default withRouter(LimitPurchase);