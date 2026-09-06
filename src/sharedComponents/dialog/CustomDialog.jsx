import React, { useLayoutEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";

import { Button } from "TheOdcMfUI/sharedComp";

function CustomDialog({
  children,
  title,
  open,
  onClose = undefined,
  handleClose,
  handleConfirm,
  confirmLabel = "Yes",
  cancelLabel = "No",
  size = "sm",
  isLoading = false,
  loadingLabel = "Loading...",
  ...rest
}) {
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);
  const [btnWidth, setBtnWidth] = useState(100);

  useLayoutEffect(() => {
    if (cancelRef.current && confirmRef.current) {
      const cancelWidth = cancelRef.current.offsetWidth;
      const confirmWidth = confirmRef.current.offsetWidth;
      setBtnWidth(Math.max(cancelWidth, confirmWidth));
    }
  }, [open, title]);

  return (
    <Dialog
      open={open}
      maxWidth={size}
      onClose={onClose}
      fullWidth
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      {...rest}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          fontWeight: 700,
          fontSize: { sm: "20px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 0,
        }}
      >
        {title}
        <IconButton aria-label="close" onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: "24px !important", pb: "0px !important" }}>
        {typeof children === "string" ? (
          <Typography id="modal-modal-description">{children}</Typography>
        ) : (
          children
        )}
      </DialogContent>

      <DialogActions sx={{ padding: "24px" }}>
        <Button
          ref={cancelRef}
          onClick={handleClose}
          sx={{ minWidth: btnWidth }}
          variant="outlined"
        >
          {cancelLabel}
        </Button>
        <Button
          ref={confirmRef}
          onClick={handleConfirm}
          disabled={isLoading}
          sx={{ minWidth: btnWidth }}
        >
          {isLoading ? loadingLabel : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// // Props validation
CustomDialog.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  handleConfirm: PropTypes.func,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  isLoading: PropTypes.bool,
  loadingLabel: PropTypes.string,
};

export default CustomDialog;
