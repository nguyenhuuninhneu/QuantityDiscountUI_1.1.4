import React, { useEffect, useState, useCallback } from 'react';
import { Modal, TextField,Toast } from '@shopify/polaris';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateUpdateCampaign } from '../../state/modules/campaign/actions';
import '../../assets/css/paginate.css';
// import ReactPaginate from 'react-paginate';
import axios from 'axios';
import config from '../../config/config';
import DataTable from 'react-data-table-component';
import InfiniteScroll from "react-infinite-scroll-component";


function TableProduct(props) {
    const dispatch = useDispatch();
    const appState = useSelector((state) => state.app);
    const campaignState = useSelector((state) => state.campaign.CreateUpdateCampaign);
    const campaign = campaignState.campaign;

    const [textSearch, setTextSearch] = useState('');
    const [textLoading, setTextLoading] = useState('');
    const [nextPage, setNextPage] = useState(1);
    const [selectedRows, setSelectedRows] = React.useState([]);//props.ItemSelected ||
    const [data, setData] = useState([]);
    const [isOpenToast, setIsOpenToast] = useState(false);
    const [numberOfSelected, setNumberOfSelected] = useState(0);

    const columns = [
        {
            name: 'Title',
            selector: row => row.Title,
        },
        {
            name: 'Handle',
            selector: row => row.Handle,
        },
    ];



    useEffect(() => {
        setNextPage(1)
        axios.get(config.rootLink + '/FrontEnd/SearchProductPaginate', {
            params: {
                search: textSearch,
                shop: config.shop,
                selectedstr: campaignState.campaign.ListProducts.map(p => p.ProductID).toString(),
                page: 1,
                pagezise: 10,
                token: config.token,

            }
        })
            .then(function (response) {
                const result = response?.data;
                var product = result.products;
                // if (props.ItemSelected != undefined && props.ItemSelected != null && result.products != undefined && result.products != null) {
                //     product = product.filter(p => !props.ItemSelected.map(x => x.ProductID).includes(p.ProductID));
                // }
                setData(product)
                // setTotalPage(result.totalpage);
                if (result.page < result.totalpage) {
                    setNextPage(result.page + 1)
                } else {
                    setNextPage(0)
                }
            })
            .catch(function (error) {
                const errorMsg = error.message;
                console.log(errorMsg);
            })

    }, []);
    const handleChangeTextSearch = (e, arrAdd) => {
        var checkselect = campaignState.campaign.ListProducts;
        if (arrAdd != undefined && arrAdd != null) {
            checkselect = checkselect.concat(arrAdd);
        }
        setTextSearch(e);
        setNextPage(1)
        axios.get(config.rootLink + '/FrontEnd/SearchProductPaginate', {
            params: {
                search: e,
                shop: config.shop,
                selectedstr: checkselect.map(p => p.ProductID).toString(),
                page: 1,
                pagezise: 10,
                token: config.token,
            }
        })
            .then(function (response) {
                const result = response?.data;
                var product = result.products;
                // if (props.ItemSelected != undefined && props.ItemSelected != null && result.products != undefined && result.products != null) {
                //     product = product.filter(p => !props.ItemSelected.map(x => x.ProductID).includes(p.ProductID));
                // }
                setData(product)
                if (result.page < result.totalpage) {
                    setNextPage(result.page + 1)
                } else {
                    setNextPage(0)
                }

            })
            .catch(function (error) {
                const errorMsg = error.message;
                console.log(errorMsg);
            })
    };
    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
        // if (wholeSelected.length === 0) {
        //     setWholeSelected(...wholeSelected, state.selectedRows)
        // } else {
        //     var arrWhole = wholeSelected;
        //     var arrAdd = state.selectedRows.filter(x => !arrWhole.map(p=>p.ProductID).includes(x.ProductID));
        //     if (arrAdd.length > 0) {
        //         arrWhole = arrWhole.concat(arrAdd);
        //     }
        //     setWholeSelected(arrWhole)
        // }

    }, []);
    function AddProductToInput() {
        var arrAdd = props.ItemSelected.concat(selectedRows);
        // var newData = [];
        // newData = data.filter(p => !selectedRows.map(x => x.ProductID).includes(p.ProductID));
        // setData(newData);
        setIsOpenToast(true);
        setNumberOfSelected(selectedRows.length);
        setSelectedRows([]);
        dispatch(setCreateUpdateCampaign(
            {
                ...campaignState,
                campaign:
                {
                    ...campaign,
                    ListProducts: arrAdd
                },
                IsOpenSaveToolbar: true,
            }));
        handleChangeTextSearch('', selectedRows);
    }
    // Invoke when user click to request another page.
    // const handlePageClick = (event) => {
    //     axios.get(config.rootLink + '/FrontEnd/SearchProductPaginate', {
    //         params: {
    //             search: textSearch,
    //             shopID: appState.Shop?.ID,
    //             page: event.selected + 1,
    //             pagezise: 100
    //         }
    //     })
    //         .then(function (response) {
    //             const result = response?.data;
    //             setData(result.products)
    //         })
    //         .catch(function (error) {
    //             const errorMsg = error.message;
    //             console.log(errorMsg);
    //         })
    // };
    const fetchMoreData = () => {
        if (nextPage !== 0) {
            setTextLoading(<><h4 style={{ textAlign: 'center', padding: '10px 0' }}>Loading...</h4></>);
            axios.get(config.rootLink + '/FrontEnd/SearchProductPaginate', {
                params: {
                    search: textSearch,
                    shop: config.shop,
                    selectedstr: campaignState.campaign.ListProducts.map(p => p.ProductID).toString(),
                    page: nextPage,
                    pagezise: 10,
                    token: config.token,
                }
            })
                .then(function (response) {
                    const result = response?.data;
                    var product = result.products;
                    // if (props.ItemSelected != undefined && props.ItemSelected != null && result.products != undefined && result.products != null) {
                    //     product = product.filter(p => !props.ItemSelected.map(x => x.ProductID).includes(p.ProductID));
                    // }
                    var newArr = data.concat(product);
                    setData(newArr)
                    if (result.page < result.totalpage) {
                        setNextPage(result.page + 1)
                    } else {
                        setNextPage(0)
                    }
                    setTextLoading('');
                })
                .catch(function (error) {
                    const errorMsg = error.message;
                    console.log(errorMsg);
                })
        }

    };
    return (


        <Modal
            open={props.IsOpenAdSpecificProductModal}
            onClose={() => { props.setIsOpenAddSpecificProductModal(false) }}
            title="Choose product"
            primaryAction={{
                content: 'Add',
                onAction: () => {
                    AddProductToInput()
                },
            }}
            secondaryActions={[
                {
                    content: 'Close',
                    onAction: () => { props.setIsOpenAddSpecificProductModal(false) },
                },
            ]}
        >
            <div className="bound-infinitive">
                <InfiniteScroll
                    dataLength={data.length}
                    next={fetchMoreData}
                    hasMore={true}
                    // loader={textLoading}
                    height={420}

                    marginTop={10}
                >
                    <Modal.Section>

                        <div className='search-sticky'>
                            <TextField
                                value={textSearch}
                                onChange={(e) => {
                                    handleChangeTextSearch(e)
                                }}
                                type="text"
                                placeholder='Search Product'
                            />
                            <div className="selected-item">
                                {selectedRows.length} product selected
                            </div>
                            <div className="shadow">
                            </div>
                        </div>

                        <DataTable
                            columns={columns}
                            data={data}
                            selectableRows
                            onSelectedRowsChange={handleRowSelected}
                        selectableRowSelected={row => selectedRows != undefined && selectedRows.map(p => p.ProductID).indexOf(row.ProductID) >= 0}
                        />

                        {/* {
data !== undefined && data !== null && data.length > 0 ? <>
<div className='paging-area'>
<ReactPaginate
nextLabel=">"
onPageChange={handlePageClick}
pageRangeDisplayed={2}
marginPagesDisplayed={2}
pageCount={TotalPage}
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
} */}

                    </Modal.Section>

                </InfiniteScroll>
            </div>
            {isOpenToast ? <Toast content={"Add " + numberOfSelected + " product is successfully."} duration={2400} onDismiss={() => {
                setIsOpenToast(false);
            }} /> : null}
        </Modal>
    )
}

export default TableProduct