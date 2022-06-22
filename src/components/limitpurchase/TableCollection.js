import React, { useEffect, useState, useCallback } from 'react';
import { Modal, TextField } from '@shopify/polaris';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateUpdateLimitPurchase } from '../../state/modules/limitpurchase/actions';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import config from '../../config/config';

function TableCollection(props) {
  const dispatch = useDispatch();
  const appState = useSelector((state) => state.app);
  const createUpdateLimitPurchase = useSelector((state) => state.limitpurchase.CreateUpdateLimitPurchase);
  const [textSearch, setTextSearch] = useState('');
  const [nextPage, setNextPage] = useState(1);
  const [wholeSelected, setWholeSelected] = React.useState(props.ItemSelected || []);
  const [selectedRows, setSelectedRows] = React.useState(props.ItemSelected || []);//props.ItemSelected || 
  const [data, setData] = useState([]);

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
  const handleChangeTextSearch = (e) => {
    setTextSearch(e);
    setNextPage(1)
    axios.get(config.rootLink + '/FrontEnd/GetCollectPaginate', {
      params: {
        search: e,
        shop: config.shop,
        page: 1,
        pagezise: 10,
        token: config.token
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
        token: config.token
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
    if (wholeSelected.length === 0) {
      setWholeSelected(...wholeSelected, state.selectedRows)
    } else {
      var arrWhole = wholeSelected;
      var arrAdd = state.selectedRows.filter(x => !arrWhole.map(p => p.ProductID).includes(x.ProductID));
      if (arrAdd.length > 0) {
        arrWhole = arrWhole.concat(arrAdd);
      }
      setWholeSelected(arrWhole)
    }
  }, []);
  function AddCollectionToInput() {
    dispatch(setCreateUpdateLimitPurchase(
      {
        ...createUpdateLimitPurchase,
        BulkUpdate:
        {
          ...createUpdateLimitPurchase.BulkUpdate,
          ListCollects: selectedRows.length > 0 ? selectedRows : wholeSelected
        },
        IsOpenSaveToolbar: true
      }));
    props.setIsOpenAddSpecificCollectionModal(false);

  }

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
          selectableRowSelected={row => props.ItemSelected != null && props.ItemSelected.length > 0 ? selectedRows.map(p => p.CollectID).indexOf(row.CollectID) >= 0 :  wholeSelected != undefined && wholeSelected.map(p => p.CollectID).indexOf(row.CollectID) >= 0}
        />
      </Modal.Section>
    </Modal>
  )
}

export default TableCollection