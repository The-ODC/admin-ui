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
      category: "",
      subCategory: "",
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
    category = "",
    subCategory = "",
    dateInterval = "",
    fromDate = "",
    toDate = "",
  } = localFilters;

  const handleChange = (field, value) => {
    if (field === "dateInterval") {
      setLocalFilters({
        dateInterval: value,
        fromDate: "",
        toDate: "",
      });
      return;
    }
    if (field === "fromDate" || field === "toDate") {
      setLocalFilters({
        [field]: value,
        dateInterval: "",
      });
      return;
    }
    if (field === "category") {
      setLocalFilters({
        category: value,
        subCategory: "",
      });
      return;
    }
    setLocalFilters({
      [field]: value,
    });
  };

  const handleApply = () => {
    setFilters(localFilters);
  };

  const handleReset = () => {
    const cleared = {
      status: "",
      category: "",
      subCategory: "",
      dateInterval: "",
      fromDate: "",
      toDate: "",
    };
    setLocalFilters(cleared);
    setFilters(cleared);
  };

  const subCategories = dropDownOptions.productMgmt.subCategory[category] || [];

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
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              value={status}
              labelId="status-select-label"
              label="Status"
              onChange={(e) => handleChange("status", e.target.value)}
            >
              {dropDownOptions.productMgmt.status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              value={category}
              labelId="category-select-label"
              label="Category"
              onChange={(e) => handleChange("category", e.target.value)}
            >
              {dropDownOptions.productMgmt.category.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <FormControl fullWidth disabled={!category}>
            <InputLabel id="subcategory-select-label">Cuisine Type</InputLabel>
            <Select
              value={subCategory}
              labelId="subcategory-select-label"
              label="Cuisine Type"
              onChange={(e) => handleChange("subCategory", e.target.value)}
            >
              {subCategories.length > 0 ? (
                subCategories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No Cuisine Types</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="date-interval-label">
              Created Date Interval
            </InputLabel>
            <Select
              value={dateInterval}
              labelId="date-interval-label"
              label="Created Date Interval"
              onChange={(e) => handleChange("dateInterval", e.target.value)}
              disabled={Boolean(fromDate || toDate)}
            >
              {dropDownOptions.productMgmt.dateInterval.map((option) => (
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
            onChange={(e) => handleChange("fromDate", e.target.value)}
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
            onChange={(e) => handleChange("toDate", e.target.value)}
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
    category: PropTypes.string,
    subCategory: PropTypes.string,
    dateInterval: PropTypes.string,
    fromDate: PropTypes.string,
    toDate: PropTypes.string,
  }),
  setFilters: PropTypes.func.isRequired,
};

export default memo(FilterModal);
