import '../../assets/css/plan.css'
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Icon, Toast } from '@shopify/polaris';
import { CircleTickMajor } from '@shopify/polaris-icons';
import { setPlan } from '../../state/modules/plan/actions';
import Loading from '../../components/plugins/Loading';
import { fetchPlan, Upgrade, Downgrade, ChoosePlan } from '../../state/modules/plan/operations';
import moreAppConfig from "../../config/moreAppConfig";

function Plan() {
    const dispatch = useDispatch();
    const planState = useSelector((state) => state.plan.Plan);
    useEffect(() => {
        dispatch(fetchPlan());
    }, [dispatch]);
    return (
        <>
            {
                planState.IsLoadingPage ? <Loading></Loading> :
                    <>
                        <div className='plan'>
                            <div className='table-plan'>
                                <div className='header'>
                                    <div className='item'>
                                        <div className='col col1'>
                                            Plan
                                        </div>
                                        <div className='col col2'>
                                            Free
                                        </div>
                                        <div className='col col3'>
                                            Basic
                                        </div>
                                        <div className='col col4'>
                                            Advance
                                        </div>
                                        <div className='cb'></div>
                                    </div>
                                </div>
                                <div className='body'>
                                    <div className='item'>
                                        <div className='col col1'>
                                            Maximum number of discount campaigns
                                        </div>
                                        <div className='col col2'>
                                            1 campaign
                                        </div>
                                        <div className='col col3'>
                                            5 campaigns
                                        </div>
                                        <div className='col col4'>
                                            Unlimited
                                        </div>
                                        <div className='cb'></div>
                                    </div>
                                    <div className='item'>
                                        <div className='col col1'>
                                            Limit usage for discount
                                        </div>
                                        <div className='col col2'>
                                            <Icon
                                                source={CircleTickMajor}
                                                color="base" />
                                        </div>
                                        <div className='col col3'>
                                            <Icon
                                                source={CircleTickMajor}
                                                color="base" />
                                        </div>
                                        <div className='col col4'>
                                            <Icon
                                                source={CircleTickMajor}
                                                color="base" />
                                        </div>
                                        <div className='cb'></div>
                                    </div>
                                    <div className='item'>
                                        <div className='col col1'>
                                            Limit purchase
                                        </div>
                                        <div className='col col2'>
                                            <Icon
                                                source={CircleTickMajor}
                                                color="base" />
                                        </div>
                                        <div className='col col3'>
                                            <Icon
                                                source={CircleTickMajor}
                                                color="base" />
                                        </div>
                                        <div className='col col4'>
                                            <Icon
                                                source={CircleTickMajor}
                                                color="base" />
                                        </div>
                                        <div className='cb'></div>
                                    </div>
                                    <div className='item'>
                                        <div className='col col1'>
                                        Discount for multiple
                                        </div>
                                        <div className='col col2'>
                                            -
                                        </div>
                                        <div className='col col3'>
                                            <Icon
                                                source={CircleTickMajor}
                                                color="base" />
                                        </div>
                                        <div className='col col4'>
                                            <Icon
                                                source={CircleTickMajor}
                                                color="base" />
                                        </div>
                                        <div className='cb'></div>
                                    </div>
                                    {/* <div className='item'>
                                        <div className='col col1'>
                                            Limit order
                                        </div>
                                        <div className='col col2'>
                                            -
                                        </div>
                                        <div className='col col3'>
                                            <Icon
                                                source={CircleTickMajor}
                                                color="base" />
                                        </div>
                                        <div className='col col4'>
                                            <Icon
                                                source={CircleTickMajor}
                                                color="base" />
                                        </div>
                                        <div className='cb'></div>
                                    </div> */}
                                    <div className='item'>
                                        <div className='col col1'>
                                            Dashboard & report
                                        </div>
                                        <div className='col col2'>
                                            -
                                        </div>
                                        <div className='col col3'>
                                            -
                                        </div>
                                        <div className='col col4'>
                                            <Icon
                                                source={CircleTickMajor}
                                                color="base" />
                                        </div>
                                        <div className='cb'></div>
                                    </div>
                                    <div className='item'>
                                        <div className='col col1'>
                                            Upsell in cart page
                                        </div>
                                        <div className='col col2'>
                                            -
                                        </div>
                                        <div className='col col3'>
                                            -
                                        </div>
                                        <div className='col col4'>
                                            <Icon
                                                source={CircleTickMajor}
                                                color="base" />
                                        </div>
                                        <div className='cb'></div>
                                    </div>
                                    <div className='item'>
                                        <div className='col col1'>
                                            Work with “Buy it now”
                                        </div>
                                        <div className='col col2'>
                                            -
                                        </div>
                                        <div className='col col3'>
                                            -
                                        </div>
                                        <div className='col col4'>
                                            <Icon
                                                source={CircleTickMajor}
                                                color="base" />
                                        </div>
                                        <div className='cb'></div>
                                    </div>
                                    <div className='item price'>
                                        <div className='col col1'>
                                            Price
                                        </div>
                                        <div className='col col2'>
                                            Free
                                        </div>
                                        <div className='col col3'>
                                            $8/month
                                        </div>
                                        <div className='col col4'>
                                            $11/month
                                        </div>
                                        <div className='cb'></div>
                                    </div>
                                    <div className='item action'>
                                        <div className='col col1'>
                                            <span style={{ visibility: 'hidden' }}>.</span>
                                        </div>
                                        <div className='col col2'>
                                            {
                                                planState.PlanNumber === moreAppConfig.PlanNumber.Free ?
                                                    <>
                                                        <Button disabled={true} onClick={() => {

                                                        }}>Current plan</Button>
                                                    </>
                                                    :
                                                    <>
                                                        <Button primary onClick={() => {
                                                            dispatch(setPlan({
                                                                ...planState,
                                                                IsOpenChoosePlan: true,
                                                                TypePlan: moreAppConfig.PlanNumber.Free
                                                            }))
                                                        }}>Choose plan</Button>
                                                    </>
                                            }

                                        </div>
                                        <div className='col col3'>
                                            {
                                                planState.PlanNumber === moreAppConfig.PlanNumber.Basic ?
                                                    <>
                                                        <Button disabled={true} onClick={() => {

                                                        }}>Current plan</Button>
                                                    </>
                                                    :
                                                    <>
                                                        <Button primary onClick={() => {
                                                            dispatch(setPlan({
                                                                ...planState,
                                                                IsOpenChoosePlan: true,
                                                                TypePlan: moreAppConfig.PlanNumber.Basic
                                                            }))
                                                        }}>Choose plan</Button>
                                                    </>
                                            }
                                            <div className='day-trial'>{planState.PlanNumber !== moreAppConfig.PlanNumber.Advanced && planState.PlanNumber !== moreAppConfig.PlanNumber.Basic && planState.StartFreeTrial === 1 ? '7 days trial' :''}</div>
                                        </div>
                                        <div className='col col4'>
                                            {
                                                planState.PlanNumber === moreAppConfig.PlanNumber.Advanced ?
                                                    <>
                                                        <Button disabled={true} onClick={() => {

                                                        }}>Current plan</Button>
                                                    </>
                                                    :
                                                    <>
                                                        <Button primary onClick={() => {
                                                            dispatch(setPlan({
                                                                ...planState,
                                                                IsOpenChoosePlan: true,
                                                                TypePlan: moreAppConfig.PlanNumber.Advanced
                                                            }))
                                                        }}>Choose plan</Button>
                                                    </>
                                            }
                                            <div className='day-trial'>{planState.PlanNumber !== moreAppConfig.PlanNumber.Advanced && planState.StartFreeTrialAdvanced === 1 ? '7 days trial' :''}</div>
                                        </div>
                                        <div className='cb'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
            }

            <Modal
                open={planState.IsOpenChoosePlan}
                onClose={() => {
                    dispatch(setPlan({
                        ...planState,
                        IsOpenChoosePlan: false
                    }))

                }}
                title={"Do you want to change your plan to " + (planState.TypePlan == moreAppConfig.PlanNumber.Free ? "Free" : planState.TypePlan == moreAppConfig.PlanNumber.Basic ? "Basic" : "Advanced")}
                primaryAction={{
                    content: 'OK',
                    onAction: () => {
                        dispatch(ChoosePlan(planState.TypePlan))
                    },
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: () => {
                            dispatch(setPlan({
                                ...planState,
                                IsOpenChoosePlan: false
                            }))
                        },
                    },
                ]}
            ></Modal>
            {planState.IsOpenSaveResult ? <Toast content={planState.MessageSaveResult} duration={2400} onDismiss={() => {
                dispatch(setPlan({
                    ...planState,
                    IsOpenSaveResult: false
                }))
            }} /> : null}
        </>
    )
}

export default Plan