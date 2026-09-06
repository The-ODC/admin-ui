import React from "react";
import PropTypes from "prop-types";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Skeleton,
  useTheme,
} from "@mui/material";

import { NoData } from "TheOdcMfUI/helpers";

const DataTable = ({
  columns = [],
  rows = [],
  handleChangeRowsPerPage,
  handleChangePage,
  page = 0,
  rowsPerPage = 10,
  totalItem = 0,
  isLoading = false,
  hidePagination = false,
  sx = {},
  maxHeight = "60vh",
  minHeight = "50vh",
}) => {
  const theme = useTheme();

  return (
    <TableContainer
      component={Paper}
      sx={{
        position: "relative",
        background: theme.palette.background.paper,
        boxShadow: "none",
        maxWidth: {
          xs: `calc(100vw - 2rem)`,
          md: `calc(100vw - (270px + 7rem))`,
        },
        maxHeight,
        minHeight,
        ...sx,
      }}
    >
      <Table
        stickyHeader
        sx={{
          minHeight: (rows || []).length === 0 ? minHeight : "auto",
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                sx={{
                  width: column.maxWidth,
                  textAlign: column.align || "left",
                  backgroundColor: theme.palette.primary.main,
                  fontWeight: column.fontWeight || "bold",
                  textTransform: "capitalize",
                  color: theme.palette.primary.contrastText,
                  minWidth:
                    column.minWidth !== undefined ? column.minWidth : 150,
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Show Skeleton Loader when loading */}
          {isLoading ? (
            [...new Array(Math.min(rowsPerPage || 8, 10))].map((_, index) => (
              <TableRow key={index + 1}>
                {columns.map((col, colIdx) => (
                  <TableCell key={col.id} sx={{ width: col.maxWidth, py: 2 }}>
                    <Skeleton
                      variant="rounded"
                      height={22}
                      width={
                        col.id === "actions" || col.id === "action"
                          ? 70
                          : colIdx === 0
                            ? "55%"
                            : colIdx % 2 === 0
                              ? "75%"
                              : "85%"
                      }
                      sx={{ borderRadius: "6px" }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (rows || []).length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                align="center"
                sx={{ py: 6, border: 0 }}
              >
                <NoData />
              </TableCell>
            </TableRow>
          ) : (
            (rows || []).map((row, rowIndex) => (
              <TableRow key={row?._id || row?.id || rowIndex + 1}>
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    sx={{
                      width: col.maxWidth,
                      textAlign: col.align || "left",
                      textTransform: col.textTransform || "none",
                    }}
                  >
                    {col.render
                      ? col.render(row[col.id], row)
                      : row[col.id] || "-N/A-"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {rows.length > 0 && !hidePagination ? (
        <TablePagination
          sx={{
            backgroundColor: theme.palette.background.paper,
            position: "sticky",
            top: "100%",
            left: 0,
          }}
          component="div"
          count={totalItem}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
      ) : (
        ""
      )}
    </TableContainer>
  );
};

/** ✅ Add PropTypes for type checking */
DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // Unique ID for the column
      label: PropTypes.string.isRequired, // Column header label
      align: PropTypes.oneOf(["left", "right", "center"]), // Alignment of text
      maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Max width of column
      fontWeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Font weight (bold, normal, etc.)
      textTransform: PropTypes.string, // Text transformation (capitalize, uppercase, etc.)
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired, // Rows should be an array of objects
  handleChangeRowsPerPage: PropTypes.func.isRequired, // Function for changing rows per page
  handleChangePage: PropTypes.func.isRequired, // Function for changing page
  page: PropTypes.number, // Current page index
  rowsPerPage: PropTypes.number, // Number of rows per page
  totalItem: PropTypes.number, // Total number of items
  isLoading: PropTypes.bool, // Loading state
  hidePagination: PropTypes.bool, // Whether to hide pagination
};

export default DataTable;
