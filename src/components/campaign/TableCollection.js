import React, { useEffect, useState, useCallback } from 'react';
import { Modal, TextField, Toast } from '@shopify/polaris';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateUpdateCampaign } from '../../state/modules/campaign/actions';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import config from '../../config/config';
import InfiniteScroll from "react-infinite-scroll-component";

function TableCollection(props) {
  const dispatch = useDispatch();
  const campaignState = useSelector((state) => state.campaign.CreateUpdateCampaign);
  const campaign = campaignState.campaign;
  const appState = useSelector((state) => state.app);
  const [textSearch, setTextSearch] = useState('');
  const [nextPage, setNextPage] = useState(1);
  const [textLoading, setTextLoading] = useState('');
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
  const handleChangeTextSearch = (e, arrAdd) => {
    var checkselect = campaignState.campaign.ListCollects;
    if (arrAdd != undefined && arrAdd != null) {
      checkselect = checkselect.concat(arrAdd);
    }
    setTextSearch(e);
    setNextPage(1)
    axios.get(config.rootLink + '/FrontEnd/GetCollectPaginate', {
      params: {
        search: e,
        shop: config.shop,
        selectedstr: checkselect.map(p => p.CollectID).toString(),
        page: 1,
        pagezise: 10,
        token: config.token,

      }
    })
      .then(function (response) {
        const result = response?.data;
        setData(result.collects)
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


  useEffect(() => {
    setNextPage(1)
    axios.get(config.rootLink + '/FrontEnd/GetCollectPaginate', {
      params: {
        search: textSearch,
        shop: config.shop,
        page: 1,
        pagezise: 10,
        selectedstr: campaignState.campaign.ListCollects.map(p => p.CollectID).toString(),
        token: config.token,

      }
    })
      .then(function (response) {
        const result = response?.data;
        setData(result.collects)
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
  const handleRowSelected = React.useCallback(state => {
    setSelectedRows(state.selectedRows);
    // setSelectedRows(state.selectedRows);
    // if (wholeSelected.length === 0) {
    //   setWholeSelected(...wholeSelected, state.selectedRows)
    // } else {
    //   var arrWhole = wholeSelected;
    //   var arrAdd = state.selectedRows.filter(x => !arrWhole.map(p => p.ProductID).includes(x.ProductID));
    //   if (arrAdd.length > 0) {
    //     arrWhole = arrWhole.concat(arrAdd);
    //   }
    //   setWholeSelected(arrWhole)
    // }
  }, []);
  function AddCollectionToInput() {
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
          ListCollects: arrAdd
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
      axios.get(config.rootLink + '/FrontEnd/GetCollectPaginate', {
        params: {
          search: textSearch,
          shop: config.shop,
          selectedstr: campaignState.campaign.ListCollects.map(p => p.CollectID).toString(),
          page: nextPage,
          pagezise: 10,
          token: config.token,
        }
      })
        .then(function (response) {
          const result = response?.data;
          var collects = result.collects;
          // if (props.ItemSelected != undefined && props.ItemSelected != null && result.products != undefined && result.products != null) {
          //     product = product.filter(p => !props.ItemSelected.map(x => x.ProductID).includes(p.ProductID));
          // }
          var newArr = data.concat(collects);
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
      open={props.IsOpenAdSpecificCollectionModal}
      onClose={() => { props.setIsOpenAddSpecificCollectionModal(false) }}
      title="Choose collect"
      primaryAction={{
        content: 'Done',
        onAction: () => {
          AddCollectionToInput()
        },
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: () => { props.setIsOpenAddSpecificCollectionModal(false) },
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
                placeholder='Search Collection'
              />
              <div className="selected-item">
                {selectedRows.length} collection selected
              </div>

            </div>
            <DataTable
              columns={columns}
              data={data}
              selectableRows
              onSelectedRowsChange={handleRowSelected}
              selectableRowSelected={row => selectedRows != undefined && selectedRows.map(p => p.CollectID).indexOf(row.CollectID) >= 0}
            />
          </Modal.Section>
        </InfiniteScroll>
      </div>
      {isOpenToast ? <Toast content={"Add " + numberOfSelected + " collect is successfully."} duration={2400} onDismiss={() => {
        setIsOpenToast(false);
      }} /> : null}
    </Modal>

  )
}

export default TableCollection