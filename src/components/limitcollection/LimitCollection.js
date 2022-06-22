import { Card, Badge, InlineError, Button, Modal, Toast, TextContainer, Icon, TextField, DataTable, List, Stack, Checkbox } from '@shopify/polaris';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateUpdateLimitCollection, setListLimitCollection, setSetting, setIsDeleteLoading,setIsPaginateLoading } from '../../state/modules/limitcollection/actions';
import config from '../../config/config';
import { createEditLimitCollection, fetchList, saveLimitCollection, saveBulkLimitCollection } from '../../state/modules/limitcollection/operations';
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
    const [isHover, setIsHover] = useState(false);
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
                    },
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
                            <DataTable
                                columnContentTypes={[
                                    'text',
                                    'text',
                                    '',
                                ]}
                                headings={[
                                    'Collections',
                                    'Limit purchase',
                                    'Action'
                                ]}
                                // footerContent={`Showing ${currentItems.length} of ${limitCollectionState..length} results`}
                                rows={limitCollectionState.Paginate.CurrentItems != null && limitCollectionState.Paginate.CurrentItems.length > 0 ? limitCollectionState.Paginate.CurrentItems.map((limitcollection, index) => {
                                    return [
                                        <>
                                            <p key={index}>
                                                {limitcollection.CollectName}
                                                {/* <a href={'https://' + appState?.Shop?.Domain + '/products/' + limitcollection.Handle} target="_blank"></a> */}
                                            </p>
                                        </>
                                        ,
                                        <>
                                            {
                                                limitcollection.Min !== undefined && limitcollection.Min !== null && limitcollection.Max !== undefined && limitcollection.Max !== null ?
                                                    <List type="bullet">
                                                        <List.Item>Min: {limitcollection.Min} {limitcollection.LimitTypeMin === 0 ? 'items' : (limitCollectionState.Setting !== null && limitCollectionState.Setting !== undefined ? limitCollectionState.Setting.Currency : 'USD')}</List.Item>
                                                        <List.Item>Max: {limitcollection.Max === 0 ? 'Unlimited' : limitcollection.Max + ' '+ (limitcollection.LimitTypeMax === 0 ? 'items' : (limitCollectionState.Setting !== null && limitCollectionState.Setting !== undefined ? limitCollectionState.Setting.Currency : 'USD'))} </List.Item>
                                                        <>
                                                            {
                                                                limitcollection.ApplyLimitCustomerLifetime ? <List.Item>Limit to customer lifetime</List.Item> : ''
                                                            }

                                                        </>
                                                    </List> : null
                                            }</>
                                        ,
                                        <>
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

                                        </>

                                    ];
                                }) : []}
                            />
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
                                        label="Collection name"
                                        placeholder='Collection name'
                                    />
                                </div>

                                <div className='cb'>
                                </div>
                                <span className='rule-max-zero'>This name will be shown in alert popup for customer. For example “You have to choose minimum of 3 items in {createLimitCollectionState.limitcollection.CollectName}”</span>

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
                                <span className='show-tooltip show-tooltip-2' onMouseEnter={()=>{setIsHover(true)}} onMouseLeave={()=>{setIsHover(false)}}>
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