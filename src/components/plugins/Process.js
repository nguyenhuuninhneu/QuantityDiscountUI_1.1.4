import { Icon } from '@shopify/polaris';
import React, { useState, useEffect } from 'react';
import { CircleInformationMajor } from '@shopify/polaris-icons';

function Process(props) {
    return (
        <>
            <div className="Polaris-Card" style={{ backgroundColor: '#EBF9FC', marginTop: '15px', marginBottom: '15px' }}>
                <div className="Polaris-CalloutCard__Container">
                    <div className="Polaris-Card__Section" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
                        <div className="Polaris-CalloutCard">
                            <div className="Polaris-CalloutCard__Content" style={{ paddingLeft: '5px' }}>
                                <div className="Polaris-CalloutCard__Title" style={{ marginBottom: '0.5rem' }}>
                                    <h2 className="Polaris-Heading Heading-Icon process-bar-heading-icon"> <Icon source={CircleInformationMajor} color='red'></Icon> Please wait for data to be fully loaded from your store!
                                    </h2>
                                </div>
                                <div className="Polaris-TextContainer" style={{ marginBottom: '0.5rem' }}>
                                    <p>If your store data is not fully loaded, the discount campaigns might work incorrectly.</p>
                                </div>
                                <div className="process-bar-number">
                                    <div className="Polaris-ProgressBar Polaris-ProgressBar--sizeMedium Polaris-ProgressBar--colorSuccess" style={{ height: '8px' }}>
                                        <progress className="Polaris-ProgressBar__Progress" value="30" max="100"></progress>
                                        <div className="Polaris-ProgressBar__Indicator Polaris-ProgressBar__Animated" style={{ width: props.Process + '%' }}>
                                        </div>
                                        <span className="process-bar-number-before">{props.Process + '%'}</span>
                                        {/* <span className="process-bar-number-after">100%</span> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Process