import React, { useLayoutEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { Button } from "TheOdcMfUI/sharedComp";

function CustomAlertDialog({
  open,
  onClose,
  handleConfirm,
  title = "Are you sure?",
  description = "Are you sure you want to perform this action?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  size = "xs",
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
  }, [open, title, description]);

  return (
    <Dialog
      open={open}
      maxWidth={size}
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...rest}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ fontWeight: 700, fontSize: { sm: "20px" } }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        {typeof description === "string" ? (
          <DialogContentText id="alert-dialog-description" color="inherit">
            {description}
          </DialogContentText>
        ) : (
          description
        )}
      </DialogContent>
      <DialogActions sx={{ padding: "24px" }}>
        <Button
          ref={cancelRef}
          variant="outlined"
          onClick={onClose}
          sx={{ minWidth: btnWidth }}
        >
          {cancelLabel}
        </Button>
        <Button
          ref={confirmRef}
          onClick={handleConfirm}
          sx={{ minWidth: btnWidth }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// props validation
CustomAlertDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  size: PropTypes.string,
};

export default CustomAlertDialog;
