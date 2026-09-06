import React, { memo, useReducer, useEffect } from "react";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";

import { FilterWrapper } from "TheOdcMfUI/sharedComp";

import { dropDownOptions } from "../../../constant";

function FilterModal({ filters, setFilters }) {
  const [localFilters, setLocalFilters] = useReducer(
    (prev, next) => ({ ...prev, ...next }),
    {
      status: "",
      paymentMethod: "",
      dateInterval: "",
      fromDate: "",
      toDate: "",
    }
  );

  // Sync local filters with parent filters when they change
  useEffect(() => {
    if (filters) {
      setLocalFilters(filters);
    }
  }, [filters]);

  const {
    status = "",
    paymentMethod = "",
    dateInterval = "",
    fromDate = "",
    toDate = "",
  } = localFilters;

  const handleApply = () => {
    setFilters(localFilters);
  };

  const handleReset = () => {
    const cleared = {
      status: "",
      paymentMethod: "",
      dateInterval: "",
      fromDate: "",
      toDate: "",
    };
    setLocalFilters(cleared);
    setFilters(cleared);
  };

  return (
    <FilterWrapper onApply={handleApply} onReset={handleReset}>
      <Grid
        container
        spacing={2}
        fullWidth
        sx={{
          minWidth: {
            xs: "calc(100vw - 60px)",
            md: "calc(100vw - (270px + 60px))",
          },
        }}
      >
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Payment Status</InputLabel>
            <Select
              value={status}
              labelId="status-select-label"
              label="Status"
              onChange={(e) => setLocalFilters({ status: e.target.value })}
            >
              {dropDownOptions.paymentMgmt.status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              labelId="payment-method-label"
              label="Payment Method"
              onChange={(e) =>
                setLocalFilters({ paymentMethod: e.target.value })
              }
            >
              {dropDownOptions.paymentMgmt.paymentMethods.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="date-interval-label">
              Payment Date Interval
            </InputLabel>
            <Select
              value={dateInterval}
              labelId="date-interval-label"
              label="Payment Date Interval"
              onChange={(e) => {
                setLocalFilters({
                  dateInterval: e.target.value,
                  fromDate: "",
                  toDate: "",
                });
              }}
              disabled={Boolean(fromDate || toDate)}
            >
              {dropDownOptions.paymentMgmt.dateInterval.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <TextField
            fullWidth
            label="From Date"
            type="date"
            value={fromDate}
            onChange={(e) => {
              setLocalFilters({ fromDate: e.target.value, dateInterval: "" });
            }}
            disabled={Boolean(dateInterval)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <TextField
            fullWidth
            label="To Date"
            type="date"
            value={toDate}
            onChange={(e) => {
              setLocalFilters({ toDate: e.target.value, dateInterval: "" });
            }}
            disabled={Boolean(dateInterval)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
      </Grid>
    </FilterWrapper>
  );
}

FilterModal.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.string,
    paymentMethod: PropTypes.string,
    dateInterval: PropTypes.string,
    fromDate: PropTypes.string,
    toDate: PropTypes.string,
  }),
  setFilters: PropTypes.func.isRequired,
};

export default memo(FilterModal);
