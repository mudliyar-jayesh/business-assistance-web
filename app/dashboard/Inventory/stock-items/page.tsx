"use client";

import { numericToString } from "@/app/services/Local/helper";
import { DataTable } from "@/app/ui/data_grid";
import { CardView, DynGrid, Weight, GridDirection } from "@/app/ui/responsive_grid";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const Page = () => {

    const [refresh, setRefresh] = useState(false);

    const loadData = async (offset: number, limit: number, search?: string) => {
        let url = "http://118.139.167.125:45700/stock-items/get/report";
            let requestBody = {
            "Limit": limit,
            "Offset": offset,
            "SearchText": search,
            "StockGroups": [],
        }
        let appHeaders = {
            "Content-Type": "application/json; charset=utf-8",
            "CompanyId": Cookies.get("companyId") ?? 1,
        };
        let res = await axios.post(url, requestBody, { headers: appHeaders })
        let values = res.data.map((entry: any, index: number) => {
            return {
                id: index + 1,
                Quantity: entry.ClosingBal != null ? entry.ClosingBal.Number : 0,
                Amount: entry.ClosingValue != null ? entry.ClosingValue.Amount : 0,
                Rate: entry.ClosingRate != null ? entry.ClosingRate.RatePerUnit : 0,
                ...entry

            };
        });
        return values
    }


    const columns: GridColDef<any[number]>[] = [
        {
            field: "Name",
            headerName: "Item",
            editable: false,
            sortable: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "StockGroup",
            headerName: "Parent",
            editable: false,
            sortable: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "BaseUnit",
            headerName: "Base Unit",
            editable: false,
            sortable: true,
            flex: 1,
        },
        {
            field: "Quantity",
            headerName: "Quantity",
            editable: false,
            sortable: true,
            flex: 1,
        },
        {
            field: "Amount",
            headerName: "Value",
            editable: false,
            sortable: true,
            type: "number",
            flex: 1,
            minWidth: 150,
        },
    ];

    const gridConfig = [
        {
            weight: Weight.High,
            view: (
                <CardView title="Parties">
                <DataTable
                columns={columns}
                refresh={refresh}
                useSearch={true}
                onApi={async (page, pageSize, searchText) => {
                    return await loadData(page, pageSize, searchText);
                }}
                onRowClick={(params) => {
                }}
                />
                </CardView>
            ),
        },
    ]

    return (
        <div className="w-full">
        <DynGrid views={gridConfig} direction={GridDirection.Column}/>
        </div>
    );
}

export default Page;
