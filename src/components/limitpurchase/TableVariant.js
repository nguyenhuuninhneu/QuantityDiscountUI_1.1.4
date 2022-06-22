import React, { useEffect, useState, useCallback } from 'react';
import { Modal, TextField } from '@shopify/polaris';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateUpdateLimitPurchase } from '../../state/modules/limitpurchase/actions';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import config from '../../config/config';

function TableVariant(props) {
  const dispatch = useDispatch();
  const [profileState, setProfileState] = useState(props);

  const createUpdateLimitPurchaseVariant = useSelector((state) => state.limitpurchase.CreateUpdateLimitPurchase);
  const [wholeSelected, setWholeSelected] = React.useState(profileState.ItemSelected || []);
  const [selectedRows, setSelectedRows] = React.useState(profileState.ItemSelected || []);//props.ItemSelected || 
  const [data, setData] = useState([]);
  console.log(profileState, props);
  const customStyles = {
    rows: {
      style: {
        minHeight: '72px', // override the row height
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',
      },
    },
  };
  
  useEffect(() => {
    setProfileState(props);
    // setData(profileState.ListVariant);

  }, [props]);
  const columns = [
    {
      name: 'Variants',
      selector: row => row.VariantName,
    },
    {
      name: 'Min limit purchase',
      cell: row => (

        <TextField
          disabled={ createUpdateLimitPurchaseVariant.limitpurchase.ListVariant.filter(p => p.VariantID == row.VariantID)[0].IsDisabled}
          value={ createUpdateLimitPurchaseVariant.limitpurchase.ListVariant.filter(p => p.VariantID == row.VariantID)[0].Min.toString()}
          onChange={(e) => {
            profileState.setMinVariant(e, row.VariantID);
          }}
          error={ createUpdateLimitPurchaseVariant.limitpurchase.ListVariant.filter(p => p.VariantID == row.VariantID)[0].MinValidation }
          type="number"
        />
      ),
    },
    {
      name: 'Max limit purchase',
      cell: row => (
        <TextField
          value={ createUpdateLimitPurchaseVariant.limitpurchase.ListVariant.filter(p => p.VariantID == row.VariantID)[0].Max.toString()}
          disabled={ createUpdateLimitPurchaseVariant.limitpurchase.ListVariant.filter(p => p.VariantID == row.VariantID)[0].IsDisabled }
          onChange={(e) => {
            profileState.setMaxVariant(e, row.VariantID);
          }}
          error={ createUpdateLimitPurchaseVariant.limitpurchase.ListVariant.filter(p => p.VariantID == row.VariantID)[0].MaxValidation }
          type="number"
        />
      )
    },
  ];
  const handleRowSelected = React.useCallback(state => {
    setSelectedRows(state.selectedRows);
    if (wholeSelected.length === 0) {
      setWholeSelected(...wholeSelected, state.selectedRows)
      profileState.setVariant(...wholeSelected, state.selectedRows);

    } else {
      var arrWhole = wholeSelected;
      var arrAdd = state.selectedRows.filter(x => !arrWhole.map(p => p.VariantID).includes(x.VariantID));
      if (arrAdd.length > 0) {
        arrWhole = arrWhole.concat(arrAdd);
      }
      setWholeSelected(arrWhole);
      profileState.setVariant(arrWhole);

    }
  }, []);

  return (
    <DataTable
      columns={columns}
      data={data}
      selectableRows
      onSelectedRowsChange={handleRowSelected}
      customStyles={customStyles}
      selectableRowSelected={row => profileState.ItemSelected != null && profileState.ItemSelected.length > 0 ? selectedRows.map(p => p.VariantID).indexOf(row.VariantID) >= 0 : wholeSelected != undefined && wholeSelected.map(p => p.VariantID).indexOf(row.VariantID) >= 0}
    />
  )
}

export default TableVariant