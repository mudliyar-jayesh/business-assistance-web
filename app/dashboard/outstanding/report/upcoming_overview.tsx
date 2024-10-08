"use client";
import { DropDown } from "@/app/ui/drop_down";
import { useEffect, useState, useRef } from "react";
import {
  PeriodicTable,
  TableColumn,
  TableSearchKey,
  ApiProps,
} from "@/app/ui/periodic_table/period_table";
import {
  getAsync,
  getSgBizBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { IconButton, Stack, Switch, useTheme } from "@mui/material";
import { convertToDate } from "@/app/services/Local/helper";
import { ApiMultiDropDown } from "@/app/ui/api_multi_select";
import { useSnackbar } from "@/app/ui/snack_bar_provider";

const isDebitType = [
  {
    name: "Receivable",
    value: true,
  },
  {
    name: "Payable",
    value: false,
  },
];

const UpcomingOverview = () => {
  const theme = useTheme();
  const [selectedReportType, setSelectedReportType] = useState<number>(0); // 0 - Party Wise, 1 - Bill Wise
  const [selectedDueType, setSelectedDueType] = useState<number>(0);
  const [deductAdvancePayment, setDeductAdvancePayment] =
    useState<boolean>(false); // Default false

  const [applyRangeFilter, setApplyRangeFilter] = useState<boolean>(true); // Default true

  let selectedGroups = useRef<string[]>([]);
  let selectedParty = useRef<string[]>([]);

  let selectedisDebitType = useRef<boolean>(true);

  const [refresh, triggerRefresh] = useState(false);
  const [refreshGroups, triggerGroupRefresh] = useState(false);
  const [refreshParties, triggerRefrehParties] = useState(false);

  const snackbar = useSnackbar();

  useEffect(() => {
    loadParties("");
    loadGroups();
  }, []);

  const loadParties = async (searchValue: string) => {
    let values = [{ name: "None" }];
    try {
      let url = `${getSgBizBaseUrl()}/os/search/ledgers?searchKey=${searchValue}`;
      let response = await getAsync(url);
      if (response == null || response.Data == null) {
        return [];
      }
      response.Data.map((entry: any) => {
        values.push({
          name: entry.Name,
        });
      });
      triggerRefresh(false);
      return values;
    } catch {
      return [];
    }
  };

  const loadGroups = async () => {
    try {
      let url = `${getSgBizBaseUrl()}/os/get/groups?isDebit=${
        selectedisDebitType.current ?? true
      }`;
      let response = await getAsync(url);
      console.log(JSON.stringify(response));
      if (response == null || response.Data == null) {
        return [];
      }
      let values = response.Data.map((entry: any) => {
        return {
          name: entry,
        };
      });
      triggerRefresh(false);
      return values;
    } catch {
      return [];
    }
  };

  const loadData = async (apiProps: ApiProps) => {
    let url = `${getSgBizBaseUrl()}/upcoming/overview?durationType=Monthly`;

    console.log("load Data", url);
    let groupNames = selectedGroups.current.map((entry: any) => entry.name);
    let partyNames = selectedParty.current.map((entry: any) => entry.name);
    let requestBody = {
      Filter: {
        Batch: {
          Limit: apiProps.limit,
          Offset: apiProps.offset,
          Apply: true,
        },
        SearchKey: apiProps.searchKey,
        SearchText: apiProps.searchText ?? "",
        SortKey: "Name",
        SortOrder: "asc",
      },
      DeductAdvancePayment: deductAdvancePayment,
      IsDebit: selectedisDebitType.current,
      Groups: groupNames ?? [],
      Parties: partyNames ?? [],
    };

    console.log(JSON.stringify(requestBody));

    let res = await postAsync(url, requestBody);
    if (!res || !res.Data) {
      return [];
    }
    console.log(JSON.stringify(res));

    let values = res.Data.map((entry: any, index: number) => {
      let parties: any[] = [];
      if (entry.parties != null && entry.parties.length > 0) {
        parties = entry.parties.map((party: any, idx: number) => {
          let bills: any[] = [];
          if (party["bills"] != null && party["bills"].length > 0) {
            bills = party["bills"].map((bill: any) => {
              return {
                BillNumber: bill.BillNumber,
                BillDate: bill.BillDate,
                DueDate: bill.DueDate,
                Opening:
                  bill.OpeningBalance == null ? 0 : bill.OpeningBalance.Value,
                Closing:
                  bill.ClosingBalance == null ? 0 : bill.ClosingBalance.Value,
              };
            });
          }
          return {
            Party: party.party_name,
            Amount: party.total_amount,
            Bills: bills,
          };
        });
      }

      return {
        id: index + 1,
        Duration: entry.duration_key,
        Amount: entry.total_amount,
        Parties: parties,
      };
    });

    triggerRefresh(false);
    return values;
  };

  const columns: any[] = [
    {
      field: "Parties",
      headerName: "Parties",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      hideable: true,
      mobileFullView: true,
    },
    {
      field: "Duration",
      headerName: "Time Period",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      hideable: false,
      mobileFullView: true,
    },
    {
      field: "Amount",
      headerName: "Total Amount",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 200,
    },
  ];

  const osSearchKeys: TableSearchKey[] = [
    {
      title: "Party Name",
      value: "Party",
    },
    {
      title: "Ledger Group",
      value: "Group",
    },
    {
      title: "Bill Number",
      value: "Bill",
    },
  ];

  // Common sort keys for both Party Wise and Bill Wise
  const osCommonSortKeys: TableSearchKey[] = [
    { title: "Party Name", value: "party-wise" },
    { title: "Ledger Group", value: "group-wise" },
    { title: "Credit Limit", value: "credit-limit-wise" },
    { title: "Credit Period", value: "credit-period-wise" },
    { title: "Opening Amount", value: "opening-wise" },
    { title: "Closing Amount", value: "closing-wise" },
    { title: "Total Bills", value: "bill-count-wise" },
    { title: "Above 30 Days", value: "above-30-wise" },
    { title: "Above 60 Days", value: "above-60-wise" },
    { title: "Above 90 Days", value: "above-90-wise" },
    { title: "Above 120 Days", value: "above-120-wise" },
  ];

  const renderFilterView = () => {
    return (
      <div>
        <Stack flexDirection={"column"} gap={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <span>Deduct Advance Payment</span>
            <Switch
              checked={deductAdvancePayment}
              onChange={(event) => {
                setDeductAdvancePayment(event.target.checked);
                triggerRefresh(!refresh);
              }}
              style={{
                color: theme.palette.primary.dark,
              }}
            />
            <span>Apply Range</span>
            <Switch
              checked={applyRangeFilter}
              onChange={(event) => {
                setApplyRangeFilter(event.target.checked);
                triggerRefresh(!refresh);
              }}
              style={{
                color: theme.palette.primary.dark,
              }}
            />
          </Stack>

          <ApiMultiDropDown
            reload={refreshGroups}
            label="Ledger Group"
            displayFieldKey={"name"}
            defaultSelections={selectedGroups.current}
            valueFieldKey={null}
            onApi={loadGroups}
            helperText={""}
            onSelection={(selection) => {
              selectedGroups.current = selection;
              loadGroups();
              triggerRefresh(!refresh);
            }}
          />

          <ApiMultiDropDown
            reload={refreshParties}
            label="Parties"
            displayFieldKey={"name"}
            defaultSelections={selectedParty.current}
            valueFieldKey={null}
            onApi={loadParties}
            helperText={""}
            onSelection={(selection) => {
              selectedParty.current = selection;
              loadParties("");
              triggerRefresh(!refresh);
            }}
          />
        </Stack>
        <div className="mt-4" />
      </div>
    );
  };

  return (
    <>
      <Stack flexDirection={"column"} gap={2}>
        <DropDown
          label="View"
          displayFieldKey={"name"}
          valueFieldKey={null}
          selectionValues={isDebitType}
          helperText={""}
          onSelection={(selection) => {
            selectedisDebitType.current = selection.value;
            loadGroups().then((_) => {
              triggerRefresh(!refresh);
            });
          }}
        />
      </Stack>
      <div className="mt-4" />
      <PeriodicTable
        pivotKey={"Parties"}
        pivotKey2={"Bills"}
        usePivot={true}
        showSummationRow={true}
        chartKeyFields={[
          {
            label: "Party",
            value: "LedgerName",
          },
          {
            label: "Ledger Group",
            value: "LedgerGroupName",
          },
        ]}
        chartValueFields={[
          {
            label: "Pending Amount",
            value: "Amount",
          },
          {
            label: "Due Amount",
            value: "DueAmount",
          },
          {
            label: "OverDue Amount",
            value: "OverDueAmount",
          },
        ]}
        refreshFilterView={refresh}
        RenderAdditionalView={renderFilterView()}
        useSearch={true}
        searchKeys={osSearchKeys}
        reload={refresh}
        columns={columns.map((col: any) => {
          let column: TableColumn = {
            header: col.headerName,
            field: col.field,
            type: col.type,
            pinned: false,
            hideable: col.hideable,
            showSummation: col.showSummation,
            rows: [],
          };
          return column;
        })}
        onApi={loadData}
        sortKeys={osCommonSortKeys}
        onRowClick={() => {
          // (row)
        }}
        checkBoxSelection={false}
      />
      <IconButton> </IconButton>
    </>
  );
};

export { UpcomingOverview };
