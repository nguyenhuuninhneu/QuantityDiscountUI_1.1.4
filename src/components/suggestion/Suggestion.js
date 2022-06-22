import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import config from '../../config/config'
import moreAppConfig from '../../config/moreAppConfig';
import { TextField, Card, Heading, TextStyle, Button, Toast } from '@shopify/polaris';
import '../../assets/css/suggestion.css';
import '../../App.css';
import lightvertical from '../../assets/images/light-vertical.png'
import lighthorizontal from '../../assets/images/light-horizontal.png'
import IcoBub from '../../assets/images/ico_bub.svg'
import dismiss from '../../assets/images/dismiss.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import ShowMoreText from "react-show-more-text";

const Suggestion = (props) => {
    //Suggestion
    const appState = useSelector((state) => state.app);
    const [Suggest, setSuggest] = useState(null);
    const [toastSent, settoastSent] = useState(null);
    const [textSearch, setTextSearch] = useState('');
    const [textTitleValid, setTitleValid] = useState('');
    const [textDescriptionValid, setDescriptionValid] = useState('');
    const handleChangeTextSearch = (newValue) => {
        setTextSearch(newValue);

        if (newValue !== '') {
            const newList = Suggest.filter((item) => item.Title.toLowerCase().includes(newValue.toLowerCase()) || item.Description.toLowerCase().includes(newValue.toLowerCase()));
            setListSearch(newList);
        } else {
            setListSearch(Suggest);
        }
    }
    const [textTitle, setTextTitle] = useState('');
    const handleChangeTextTitle = (newValue) => {
        setTextTitle(newValue);
        if (newValue == '') {
            setTitleValid(moreAppConfig.TilteValidationText);
        } else {
            setTitleValid('');
        }

    };
    const [textDes, setTextDes] = useState('');
    const handleChangeTextDes = (newValue) => {
        setTextDes(newValue);
        if (newValue == '') {
            setDescriptionValid(moreAppConfig.DescriptionValidationText);
        } else {
            setDescriptionValid('');
        }
    };
    const [stepSurvey, setStepSurvey] = useState(0);
    const [isShowFeature, setShowFeature] = useState(false);
    const [addNewFeature, setAddNewFeature] = useState(false);
    const [listSearch, setListSearch] = useState(null);
    //Paging
    const [limitItem, setLimitItem] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const handleShowSuggestion = () => {
        setStepSurvey(0);
        setAddNewFeature(false);
        setTextSearch('');
        axios.get(config.rootLink + '/FrontEnd/GetSuggests')
            .then(function (response) {
                // handle success
                console.log(response);
                setShowFeature(true)
                setSuggest(response.data, [Suggest]);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })



    }
    function changeSuggestStatus(suggest) {

        axios.post(config.rootLink + '/FrontEnd/ChangeReaction', {
            obj: suggest,
            shop: config.shop,
        })
            .then(function (response) {


                if (response.data.IsSuccess) {
                    settoastSent(<Toast content={response.data.Messenger} onDismiss={() => { settoastSent(null) }} duration={4500} />)
                    const newList = Suggest.map((item) => {
                        if (item.ID === suggest.ID) {
                            const updatedItem = {
                                ...item,
                                VotedShop: response.data.Suggest.VotedShop,
                                VoteNumber: response.data.Suggest.VoteNumber,
                            };
                            return updatedItem;
                        }
                        return item;
                    });
                    setSuggest(newList);

                    const newListSearch = listSearch.map((item) => {
                        if (item.ID === suggest.ID) {
                            const updatedItem = {
                                ...item,
                                VotedShop: response.data.Suggest.VotedShop,
                                VoteNumber: response.data.Suggest.VoteNumber,
                            };
                            return updatedItem;
                        }
                        return item;
                    });
                    setListSearch(newListSearch);
                }
                else {
                    settoastSent(<Toast content={response.data.Messenger} onDismiss={() => { settoastSent(null) }} duration={4500} />)
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
    function handleCancelAddSuggestion() {
        setAddNewFeature(false);
        setTextSearch('');
        setStepSurvey(0);
        setListSearch(Suggest);
    }
    function handleSendSuggestion() {
        let validTitle = true;
        let validDes = true;
        if (textTitle == '') {
            setTitleValid(moreAppConfig.TilteValidationText);
            validTitle = false;
        }
        if (textDes == '') {
            setDescriptionValid(moreAppConfig.DescriptionValidationText);
            validDes = false;
        }
        if (!validTitle || !validDes) {
            return false;
        }
        var newItem = {
            Title: textTitle,
            Description: textDes,
        }
        axios.post(config.rootLink + '/FrontEnd/CreateSuggest', {
            obj: newItem,
            shop: config.shop,
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    Suggest.unshift(response.data.suggest);
                    settoastSent(<Toast content={response.data.Messenger} onDismiss={() => { settoastSent(null) }} duration={4500} />)
                    setSuggest(Suggest);
                    setCurrentPage(1);
                    setLimitItem(5);
                    setAddNewFeature(false);
                    setStepSurvey(2);
                }
                else {
                    settoastSent(<Toast content={response.data.Messenger} onDismiss={() => { settoastSent(null) }} duration={4500} />)
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }
    const openFormAddNewFeature = () => {
        setStepSurvey(1);
        const newList = Suggest.slice(0, 3);
        setListSearch(newList);
        setTextTitle('');
        setTextDes('');
        setAddNewFeature(true);

    }
    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - Math.round(e.target.scrollTop) === e.target.clientHeight;

        if (bottom && (textSearch === '' && !addNewFeature)) {
            setCurrentPage(currentPage => currentPage + 1);
            setLimitItem(limitItem => limitItem + 5);
        }
    }

    useEffect(() => {
        handleShowSuggestion();
    }, []);
    return (
        <>
            <div className='header'>
                <div className='block-light'>
                    <div className='title'>
                        Request new feature
                    </div>
                    <div className='image'>
                        <img src={IcoBub} />
                    </div>
                </div>
                {/* <p className='label'>
                   Upvote existing ideas or suggest new ones.
               </p> */}
            </div>
            <div className='new-feature'>
                <Card>
                    <Card.Section>
                        {
                            !addNewFeature ?
                                <>
                                    <div className='search-featrue search-hide'>
                                        <ul>
                                            <li>You can upvote existing ideas so that we can buid it as soon ass possible. Yes, you won’t have to wait for so long!</li>
                                            <li>Click “Request new feature” if you can’t find it in the list below</li>
                                        </ul>
                                        <div className='tag-feature'>
                                            <Button primary onClick={() => {
                                                openFormAddNewFeature()
                                            }}>Request new feature</Button>
                                        </div>
                                        <div>
                                            <TextField
                                                placeholder="Search your suggestion"
                                                value={textSearch}
                                                onChange={(e) => { handleChangeTextSearch(e) }}
                                                autoComplete="off"
                                            />
                                        </div>

                                    </div>
                                </> :
                                <>
                                    <div className='form-add-feature mb-10'>
                                        <Heading>Suggest another feature</Heading>
                                    </div>
                                    <p className='mb-10'>Title <span className='valid'>(*)</span> </p>
                                    <TextField
                                        placeholder="Title"
                                        value={textTitle}
                                        error={textTitleValid}
                                        onChange={(e) => { handleChangeTextTitle(e) }}
                                        autoComplete="off"
                                        maxLength="150"
                                    />
                                    <p className='mt-10 mb-10'>Description <span className='valid'>(*)</span> </p>
                                    <TextField
                                        placeholder="Description"
                                        value={textDes}
                                        error={textDescriptionValid}
                                        onChange={(e) => { handleChangeTextDes(e) }}
                                        autoComplete="off"
                                        multiline={4}
                                    />
                                    <div className='mt-20'>
                                        <Button onClick={() => { handleCancelAddSuggestion() }}>Cancel</Button>
                                        <Button onClick={() => { handleSendSuggestion() }} primary>Send</Button>
                                    </div>
                                    <hr className='mb-20 mt-20' />
                                </>
                        }

                        <div className='list-feature' onScroll={handleScroll}>
                            {
                                (textSearch === '' && !addNewFeature) && Suggest !== null && Suggest !== undefined ?

                                    Suggest.slice(0, limitItem).map((suggest, index) => {

                                        return (
                                            <div className='item-feature' key={index}>
                                                <div className='left'>
                                                    <a className={!suggest.VotedShop.includes(appState?.Shop?.ID) ? 'gray pointer' : 'green pointer'} onClick={() => { changeSuggestStatus(suggest) }} title={suggest.VotedShop.includes(appState?.Shop?.ID.toString()) ? 'Like' : 'Dislike'} >
                                                        <FontAwesomeIcon icon={faThumbsUp} />
                                                    </a>
                                                </div>
                                                <div className='right'>
                                                    <div className='title'>
                                                        {suggest.Title}
                                                    </div>
                                                    <div className='description mb-10'>
                                                        <ShowMoreText
                                                            /* Default options */
                                                            lines={2}
                                                            more="view more"
                                                            less="view less"
                                                            className="content-css"
                                                            anchorClass="my-anchor-css-class"
                                                            expanded={false}
                                                            truncatedEndingComponent={"... "}
                                                        >
                                                            {suggest.Description}

                                                        </ShowMoreText>
                                                    </div>
                                                </div>
                                                <div className='cb'>
                                                </div>
                                                <div className='vote-number'>
                                                    {suggest.VoteNumber} votes
                                                </div>
                                                {suggest.ShopID == appState.Shop.ID ?
                                                    <>
                                                        <div className='your-suggestion'>
                                                            your suggestion
                                                        </div>
                                                    </> : ''}

                                            </div>
                                        )
                                    })

                                    : null
                            }
                            {
                                (textSearch !== '' || (textSearch === '' && addNewFeature)) && listSearch != null && listSearch != undefined ?

                                    listSearch.map((suggest, index) => {

                                        return (
                                            <div className='item-feature' key={index}>
                                                <div className='left'>
                                                    <a className={!suggest.VotedShop.includes(appState?.Shop?.ID.toString()) ? 'gray' : 'green'} onClick={() => { changeSuggestStatus(suggest) }} title={suggest.VotedShop.includes(appState?.Shop?.ID.toString()) ? 'Like' : 'Dislike'} >
                                                        <FontAwesomeIcon icon={faThumbsUp} />
                                                    </a>
                                                </div>
                                                <div className='right'>
                                                    <div className='title'>
                                                        {suggest.Title}
                                                    </div>
                                                    <div className='description mb-10'>
                                                        <ShowMoreText
                                                            /* Default options */
                                                            lines={2}
                                                            more="view more"
                                                            less="view less"
                                                            className="content-css"
                                                            anchorClass="my-anchor-css-class"
                                                            expanded={false}
                                                            truncatedEndingComponent={"... "}
                                                        >
                                                            {suggest.Description}

                                                        </ShowMoreText>
                                                    </div>
                                                </div>
                                                <div className='cb'>
                                                </div>
                                                <div className='vote-number'>
                                                    {suggest.VoteNumber} votes
                                                </div>
                                                {suggest.ShopID == appState?.Shop?.ID ?
                                                    <>
                                                        <div className='your-suggestion'>
                                                            your suggestion
                                                        </div>
                                                    </> : ''}

                                            </div>
                                        )
                                    })

                                    : null
                            }
                        </div>

                    </Card.Section>
                </Card>

            </div>


            <div className='dismiss'>
                <a onClick={() => { props.setIsShowSuggestion(false); setShowFeature(false); setStepSurvey(0) }} className='tag-dismiss pointer' title="Close" >
                    <img src={dismiss} />
                </a>
            </div>
        </>
        // <div className='suggestion'>
        //     {/* <div className={!isShowFeature ? 'light-fixed light-show' : 'light-fixed light-hide'}>
        //         <a onClick={() => { handleShowSuggestion() }} className='tag-horizontal pointer' title="Features Suggestion" >
        //             <img src={lighthorizontal} />
        //         </a>
        //     </div> */}
        //     <div className={props.isShowSuggestion ? 'feature-fixed feature-show':'feature-fixed feature-hide'}>

        //     </div>

        // </div>

    )
}

export default Suggestion