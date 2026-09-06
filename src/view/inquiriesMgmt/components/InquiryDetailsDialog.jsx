import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Stack,
  Divider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

import { Button, StatusChip } from "TheOdcMfUI/sharedComp";
import { formatDateTime } from "TheOdcMfUI/utility";

export default function InquiryDetailsDialog({
  open,
  onClose,
  inquiry,
  onStatusChange,
  isUpdatingStatus,
  newNoteText,
  setNewNoteText,
  onAddNote,
  isAddingNote,
}) {
  if (!inquiry) return null;

  const infoFields = [
    { label: "Customer Name", value: inquiry.name, fontWeight: 600 },
    { label: "Email Address", value: inquiry.email, wordBreak: "break-word" },
    { label: "Phone Number", value: inquiry.phone },
    { label: "Submitted At", value: formatDateTime(inquiry.createdAt) },
    { label: "Inquiry Reason", value: inquiry.subject, fontWeight: 600 },
    {
      label: "Status",
      value: (
        <FormControl size="small" fullWidth sx={{ maxWidth: 160 }}>
          <Select
            value={inquiry.status}
            onChange={(e) => onStatusChange(e.target.value)}
            disabled={isUpdatingStatus}
          >
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="contacted">Contacted</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
          </Select>
        </FormControl>
      ),
    },
  ];

  return (
    <Dialog
      open={open}
      maxWidth="md"
      onClose={onClose}
      fullWidth
      aria-labelledby="inquiry-dialog-title"
      PaperProps={{
        sx: {
          overflowX: "hidden",
        },
      }}
    >
      {/* Dialog Header matching CustomDialog pattern */}
      <DialogTitle
        id="inquiry-dialog-title"
        sx={{
          fontWeight: 700,
          fontSize: { sm: "20px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 0,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <span>Inquiry Details</span>
          <StatusChip status={inquiry.status} />
        </Stack>
        <IconButton aria-label="close" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          pt: "24px !important",
          pb: "0px !important",
          overflowX: "hidden",
        }}
      >
        <Stack spacing={3}>
          {/* Key-Value Information Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {infoFields.map(({ label, value, fontWeight, wordBreak }) => (
              <Box key={label}>
                <Typography variant="body2" color="text.disabled" gutterBottom>
                  {label}
                </Typography>
                {React.isValidElement(value) ? (
                  value
                ) : (
                  <Typography
                    variant="body1"
                    fontWeight={fontWeight || "normal"}
                    sx={wordBreak ? { wordBreak } : undefined}
                  >
                    {value || "-"}
                  </Typography>
                )}
              </Box>
            ))}

            <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
              <Typography variant="body2" color="text.disabled" gutterBottom>
                Customer Message
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  bgcolor: "action.hover",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                >
                  {inquiry.message || "-"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Internal Admin Notes Section */}
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Internal Admin Notes ({inquiry.adminNotes?.length || 0})
            </Typography>
            <Typography
              variant="caption"
              color="text.disabled"
              display="block"
              sx={{ mb: 2 }}
            >
              These notes are strictly visible to administrators.
            </Typography>

            {/* List of existing notes */}
            {inquiry.adminNotes && inquiry.adminNotes.length > 0 && (
              <Stack spacing={1.5} sx={{ mb: 2 }}>
                {inquiry.adminNotes
                  .slice()
                  .reverse()
                  .map((noteItem, idx) => (
                    <Box
                      key={noteItem._id || idx}
                      sx={{
                        p: 1.75,
                        borderRadius: 1.5,
                        bgcolor: "action.hover",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={0.5}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="primary"
                        >
                          {noteItem.authorName || "Admin"}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {formatDateTime(noteItem.createdAt)}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {noteItem.note}
                      </Typography>
                    </Box>
                  ))}
              </Stack>
            )}

            {/* Add note input form */}
            <Stack spacing={1.5}>
              <TextField
                placeholder="Write an internal note..."
                multiline
                rows={2.5}
                fullWidth
                size="small"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={onAddNote}
                  disabled={!newNoteText?.trim() || isAddingNote}
                  size="small"
                >
                  {isAddingNote ? "Adding..." : "Add Note"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      {/* Standard DialogActions matching CustomDialog */}
      <DialogActions sx={{ padding: "24px" }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

InquiryDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  inquiry: PropTypes.object,
  onStatusChange: PropTypes.func.isRequired,
  isUpdatingStatus: PropTypes.bool,
  newNoteText: PropTypes.string,
  setNewNoteText: PropTypes.func.isRequired,
  onAddNote: PropTypes.func.isRequired,
  isAddingNote: PropTypes.bool,
};
