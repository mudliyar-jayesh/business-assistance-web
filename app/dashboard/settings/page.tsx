"use client";

import { DateRangePicker } from "@/app/ui/date_ui";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { Grid, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { AgingSettings } from "./aging_setting";
import UserPermissions from "./user_permissions";
import MasterPermissions from "./master_permissions";

const Page = () => {
  const gridConfig: GridConfig[] = [
    {
      type: "item",
      children: [],
      view: (
        <CardView className="h-fit" title="Aging Settings">
          <AgingSettings />
        </CardView>
      ),
    },
    {
      type: "item",
      children: [],
      view: (
        <CardView className="max-h-fit h-fit" title="Date Range Setting">
          <DateRangePicker
            onDateChange={(fromDate, toDate) => {
              Cookies.set("fromDate", fromDate ?? "", { expires: 365 });
              Cookies.set("toDate", toDate ?? "", { expires: 365 });
            }}
          />
        </CardView>
      ),
    },
    {
      type: "item",
      children: [],
      view: (
        <CardView className="max-h-fit h-fit" title="User Permissions">
          <UserPermissions />
        </CardView>
      ),
    },
    {
      type: "item",
      children: [],
      view: (
        <CardView className="max-h-fit h-fit" title="Master Permissions">
          <MasterPermissions />
        </CardView>
      ),
    },
  ];
  return (
    <div className="w-full" style={{}}>
      <Grid
        container
        className="bg-gray-200"
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
