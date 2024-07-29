"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import { postAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { numericToString } from "@/app/services/Local/helper";
import { useRouter } from "next/navigation";

interface Task {
  partyName: string;
  amount: number;
  currency: string;
}

const OutstandingTask = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [durationKey] = useState(dayjs().format("YYYY-MM-DD"));

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const url = `${getBmrmBaseUrl()}/bill/get/upcoming-bills?groupType=receivable&durationType=daily&durationKey=${durationKey}`;
      const requestBody = {
        page_number: 1,
        page_size: 2,
        search_text: "",
        sort_by: "name",
        sort_order: "asc",
      };

      const response = await postAsync(url, requestBody);
      const entries = response.slice(0, 2).map((entry: any) => ({
        partyName: entry.name,
        amount: entry.totalAmount,
        currency: entry.currency ?? "₹",
      }));

      setTasks(entries);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTask = (entry: Task, index: number) => (
    <Box key={index} className="mb-4 overflow-hidden">
      <div className="flex">
        <Typography variant="h6" className="font-medium truncate">
          {entry.partyName}
        </Typography>
        <div className="flex items-center mt-2">
          <Typography variant="subtitle1" className="font-bold text-orange-500">
            {`${entry.currency} ${numericToString(entry.amount)}`}
          </Typography>
          <Typography variant="caption" className="ml-2">
            Pending
          </Typography>
        </div>
      </div>
    </Box>
  );

  return (
    <Box>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h6" className="font-semibold">
              {" Outstanding Today's Task"}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              className="w-24"
              onClick={() => {
                localStorage.setItem("party_filter_value", durationKey);
                localStorage.setItem("party_view_type", "upcoming");
                localStorage.setItem("party_bill_type", "receivable");
                localStorage.setItem("party_filter_type", "daily");
                router.push("/dashboard/outstanding/party-search");
              }}
            >
              View More
            </Button>
          </div>
          {tasks.map(renderTask)}
        </div>
      )}
    </Box>
  );
};

export { OutstandingTask };
