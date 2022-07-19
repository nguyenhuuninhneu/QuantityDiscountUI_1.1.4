const moreAppConfig = {
    plans: ['0', '5.99', '7.99', '63.99', '85.99'],
    discounttype: [
        { label: 'Minimum Cart Quantity', value: 1 },
        { label: 'Minimum Same Product Quantity', value: 2 },
        { label: 'Minimum Same Variant Quantity', value: 3 }
    ],
    pricetype: [
        { label: 'Percent discount', value: 1 },
        { label: 'Price discount', value: 2 },
        { label: 'Fixed price per item', value: 3 }
    ],
    ItemPerPage: 10,
    Menu: {
        DASHBOARD: 1,
        REPORT: 2,
        CREATECAMPAIGN: 3,
        MANAGECAMPAIGN: 4,
        LIMITPURCHASECAMPAIGN: 5,
        PLAN: 6,
        SETTING: 7,
        LIMITORDER: 8,
    },
    DateRangeType:[
        { label: 'Today', value: 1 },
        { label: 'Yesterday', value: 2 },
        { label: 'Last 7 days', value: 3 },
        { label: 'Last 30 days', value: 4 },
        { label: 'Last 90 days', value: 5 },
        { label: 'Last quarter', value: 6 },
        { label: 'Last month', value: 7 },
        { label: 'Last year', value: 8 },
        { label: 'Month to date', value: 9 },
        { label: 'Quater to date', value: 10 },
        { label: 'Year to date', value: 11 },
    ],
    TilteValidationText: 'Title is required.',
    DescriptionValidationText: 'Description is required.',
    EndTimeGreateThanStartTimeValidationText: 'End date must be greater than start date.',
    MinValidationText: 'Min is required.',
    MaxValidationText: 'Max is required.',
    VariantValidationText: 'Please select at least one variant.',
    MaxGreateThanMinValidationText: 'Max limit must be greater than min.',
    LimitPurchaseCollectValidationText: 'Collection is required.',
    PlanNumber: {
        Free: 2,
        Basic: 0,
        Advanced: 1
    },
     KeyExpandMenu: {
        Dashboard: 'dashboard',
        DiscountCampaign: 'discountcampaign',
        LimitPurchase: 'limitpurchase'
    },
    ExpandMenu: ',discountcampaign,',
    LimitTypeMin: [
        { label: 'Limit quantity', value: 0 },
        { label: 'Limit value purchase', value: 1 },
    ],
    LimitTypeMax: [
        { label: 'Limit quantity', value: 0 },
        { label: 'Limit value purchase', value: 1 },
    ],
    CollectNameValidationText:'Collection name is required.',
    BulkAction: {
        SetLimitPurchase : 0,
        DisabledSelected: 1,
        EnabledSelected: 2,
        DeleteAllSelected: 3
    },
    TargetType : {
        "line_item":"Line item",
        "shipping_line":"Shipping fee",
    }
}
export default moreAppConfig;
