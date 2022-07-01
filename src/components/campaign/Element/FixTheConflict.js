import React, { useState, useEffect } from 'react';
import { Button, Icon } from '@shopify/polaris';


function FixTheConflict(props) {
    useEffect(() => {

    });

    return <>
        <div className="Polaris-Card" style={{ backgroundColor: '#EBF9FC', marginTop: '15px', marginBottom: '15px' }}>
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
        </div>
    </>
}
