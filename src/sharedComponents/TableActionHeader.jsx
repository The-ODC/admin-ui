import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Clear, Search } from "@mui/icons-material";

import { RenderIf } from "TheOdcMfUI/helpers";

function TableActionHeader({
  searchLabel = "Search...",
  searchPlaceholder = "Search...",
  setSearch,
  sortLabel,
  setSort,
  sortList = [],
  children,
}) {
  const [sortBy, setSortBy] = useState(
    sortList.find((option) => option.default)?.value ||
      sortList?.[0]?.value ||
      ""
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    setSort(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearch(searchTerm);
    }
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      columnSpacing={3}
      rowSpacing={2}
      mb={3}
    >
      {/* Search Input */}
      <Grid size={{ xs: 12, sm: 6, md: 12, lg: 7 }}>
        <TextField
          fullWidth
          label={searchLabel}
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearch(searchTerm)}>
                  <Search />
                </IconButton>
                {searchTerm && (
                  <IconButton
                    onClick={() => {
                      setSearchTerm("");
                      setSearch("");
                    }}
                  >
                    <Clear />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {/* Additional Content */}
      <Grid
        container
        size={{ xs: 12, sm: 6, md: 12, lg: 4 }}
        justifyContent="flex-end"
        alignItems="center"
        spacing={2}
      >
        <Grid size={{ xs: 12, sm: 6 }}>{children}</Grid>
        <RenderIf render={sortLabel}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="sort-select-label">{sortLabel}</InputLabel>
              <Select
                id="sort-select"
                value={sortBy}
                labelId="sort-select-label"
                label={sortLabel}
                onChange={handleSortChange}
              >
                {sortList?.length > 0 ? (
                  sortList.map((sortOption) => (
                    <MenuItem value={sortOption?.value} key={sortOption?.value}>
                      {sortOption?.label}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No options available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        </RenderIf>
      </Grid>
    </Grid>
  );
}

TableActionHeader.propTypes = {
  searchLabel: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  setSearch: PropTypes.func.isRequired,
  sortLabel: PropTypes.string,
  setSort: PropTypes.func.isRequired,
  sortList: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node,
};

export default TableActionHeader;
