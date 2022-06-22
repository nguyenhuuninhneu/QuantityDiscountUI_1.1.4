import React from 'react';
import { Card, TextContainer, Layout, SkeletonBodyText, SkeletonDisplayText, SkeletonPage } from '@shopify/polaris';

export default class URLNotFound extends React.Component {
    render() {
        return (
            <><div style={{fontSize: '30px',fontWeight: 'bold',textAlign: 'center',marginTop: '100px'}}>There’s no page at this address.</div>
            </>
        );
    }
}
