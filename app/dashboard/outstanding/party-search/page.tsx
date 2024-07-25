"use client";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { ChevronLeftRounded } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Page = () => {
  const router = useRouter();

  const filterValue = localStorage.getItem("party_filter_value");
  const viewType = localStorage.getItem("party_view_type");
  const billType = localStorage.getItem("party_bill_type");
  const filterType = localStorage.getItem("party_filter_type") || null;

  const [rows, setRows] = useState([]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    onApi(paginationModel);
  }, []);

  const onApi = async ({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }) => {
    let collectionUrl = `${getBmrmBaseUrl()}/bill/get/upcoming-bills?groupType=${billType}&durationType=${filterType}&durationKey=${filterValue}`;
    let agingUrl = `${getBmrmBaseUrl()}/bill/get/aging-bills?agingCode=${filterValue}&groupType=${billType}`;
    let totalOutstandingUrl = `${getBmrmBaseUrl()}/bill/get/all-party-bills?groupType=${billType}`;

    let url = totalOutstandingUrl;
    if (viewType === "upcoming") {
      url = collectionUrl;
    } else if (viewType === "aging") {
      url = agingUrl;
    }

    let requestBody = {
      page_number: page + 1,
      page_size: pageSize,
      search_text: "",
      sort_by: "name",
      sort_order: "asc",
    };
    let response = await postAsync(url, requestBody);
    let entries = response.map((entry: any, index: number) => {
      return {
        id: index + 1,
        partyName: entry.name,
        amount: entry.totalAmount,
        billCount: entry.billCount,
        currency: entry.currency ?? "₹",
      };
    });
    setRows(entries);
    return entries;
  };
  const columns: GridColDef<any[number]>[] = [
    {
      field: "partyName",
      headerName: "Name",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
    {
      field: "amount",
      headerName: "Value",
      editable: false,
      sortable: true,
      minWidth: 100,
      maxWidth: 400,
      valueGetter: (value, row) => `${row.currency || ""} ${row.amount || "0"}`,
    },
    {
      field: "billCount",
      headerName: "Total Bills",
      editable: false,
      sortable: true,
      minWidth: 50,
      maxWidth: 400,
    },
  ];

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      view: (
        <CardView className="">
          <div className="flex flex-row items-center">
            <IconButton
              onClick={() => {
                router.back();
              }}
            >
              <ChevronLeftRounded />
            </IconButton>
            <Typography>Go Back</Typography>
          </div>
          <br />
          <Typography className="text-xl">Party Search</Typography>
          <Typography className="text-2xl">
            {viewType === "upcoming"
              ? `View based on filter:  ${filterType}`
              : viewType == "aging"
              ? `Aging-wise outstanding values`
              : `All parties outstanding values`}
          </Typography>
          <br />
          <br />
          <Container className="overflow-x-auto flex">
            <PieChart
              width={300}
              height={300}
              margin={{top: 100, left: 100, bottom: 100, right: 100,}}
              sx={{
                flex: 1,
                borderWidth: 2,
                borderRadius: 4,
                marginBottom: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
              slotProps={{
                legend: {
                  hidden: true,
                  position: {
                    horizontal: "right",
                    vertical: "bottom",
                  },
                },
              }}
              series={[
                {
                  data: rows.map((entry: any) => {
                    return {
                      label: entry.partyName,
                      value: entry.amount,
                    };
                  }),
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                  startAngle: 0,
                  endAngle: 360,
                  // cx: 150,
                  // cy: 150,
                },
              ]}
            />
          </Container>
        </CardView>
      ),
      className: "",
      children: [],
    },
    {
      type: "item",
      view: (
        <CardView>
          <DataGrid
            columns={columns}
            rows={rows}
            rowCount={rows.length * 100}
            paginationMode="server"
            pagination
            paginationModel={paginationModel}
            initialState={{
              pagination: {
                paginationModel: paginationModel,
              },
            }}
            pageSizeOptions={[5, 10, 25, 50, 75, 100]}
            onRowClick={(params) => {
              localStorage.setItem("party_filter_value", filterValue || "");
              localStorage.setItem("party_view_type", viewType || "");
              localStorage.setItem("party_bill_type", billType || "");
              localStorage.setItem("party_filter_type", filterType || "");
              localStorage.setItem("bill_party_name", params.row.partyName);
              router.push("/dashboard/outstanding/bill-detail");
            }}
            disableRowSelectionOnClick
            onPaginationModelChange={(value) => {
              setPaginationModel(value);
              onApi(value);
            }}
          />
        </CardView>
      ),
      className: "",
      children: [],
    },
  ];

  return (
    <div
      className="w-full"
      style={{
      }}
    >
      <Grid
        container
        sx={{
          flexGrow: 1,
          height: "100vh",
        }}
      >
        {RenderGrid(gridConfig)}
      </Grid>
    </div>
  );
};

export default Page;
