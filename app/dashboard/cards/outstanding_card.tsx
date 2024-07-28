"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  IconButton,
  Grid,
  Box,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { useRouter } from "next/navigation";

interface OutstandingData {
  payableTitle: string;
  receivableTitle: string;
  payableAmount: number;
  receivableAmount: number;
  currency: string;
}

const OutstandingCard = () => {
  const router = useRouter();

  const [data, setData] = useState<OutstandingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOutstandingData();
  }, []);

  const fetchOutstandingData = async () => {
    try {
      setIsLoading(true);
      let url = `${getBmrmBaseUrl()}/bill/get/outstanding-overview`;
      const response = await getAsync(url);

      if (response === null || response.length < 2) {
        throw new Error("Invalid response data");
      }

      setData({
        payableTitle: response[0].name || "Payable",
        receivableTitle: response[1].name || "Receivable",
        payableAmount: response[0].closingBal,
        receivableAmount: response[1].closingBal,
        currency: response.currency || "₹",
      });
    } catch (error) {
      console.error("Error fetching outstanding data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const AmountDisplay = ({
    title,
    amount,
  }: {
    title: string;
    amount: number;
  }) => (
    <div>
      <Typography variant="subtitle2" className="text-gray-600">
        {title}
      </Typography>
      <Typography variant="h6" className="font-bold">
        {data?.currency}
        {amount.toLocaleString()}
      </Typography>
    </div>
  );

  const handleCardClick = () => {
    router.push("/dashboard/outstanding");
  };

  return (
    <div>
      {isLoading ? (
        <CardContent className="flex justify-center items-center h-40">
          <CircularProgress />
        </CardContent>
      ) : (
        <Box onClick={handleCardClick} sx={{ cursor: "pointer" }}>
          <CardContent className="p-0">
            <Typography variant="h6" className="text-gray-800 mb-4">
              Outstanding Overview
            </Typography>
            <Grid container spacing={2} className="mb-1">
              <Grid item xs={6}>
                <AmountDisplay
                  title={data?.payableTitle || "Payable"}
                  amount={data?.payableAmount || 0}
                />
              </Grid>
              <Grid item xs={6}>
                <AmountDisplay
                  title={data?.receivableTitle || "Receivable"}
                  amount={data?.receivableAmount || 0}
                />
              </Grid>
            </Grid>
            <div className="flex justify-end">
              <IconButton size="small">
                <ChevronRight />
              </IconButton>
            </div>
          </CardContent>
        </Box>
      )}
    </div>
  );
};

export { OutstandingCard };
