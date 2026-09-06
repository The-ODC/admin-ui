import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { FileDownload, ReplyAll } from "@mui/icons-material";

import { Button } from "TheOdcMfUI/sharedComp";
import { RenderIf } from "TheOdcMfUI/helpers";

function PageHeader({
  pageTitle,
  children,
  sx,
  onExportClick,
  exportBtnLabel = "Export Data",
  hideExportBtn = false,
  showBackBtn = false,
  backBtnLabel = "Go Back",
  isExporting = false,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        rowGap: 1,
        mb: 2,
        ...sx,
      }}
    >
      <Typography variant="h2">{pageTitle}</Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", rowGap: 1 }}>
        {children}

        <RenderIf render={!hideExportBtn}>
          <Button
            variant="contained"
            startIcon={<FileDownload />}
            onClick={onExportClick}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : exportBtnLabel}
          </Button>
        </RenderIf>
        <RenderIf render={showBackBtn}>
          <Button
            variant="contained"
            startIcon={<ReplyAll />}
            onClick={() => window.history.back()}
          >
            {backBtnLabel}
          </Button>
        </RenderIf>
      </Box>
    </Box>
  );
}

PageHeader.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  children: PropTypes.node,
  sx: PropTypes.object,
  onExportClick: PropTypes.func,
  exportBtnLabel: PropTypes.string,
  hideExportBtn: PropTypes.bool,
  showBackBtn: PropTypes.bool,
  backBtnLabel: PropTypes.string,
  isExporting: PropTypes.bool,
};

export default PageHeader;
