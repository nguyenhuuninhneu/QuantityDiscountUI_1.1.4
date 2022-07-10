import React, { useState, useEffect } from 'react';
import { Button, Icon, Toast } from '@shopify/polaris';
import { CircleInformationMajor, CancelSmallMinor } from '@shopify/polaris-icons';
import axios from 'axios';
import config from './../../../config/config';


function FixTheConflict(props) {
    const [IsHideNotification, setIsHideNotification] = useState(false);
    const [IsFixLoading, setIsFixLoading] = useState(false);
    const [Alert, setAlert] = useState(null);
    useEffect(() => {

    });
    const FixConflict = () => {
        axios.get(config.rootLink + '/FrontEnd/InstallCodeForDebutTheme', {
            params: {
                shop: config.shop,
            }
        })
            .then(function (response) {
                const result = response?.data;
                setIsFixLoading(false);
                setAlert(<Toast content={'Fix the conflict ' + (result ? 'successfully' : 'has error')} duration={2400} onDismiss={() => {
                    setAlert(null);
                }} />);
                if(props.Disappear){
                    setIsHideNotification(true);
                }
            })
            .catch(function (error) {
                const errorMsg = error.message;
                setIsFixLoading(false);
                setAlert(<Toast content={'Fix the conflict has error'} duration={2400} onDismiss={() => {
                    setAlert(null);
                }} />);
                console.log(errorMsg);
            })
    }
    return <>
        {
            !IsHideNotification ? <>
            {/*, border: '1px solid #008060'  */}
                <div className="Polaris-Card fix-conflict" style={{  backgroundColor: '#EBF9FC', marginTop: '15px', marginBottom: '15px'}}>
                    <div className="Polaris-CalloutCard__Container">
                        <div className="Polaris-Card__Section relative">
                            {props.IsShowButtonClose ? <>
                                <div className="absolute" onClick={() => {
                                    setIsHideNotification(true);
                                }}><Icon source={CancelSmallMinor}></Icon></div>
                            </> : ''}

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
                                            setIsFixLoading(true);
                                            FixConflict();
                                        }} loading={IsFixLoading}>Fix the conflict</Button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </> : ''
        }
        {Alert}
    </>
}

export default FixTheConflict;
