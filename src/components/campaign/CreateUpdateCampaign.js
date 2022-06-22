
import { DataTable, Link, TextStyle, Button, InlineError, OptionList, Card, ContextualSaveBar, Heading, Layout, TextField, Toast, Stack, Modal, List, Checkbox, FormLayout, Icon, Autocomplete, Tag } from '@shopify/polaris';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateUpdateCampaign, setSetting } from '../../state/modules/campaign/actions';
import { setIsNoCampaign, setIsCreatingCampaign, setMenu, setURL, setIsEditCampaign, setNoCallTwices } from '../../state/modules/app/actions';
import config from '../../config/config';
import { saveCampaign, enableAppEmbed, sendSupportRequest } from '../../state/modules/campaign/operations';
import moreAppConfig from '../../config/moreAppConfig';
import TShirtYellow from '../../assets/images/t-shirt-yellow.svg';
import TShirtGreen from '../../assets/images/t-shirt-green.svg';
import TShirtGray from '../../assets/images/t-shirt-gray.svg';
import TShirtGrey from '../../assets/images/t-shirt-grey.svg';
import ShoeGreen from '../../assets/images/shoe-green.svg';
import AlmostDone from '../../assets/images/almost-done.svg';
import Congratulation from '../../assets/images/congratulation.svg';
import { DeleteMinor, QuestionMarkMajor, CircleInformationMajor, TickMinor, ViewMinor, ConfettiMajor, DiamondAlertMajor, CancelSmallMinor } from '@shopify/polaris-icons';
import Loading from '../../components/plugins/Loading';
import TableCollection from './TableCollection';
import TableProduct from './TableProduct';
import Select from 'react-select';
import axios from 'axios';
import { withRouter, useHistory, useParams } from "react-router-dom";
import AsyncSelect from 'react-select/async';

import _ from "lodash";

const dateObj = new Date();
const month = String(dateObj.getMonth() + 1).padStart(2, '0');
const day = String(dateObj.getDate()).padStart(2, '0');
const year = dateObj.getFullYear();
const todayStr = year + '-' + month + '-' + day;

const CreateUpdateCampaign = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [numberAppliedDiscount, setNumberAppliedDiscount] = useState(0);
    const { slug } = useParams();
    const appState = useSelector((state) => state.app);
    const campaignState = useSelector((state) => state.campaign.CreateUpdateCampaign);
    const campaign = campaignState.campaign;
    const myRefTitle = useRef(null);
    const myRefCampaignType = useRef(null);
    const myRefCampaignDetail = useRef(null);
    const myRefDate = useRef(null);
    const myRefTagCustomer = useRef(null);
    const scrollToDiscountTitle = () => myRefTitle.current.scrollIntoView();
    const scrollToCampaignType = () => myRefCampaignType.current.scrollIntoView();
    const scrollToCampaignDetail = () => myRefCampaignDetail.current.scrollIntoView();
    const scrollToDate = () => myRefDate.current.scrollIntoView();
    const scrollToTagCustomer = () => myRefTagCustomer.current.scrollIntoView();

    const wait = 100;
    const loadOptionsProduct = inputValue2 => getAsyncOptionsProduct(inputValue2);
    const debouncedLoadOptionsProduct = _.debounce(loadOptionsProduct, wait, {
        leading: true
    });
    const getAsyncOptionsProduct = (inputValue2) => {
        return new Promise((resolve, reject) => {
            axios.get(config.rootLink + '/FrontEnd/SearchProductPaginateVariant', {
                params: {
                    search: inputValue2,
                    shop: config.shop,
                    page: 1,
                    pagezise: 100,
                    selectedstr: campaign.ListVariants !== undefined && campaign.ListVariants !== null && campaign.ListVariants.length > 0 ? campaign.ListVariants.map(p => p.ProductID).join(',') : '',
                    //campaign.ListVariants.map(p=> p.ProductID).toString()
                    token: config.token
                }
            })
                .then((res) => {
                    ;
                    const result = res?.data;
                    resolve(result.listOptionProduct);

                })
                .catch(err => console.log(err))

        });
    }
    // const getOptions = async (input) => {
    //     SearchVariant(input)

    // };
    const SearchVariant = async (input) => {
        await axios.get(config.rootLink + '/FrontEnd/SearchProductPaginateVariant', {
            params: {
                search: input,
                shop: config.shop,
                page: 1,
                pagezise: 100,
                selectedstr: campaign.ListVariants !== undefined && campaign.ListVariants !== null && campaign.ListVariants.length > 0 ? campaign.ListVariants.map(p => p.ProductID).join(',') : '',
                //campaign.ListVariants.map(p=> p.ProductID).toString()
                token: config.token
            }
        })
            .then((res) => {
                // dispatch(setCreateUpdateCampaign(
                //     {
                //         ...campaignState,
                //         SelectOptionProducts: res.data.listOptionProduct,
                //     }));
                var campaignVariants = [];
                if (!appState.IsEditCampaign) {
                    var product = res.data.listOptionProduct;
                    campaignVariants = [];
                    if (res.data.listOptionProduct[0] != undefined) {
                        var listVariant = product !== undefined && product !== null && product.map(m => m.ListVariant) != null && product.map(m => m.ListVariant) != undefined ? product.map(m => m.ListVariant)[0] : [];
                        campaignVariants.push({
                            ID: Math.floor(100000000 + Math.random() * 900000000),
                            ProductID: res.data.listOptionProduct[0].ProductID,
                            VariantID: 0,
                            ListVariant: listVariant,
                            ListVariantSelected: []
                        });
                    }
                    if (res.data.listOptionProduct[1] != undefined) {
                        var listVariant2 = product !== undefined && product !== null && product.map(m => m.ListVariant) != null && product.map(m => m.ListVariant) != undefined ? product.map(m => m.ListVariant)[1] : [];
                        campaignVariants.push(
                            {
                                ID: Math.floor(100000000 + Math.random() * 900000000),
                                ProductID: res.data.listOptionProduct[1].ProductID,
                                VariantID: 0,
                                ListVariant: listVariant2,
                                ListVariantSelected: []
                            }
                        );
                    }
                    // setRowPreview(campaign.ListDetails);
                    dispatch(setCreateUpdateCampaign(
                        {
                            ...campaignState,
                            campaign:
                            {
                                ...campaign,
                                ListVariants: campaignVariants,
                            },
                            SelectOptionProducts: res.data.listOptionProduct,
                        }));
                }
                else {
                    if (campaign.ListVariants == undefined || campaign.ListVariants == null || campaign.ListVariants.length == 0) {
                        var product = res.data.listOptionProduct;
                        campaignVariants = [];
                        if (res.data.listOptionProduct[0] != undefined) {
                            var listVariant = product !== undefined && product !== null && product.map(m => m.ListVariant) != null && product.map(m => m.ListVariant) != undefined ? product.map(m => m.ListVariant)[0] : [];
                            campaignVariants.push({
                                ID: Math.floor(100000000 + Math.random() * 900000000),
                                ProductID: res.data.listOptionProduct[0].ProductID,
                                VariantID: 0,
                                ListVariant: listVariant,
                                ListVariantSelected: []
                            });
                        }
                        if (res.data.listOptionProduct[1] != undefined) {
                            var listVariant2 = product !== undefined && product !== null && product.map(m => m.ListVariant) != null && product.map(m => m.ListVariant) != undefined ? product.map(m => m.ListVariant)[1] : [];
                            campaignVariants.push(
                                {
                                    ID: Math.floor(100000000 + Math.random() * 900000000),
                                    ProductID: res.data.listOptionProduct[1].ProductID,
                                    VariantID: 0,
                                    ListVariant: listVariant2,
                                    ListVariantSelected: []
                                }
                            );
                        }

                        // setRowPreview(campaign.ListDetails);
                        dispatch(setCreateUpdateCampaign(
                            {
                                ...campaignState,
                                campaign:
                                {
                                    ...campaign,
                                    ListVariants: campaignVariants,
                                },
                                SelectOptionProducts: res.data.listOptionProduct,
                            }));
                    } else {
                        dispatch(setCreateUpdateCampaign(
                            {
                                ...campaignState,
                                SelectOptionProducts: res.data.listOptionProduct,
                            }));
                    }


                }
                getSettingOne();


            })
            .catch(
                err => console.log(err)
            );
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
    const checkNoCampaign = async () => {
        await axios.get(config.rootLink + '/FrontEnd/CheckNoCampaign', {
            params: {
                shop: config.shop,
                token: config.token,
            }
        })
            .then((res) => {
                const result = res?.data;
                setIsFirstCampaign(!result.hasCampaign);

            })
            .catch(err => console.log(err))
    }
    const getGetNumberAppliedDiscount = async (id) => {
        await axios.get(config.rootLink + '/FrontEnd/GetNumberAppliedDiscount', {
            params: {
                id: id,
                shop: config.shop,
                token: config.token,
            }
        })
            .then((res) => {
                const result = res?.data;
                setNumberAppliedDiscount(result.numberapplieddiscount);
            })
            .catch(err => console.log(err))
    }
    const [rowsPreview, setRowPreview] = useState([]);

    useEffect(() => {
        if (appState.URL.includes('update-campaign') && slug !== undefined) {
            dispatch(setMenu(moreAppConfig.Menu.CREATECAMPAIGN));
            dispatch(setIsEditCampaign(true));
            dispatch(setNoCallTwices(true));
            dispatch(setIsCreatingCampaign(false));
            axios.get(config.rootLink + '/FrontEnd/GetCampaignForEdit', {
                params: {
                    id: slug,
                    shop: config.shop,
                    token: config.token,
                }
            })
                .then((res) => {

                    const result = res?.data;
                    // campaign = result.campaign;

                    // campaign = [...campaign, result.campaign];

                    setRowPreview(campaignState.campaign.ListDetails);
                    getAsyncOptionsProduct('');

                    SearchVariant('');
                    checkNoCampaign();


                })
                .catch(err => console.log(err))
            getGetNumberAppliedDiscount(slug);
        }
        else {
            setRowPreview(campaign.ListDetails);
            getAsyncOptionsProduct('');

            SearchVariant('');
            checkNoCampaign();
        }



    }, []);


    const [IsOpenAdSpecificCollectionModal, setIsOpenAddSpecificCollectionModal] = useState(false);
    const [IsOpenAdSpecificProductModal, setIsOpenAddSpecificProductModal] = useState(false);
    const [IsHideNotification, setIsHideNotification] = useState(false);

    const handleSelectChangeDiscountType = (value) => {
        dispatch(setCreateUpdateCampaign({
            ...campaignState,
            campaign: {
                ...campaign,
                DiscountType: value.value
            },
            IsOpenSaveToolbar: true
        }))
    };

    const [isLoadingStep, setIsLoadingStep] = useState(false);


    function ChangeStep(step) {
        setIsLoadingStep(true);
        if (step == 3) {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                campaign: {
                    ...campaign,
                    Step: step
                },
                IsOpenSaveToolbar: false
            }))
        } else {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                campaign: {
                    ...campaign,
                    Step: step
                },
                IsOpenSaveToolbar: true
            }))
        }

        setIsLoadingStep(false);
    }

    const [isFirstCampaign, setIsFirstCampaign] = useState(props.IsNoCampaign);

    const handleSelectChangePriceType = (value) => {
        dispatch(setCreateUpdateCampaign({
            ...campaignState,
            campaign: {
                ...campaign,
                PriceType: value.value
            },
            IsOpenSaveToolbar: true
        }))
    };

    const handleChangeAcrossAllProduct = (value) => {
        dispatch(setCreateUpdateCampaign({
            ...campaignState,
            campaign: {
                ...campaign,
                AllProducts: value,
                // IsSpecificCollect: false,
                // IsSpecificProduct: false,
                // IsVariantProduct: false,
            },
            CheckTypeDiscountVariantValidation: "",
            IsOpenSaveToolbar: true
        }))
    }


    const [checkedSendReportToMail, setCheckedSendReportToMail] = useState(false);
    const handleChangeSendReportToMail = useCallback((newChecked) => setCheckedSendReportToMail(newChecked), []);

    const handleChangeSpecificCollection = (value) => {
        dispatch(setCreateUpdateCampaign({
            ...campaignState,
            campaign: {
                ...campaign,
                IsSpecificCollect: value,
                // AllProducts: false,
                // IsVariantProduct: false,
            },
            CheckTypeDiscountVariantValidation: "",
            CheckTypeDiscountCollectValidation: "",
            CheckTypeDiscountProductValidation: "",
            IsOpenSaveToolbar: true
        }))
    }
    const handleChangeSpecificProduct = (value) => {
        dispatch(setCreateUpdateCampaign({
            ...campaignState,
            campaign: {
                ...campaign,
                IsSpecificProduct: value,
                // AllProducts: false,
                // IsVariantProduct: false,
            },
            CheckTypeDiscountVariantValidation: "",
            CheckTypeDiscountCollectValidation: "",
            CheckTypeDiscountProductValidation: "",
            IsOpenSaveToolbar: true
        }))
    }
    const handleChangeSpecificVariants = (value) => {
        dispatch(setCreateUpdateCampaign({
            ...campaignState,
            campaign: {
                ...campaign,
                IsVariantProduct: value,
                // AllProducts: false,
                // IsSpecificProduct: false,
                // IsSpecificCollect: false,
            },
            CheckTypeDiscountVariantValidation: "",
            CheckTypeDiscountCollectValidation: "",
            CheckTypeDiscountProductValidation: "",
            IsOpenSaveToolbar: true
        }))
    }

    function ValidFormSuportRequest() {
        var isValidName = true;
        var isValidEmail = true;
        var isValidDescribe = true;
        var strValidName = '';
        var strValidEmail = '';
        var strValidDescribe = '';
        if (campaignState.YourName.toString() == '' || campaignState.YourName.toString() === null) {
            strValidName = 'Name is required';
            isValidName = false;
        }
        if (campaignState.YourEmail.toString() == '' || campaignState.YourEmail.toString() === null) {
            strValidEmail = 'Email is required';
            isValidEmail = false;
        } else {
            // var regexMail = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(campaignState.YourEmail)
            // if (!regexMail) {
            //     strValidEmail = 'Email is not valid';
            //     isValidEmail = false;
            // }
        }
        if (campaignState.DescribeYourProblem.toString() == '' || campaignState.DescribeYourProblem.toString() === null) {
            strValidDescribe = 'Describe is required';
            isValidDescribe = false;
        }
        if (!isValidName || !isValidEmail || !isValidDescribe) {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                YourNameValidation: strValidName,
                YourEmailValidation: strValidEmail,
                DescribeYourProblemValidation: strValidDescribe
            }))
            return false;
        }
        return true;
    }
    function ValidForm() {

        if (campaign.Title.toString() == '' || campaign.Title.toString() === null) {
            scrollToDiscountTitle();
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                IsOpenSaveToolbar: false,
                TitleValidation: moreAppConfig.TilteValidationText
            }))
            return false;
        }


        // var justOneDiscountType = (campaign.AllProducts && !campaign.IsVariantProduct && !campaign.IsSpecificCollect && !campaign.IsSpecificProduct)
        //     || (campaign.IsVariantProduct && !campaign.AllProducts && !campaign.IsSpecificCollect && !campaign.IsSpecificProduct)
        //     || ((campaign.IsSpecificCollect || campaign.IsSpecificProduct) && !campaign.IsVariantProduct && !campaign.AllProducts);
        // if (!justOneDiscountType) {
        //     dispatch(setCreateUpdateCampaign({
        //         ...campaignState,
        //         IsOpenSaveToolbar: false,
        //         CheckTypeDiscountVariantValidation: "Just choose at least one type of discount"
        //     }))
        //     scrollToCampaignType();
        //     return false;
        // }
        // else {
        //     dispatch(setCreateUpdateCampaign({
        //         ...campaignState,
        //         CheckTypeDiscountVariantValidation: ""
        //     }))
        // }
        if (campaign.IsSpecificCollect && campaign.ListCollects.length === 0) {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                IsOpenSaveToolbar: false,
                CheckTypeDiscountCollectValidation: "Please choose at least one collection"
            }))
            scrollToCampaignType();
            return false;
        } else {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                CheckTypeDiscountCollectValidation: ""
            }))
        }
        if (campaign.IsSpecificProduct && campaign.ListProducts.length === 0) {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                IsOpenSaveToolbar: false,
                CheckTypeDiscountProductValidation: "Please choose at least one product"
            }))
            scrollToCampaignType();
            return false;
        } else {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                CheckTypeDiscountProductValidation: ""
            }))
        }
        if (campaign.IsVariantProduct && campaign.ListVariants !== undefined && campaign.ListVariants !== null && campaign.ListVariants.length === 0) {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                IsOpenSaveToolbar: false,
                CheckTypeDiscountVariantValidation: "Please choose at least one variant"
            }))
            scrollToCampaignType();
            return false;
        } else {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                CheckTypeDiscountVariantValidation: ""
            }))
        }

        if (!campaign.IsVariantProduct && !campaign.IsSpecificCollect && !campaign.IsSpecificProduct && !campaign.AllProducts) {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                IsOpenSaveToolbar: false,
                CheckTypeDiscountVariantValidation: "Please choose collections, products or variants"
            }))
            scrollToCampaignType();
            return false;
        }
        else {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                CheckTypeDiscountVariantValidation: ""
            }))
        }
        if (campaign.IsVariantProduct && campaign.ListVariants != undefined && campaign.ListVariants != null && campaign.ListVariants.length > 0) {
            var checkVariantsProduct = campaign.ListVariants.filter(p => p.ListVariantSelected.length === 0).length > 0 ? false : true;
            if (!checkVariantsProduct) {
                dispatch(setCreateUpdateCampaign({
                    ...campaignState,
                    IsOpenSaveToolbar: false,
                    CheckTypeDiscountVariantValidation: "Please choose variant for each product"
                }))
                scrollToCampaignType();
                return false;
            }
            let isDuplicate = false;
            // call some function with callback function as argument
            var listProductVariants = campaign.ListVariants.map(p => p.ProductID)
            isDuplicate = listProductVariants.some((element, index) => {
                return listProductVariants.indexOf(element) !== index
            });
            if (isDuplicate) {
                dispatch(setCreateUpdateCampaign({
                    ...campaignState,
                    IsOpenSaveToolbar: false,
                    CheckTypeDiscountVariantValidation: "Duplicate products"
                }))
                scrollToCampaignType();
                return false;
            }
        }
        if (campaign.IsVariantProduct && (campaign.ListVariants == undefined || campaign.ListVariants == null)) {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                IsOpenSaveToolbar: false,
                CheckTypeDiscountVariantValidation: "Please choose at least one variant"
            }))
            scrollToCampaignType();
            return false;

        }
        if (campaign.ListDetails != undefined && campaign.ListDetails.length > 0) {
            var checkQuantityNull = campaign.ListDetails.filter(p => p.Quantity === '').length > 0 ? false : true;
            if (!checkQuantityNull) {
                dispatch(setCreateUpdateCampaign({
                    ...campaignState,
                    IsOpenSaveToolbar: false,
                    CampaignDetailValidation: "Minimum quantity is required"
                }))
                scrollToCampaignDetail();
                return false;
            }
            var checkQuantityZero = campaign.ListDetails.filter(p => parseInt(p.Quantity) === 0).length > 0 ? false : true;
            if (!checkQuantityZero) {
                dispatch(setCreateUpdateCampaign({
                    ...campaignState,
                    IsOpenSaveToolbar: false,
                    CampaignDetailValidation: "Minimum quantity must be greater than 0"
                }))
                scrollToCampaignDetail();
                return false;
            }
            if (checkQuantityZero && checkQuantityNull) {
                dispatch(setCreateUpdateCampaign({
                    ...campaignState,
                    CampaignDetailValidation: ""
                }))
            }
            var checkPriceNull = campaign.ListDetails.filter(p => p.PercentOrPrice === '').length > 0 ? false : true;
            if (!checkPriceNull) {
                dispatch(setCreateUpdateCampaign({
                    ...campaignState,
                    IsOpenSaveToolbar: false,
                    CampaignDetailValidation: "Discount value is required"
                }))
                scrollToCampaignDetail();
                return false;
            }
            var checkPriceZero = campaign.ListDetails.filter(p => parseFloat(p.PercentOrPrice) === 0).length > 0 ? false : true;
            if (!checkPriceZero) {
                dispatch(setCreateUpdateCampaign({
                    ...campaignState,
                    IsOpenSaveToolbar: false,
                    CampaignDetailValidation: "Discount value must be greater than 0"
                }))
                scrollToCampaignDetail();
                return false;
            }
            if (checkPriceZero && checkPriceNull) {
                dispatch(setCreateUpdateCampaign({
                    ...campaignState,
                    CampaignDetailValidation: ""
                }))
            }
        }
        else {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                IsOpenSaveToolbar: false,
                CampaignDetailValidation: "Campaign detail is required"
            }))
            scrollToCampaignDetail();
            return false;
        }

        if (campaignState.IsEndDate && campaign.EndDateEdit.toString() === '') {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                IsOpenSaveToolbar: false,
                EndTimeValidation: 'Set end date.'
            }))
            scrollToDate();
            return false;
        }
        if ((campaign.StartDateEdit.toString() != '' && campaignState.IsEndDate && campaign.EndDateEdit.toString() != '')) {
            var startTime = Date.parse(campaign.StartDateEdit);
            var endTime = Date.parse(campaign.EndDateEdit);
            if (endTime <= startTime) {
                dispatch(setCreateUpdateCampaign({
                    ...campaignState,
                    IsOpenSaveToolbar: false,
                    EndTimeValidation: moreAppConfig.EndTimeGreateThanStartTimeValidationText
                }))
                scrollToDate();
                return false;
            }
        }
        if (campaign.OnlyShowDiscountTaggedCustomer && campaign.ListTaggedCustomerArr.length === 0) {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                IsOpenSaveToolbar: false,
                ListTaggedCustomerValidation: "List Tag Customer is empty. Add a tag and hit enter."
            }))
            scrollToTagCustomer();
            return false;
        } else {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                ListTaggedCustomerValidation: ""
            }))
        }
        return true;
    }
    const validateNumber = (e) => {
        if (isNaN(e)) {
            return false;
        } else {
            return true;
        }
    }
    const AddRule = () => {

        var listOld = campaign.ListDetails;
        var item = {
            ID: Math.floor(100000000 + Math.random() * 900000000),
            Quantity: 0,
            PercentOrPrice: 0
        }
        listOld.push(item);
        setRowPreview(listOld);
        dispatch(setCreateUpdateCampaign({
            ...campaignState,
            campaign: {
                ...campaign,
                ListDetails: listOld
            }
        }));
    }

    const RemoveCampaignDetail = (id) => {
        var newRows = rowsPreview.filter(p => p.ID != id);
        setRowPreview(newRows);
        var arrPro = campaign.ListDetails.filter(p => p.ID != id);
        dispatch(setCreateUpdateCampaign(
            {
                ...campaignState,
                campaign:
                {
                    ...campaign,
                    ListDetails: arrPro
                },
                IsOpenSaveToolbar: true
            }));
    }
    const AddProduct = () => {
        ;
        var listOld = campaign.ListVariants !== undefined && campaign.ListVariants !== null ? campaign.ListVariants : [];
        var firstProduct = campaignState.SelectOptionProducts.filter(p => !listOld.map(x => x.ProductID).includes(p.ProductID));
        var listVariant = firstProduct !== undefined ? firstProduct.map(m => m.ListVariant)[0] : [];
        var item = {
            ID: Math.floor(100000000 + Math.random() * 900000000),
            ProductID: firstProduct !== undefined ? firstProduct[0].ProductID : 0,
            VariantID: 0,
            ListVariant: listVariant,
            ListVariantSelected: []
        }
        listOld.push(item);
        dispatch(setCreateUpdateCampaign({
            ...campaignState,
            campaign: {
                ...campaign,
                ListVariants: listOld
            }
        }));
    }
    //Variant
    const handleSelectChangeVariant = (item, index) => {
        if (campaignState.SelectOptionProducts.filter(p => p.ProductID == item.value).length == 0) {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                SelectOptionProducts: [...campaignState.SelectOptionProducts, item],
                campaign: {
                    ...campaign,
                    ListVariants: campaign.ListVariants.map((p, i) => (i == index ? {
                        ...p,
                        ProductID: item.value,
                        ListVariant: item.ListVariant
                        // ListVariantSelected: listVariantSelected
                    } : p))
                },
                CheckTypeDiscountVariantValidation: '',
                IsOpenSaveToolbar: true
            }))
        }
        else {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                campaign: {
                    ...campaign,
                    ListVariants: campaign.ListVariants.map((p, i) => (i == index ? {
                        ...p,
                        ProductID: item.value,
                        ListVariant: item.ListVariant
                        // ListVariantSelected: listVariantSelected
                    } : p))
                },
                CheckTypeDiscountVariantValidation: '',
                IsOpenSaveToolbar: true
            }))
        }


        // CheckUplicationProduct();
    }
    // const CheckUplicationProduct = () => {
    //     let isDuplicate = false;
    //     // call some function with callback function as argument
    //     var listProductVariants = campaign.ListVariants.map(p => p.ProductID)
    //     isDuplicate = listProductVariants.some((element, index) => {
    //         return listProductVariants.indexOf(element) !== index
    //     });
    //     let message = '';
    //     if (isDuplicate) {
    //         message = "Duplicate products";
    //         scrollToCampaignType();
    //     }
    //     dispatch(setCreateUpdateCampaign({
    //         ...campaignState,
    //         CheckTypeDiscountVariantValidation: message,
    //     }))
    // }

    const handleChangeCheckVariantByProduct = (item, productID, index) => {

        var listVariant = campaignState.SelectOptionProducts.filter(p => p.ProductID == productID).map(m => m.ListVariant)[0];
        // var listVariantSelected = campaignState.SelectOptionProducts.filter(p=>p.ProductID == productID).map(m=>m.ListVariant).map(k=> k.VariantID);
        dispatch(setCreateUpdateCampaign({
            ...campaignState,
            campaign: {
                ...campaign,
                ListVariants: campaign.ListVariants.map((p, i) => (p.ProductID == productID ? {
                    ...p,
                    ListVariantSelected: item
                } : p))
            },
            CheckTypeDiscountVariantValidation: "",
            IsOpenSaveToolbar: true
        }))
    }

    const RemoveVariantsProduct = (id) => {
        var arrPro = campaign.ListVariants.filter(p => p.ProductID != id);
        dispatch(setCreateUpdateCampaign(
            {
                ...campaignState,
                campaign:
                {
                    ...campaign,
                    ListVariants: arrPro
                },
                IsOpenSaveToolbar: true
            }));

    }


    function RemoveSpecificCollection(id) {
        var arrPro = campaign.ListCollects.filter(p => p.ID != id);
        dispatch(setCreateUpdateCampaign(
            {
                ...campaignState,
                campaign:
                {
                    ...campaign,
                    ListCollects: arrPro
                },
                CheckTypeDiscountCollectValidation: '',
                IsOpenSaveToolbar: true
            }));
    }



    function RemoveSpecificProduct(id) {
        var arrPro = campaign.ListProducts.filter(p => p.ID != id);
        dispatch(setCreateUpdateCampaign(
            {
                ...campaignState,
                campaign:
                {
                    ...campaign,
                    ListProducts: arrPro
                },
                CheckTypeDiscountProductValidation: '',
                IsOpenSaveToolbar: true
            }));
    }
    const handleChangeTypeTag = (e) => {
        dispatch(setCreateUpdateCampaign({
            ...campaignState,
            IsOpenSaveToolbar: true,
            TypeTag: e.target.value,
            ListTaggedCustomerValidation: '',
        }))
    }
    function handleAddTagToList(e) {
        ;
        if (e.key === 'Enter') {
            ;
            if (campaignState.TypeTag === null || campaignState.TypeTag === '' || campaignState.TypeTag === undefined) {
                dispatch(setCreateUpdateCampaign(
                    {
                        ...campaignState,
                        ListTaggedCustomerValidation: 'Tag Customer is required',
                    }));
            }
            else {
                ;
                var listTag = campaign.ListTaggedCustomerArr || [];
                if (listTag !== null && listTag !== undefined && listTag.length > 0) {
                    const listTagCheck = listTag.map(element => {
                        return element.trim();
                    });
                    let isExist = listTagCheck.includes(campaignState.TypeTag.trim());
                    //.toLowerCase()
                    if (isExist) {
                        dispatch(setCreateUpdateCampaign(
                            {
                                ...campaignState,
                                ListTaggedCustomerValidation: 'Tag Customer is existed',
                            }));
                        return;
                    }

                }
                listTag.push(campaignState.TypeTag);
                dispatch(setCreateUpdateCampaign({
                    ...campaignState,
                    campaign: {
                        ...campaign,
                        ListTaggedCustomerArr: listTag
                    },
                    TypeTag: '',
                    ListTaggedCustomerValidation: '',
                    IsOpenSaveToolbar: true
                }))


            }

        }
        else {
            dispatch(setCreateUpdateCampaign({
                ...campaignState,
                TypeTag: e.target.value,
            }))
        }
    }
    function RemoveTag(value) {
        var arrPro = campaign.ListTaggedCustomerArr.filter(p => p != value);
        dispatch(setCreateUpdateCampaign(
            {
                ...campaignState,
                campaign:
                {
                    ...campaign,
                    ListTaggedCustomerArr: arrPro
                },
                CheckTypeDiscountCollectValidation: '',
                IsOpenSaveToolbar: true
            }));
    }
    return (
        <>
            {
                campaignState.IsLoadingPage ? <Loading></Loading> :
                    <>
                        {campaignState.IsOpenSaveToolbar ?
                            <div className='head'>
                                {
                                    isFirstCampaign && campaign.Step == 1 ? <>
                                        <ContextualSaveBar
                                            message={isFirstCampaign ? "" : "Unsaved changes"}
                                            saveAction={{
                                                content: isFirstCampaign ? (campaign.Step === 2 ? "Save" : "Next Step") : "Save",
                                                onAction: () => {
                                                    // if (isFirstCampaign) {
                                                    //     if (ValidForm()) {
                                                    //         if (campaign.Step === 1) {
                                                    //             dispatch(saveCampaign(isFirstCampaign, campaignState.IsEndDate));
                                                    //             // ChangeStep(2);
                                                    //         } 
                                                    //         // else {
                                                    //         //     ChangeStep(2);
                                                    //         // }
                                                    //         // dispatch(setCreateUpdateCampaign({
                                                    //         //     ...campaignState,
                                                    //         //     IsOpenSaveToolbar: true
                                                    //         // }))
                                                    //     }
                                                    // }
                                                    // else {
                                                    //     if (ValidForm()) {
                                                    //         dispatch(saveCampaign(isFirstCampaign, campaignState.IsEndDate));
                                                    //     }
                                                    // }
                                                    if (ValidForm()) {
                                                        dispatch(saveCampaign(isFirstCampaign, campaignState.IsEndDate, campaignState.Setting.PlanNumber));
                                                    }

                                                },
                                                loading: campaignState.IsSaveLoading,
                                            }}

                                        />
                                    </>
                                        : <>
                                            <ContextualSaveBar
                                                message={isFirstCampaign ? "" : "Unsaved changes"}
                                                saveAction={{
                                                    content: isFirstCampaign ? (campaign.Step === 2 ? "Next Step" : "Save") : "Save",
                                                    onAction: () => {
                                                        if (isFirstCampaign) {
                                                            // if (ValidForm()) {
                                                            //     if (campaign.Step === 2) {

                                                            //     } else {
                                                            //         dispatch(saveCampaign(isFirstCampaign, campaignState.IsEndDate));
                                                            //     }
                                                            //     // dispatch(setCreateUpdateCampaign({
                                                            //     //     ...campaignState,
                                                            //     //     IsOpenSaveToolbar: true
                                                            //     // }))
                                                            // }
                                                            dispatch(setCreateUpdateCampaign({
                                                                ...campaignState,
                                                                IsOpenSaveToolbar: false
                                                            }))
                                                            ChangeStep(3);
                                                        }
                                                        else {
                                                            if (ValidForm()) {
                                                                dispatch(saveCampaign(isFirstCampaign, campaignState.IsEndDate, campaignState.Setting.PlanNumber));
                                                                // history.push('/manage-campaign?shop=' + config.shop + '&token=' + config.token)
                                                                // dispatch(setURL('manage-campaign'));
                                                            }
                                                        }

                                                    },
                                                    loading: campaignState.IsSaveLoading,
                                                }}
                                                discardAction={{
                                                    content: campaign.Step == 2 && isFirstCampaign ? "Edit Campaign" : "Discard",
                                                    onAction: () => {
                                                        if (isFirstCampaign) {
                                                            if (campaign.Step == 2) {
                                                                ChangeStep(1);
                                                                setIsFirstCampaign(true);
                                                            } else {
                                                                dispatch(setCreateUpdateCampaign({
                                                                    ...campaignState,
                                                                    IsOpenSaveToolbar: false
                                                                }))
                                                            }
                                                        }
                                                        else {
                                                            dispatch(setCreateUpdateCampaign({
                                                                ...campaignState,
                                                                IsOpenSaveToolbar: false
                                                            }))
                                                        }
                                                    },
                                                }}

                                            />
                                        </>
                                }

                            </div>
                            : <></>}
                        {
                            isFirstCampaign ?
                                <>

                                    <div className="onboarding">
                                        <Heading>Onboarding in minutes!</Heading>
                                        <div className='steper'>
                                            <div className='node node1 complete'>
                                                <div className='number'>
                                                    <span>1</span>
                                                    <Icon
                                                        source={TickMinor}
                                                        color="base" />
                                                </div>
                                                <span className='title'>Install app</span>
                                            </div>
                                            <div className={campaign.Step === 2 || campaign.Step === 3 ? 'node node2 complete' : 'node node2'}>
                                                <div className='number'>
                                                    <span>2</span>
                                                    <Icon
                                                        source={TickMinor}
                                                        color="base" />
                                                </div>
                                                <span className={campaign.Step === 1 ? 'title active' : 'title'}>Create 1st campaign</span>
                                            </div>
                                            <div className={campaign.Step === 3 ? 'node node3 complete' : 'node node3'}>
                                                <div className='number'>
                                                    <span>3</span>
                                                    <Icon
                                                        source={TickMinor}
                                                        color="base" />
                                                </div>
                                                <span className={campaign.Step === 2 || campaign.Step === 3 ? 'title active' : 'title'}>Test campaign</span>
                                            </div>
                                            <div className='cb'>

                                            </div>
                                        </div>
                                    </div>
                                </>
                                : ''
                        }

                        {

                            !isFirstCampaign || (isFirstCampaign && campaign.Step === 1) ? <>
                                <div className="campaign-form">
                                    <div className='colLeft'>
                                        <div className='section general'>
                                            <Layout>
                                                <Layout.Section oneThird>
                                                    <Card>
                                                        <Card.Section>
                                                            <Heading size="small">1. General</Heading>
                                                            <div className='element-general'>
                                                                <div className='flex mt-10'>
                                                                    <span style={{ marginRight: '15px' }} ref={myRefTitle}>Campaign Status</span>
                                                                    <label className="switch">
                                                                        <input type="checkbox" onClick={() => {
                                                                            dispatch(setCreateUpdateCampaign({
                                                                                ...campaignState,
                                                                                campaign: {
                                                                                    ...campaign,
                                                                                    Active: !campaign.Active
                                                                                },
                                                                                IsOpenSaveToolbar: true
                                                                            }))
                                                                        }} className={campaign.Active ? 'active' : ''} id="togBtn" />
                                                                        <div className="slider round">
                                                                            <span className="on">ON</span>
                                                                            <span className="off">OFF</span>
                                                                        </div>
                                                                    </label>
                                                                </div>

                                                                <div className='flex mt-20'>
                                                                    <span className='campaign-title'>
                                                                        <span className='text-title'>Discount title</span>
                                                                        <span className='show-tooltip'>
                                                                            <Icon source={QuestionMarkMajor} color='base' />
                                                                            <span className='tooltip'>Customers will see this in cart and at checkout.</span>
                                                                        </span>
                                                                    </span>
                                                                    <div style={{ flex: '1' }}>
                                                                        <TextField
                                                                            value={campaign.Title}
                                                                            onChange={(e) => {
                                                                                dispatch(setCreateUpdateCampaign({
                                                                                    ...campaignState,
                                                                                    campaign: {
                                                                                        ...campaign,
                                                                                        Title: e
                                                                                    },
                                                                                    IsOpenSaveToolbar: true,
                                                                                    TitleValidation: e == '' ? moreAppConfig.TilteValidationText : null
                                                                                }))
                                                                            }}
                                                                            type="text"
                                                                            placeholder='Flash Sales'
                                                                            error={campaignState.TitleValidation}
                                                                            maxLength={150}
                                                                            showCharacterCount
                                                                        />
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </Card.Section>
                                                    </Card>
                                                </Layout.Section>
                                            </Layout>
                                        </div>
                                        <div className='section'>
                                            <Layout>
                                                <Layout.Section oneThird>
                                                    <Card>
                                                        <Card.Section>
                                                            <Heading size="small">2. Campaign Type</Heading>

                                                            <div className='campaign-type pt-10'>
                                                                <div className='flex' ref={myRefCampaignType}>
                                                                    <div className='flex-half'>
                                                                        <div style={{ marginBottom: '5px' }}>Discount based on</div>
                                                                        <Select
                                                                            label="Discount based on"
                                                                            options={moreAppConfig.discounttype}
                                                                            defaultValue={moreAppConfig.discounttype[0]}
                                                                            onChange={(value) => {

                                                                                // value = parseInt(value);
                                                                                handleSelectChangeDiscountType(value);
                                                                                // if (value !== null && value !== undefined && value !== '') {
                                                                                //     dispatch(setSetting({
                                                                                //         ...campaignState,
                                                                                //         TitleValidationTheme: ''
                                                                                //     }))
                                                                                // } else {
                                                                                //     dispatch(setSetting({
                                                                                //         ...campaignState,
                                                                                //         TitleValidationTheme: moreAppConfig.SettingValidationSelectTheme
                                                                                //     }))
                                                                                // }
                                                                            }}
                                                                            isSearchable={false}
                                                                            value={moreAppConfig.discounttype.filter(p => p.value == campaign.DiscountType)[0] || moreAppConfig.discounttype[0]}
                                                                        />
                                                                    </div>
                                                                    <div className='flex-half'>
                                                                        <div style={{ marginBottom: '5px' }}>Type of discount</div>

                                                                        <Select
                                                                            label="Type of discount"
                                                                            options={moreAppConfig.pricetype}
                                                                            defaultValue={moreAppConfig.pricetype[0]}
                                                                            onChange={(value) => {
                                                                                // value = parseInt(value);
                                                                                handleSelectChangePriceType(value);
                                                                                // if (value !== null && value !== undefined && value !== '') {
                                                                                //     dispatch(setSetting({
                                                                                //         ...campaignState,
                                                                                //         TitleValidationTheme: ''
                                                                                //     }))
                                                                                // } else {
                                                                                //     dispatch(setSetting({
                                                                                //         ...campaignState,
                                                                                //         TitleValidationTheme: moreAppConfig.SettingValidationSelectTheme
                                                                                //     }))
                                                                                // }
                                                                            }}
                                                                            isSearchable={false}
                                                                            value={moreAppConfig.pricetype.filter(p => p.value == campaign.PriceType)[0] || moreAppConfig.pricetype[0]}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="Polaris-Card" style={{ backgroundColor: '#EBF9FC', marginTop: '15px', marginBottom: '15px' }}>
                                                                    <div className="Polaris-CalloutCard__Container">
                                                                        <div className="Polaris-Card__Section">
                                                                            <div className="Polaris-CalloutCard">
                                                                                <div className="Polaris-CalloutCard__Content">
                                                                                    <div className="Polaris-CalloutCard__Title">
                                                                                        <h2 className="Polaris-Heading Heading-Icon"> <Icon source={CircleInformationMajor} color='red'></Icon>{campaign.DiscountType == 1 ? 'Minimum Cart Quantity' : campaign.DiscountType == 2 ? 'Minimum Same Product Quantity' : campaign.DiscountType == 3 ? 'Minimum Same Variant Quantity' : ''}</h2>
                                                                                    </div>
                                                                                    <div className="Polaris-TextContainer">
                                                                                        {campaign.DiscountType == 1 ?
                                                                                            <>
                                                                                                <p>Discounts are applied based on the total quantity of products in the cart.</p>
                                                                                                <p style={{ fontStyle: 'italic', marginTop: '5px' }}>Example: With a minimum quantity of <strong>3 products</strong> in the cart (shoes, T-shirts, shirts), shoppers can get a 10% discount for the total order value.</p>
                                                                                            </> :
                                                                                            campaign.DiscountType == 2 ?
                                                                                                <>
                                                                                                    <p>Discounts are applied based on the total quantity of a certain product in the cart.</p>
                                                                                                    <p style={{ fontStyle: 'italic', marginTop: '5px' }}>Example: With a minimum quantity of <strong>3 T-shirts</strong> in the cart, shoppers can get a 10% discount for the total value of the <strong>T-shirts</strong></p>
                                                                                                </> :
                                                                                                campaign.DiscountType == 3 ?
                                                                                                    <>
                                                                                                        <p>Discounts are applied based on the total quantity of a certain variant of a product in the cart.</p>
                                                                                                        <p style={{ fontStyle: 'italic', marginTop: '5px' }}>Example: With a minimum quantity of <strong>3 yellow T-shirts</strong> in the cart, shoppers can get a 10% discount for the total value of the yellow <strong>T-shirts</strong></p>
                                                                                                    </>
                                                                                                    : ''}
                                                                                    </div>
                                                                                    <div className="Polaris-CalloutCard__Buttons" style={{ display: 'flex' }}>
                                                                                        {campaign.DiscountType == 3 ?
                                                                                            <>
                                                                                                <img src={TShirtYellow} alt="" style={{ marginLeft: '0' }} className="Polaris-CalloutCard__Image" />
                                                                                                <img src={TShirtYellow} alt="" className="Polaris-CalloutCard__Image" />
                                                                                                <img src={TShirtYellow} alt="" className="Polaris-CalloutCard__Image" />
                                                                                            </> :
                                                                                            campaign.DiscountType == 2 ?
                                                                                                <>
                                                                                                    <img src={TShirtGreen} alt="" style={{ marginLeft: '0' }} className="Polaris-CalloutCard__Image" />
                                                                                                    <img src={TShirtYellow} alt="" className="Polaris-CalloutCard__Image" />
                                                                                                    <img src={TShirtGray} alt="" className="Polaris-CalloutCard__Image" />
                                                                                                </>
                                                                                                : <>
                                                                                                    <>
                                                                                                        <img src={ShoeGreen} alt="" style={{ marginLeft: '0' }} className="Polaris-CalloutCard__Image" />
                                                                                                        <img src={TShirtYellow} alt="" className="Polaris-CalloutCard__Image" />
                                                                                                        <img src={TShirtGrey} alt="" className="Polaris-CalloutCard__Image" />
                                                                                                    </>
                                                                                                </>
                                                                                        }

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Stack>
                                                                    <Checkbox
                                                                        // disabled={campaign.IsVariantProduct}
                                                                        label="Apply the discounts across all products"
                                                                        checked={campaign.AllProducts}
                                                                        onChange={(e) => { handleChangeAcrossAllProduct(e) }}
                                                                    />
                                                                </Stack>
                                                                <div className='throw-line'>
                                                                    <span className='text'>Or</span>
                                                                </div>
                                                                <Stack>
                                                                    <Checkbox
                                                                        // disabled={campaign.IsVariantProduct}
                                                                        label="Apply the discounts to specific collections"
                                                                        checked={campaign.IsSpecificCollect}
                                                                        onChange={(e) => { handleChangeSpecificCollection(e) }}
                                                                    />

                                                                </Stack>

                                                                {campaign.IsSpecificCollect ?
                                                                    <>
                                                                        <div className="tags-input-wrapper" onClick={() => {
                                                                            setIsOpenAddSpecificCollectionModal(true)
                                                                        }}>

                                                                            <span className="search">Search collections
                                                                            </span>
                                                                        </div>
                                                                        {


                                                                            campaign.ListCollects != null && campaign.ListCollects != undefined && campaign.ListCollects.length > 0 ?

                                                                                <div className={campaign.ListCollects.length > 10 ? "tags-input-wrapper tags-input-wrapper-scroll" : "tags-input-wrapper"}>
                                                                                    {
                                                                                        campaign.ListCollects.map((item, index) => {

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
                                                                    </>
                                                                    : ''}
                                                                <InlineError message={campaignState.CheckTypeDiscountCollectValidation} fieldID="collect" />
                                                                <Stack>
                                                                    <Checkbox
                                                                        // disabled={campaign.IsVariantProduct}
                                                                        label="Apply the discounts to specific products"
                                                                        checked={campaign.IsSpecificProduct}
                                                                        onChange={(e) => { handleChangeSpecificProduct(e) }}
                                                                    />

                                                                </Stack>
                                                                {campaign.IsSpecificProduct ?
                                                                    <>
                                                                        <div className="tags-input-wrapper" onClick={() => {

                                                                            setIsOpenAddSpecificProductModal(true)
                                                                        }}>
                                                                            <span className="search">Search products
                                                                            </span>

                                                                        </div>
                                                                        {
                                                                            campaign.ListProducts != null && campaign.ListProducts != undefined && campaign.ListProducts.length > 0 ?
                                                                                <div className={campaign.ListProducts.length > 10 ? "tags-input-wrapper tags-input-wrapper-scroll" : "tags-input-wrapper"}>
                                                                                    {
                                                                                        campaign.ListProducts.map((item, index) => {
                                                                                            return (
                                                                                                <span className="tag" key={index}>{item.Title}
                                                                                                    <a title='Remove' onClick={() => {
                                                                                                        RemoveSpecificProduct(item.ID)
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
                                                                        <InlineError message={campaignState.CheckTypeDiscountProductValidation} fieldID="product" />
                                                                    </>
                                                                    : ''}
                                                                <div className='throw-line'>
                                                                    <span className='text'>Or</span>
                                                                </div>
                                                                <Stack >
                                                                    <Checkbox
                                                                        label="Apply the discounts to specific variants"
                                                                        checked={campaign.IsVariantProduct}
                                                                        // disabled={campaign.ID > 0 ? true : false}
                                                                        onChange={(e) => { handleChangeSpecificVariants(e) }}
                                                                    />

                                                                </Stack>
                                                                {campaign.IsVariantProduct ?
                                                                    <>
                                                                        <div className='variant-product'>
                                                                            <div className='timeline'>
                                                                                {campaign.ListVariants !== undefined && campaign.ListVariants !== null && campaign.ListVariants
                                                                                    .map(
                                                                                        ({ ID, ProductID, VariantID, ListVariant, ListVariantSelected }, index) => (
                                                                                            <div className='node' key={index}>
                                                                                                <Stack wrap={false} alignment="leading" spacing="loose">
                                                                                                    <Stack.Item fill>
                                                                                                        <FormLayout>
                                                                                                            <FormLayout.Group condensed>
                                                                                                                {/* <Select
                                                                                                                        // label="Discount based on"
                                                                                                                        options={campaignState.SelectOptionProducts}
                                                                                                                        defaultValue={campaignState.SelectOptionProducts[0]}
                                                                                                                        onChange={(value) => {

                                                                                                                            handleSelectChangeVariant(value, ID, index);

                                                                                                                        }}
                                                                                                                        isSearchable={false}
                                                                                                                        value={campaignState.SelectOptionProducts.filter(p => p.ProductID == ProductID)[0] || campaignState.SelectOptionProducts[0]}
                                                                                                                    /> */}
                                                                                                                {/* <Select
                                                                                                                    name="form-field-name"
                                                                                                                    loadOptions={getOptions}
                                                                                                                    options={campaignState.SelectOptionProducts}
                                                                                                                    onChange={(value) => {
                                                                                                                        handleSelectChangeVariant(value, index);
                                                                                                                    }}
                                                                                                                    value={campaignState.SelectOptionProducts != null && campaignState.SelectOptionProducts.filter(p => p.ProductID == ProductID)[0] || campaignState.SelectOptionProducts != null && campaignState.SelectOptionProducts[0]}
                                                                                                                /> */}
                                                                                                                <AsyncSelect cacheOptions defaultOptions loadOptions={inputValue2 => debouncedLoadOptionsProduct(inputValue2)}
                                                                                                                    placeholder='Search'
                                                                                                                    onChange={(e) => {
                                                                                                                        handleSelectChangeVariant(e, index);
                                                                                                                    }}
                                                                                                                    value={campaignState.SelectOptionProducts != null && campaignState.SelectOptionProducts.filter(p => p.ProductID == ProductID)[0] || campaignState.SelectOptionProducts != null && campaignState.SelectOptionProducts[0]}
                                                                                                                />
                                                                                                                <Card>
                                                                                                                    <div className={ListVariant != undefined && ListVariant != null && ListVariant.length > 7 ? "scroll-variant" : ""}>
                                                                                                                        <OptionList
                                                                                                                            onChange={(e) => { handleChangeCheckVariantByProduct(e, ProductID, index) }}
                                                                                                                            options={ListVariant}
                                                                                                                            selected={ListVariantSelected}
                                                                                                                            allowMultiple
                                                                                                                        />
                                                                                                                    </div>

                                                                                                                </Card>
                                                                                                            </FormLayout.Group>
                                                                                                        </FormLayout>
                                                                                                    </Stack.Item>
                                                                                                    <Button icon={DeleteMinor}
                                                                                                        onClick={() => { RemoveVariantsProduct(ProductID) }} accessibilityLabel="Remove item" />
                                                                                                </Stack>
                                                                                            </div>
                                                                                        ))}
                                                                                <div className='node'>
                                                                                    <Button primary onClick={() => {
                                                                                        AddProduct()
                                                                                    }}>Add Product</Button>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </>
                                                                    : ''}
                                                                <InlineError message={campaignState.CheckTypeDiscountVariantValidation} fieldID="collection12" />
                                                            </div>



                                                        </Card.Section>
                                                    </Card>
                                                </Layout.Section>
                                            </Layout>
                                        </div>
                                        <div className='section'>
                                            <Layout>
                                                <Layout.Section oneThird>
                                                    <Card>
                                                        <Card.Section>
                                                            <div className="campaign-detail" ref={myRefCampaignDetail}>
                                                                <Heading size="small">3. Campaign Detail</Heading>
                                                                <div className='timeline'>
                                                                    <Stack wrap={false} alignment="leading" spacing="loose">
                                                                        <Stack.Item fill>
                                                                            <FormLayout>
                                                                                <FormLayout.Group condensed>
                                                                                    <TextStyle>{campaign.DiscountType === 1 ? 'Minimum Cart Quantity' : campaign.DiscountType === 2 ? 'Minimum Same Product Quantity' : campaign.DiscountType === 3 ? 'Minimum Same Variant Quantity' : 'Minimum Cart Quantity'}</TextStyle>
                                                                                    <p>{campaign.PriceType === 1 ? '% discount' : campaign.PriceType === 2 ? 'Discount amount' : campaign.PriceType === 3 ? 'Fixed price per item' : '% discount'}</p>
                                                                                </FormLayout.Group>
                                                                            </FormLayout>
                                                                        </Stack.Item>

                                                                    </Stack>
                                                                    {campaign.ListDetails != null && campaign.ListDetails != undefined && campaign.ListDetails
                                                                        .map(
                                                                            ({ ID, Quantity, PercentOrPrice }, index) => (
                                                                                <div className='node' key={index}>
                                                                                    <Stack wrap={false} alignment="leading" spacing="loose">
                                                                                        <Stack.Item fill>
                                                                                            <FormLayout>
                                                                                                <FormLayout.Group condensed>
                                                                                                    <TextField
                                                                                                        value={Quantity.toString()}
                                                                                                        onChange={(e) => {
                                                                                                            var newRows = rowsPreview.map((p, i) =>
                                                                                                                (i == index ? { ...p, Quantity: e } : p)
                                                                                                            )
                                                                                                            setRowPreview(newRows);
                                                                                                            dispatch(setCreateUpdateCampaign({
                                                                                                                ...campaignState,
                                                                                                                campaign: {
                                                                                                                    ...campaign,
                                                                                                                    ListDetails: campaign.ListDetails.map((p, i) => (i == index ? {
                                                                                                                        ...p,
                                                                                                                        Quantity: validateNumber(e.trim()) ? e.trim() : "0"
                                                                                                                    } : p))
                                                                                                                },
                                                                                                                CampaignDetailValidation: "",
                                                                                                                IsOpenSaveToolbar: true
                                                                                                            }))
                                                                                                        }}
                                                                                                        type="text"
                                                                                                    />
                                                                                                    <div className='price-discount'>
                                                                                                        <TextField
                                                                                                            value={PercentOrPrice.toString()}
                                                                                                            onChange={(e) => {

                                                                                                                dispatch(setCreateUpdateCampaign({
                                                                                                                    ...campaignState,
                                                                                                                    campaign: {
                                                                                                                        ...campaign,
                                                                                                                        ListDetails: campaign.ListDetails.map((p, i) => (i == index ? {
                                                                                                                            ...p,
                                                                                                                            PercentOrPrice: validateNumber(e.trim()) ? e.trim() : "0"
                                                                                                                        } : p))
                                                                                                                    },
                                                                                                                    CampaignDetailValidation: "",
                                                                                                                    IsOpenSaveToolbar: true
                                                                                                                }))
                                                                                                                var newRows = rowsPreview.map((p, i) =>
                                                                                                                    (i == index ? { ...p, PercentOrPrice: e } : p)
                                                                                                                )
                                                                                                                setRowPreview(newRows);
                                                                                                            }}
                                                                                                            type="text"
                                                                                                        />
                                                                                                        <span className='unit'>{campaign.PriceType === 1 ? '%' : campaignState.Setting.Currency}</span>
                                                                                                    </div>

                                                                                                </FormLayout.Group>
                                                                                            </FormLayout>
                                                                                        </Stack.Item>
                                                                                        <Button icon={DeleteMinor}
                                                                                            onClick={() => {
                                                                                                RemoveCampaignDetail(ID)
                                                                                            }} accessibilityLabel="Remove item" />
                                                                                    </Stack>
                                                                                </div>

                                                                            ))}

                                                                    <div className='node'>
                                                                        <Button primary onClick={() => {
                                                                            AddRule()
                                                                        }}>Add Rule</Button>
                                                                        <InlineError message={campaignState.CampaignDetailValidation} fieldID="myFieldID" />

                                                                    </div>

                                                                </div>

                                                                <div className='campaign-time'>
                                                                    {/* <div className="Polaris-Labelled__LabelWrapper">
                                            <div className="Polaris-Label">
                                                <label id="PolarisTextField2Label" htmlFor="PolarisTextField2" className="Polaris-Label__Text">Campaign Duration <span className="risk-text">(*)</span>
                                                </label>
                                            </div>
                                        </div> */}
                                                                    <div className='flex' ref={myRefDate}>
                                                                        <div className='flex-half'>
                                                                            <TextField
                                                                                label='Start date'
                                                                                value={campaign.StartDateEdit}
                                                                                type="date"
                                                                                min={todayStr}
                                                                                error={campaignState.StartTimeValidation}
                                                                                onChange={(e) => {
                                                                                    dispatch(setCreateUpdateCampaign({
                                                                                        ...campaignState,
                                                                                        campaign: {
                                                                                            ...campaign,
                                                                                            StartDateEdit: e,
                                                                                            StartDate: e
                                                                                        },
                                                                                        IsOpenSaveToolbar: true,
                                                                                        StartTimeValidation: e == '' ? moreAppConfig.StartTimeValidationText : null,
                                                                                        EndTimeValidation: ''
                                                                                    }))

                                                                                }}

                                                                            />
                                                                        </div>
                                                                        <div className='flex-half'>
                                                                            <Checkbox
                                                                                label="Set end date"
                                                                                checked={campaignState.IsEndDate}
                                                                                onChange={(e) => {
                                                                                    if (e == false) {
                                                                                        dispatch(setCreateUpdateCampaign({
                                                                                            ...campaignState,
                                                                                            campaign: {
                                                                                                ...campaign,
                                                                                                EndDateEdit: '',
                                                                                                EndDate: '',
                                                                                            },
                                                                                            IsOpenSaveToolbar: true,
                                                                                            IsEndDate: e,
                                                                                            EndTimeValidation: '',
                                                                                        }))
                                                                                    } else {
                                                                                        dispatch(setCreateUpdateCampaign({
                                                                                            ...campaignState,
                                                                                            campaign: {
                                                                                                ...campaign,
                                                                                                EndDateEdit: todayStr,
                                                                                                EndDate: todayStr,
                                                                                            },
                                                                                            IsOpenSaveToolbar: true,
                                                                                            IsEndDate: e,
                                                                                            EndTimeValidation: '',
                                                                                        }))
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <TextField
                                                                                disabled={!campaignState.IsEndDate}
                                                                                value={campaignState.IsEndDate ? campaign.EndDateEdit : campaign.EndDateEditEmpty}
                                                                                type={campaignState.IsEndDate ? "date" : "text"}
                                                                                error={campaignState.EndTimeValidation}
                                                                                onChange={(e) => {
                                                                                    dispatch(setCreateUpdateCampaign({
                                                                                        ...campaignState,
                                                                                        campaign: {
                                                                                            ...campaign,
                                                                                            EndDateEdit: e,
                                                                                            EndDate: e
                                                                                        },
                                                                                        IsOpenSaveToolbar: true,
                                                                                        EndTimeValidation: e == '' ? moreAppConfig.EndTimeValidationText : null
                                                                                    }))

                                                                                }}


                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <p className="time-zone-note ml-20">*Timezone is {campaignState.TimeZone}, set according to your store’s timezone</p>
                                                                </div>

                                                            </div>
                                                        </Card.Section>
                                                    </Card>
                                                </Layout.Section>
                                            </Layout>
                                        </div>
                                        <div className='section'>
                                            <Layout>
                                                <Layout.Section oneThird>
                                                    <Card>
                                                        <Card.Section>
                                                            <Heading size="small">4. Usage limit</Heading>

                                                            <div className='campaign-type pt-10'>
                                                                <Stack>
                                                                    <Checkbox
                                                                        // disabled={campaign.IsVariantProduct}
                                                                        label="Limit number of times this discount is applied in total"
                                                                        checked={campaign.LimitNumberOfTime}
                                                                        onChange={(e) => {
                                                                            dispatch(setCreateUpdateCampaign({
                                                                                ...campaignState,
                                                                                campaign: {
                                                                                    ...campaign,
                                                                                    LimitNumberOfTime: e,
                                                                                    // IsSpecificCollect: false,
                                                                                    // IsSpecificProduct: false,
                                                                                    // IsVariantProduct: false,
                                                                                },
                                                                                LimitNumberOfTimeValidation: e === '' ? 'Limit to one use per customer lifetime is required' : '',
                                                                                IsOpenSaveToolbar: true
                                                                            }))
                                                                        }}
                                                                        error={campaign.LimitNumberOfTimeValidation}
                                                                    />
                                                                </Stack>
                                                                <div className="break-line"></div>
                                                                {campaign.LimitNumberOfTime ?
                                                                    <>
                                                                        <TextField
                                                                            id='NumberOfTime'
                                                                            value={campaign.NumberOfTime !== null && campaign.NumberOfTime !== undefined ? campaign.NumberOfTime.toString() : '0'}
                                                                            onChange={(e) => {
                                                                                dispatch(setCreateUpdateCampaign({
                                                                                    ...campaignState,
                                                                                    campaign: {
                                                                                        ...campaign,
                                                                                        NumberOfTime: validateNumber(e.trim()) ? e.trim() : "0",
                                                                                        // IsSpecificCollect: false,
                                                                                        // IsSpecificProduct: false,
                                                                                        // IsVariantProduct: false,
                                                                                    },
                                                                                    IsOpenSaveToolbar: true
                                                                                }))
                                                                            }}
                                                                            type="number"
                                                                            min={0}
                                                                        />
                                                                        <div className="break-line"></div>
                                                                        {
                                                                            appState.URL.includes('update-campaign') ? <>
                                                                                <p className='gray-text'>Numer of times this discount has been applied: {numberAppliedDiscount}</p>
                                                                                <div className="break-line"></div>
                                                                            </> : null
                                                                        }

                                                                    </>
                                                                    : ''}
                                                                <Stack>
                                                                    <Checkbox
                                                                        // disabled={campaign.IsVariantProduct}
                                                                        label="Limit to one use per customer lifetime"
                                                                        checked={campaign.LimitCustomerLifetime}
                                                                        onChange={(e) => {
                                                                            dispatch(setCreateUpdateCampaign({
                                                                                ...campaignState,
                                                                                campaign: {
                                                                                    ...campaign,
                                                                                    LimitCustomerLifetime: e,
                                                                                    // IsSpecificCollect: false,
                                                                                    // IsSpecificProduct: false,
                                                                                    // IsVariantProduct: false,
                                                                                },
                                                                                IsOpenSaveToolbar: true
                                                                            }))
                                                                        }}
                                                                    />

                                                                </Stack>
                                                                <div className="break-line"></div>
                                                                <Stack>
                                                                    <Checkbox
                                                                        // disabled={campaign.IsVariantProduct}
                                                                        label="Only show discount to tagged customer"
                                                                        checked={campaign.OnlyShowDiscountTaggedCustomer}
                                                                        onChange={(e) => {
                                                                            dispatch(setCreateUpdateCampaign({
                                                                                ...campaignState,
                                                                                campaign: {
                                                                                    ...campaign,
                                                                                    OnlyShowDiscountTaggedCustomer: e,
                                                                                    // IsSpecificCollect: false,
                                                                                    // IsSpecificProduct: false,
                                                                                    // IsVariantProduct: false,
                                                                                },
                                                                                IsOpenSaveToolbar: true
                                                                            }))
                                                                        }}
                                                                    />

                                                                </Stack>
                                                                <div className="break-line"></div>
                                                                {campaign.OnlyShowDiscountTaggedCustomer ?
                                                                    <>
                                                                        <div className="" ref={myRefTagCustomer}>
                                                                            <div className="Polaris-Connected"><div className="Polaris-Connected__Item Polaris-Connected__Item--primary"><div className="Polaris-TextField"><input id="TypeTag" placeholder="Add a tag and hit enter" className="Polaris-TextField__Input" type="text" aria-labelledby="TypeTagLabel" aria-invalid="false" value={campaignState.TypeTag}
                                                                                onChange={(e) => {
                                                                                    handleChangeTypeTag(e)
                                                                                }}
                                                                                onKeyDown={(e) => {
                                                                                    handleAddTagToList(e)
                                                                                }} /><div className="Polaris-TextField__Backdrop" ></div></div></div></div></div>
                                                                        <div className="break-line"></div>
                                                                        <InlineError message={campaignState.ListTaggedCustomerValidation} fieldID="tagged" />
                                                                        {


                                                                            campaign.ListTaggedCustomerArr != null && campaign.ListTaggedCustomerArr != undefined && campaign.ListTaggedCustomerArr.length > 0 ?

                                                                                <div className={campaign.ListTaggedCustomerArr.length > 10 ? "tags-input-wrapper tags-input-wrapper-scroll" : "tags-input-wrapper"}>
                                                                                    {
                                                                                        campaign.ListTaggedCustomerArr.map((item, index) => {

                                                                                            return (
                                                                                                <span className="tag" key={index}>{item}
                                                                                                    <a title='Remove' onClick={() => {
                                                                                                        RemoveTag(item)

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
                                                                        {/* <TextField
                                                                            id='TypeTag'
                                                                            placeholder='Add a tag and hit enter'
                                                                            value={campaignState.TypeTag}
                                                                            onChange={(e) => {
                                                                                ;
                                                                                dispatch(setCreateUpdateCampaign({
                                                                                    ...campaignState,
                                                                                    TypeTag: e,
                                                                                    IsOpenSaveToolbar: true
                                                                                }))
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                ;
                                                                                if (e.key === 'Enter') {
                                                                                    alert(1);
                                                                                }
                                                                            }}
                                                                            type="text"
                                                                        />
                                                                         */}
                                                                    </>
                                                                    : ''}
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
                                                        <h2 className="Polaris-Heading Heading-Bottom-10 Heading-Icon-Right" style={{ fontSize: campaignState.Setting2.FontSizeDiscountTitle + 'px', color: campaignState.Setting2.TextColorDiscountTitle }}> {campaignState.Setting.TextQuantityBreaks}
                                                            {/* <Icon source={ConfettiMajor} color='base'></Icon> */}

                                                        </h2>
                                                        <Card>
                                                            <div className='item-center'>
                                                                {campaignState.Setting.LayoutInProductPage === 4 ? <>
                                                                    <div className=""><div className="Polaris-DataTable__Navigation">
                                                                        <button className="Polaris-Button Polaris-Button--disabled Polaris-Button--plain Polaris-Button--iconOnly" aria-label="" type="button" disabled=""><span className="Polaris-Button__Content">
                                                                            <span className="Polaris-Button__Icon"><span className="Polaris-Icon"><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M12 16a.997.997 0 0 1-.707-.293l-5-5a.999.999 0 0 1 0-1.414l5-5a.999.999 0 1 1 1.414 1.414L8.414 10l4.293 4.293A.999.999 0 0 1 12 16z"></path></svg></span></span></span></button><button className="Polaris-Button Polaris-Button--plain Polaris-Button--iconOnly" aria-label="" type="button"><span className="Polaris-Button__Content"><span className="Polaris-Button__Icon"><span className="Polaris-Icon"><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M8 16a.999.999 0 0 1-.707-1.707L11.586 10 7.293 5.707a.999.999 0 1 1 1.414-1.414l5 5a.999.999 0 0 1 0 1.414l-5 5A.997.997 0 0 1 8 16z"></path></svg></span></span></span></button></div><div className="Polaris-DataTable"><div className="Polaris-DataTable__ScrollContainer">
                                                                                <table className="Polaris-DataTable__Table" style={{ padding: campaignState.Setting.TablePadding + 'px', border: campaignState.Setting.TableBorderSize + 'px solid #fff' }}>
                                                                                    <thead style={{ fontSize: campaignState.Setting.TableFontSizeHeading + 'px' }}>
                                                                                        <tr>
                                                                                            <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--header" scope="col" style={{ fontSize: campaignState.Setting.TableFontSizeHeading + 'px', color: campaignState.Setting2.TextColorHeading, backgroundColor: campaignState.Setting2.BackgroundColorHeading }}>{campaignState.Setting.TextQuantity}</th>
                                                                                            {
                                                                                                campaign.PriceType != 3 ? <>
                                                                                                    <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header" scope="col" style={{ fontSize: campaignState.Setting.TableFontSizeHeading + 'px', color: campaignState.Setting2.TextColorHeading, backgroundColor: campaignState.Setting2.BackgroundColorHeading }}>{campaignState.Setting.TextDiscount}</th>

                                                                                                </>
                                                                                                    : <></>
                                                                                            }

                                                                                            {
                                                                                                campaignState.Setting.ShowDiscountedPrice ? <>
                                                                                                    <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header" scope="col" style={{ fontSize: campaignState.Setting.TableFontSizeHeading + 'px', color: campaignState.Setting2.TextColorHeading, backgroundColor: campaignState.Setting2.BackgroundColorHeading }}>{campaignState.Setting.TextDiscountPrice}</th>
                                                                                                </> : <></>
                                                                                            }
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {
                                                                                            rowsPreview.map((item, index) => {
                                                                                                return (
                                                                                                    <tr className="Polaris-DataTable__TableRow Polaris-DataTable--hoverable" key={index}>
                                                                                                        <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn" scope="row" style={{ fontSize: campaignState.Setting2.FontSizeItemInTable + 'px', color: campaignState.Setting2.TextColorItemInTable, backgroundColor: campaignState.Setting2.BackgroundColorItemInTable }}>{campaignState.Setting.TextBuy + ' ' + item.Quantity + campaignState.Setting.TextPlus}</th>
                                                                                                        {
                                                                                                            campaign.PriceType != 3 ? <>
                                                                                                                <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ fontSize: campaignState.Setting2.FontSizeItemInTable + 'px', color: campaignState.Setting2.TextColorItemInTable, backgroundColor: campaignState.Setting2.BackgroundColorItemInTable }}>{(campaign.PriceType === 1 ? item.PercentOrPrice + '%' : campaign.PriceType === 2 ? item.PercentOrPrice + ' ' + campaignState.Setting.Currency : <></>)}</td>

                                                                                                            </>
                                                                                                                : <></>
                                                                                                        }
                                                                                                        {
                                                                                                            campaignState.Setting.ShowDiscountedPrice ? <>
                                                                                                                <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" style={{ fontSize: campaignState.Setting2.FontSizeItemInTable + 'px', color: campaignState.Setting2.TextColorItemInTable, backgroundColor: campaignState.Setting2.BackgroundColorItemInTable }}>{item.PercentOrPrice === 0 ? 100 + ' ' + campaignState.Setting.Currency : (campaign.PriceType === 1 ? Math.floor(100 * (1 - (item.PercentOrPrice / 100)), 2) : campaign.PriceType === 2 ? 100 - item.PercentOrPrice : campaign.PriceType === 3 ? item.PercentOrPrice : 0) + ' ' + campaignState.Setting.Currency}</td>
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

                                                                </> : campaignState.Setting.LayoutInProductPage === 1 ? <>
                                                                    <div className=""><div className="Polaris-DataTable__Navigation">
                                                                        <button className="Polaris-Button Polaris-Button--disabled Polaris-Button--plain Polaris-Button--iconOnly" aria-label="" type="button" disabled=""><span className="Polaris-Button__Content">
                                                                            <span className="Polaris-Button__Icon"><span className="Polaris-Icon"><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M12 16a.997.997 0 0 1-.707-.293l-5-5a.999.999 0 0 1 0-1.414l5-5a.999.999 0 1 1 1.414 1.414L8.414 10l4.293 4.293A.999.999 0 0 1 12 16z"></path></svg></span></span></span></button><button className="Polaris-Button Polaris-Button--plain Polaris-Button--iconOnly" aria-label="" type="button"><span className="Polaris-Button__Content"><span className="Polaris-Button__Icon"><span className="Polaris-Icon"><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M8 16a.999.999 0 0 1-.707-1.707L11.586 10 7.293 5.707a.999.999 0 1 1 1.414-1.414l5 5a.999.999 0 0 1 0 1.414l-5 5A.997.997 0 0 1 8 16z"></path></svg></span></span></span></button></div><div className="Polaris-DataTable"><div className="Polaris-DataTable__ScrollContainer">
                                                                                <table className="Polaris-DataTable__Table"
                                                                                    style={{ padding: campaignState.Setting.TablePadding + 'px', border: campaignState.Setting.TableBorderSize + 'px solid #fff' }}>
                                                                                    <tbody>
                                                                                        <tr className="Polaris-DataTable__TableRow Polaris-DataTable--hoverable"
                                                                                            style={{ fontSize: campaignState.Setting.TableFontSizeHeading + 'px' }}>
                                                                                            <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--header Polaris-DataTable__Cell--header-border-none" scope="col" style={{ fontSize: campaignState.Setting.TableFontSizeHeading + 'px', color: campaignState.Setting2.TextColorHeading, backgroundColor: campaignState.Setting2.BackgroundColorHeading }}>
                                                                                                {campaignState.Setting.TextQuantity}
                                                                                            </th>
                                                                                            {
                                                                                                rowsPreview.map((item, index) => {
                                                                                                    return (
                                                                                                        <>
                                                                                                            <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" key={index} style={{ fontSize: campaignState.Setting2.FontSizeItemInTable + 'px', color: campaignState.Setting2.TextColorItemInTable, backgroundColor: campaignState.Setting2.BackgroundColorItemInTable }}>
                                                                                                                {campaignState.Setting.TextBuy + ' ' + item.Quantity + campaignState.Setting.TextPlus}
                                                                                                            </td>
                                                                                                        </>
                                                                                                    )
                                                                                                })
                                                                                            }

                                                                                        </tr>
                                                                                        {
                                                                                            campaign.PriceType != 3 ? <>
                                                                                                <tr className="Polaris-DataTable__TableRow Polaris-DataTable--hoverable"
                                                                                                    style={{ fontSize: campaignState.Setting.TableFontSizeHeading + 'px' }}
                                                                                                >
                                                                                                    <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--header Polaris-DataTable__Cell--header-border-none" scope="col" style={{ fontSize: campaignState.Setting.TableFontSizeHeading + 'px', color: campaignState.Setting2.TextColorHeading, backgroundColor: campaignState.Setting2.BackgroundColorHeading }}>
                                                                                                        {campaignState.Setting.TextDiscount}
                                                                                                    </th>
                                                                                                    {
                                                                                                        rowsPreview.map((item, index) => {
                                                                                                            return (
                                                                                                                <>
                                                                                                                    <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" key={index} style={{ fontSize: campaignState.Setting2.FontSizeItemInTable + 'px', color: campaignState.Setting2.TextColorItemInTable, backgroundColor: campaignState.Setting2.BackgroundColorItemInTable }}>
                                                                                                                        {(campaign.PriceType === 1 ? item.PercentOrPrice + '%' : campaign.PriceType === 2 ? item.PercentOrPrice + ' ' + campaignState.Setting.Currency : <></>)}
                                                                                                                    </td>
                                                                                                                </>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </tr>
                                                                                            </>
                                                                                                : <></>
                                                                                        }

                                                                                        {
                                                                                            campaignState.Setting.ShowDiscountedPrice ? <>
                                                                                                <tr className="Polaris-DataTable__TableRow Polaris-DataTable--hoverable" style={{ fontSize: campaignState.Setting.TableFontSizeHeading + 'px' }}>

                                                                                                    <th data-polaris-header-cell="true" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--header Polaris-DataTable__Cell--header-border-none" scope="col" style={{ fontSize: campaignState.Setting.TableFontSizeHeading + 'px', color: campaignState.Setting2.TextColorHeading, backgroundColor: campaignState.Setting2.BackgroundColorHeading }}>
                                                                                                        {campaignState.Setting.TextDiscountPrice}
                                                                                                    </th>
                                                                                                    {
                                                                                                        rowsPreview.map((item, index) => {
                                                                                                            return (
                                                                                                                <>
                                                                                                                    <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop" key={index} style={{ fontSize: campaignState.Setting2.FontSizeItemInTable + 'px', color: campaignState.Setting2.TextColorItemInTable, backgroundColor: campaignState.Setting2.BackgroundColorItemInTable }}>
                                                                                                                        {item.PercentOrPrice === 0 ? 100 + ' ' + campaignState.Setting.Currency : (campaign.PriceType === 1 ? Math.floor(100 * (1 - (item.PercentOrPrice / 100)), 2) : campaign.PriceType === 2 ? 100 - item.PercentOrPrice : campaign.PriceType === 3 ? item.PercentOrPrice : 0) + ' ' + campaignState.Setting.Currency}
                                                                                                                    </td>
                                                                                                                </>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </tr>
                                                                                            </> : <></>
                                                                                        }




                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </> : <>

                                                                </>}

                                                            </div>


                                                        </Card>
                                                        {

                                                            campaignState.Setting.LayoutInProductPage === 3 ? <>

                                                                <div className="Polaris-CalloutCard__Buttons" style={{ marginTop: 0 }}>
                                                                    <div className={rowsPreview != null && rowsPreview != undefined && rowsPreview.length > 2 ? 'list-card-scroll' : 'list-card'}>
                                                                        {
                                                                            rowsPreview.map((item, index) => {
                                                                                return (
                                                                                    campaignState.Setting2.CardTheme == 0 ? <>
                                                                                        <div className='card-orange' key={index} style={{ color: campaignState.Setting2.TextColorCard, fontSize: campaignState.Setting2.FontSizeCard + 'px' }}>
                                                                                            <div className="card-left-right" style={{ backgroundColor: campaignState.Setting2.BackgroundColorCard }}>
                                                                                                <div className="card-inside">
                                                                                                    <p className="buy" style={{ color: campaignState.Setting2.TextColorCard, fontSize: campaignState.Setting2.FontSizeCard + 'px' }}>{campaignState.Setting.TextBuy} {item.Quantity}{campaignState.Setting.TextPlus}</p>
                                                                                                    <p className="get" style={{ color: campaignState.Setting2.TextColorCard, fontSize: campaignState.Setting2.FontSizeCard + 'px' }}>{campaignState.Setting2.TextGet}</p>
                                                                                                    <p className="off-card" style={{ color: campaignState.Setting2.TextColorCard, fontSize: campaignState.Setting2.FontSizeCard + 'px' }}>{item.PercentOrPrice}{campaign.PriceType === 1 ? '%' : campaignState.Setting.Currency}{campaign.PriceType === 3 ? '/' + campaignState.Setting.TextEach : ' ' + campaignState.Setting2.TextOff}</p>
                                                                                                </div>
                                                                                                <div className="corner-left" style={{ backgroundColor: campaignState.Setting2.BackgroundColorCard }}>
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
                                                                                                            backgroundColor: campaignState.Setting2.BackgroundColorCard
                                                                                                        }}></div>
                                                                                                        <div style={{
                                                                                                            content: '',
                                                                                                            position: 'absolute',
                                                                                                            top: '18px',
                                                                                                            left: '50%',
                                                                                                            width: '5px',
                                                                                                            height: '5px',
                                                                                                            backgroundColor: campaignState.Setting2.BackgroundColorCard
                                                                                                        }}></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="corner-right" style={{ backgroundColor: campaignState.Setting2.BackgroundColorCard }}>
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
                                                                                                            backgroundColor: campaignState.Setting2.BackgroundColorCard
                                                                                                        }}></div>
                                                                                                        <div style={{
                                                                                                            content: '',
                                                                                                            position: 'absolute',
                                                                                                            top: '18px',
                                                                                                            right: '50%',
                                                                                                            width: '5px',
                                                                                                            height: '5px',
                                                                                                            backgroundColor: campaignState.Setting2.BackgroundColorCard
                                                                                                        }}></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

                                                                                    </> : <>
                                                                                        <div className='card-orange' key={index} style={{ color: campaignState.Setting2.TextColorCard, fontSize: campaignState.Setting2.FontSizeCard + 'px' }}>
                                                                                            <div className="card-four-side" style={{ backgroundColor: campaignState.Setting2.BackgroundColorCard }}>
                                                                                                <div className="card-inside">
                                                                                                    <p className="buy" style={{ color: campaignState.Setting2.TextColorCard, fontSize: campaignState.Setting2.FontSizeCard + 'px' }}>{campaignState.Setting.TextBuy} {item.Quantity}{campaignState.Setting.TextPlus}</p>
                                                                                                    <p className="get" style={{ color: campaignState.Setting2.TextColorCard, fontSize: campaignState.Setting2.FontSizeCard + 'px' }}>{campaignState.Setting2.TextGet}</p>
                                                                                                    <p className="off-card" style={{ color: campaignState.Setting2.TextColorCard, fontSize: campaignState.Setting2.FontSizeCard + 'px' }}>{item.PercentOrPrice}{campaign.PriceType === 1 ? '%' : campaignState.Setting.Currency}{campaign.PriceType === 3 ? '/' + campaignState.Setting.TextEach : ' ' + campaignState.Setting2.TextOff}</p>
                                                                                                </div>
                                                                                                <div className="corner-1" style={{
                                                                                                    position: 'absolute',
                                                                                                    display: 'flex',
                                                                                                    alignItems: 'center',
                                                                                                    width: '20px',
                                                                                                    height: '20px',
                                                                                                    top: '-1px',
                                                                                                    left: '-1px',
                                                                                                    backgroundColor: campaignState.Setting2.BackgroundColorCard,
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
                                                                                                        <div style={{ "content": "", "position": "absolute", "top": "7px", "left": "10px", "width": "5px", "height": "5px", "background": campaignState.Setting2.BackgroundColorCard }}></div>
                                                                                                        <div style={{ "content": "''", "position": "absolute", "top": "-5px", "left": "-3px", "width": "5px", "height": "5px", "background": campaignState.Setting2.BackgroundColorCard }}></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="corner-2" style={{ "position": "absolute", "display": "flex", "alignItems": "center", "width": "20px", "height": "20px", "top": "1px", "right": "-1px", "backgroundColor": campaignState.Setting2.BackgroundColorCard, "borderRadius": "50%", "backgroundClip": "content-box", "borderRight": "3px dashed #fff", "borderTopRightRadius": "50%", "borderTopLeftRadius": "50%", "transform": "rotate(135deg)" }}>
                                                                                                    <div style={{ "content": "''", "position": "absolute", "top": "0", "left": "-10%", "width": "60%", "height": "100%", "background": "#F4F6F8" }}></div>
                                                                                                    <div className="half-circle" style={{
                                                                                                        backgroundColor: '#F4F6F8'
                                                                                                    }}>
                                                                                                        <div style={{ "content": "", "position": "absolute", "top": "-5px", "right": "7px", "width": "5px", "height": "5px", "background": campaignState.Setting2.BackgroundColorCard }}></div>
                                                                                                        <div style={{ "content": "''", "position": "absolute", "top": "9px", "right": "-5px", "width": "5px", "height": "5px", "background": campaignState.Setting2.BackgroundColorCard }}></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="corner-3" style={{ "position": "absolute", "display": "flex", "alignItems": "center", "width": "20px", "height": "20px", "bottom": "1px", "right": "-2px", "borderRadius": "50%", "backgroundClip": "content-box", "borderRight": "3px dashed #fff", "borderTopRightRadius": "50%", "borderTopLeftRadius": "50%", "transform": "rotate(210deg)", "backgroundColor": campaignState.Setting2.BackgroundColorCard }}>
                                                                                                    <div style={{ "content": "''", "position": "absolute", "top": "0", "left": "-10%", "width": "60%", "height": "100%", "background": "#F4F6F8" }}></div>
                                                                                                    <div className="half-circle" style={{
                                                                                                        backgroundColor: '#F4F6F8'
                                                                                                    }}>
                                                                                                        <div style={{ "content": "''", "position": "absolute", "top": "-5px", "right": "9px", "width": "5px", "height": "5px", "background": campaignState.Setting2.BackgroundColorCard }}></div>
                                                                                                        <div style={{ "content": "''", "position": "absolute", "top": "7px", "right": "-5px", "width": "5px", "height": "5px", "background": campaignState.Setting2.BackgroundColorCard }}></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="corner-4" style={{ "position": "absolute", "display": "flex", "alignItems": "center", "width": "22px", "height": "22px", "bottom": "1px", "left": "-2px", "borderRadius": "50%", "backgroundClip": "content-box", "borderRight": "3px dashed #fff", "borderTopRightRadius": "50%", "borderTopLeftRadius": "50%", "transform": "rotate(300deg)", "backgroundColor": campaignState.Setting2.BackgroundColorCard }}>
                                                                                                    <div style={{ "content": "''", "position": "absolute", "top": "0", "left": "-10%", "width": "60%", "height": "100%", "background": "#F4F6F8" }}></div>
                                                                                                    <div className="half-circle" style={{
                                                                                                        backgroundColor: '#F4F6F8'
                                                                                                    }}>
                                                                                                        <div style={{ "content": "''", "position": "absolute", "top": "-5px", "right": "8px", "width": "5px", "height": "5px", "background": campaignState.Setting2.BackgroundColorCard }}></div>
                                                                                                        <div style={{ "content": "''", "position": "absolute", "top": "10px", "right": "-5px", "width": "5px", "height": "5px", "background": campaignState.Setting2.BackgroundColorCard }}></div>
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
                                                        <div className="cb"></div>
                                                        {campaignState.Setting.LayoutInProductPage == 3 && campaignState.Setting2.TextDiscountedPriceEachCard != undefined && campaignState.Setting2.TextDiscountedPriceEachCard != null ? <>
                                                            <p style={{ marginTop: '10px' }}>{rowsPreview.length > 0 ? (campaignState.Setting2.TextDiscountedPriceEachCard == null ? '' : campaignState.Setting2.TextDiscountedPriceEachCard).replace('{total_amount}', /*'$' +*/(rowsPreview[0].Quantity * (100 - rowsPreview[0].PercentOrPrice)) + ' ' + campaignState.Setting.Currency).replace('{price_per_item}', /*'$' + */(100 - rowsPreview[0].PercentOrPrice) + ' ' + campaignState.Setting.Currency) : ''}</p>

                                                        </> : <></>}
                                                        {
                                                            campaignState.Setting.ShowDescription ? <>
                                                                <p className='discount-applied'> {
                                                                    campaign.DiscountType === 1 ?
                                                                        campaignState.Setting2.TextMinimumCartQuantity
                                                                        : campaign.DiscountType === 2 ?
                                                                            campaignState.Setting2.TextMinimumSameProductQuantity :
                                                                            campaignState.Setting2.TextMinimumSameProductVariantQuantity
                                                                }</p>
                                                            </> : <></>
                                                        }

                                                    </div>

                                                </div>
                                                <p style={{ fontStyle: 'italic' }}>Note:</p>
                                                <List type="bullet">
                                                    <List.Item>Customized design and CSS can be set up later in Settings Tab</List.Item>
                                                    <List.Item> Original product price in the preview is 100 {campaignState.Setting.Currency}</List.Item>
                                                </List>
                                                {/* <p style={{ fontStyle: 'italic', paddingLeft: '10px' }}>Customized design and CSS can be set up later in Settings Tab</p> */}

                                            </div>
                                        </div>
                                    </div>
                                    <div className='cb'>

                                    </div>

                                    {
                                        IsOpenAdSpecificCollectionModal ? <>
                                            <TableCollection Collections={campaignState.Collections} IsOpenAdSpecificCollectionModal={IsOpenAdSpecificCollectionModal} setIsOpenAddSpecificCollectionModal={setIsOpenAddSpecificCollectionModal} ItemSelected={campaign.ListCollects}></TableCollection>

                                        </> : <></>
                                    }
                                    {
                                        IsOpenAdSpecificProductModal ? <>
                                            <TableProduct Products={campaignState.Products} IsOpenAdSpecificProductModal={IsOpenAdSpecificProductModal} setIsOpenAddSpecificProductModal={setIsOpenAddSpecificProductModal} ItemSelected={campaign.ListProducts}></TableProduct>

                                        </> : <></>
                                    }

                                </div>
                            </> : ''
                        }

                        {
                            isFirstCampaign && campaign.Step === 2 ?
                                <>
                                    <div className='create-1st-campaign'>
                                        <Layout>
                                            <Layout.Section>
                                                <img src={AlmostDone} alt="" className="Polaris-CalloutCard__Image image-campaign" />
                                                <p className='title'>Almost Done!</p>
                                                <p style={{ marginTop: '25px', marginBottom: '10px' }}>Visit <Link onClick={() => {
                                                    window.open('https://' + appState.Shop?.Domain, '_blank');

                                                }} title={appState.Shop?.Domain + ' Shop'}> {appState.Shop?.Domain} Shop</Link>, move to the products that have the discounts applied and check in turn:</p>
                                                <List type="number">
                                                    <List.Item>In product detail page: there is a table that shows the discounts program.</List.Item>
                                                    <List.Item>In the cart: the discounts work correctly.</List.Item>
                                                    <List.Item>In the check-out page: the discounts work correctly.</List.Item>
                                                </List>

                                                <p style={{ marginTop: '20px', marginBottom: '20px' }}>If all of the above are correct, you can save the campaign to finish. If not, dont worry! You can send the support request and we will respond in the shortest amount of time.</p>
                                                <div className='group-button'>
                                                    <Button primary={false} onClick={() => {
                                                        //save campaign
                                                        dispatch(setCreateUpdateCampaign({
                                                            ...campaignState,
                                                            YourName: '',
                                                            YourEmail: '',
                                                            DescribeYourProblem: '',
                                                            IsShowSendSupport: true,
                                                        }))
                                                        // dispatch(saveCampaign(isFirstCampaign));
                                                    }}>Send support request</Button>
                                                    <Button primary={true} onClick={() => {
                                                        //save campaign
                                                        //dispatch(saveCampaign(isFirstCampaign, campaignState.IsEndDate));
                                                        ChangeStep(3)
                                                    }}>Save campaign</Button>
                                                </div>
                                                {
                                                    !IsHideNotification ? <>
                                                        <div className="Polaris-Card" style={{ backgroundColor: '#FFF4F4', marginTop: '15px', marginBottom: '15px' }}>
                                                            <div className="Polaris-CalloutCard__Container">
                                                                <div className="Polaris-Card__Section relative">
                                                                    <div className="absolute" onClick={() => {
                                                                        setIsHideNotification(true);
                                                                    }}><Icon source={CancelSmallMinor}></Icon></div>
                                                                    <div className="Polaris-CalloutCard">
                                                                        <div className="Polaris-CalloutCard__Content">
                                                                            <div className="Polaris-CalloutCard__Title">
                                                                                <h2 className="Polaris-Heading Heading-Icon Diamond-Red"> <Icon source={DiamondAlertMajor} ></Icon> Activate Quantity Discount before publishing a new campaign
                                                                                </h2>
                                                                            </div>
                                                                            <div className="Polaris-TextContainer">
                                                                                <p>Our Quantity Discount app uses the new Shopify app embed feature. You need to enable this feature in the Shopify Editor before publish a new campaign.</p>
                                                                            </div>
                                                                            <div className="Polaris-CalloutCard__Buttons">
                                                                                <Button primary={false}
                                                                                    loading={campaignState.IsEnabledAppLoading}
                                                                                    onClick={() => {
                                                                                        dispatch(setCreateUpdateCampaign({
                                                                                            ...campaignState,
                                                                                            IsEnabledAppLoading: true,
                                                                                        }))
                                                                                        dispatch(enableAppEmbed(!campaignState.Setting.IsEnableAppEmbed));
                                                                                        window.open('https://' + config.shop + '/admin/themes/current/editor?context=apps&activateAppId=3f38eaa3-2a3f-4e55-bcc9-df5d3f75e351%2Forichi-discount', "_blank");
                                                                                    }}>{campaignState.Setting.IsEnableAppEmbed ? 'Disable' : 'Enable'} app embed</Button>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                        :
                                                        <></>
                                                }

                                                {/* <div className="Polaris-Card" style={{ backgroundColor: '#EBF9FC', marginTop: '15px', marginBottom: '15px' }}>
                                                    <div className="Polaris-CalloutCard__Container">
                                                        <div className="Polaris-Card__Section">
                                                            <div className="Polaris-CalloutCard">
                                                                <div className="Polaris-CalloutCard__Content">
                                                                    <div className="Polaris-CalloutCard__Title">
                                                                        <h2 className="Polaris-Heading Heading-Icon"> <Icon source={CircleInformationMajor} color='red'></Icon> Tip for quick fix if the campaign doesn’t work
                                                                        </h2>
                                                                    </div>
                                                                    <div className="Polaris-TextContainer">
                                                                        <p>If your store is using the "Debut" theme or extends from the "Debut theme" of Shopify, or if you have some errors when updating cart, checking out cart,... please click in here to fix conflict with our app with your theme.</p>
                                                                    </div>
                                                                    <div className="Polaris-CalloutCard__Buttons">
                                                                        <Button primary={false} onClick={() => {
                                                                        }}>Fix the conflict</Button>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}


                                            </Layout.Section>
                                        </Layout>
                                    </div>
                                    <Modal
                                        open={campaignState.IsShowSendSupport}
                                        onClose={() => {
                                            dispatch(setCreateUpdateCampaign({
                                                ...campaignState,
                                                IsShowSendSupport: false
                                            }))
                                        }}
                                        title="Support request"
                                        primaryAction={{
                                            content: 'Send',
                                            onAction: () => {
                                                if (ValidFormSuportRequest()) {
                                                    dispatch(sendSupportRequest(campaignState.YourName, campaignState.YourEmail, campaignState.DescribeYourProblem))
                                                }
                                            },
                                        }}
                                        secondaryActions={[
                                            {
                                                content: 'Cancel',
                                                onAction: () => {
                                                    dispatch(setCreateUpdateCampaign({
                                                        ...campaignState,
                                                        IsShowSendSupport: false
                                                    }))
                                                },
                                            },
                                        ]}
                                    >
                                        <Modal.Section>
                                            <TextField
                                                label="Your name"
                                                value={campaignState.YourName}
                                                onChange={(e) => {
                                                    dispatch(setCreateUpdateCampaign({
                                                        ...campaignState,
                                                        YourName: e,
                                                        YourNameValidation: e == '' ? 'Name is required' : ''
                                                    }))
                                                }}
                                                error={campaignState.YourNameValidation}
                                                type="text"
                                            />
                                            <div className="break-line"></div>
                                            <TextField
                                                label="Your email"
                                                value={campaignState.YourEmail}
                                                onChange={(e) => {
                                                    dispatch(setCreateUpdateCampaign({
                                                        ...campaignState,
                                                        YourEmail: e,
                                                        YourEmailValidation: e == '' ? 'Email is required' : ''
                                                    }))
                                                }}
                                                error={campaignState.YourEmailValidation}
                                                type="text"
                                            />
                                            <div className="break-line"></div>
                                            <TextField
                                                label="Describe your problem"
                                                value={campaignState.DescribeYourProblem}
                                                onChange={(e) => {
                                                    dispatch(setCreateUpdateCampaign({
                                                        ...campaignState,
                                                        DescribeYourProblem: e,
                                                        DescribeYourProblemValidation: e == '' ? 'Describe is required' : ''
                                                    }))
                                                }}
                                                multiline={4}
                                                error={campaignState.DescribeYourProblemValidation}
                                                type="text"
                                            />
                                        </Modal.Section>
                                    </Modal>
                                </> : ''
                        }
                        {
                            isFirstCampaign && campaign.Step === 3 ?
                                <>
                                    <div className='congratulation'>
                                        <Layout>
                                            <Layout.Section>
                                                <img src={Congratulation} alt="" className="Polaris-CalloutCard__Image image-campaign" />
                                                <p className='title'>Congratulation!</p>
                                                <p style={{ marginTop: '25px', marginBottom: '10px' }}>You have successfully created your first campaign! Let’s wait for the sales to explode!
                                                </p>
                                                <p style={{ marginTop: '20px', marginBottom: '20px' }}>One more thing: You can subcribe to receive our email about the campaign report as well as suggestions to make the campaign more effective. If you find this app work well, don’t forget to rate us in Shopify!</p>
                                                <Stack>
                                                    <Checkbox
                                                        label="Send the report and suggestions about the campaign to my email."
                                                        checked={checkedSendReportToMail}
                                                        onChange={(e) => { setCheckedSendReportToMail(e); handleChangeSendReportToMail(e) }}
                                                    />
                                                </Stack>
                                                <div className='group-button mt-20'>
                                                    <Button primary={false} onClick={() => {
                                                        dispatch(setCreateUpdateCampaign({
                                                            ...campaignState,
                                                            campaign: {
                                                                ...campaign,
                                                                Step: 1
                                                            },
                                                        }))
                                                        dispatch(setIsCreatingCampaign(false))
                                                        dispatch(setMenu(moreAppConfig.Menu.MANAGECAMPAIGN))
                                                        dispatch(setIsNoCampaign(false))
                                                    }}>Manage campaign</Button>
                                                    <Button primary={true} onClick={() => {
                                                        window.open('https://apps.shopify.com/quantity-break-limit-purchase', '_blank');
                                                    }}>Rate us in Shopify</Button>
                                                </div>

                                            </Layout.Section>
                                        </Layout>
                                    </div>
                                </>
                                : ''
                        }

                    </>
            }
            {campaignState.IsOpenSaveResult ? <Toast content={campaignState.MessageSaveResult} duration={2400} onDismiss={() => {
                dispatch(setCreateUpdateCampaign({
                    ...campaignState,
                    IsOpenSaveResult: false
                }))
            }} /> : null}
        </>

    )
}

export default withRouter(CreateUpdateCampaign);