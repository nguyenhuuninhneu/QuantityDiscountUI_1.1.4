import { Card, Badge, ButtonGroup, Button, Modal, Toast, TextContainer, TextField, DataTable, List, Spinner, Icon, PageActions, DatePicker } from '@shopify/polaris';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CalendarMajor } from '@shopify/polaris-icons';
import { setListReport } from '../../state/modules/report/actions';
import { fetchList, reportDetail } from '../../state/modules/report/operations';
import moreAppConfig from '../../config/moreAppConfig';
import '../../assets/css/paginate.css';
import ReactPaginate from 'react-paginate';
import Loading from '../../components/plugins/Loading';
import Select from 'react-select';
import axios from 'axios';
import config from '../../config/config';
import utils from '../../config/utils';
import { withRouter } from "react-router-dom";

const Report = (props) => {
    const dispatch = useDispatch();
    const appState = useSelector((state) => state.app);

    const reportState = useSelector((state) => state.report.ListReport);
    const [Alert, setAlert] = useState(null);
    var startdate = new Date();
    var enddate = new Date();
    startdate = sessionStorage.getItem('startdate_report') ? new Date(sessionStorage.getItem('startdate_report')) : new Date(startdate.setDate(startdate.getDate() - 30));
    enddate = sessionStorage.getItem('enddate_report') ? new Date(sessionStorage.getItem('enddate_report')) : enddate;
    var optionsDate = { year: 'numeric', month: 'short', day: 'numeric' };
    useEffect(() => {
        var strStartDateToday = startdate.getFullYear() + '-' + (startdate.getMonth() < 9 ? '0' + (startdate.getMonth() + 1) : startdate.getMonth() + 1) + '-' + (startdate.getDate() < 10 ? '0' + startdate.getDate() : startdate.getDate());
        var strEndDateToday = enddate.getFullYear() + '-' + (enddate.getMonth() < 9 ? '0' + (enddate.getMonth() + 1) : enddate.getMonth() + 1) + '-' + (enddate.getDate() < 10 ? '0' + enddate.getDate() : enddate.getDate());
        handleChangeSetDate({ start: startdate, end: enddate });
        dispatch(fetchList(strStartDateToday, strEndDateToday));

        window.sessionStorage.setItem('startdate_report', startdate);
        window.sessionStorage.setItem('enddate_report', enddate);
        var selectedrange = sessionStorage.getItem('report_selected_type_range') ? parseInt(sessionStorage.getItem('report_selected_type_range')) : 4;
        var selectedrangelabel = sessionStorage.getItem('report_selected_type_range_label') ? sessionStorage.getItem('report_selected_type_range_label') : 'Last 30 days';
        var object = { label: selectedrangelabel, value: selectedrange };
        handleChangeDateRangeOption(object);
    }, [dispatch]);
    const [{ month, year }, setDate] = useState({ month: startdate.getMonth(), year: startdate.getFullYear() });
    const [selectedDates, setSelectedDates] = useState({
        start: startdate,
        end: enddate
    });

    const handleMonthChange = useCallback(
        (month, year) => setDate({ month, year }),
        [],
    );
    const handleChangeSetDate = (e) => {
        var strStart = e.start.toLocaleDateString("en-US", optionsDate);
        var strEnd = e.end.toLocaleDateString("en-US", optionsDate);
        var startdate = e.start.getFullYear() + '-' + (e.start.getMonth() < 9 ? '0' + (e.start.getMonth() + 1) : e.start.getMonth() + 1) + '-' + (e.start.getDate() < 10 ? '0' + e.start.getDate() : e.start.getDate());
        var enddate = e.end.getFullYear() + '-' + (e.end.getMonth() < 9 ? '0' + (e.end.getMonth() + 1) : e.end.getMonth() + 1) + '-' + (e.end.getDate() < 10 ? '0' + e.end.getDate() : e.end.getDate());
        dispatch(setListReport({
            ...reportState,
            DateRange: {
                ...reportState.DateRange,
                StartDate: startdate,
                StartDateStr: strStart,
                EndDate: enddate,
                EndDateStr: strEnd
            }
        }))
        setSelectedDates({
            start: e.start,
            end: e.end
        })
    }
    const handleChangeDateRangeOption = (e) => {
        var now = new Date();
        var getStartDate;
        var getEndDate;
        switch (e.value) {
            case 1:
                //Today
                setSelectedDates({
                    start: now,
                    end: now
                })
                getStartDate = now;
                getEndDate = now;
                break;
            case 2:
                //Yesterday
                var date2 = new Date();
                date2.setDate(date2.getDate() - 1);
                setSelectedDates({
                    start: date2,
                    end: date2
                })
                getStartDate = date2;
                getEndDate = date2;
                break;
            case 3:
                //Last 7 days
                setSelectedDates({
                    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    end: now
                })
                getStartDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                getEndDate = now;
                break;

            case 4:
                //Last 30 days
                var date4 = new Date();
                setSelectedDates({
                    start: new Date(date4.setDate(date4.getDate() - 30)),
                    end: now
                })
                getStartDate = new Date(date4.setDate(date4.getDate() - 30));
                getEndDate = now;
                break;
            case 5:
                //Last 90 days
                var date5 = new Date();
                setSelectedDates({
                    start: new Date(date5.setDate(date5.getDate() - 90)),
                    end: now
                })
                getStartDate = new Date(date5.setDate(date5.getDate() - 90));
                getEndDate = now;
                break;
            case 6:
                //Last quarter
                //Previous quarter
                const quarter = Math.floor((now.getMonth() / 3));
                const startFullQuarter = new Date(now.getFullYear(), quarter * 3 - 3, 1);
                const endFullQuarter = new Date(startFullQuarter.getFullYear(), startFullQuarter.getMonth() + 3, 0);
                setSelectedDates({
                    start: startFullQuarter,
                    end: endFullQuarter
                })
                getStartDate = startFullQuarter;
                getEndDate = endFullQuarter;
                break;
            case 7:
                //Last months
                var date7 = new Date();
                date7.setMonth(date7.getMonth() - 1);
                setSelectedDates({
                    start: date7,
                    end: now
                })
                getStartDate = date7;
                getEndDate = now;
                break;
            case 8:
                //Last year
                const date8 = new Date();
                date8.setFullYear(date8.getFullYear() - 1);
                setSelectedDates({
                    start: date8,
                    end: now
                })
                getStartDate = date8;
                getEndDate = now;
                break;
            case 9:
                //Month to date
                var firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                setSelectedDates({
                    start: firstDay,
                    end: now
                })
                getStartDate = firstDay;
                getEndDate = now;
                break;
            case 10:
                //Quarter to date
                var quarter10 = Math.floor((now.getMonth() + 3) / 3);
                const startQuarter = new Date(now.getFullYear(), quarter10 * 3 - 3, 1);
                setSelectedDates({
                    start: startQuarter,
                    end: now
                })
                getStartDate = startQuarter;
                getEndDate = now;
                break;
            case 11:
                //year to date
                var first = new Date(new Date().getFullYear(), 0, 1);
                setSelectedDates({
                    start: first,
                    end: now
                })
                getStartDate = first;
                getEndDate = now;
                break;
            default:
                setSelectedDates({
                    start: now,
                    end: now
                })
                getStartDate = now;
                getEndDate = now;
                break;
        }

        var strStart = getStartDate.getFullYear() + '-' + (getStartDate.getMonth() < 9 ? '0' + (getStartDate.getMonth() + 1) : getStartDate.getMonth() + 1) + '-' + (getStartDate.getDate() < 10 ? '0' + getStartDate.getDate() : getStartDate.getDate());
        var strEnd = getEndDate.getFullYear() + '-' + (getEndDate.getMonth() < 9 ? '0' + (getEndDate.getMonth() + 1) : getEndDate.getMonth() + 1) + '-' + (getEndDate.getDate() < 10 ? '0' + getEndDate.getDate() : getEndDate.getDate());
        console.log(strStart)
        console.log(strEnd)
        dispatch(setListReport({
            ...reportState,
            DateRange: {
                ...reportState.DateRange,
                SelectedTypeRange: e,
                StartDate: strStart,
                EndDate: strEnd,
                StartDateStr: getStartDate.toLocaleDateString("en-US", optionsDate),
                EndDateStr: getEndDate.toLocaleDateString("en-US", optionsDate)
            }
        }))
        setDate({ month: getEndDate.getMonth(), year: getEndDate.getFullYear() })
        window.sessionStorage.setItem('report_selected_type_range', e.value);
        window.sessionStorage.setItem('report_selected_type_range_label', e.label);
    }
    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        var strStart = selectedDates.start.getFullYear() + '-' + (selectedDates.start.getMonth() < 9 ? '0' + (selectedDates.start.getMonth() + 1) : selectedDates.start.getMonth() + 1) + '-' + (selectedDates.start.getDate() < 10 ? '0' + selectedDates.start.getDate() : selectedDates.start.getDate());
        var strEnd = selectedDates.end.getFullYear() + '-' + (selectedDates.end.getMonth() < 9 ? '0' + (selectedDates.end.getMonth() + 1) : selectedDates.end.getMonth() + 1) + '-' + (selectedDates.end.getDate() < 10 ? '0' + selectedDates.end.getDate() : selectedDates.end.getDate());
        axios.get(config.rootLink + '/FrontEnd/GetReports', {
            params: {
                shop: config.shop,
                startDate: strStart,
                endDate: strEnd,
                page: event.selected + 1,
                pagezise: 10,
                token: config.token,
                // pagezise: 10
            }
        })
            .then(function (response) {
                const result = response?.data;
                dispatch(setListReport({
                    ...reportState,
                    Paginate: {
                        ...reportState.Paginate,
                        CurrentItems: result.list,
                        TotalPage: result.totalpage
                    },
                    TotalReport: result.totalitem
                }))
            })
            .catch(function (error) {
                const errorMsg = error.message;
                console.log(errorMsg);
            })
    };

    return (

        <>
            <div className='control-input-date-range'>
                <div className='input-display w30pt'>
                    <div className='input-calendar' onClick={() => {
                        dispatch(setListReport({
                            ...reportState,
                            IsOpenDateRange: true
                        }))
                    }}>
                        <TextField
                            disabled={true}
                            value={reportState.DateRange.StartDateStr + ' - ' + reportState.DateRange.EndDateStr}
                            type="text"
                        />
                        <span className='calendar'><Icon
                            source={CalendarMajor}
                            color="base" /></span>
                    </div>
                </div>
                {
                    reportState.IsOpenDateRange ? <>
                        <div className='date-range'>
                            <Card>
                                <Card.Section>
                                    <Select
                                        label="Date Range"
                                        defaultValue={moreAppConfig.DateRangeType[0]}
                                        options={moreAppConfig.DateRangeType}
                                        onChange={(e) => {
                                            handleChangeDateRangeOption(e);

                                        }}
                                        value={reportState.DateRange.SelectedTypeRange}
                                        isSearchable={false}
                                    // selected={reportState.DateRange.SelectedTypeRange}
                                    />
                                    <div className='start-end-date'>
                                        <div className='item-date'>
                                            <TextField
                                                label='Start date'
                                                value={reportState.DateRange.StartDate}
                                                type="date"
                                                onChange={(e) => {
                                                    var getStartDate = new Date(Date.parse(e));
                                                    var strStart = getStartDate.toLocaleDateString("en-US", optionsDate);
                                                    dispatch(setListReport({
                                                        ...reportState,
                                                        DateRange: {
                                                            ...reportState.DateRange,
                                                            StartDate: e,
                                                            StartDateStr: strStart
                                                        }
                                                    }))
                                                    setSelectedDates({
                                                        start: getStartDate,
                                                        end: new Date(Date.parse(reportState.DateRange.EndDate)),
                                                    })
                                                }}
                                            />
                                        </div>
                                        <div className='item-date'>
                                            <TextField
                                                label='End date'
                                                value={reportState.DateRange.EndDate}
                                                type="date"
                                                onChange={(e) => {
                                                    var getEndDate = new Date(Date.parse(e));
                                                    var strEnd = getEndDate.toLocaleDateString("en-US", optionsDate);
                                                    dispatch(setListReport({
                                                        ...reportState,
                                                        DateRange: {
                                                            ...reportState.DateRange,
                                                            EndDate: e,
                                                            EndDateStr: strEnd
                                                        }
                                                    }))
                                                    setSelectedDates({
                                                        start: new Date(Date.parse(reportState.DateRange.StartDate)),
                                                        end: getEndDate,
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='cb'>

                                    </div>
                                    <DatePicker
                                        month={month}
                                        year={year}
                                        onChange={(e) => {
                                            handleChangeSetDate(e);
                                        }}
                                        onMonthChange={handleMonthChange}
                                        selected={selectedDates}
                                        multiMonth
                                        allowRange
                                    />
                                    <div className='mt-10'>

                                    </div>
                                    <PageActions
                                        primaryAction={{
                                            content: 'Apply',
                                            onAction: () => {
                                                dispatch(setListReport({
                                                    ...reportState,
                                                    IsOpenDateRange: false
                                                }))
                                                window.sessionStorage.setItem('startdate_report', selectedDates.start);
                                                window.sessionStorage.setItem('enddate_report', selectedDates.end);
                                                var strStart = selectedDates.start.getFullYear() + '-' + (selectedDates.start.getMonth() < 9 ? '0' + (selectedDates.start.getMonth() + 1) : selectedDates.start.getMonth() + 1) + '-' + (selectedDates.start.getDate() < 10 ? '0' + selectedDates.start.getDate() : selectedDates.start.getDate());
                                                var strEnd = selectedDates.end.getFullYear() + '-' + (selectedDates.end.getMonth() < 9 ? '0' + (selectedDates.end.getMonth() + 1) : selectedDates.end.getMonth() + 1) + '-' + (selectedDates.end.getDate() < 10 ? '0' + selectedDates.end.getDate() : selectedDates.end.getDate());
                                                dispatch(fetchList(strStart, strEnd))
                                            }
                                        }}
                                        secondaryActions={[
                                            {
                                                content: 'Cancel',
                                                onAction: () => {
                                                    dispatch(setListReport({
                                                        ...reportState,
                                                        IsOpenDateRange: false
                                                    }))
                                                }
                                            },
                                        ]}
                                    />
                                </Card.Section>
                            </Card>

                        </div>
                    </> : null
                }
            </div>
            {
                reportState.IsLoadingPage ? <Loading></Loading> :
                    <>
                        <div className='campaign-products' style={{ margin: '10px 0' }}>
                            <div className='campaign-products-list'>
                                <div className=''>

                                </div>
                                <p style={{ margin: '10px 0' }}>Total : {reportState.TotalReport != undefined && reportState.TotalReport != null ? reportState.TotalReport : 0} campaigns</p>

                                <div className='campaign-product-list-content'>
                                    <Card>
                                        <div className='table-order item-center'>
                                            <DataTable
                                                columnContentTypes={[
                                                    'number',
                                                    'text',
                                                    'number',
                                                    'number',
                                                    'number',
                                                    'number',
                                                    '',
                                                ]}
                                                headings={[
                                                    'ID',
                                                    'Campaign title',
                                                    'Total discount',
                                                    'Total order value',
                                                    'View product page',
                                                    'View cart',
                                                    'Orders',
                                                ]}
                                                // footerContent={`Showing ${currentItems.length} of ${reportState..length} results`}
                                                rows={reportState.Paginate.CurrentItems != null && reportState.Paginate.CurrentItems.length > 0 ? reportState.Paginate.CurrentItems.map((report, index) => {
                                                    return [
                                                        report.CampaignID,
                                                        report.Title,
                                                        (report.TotalDiscount).toString() + ' ' + reportState.Currency,
                                                        (report.TotalPrice).toString() + ' ' + reportState.Currency,
                                                        report.ViewProduct,
                                                        report.ViewCart,
                                                        <>
                                                            <div className='group-button-merge'>
                                                                {report.TotalOrder}
                                                                <Button
                                                                    onClick={() => {
                                                                        dispatch(setListReport({
                                                                            ...reportState,
                                                                            IsLoadingSpinner: true
                                                                        }))
                                                                        var strStart = selectedDates.start.getFullYear() + '-' + (selectedDates.start.getMonth() < 9 ? '0' + (selectedDates.start.getMonth() + 1) : selectedDates.start.getMonth() + 1) + '-' + (selectedDates.start.getDate() < 10 ? '0' + selectedDates.start.getDate() : selectedDates.start.getDate());
                                                                        var strEnd = selectedDates.end.getFullYear() + '-' + (selectedDates.end.getMonth() < 9 ? '0' + (selectedDates.end.getMonth() + 1) : selectedDates.end.getMonth() + 1) + '-' + (selectedDates.end.getDate() < 10 ? '0' + selectedDates.end.getDate() : selectedDates.end.getDate());
                                                                        dispatch(reportDetail(report.CampaignID, strStart, strEnd));
                                                                    }} accessibilityLabel="Detail" >
                                                                    Detail
                                                                    {/* {
                                                                        reportState.IsLoadingSpinner ? <>
                                                                            <Spinner accessibilityLabel="Small spinner example" size="small" />
                                                                        </>
                                                                            : <>Detail</>
                                                                    } */}
                                                                </Button>

                                                            </div>

                                                        </>

                                                    ];
                                                }) : []}
                                            />
                                            {reportState.Paginate.CurrentItems !== undefined && reportState.Paginate.CurrentItems !== null && reportState.Paginate.CurrentItems.length > 0
                                                ? <>

                                                </> : <>
                                                    <div className="Polaris-Card">
                                                        <div className="Polaris-IndexTable">
                                                            <div className="Polaris-IndexTable__EmptySearchResultWrapper">
                                                                <div className="Polaris-Stack Polaris-Stack--vertical Polaris-Stack--alignmentCenter">
                                                                    <div className="Polaris-Stack__Item"><span className="Polaris-TextStyle--variationSubdued"><p>There is no campaign</p></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </div>


                                    </Card>
                                    <p className="time-zone-note">*Timezone is {reportState.TimeZone}, set according to your store’s timezone</p>
                                    {
                                        reportState.Paginate.CurrentItems !== undefined && reportState.Paginate.CurrentItems !== null && reportState.Paginate.CurrentItems.length > 0 ? <>
                                            <div className='paging-area'>
                                                {/* paginate */}
                                                <ReactPaginate
                                                    nextLabel=">"
                                                    onPageChange={handlePageClick}
                                                    pageRangeDisplayed={2}
                                                    marginPagesDisplayed={2}
                                                    pageCount={reportState.Paginate.TotalPage}
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
                    </>
            }
            <>
                <div className='modal-order-detail'>
                    <Modal
                        large
                        open={reportState.IsOpenReportDetail}
                        onClose={() => {
                            dispatch(setListReport({
                                ...reportState,
                                IsOpenReportDetail: false
                            }))
                        }}
                        title="List orders from campaign"
                        secondaryActions={[
                            {
                                content: 'Close',
                                onAction: () => {
                                    dispatch(setListReport({
                                        ...reportState,
                                        IsOpenReportDetail: false
                                    }))
                                },
                            },
                        ]}
                    >
                        <Modal.Section>
                            <>
                                <div className='order-detail item-center'>
                                    <DataTable
                                        columnContentTypes={[
                                            'number',
                                            'text',
                                            'text',
                                            '',
                                            '',
                                        ]}
                                        headings={[
                                            'ID',
                                            'Customer Name',
                                            'Customer Contact',
                                            'Total discount',
                                            'Total price cart',
                                        ]}
                                        // footerContent={`Showing ${currentItems.length} of ${reportState..length} results`}
                                        rows={reportState.ReportDetail != null && reportState.ReportDetail.length > 0 ? reportState.ReportDetail.map((order, index) => {
                                            return [
                                                order.OrderID,
                                                order.CustomerName,
                                                order.CustomerPhone,
                                                (order.TotalDiscount).toString() + ' ' + reportState.Currency,
                                                (order.TotalPrice).toString() + ' ' + reportState.Currency,

                                                // utils.ShopifyMoney(order.TotalDiscount * 100, reportState.FormatMoney),
                                                // utils.ShopifyMoney(order.TotalPrice * 100, reportState.FormatMoney),

                                            ];
                                        }) : []}
                                    />
                                </div>
                            </>
                        </Modal.Section>
                    </Modal>
                </div>
            </>

            {Alert}
        </>

    )
}

export default withRouter(Report);