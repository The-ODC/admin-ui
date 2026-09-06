import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  Visibility,
  NoteAlt,
  Delete,
  Block,
  LockOpen,
} from "@mui/icons-material";

function TableAction({ view, edit, remove, block, unBlock, isBlocked }) {
  const actionButtons = [
    {
      label: "View",
      icon: <Visibility />,
      action: view,
      isLink: typeof view === "string",
    },
    {
      label: "Edit",
      icon: <NoteAlt />,
      action: edit,
      isLink: typeof edit === "string",
    },
    {
      label: "Delete",
      icon: <Delete />,
      action: remove,
      isLink: false,
    },
    isBlocked
      ? {
          label: "Unblock",
          icon: <LockOpen />,
          action: unBlock,
          isLink: false,
        }
      : {
          label: "Block",
          icon: <Block />,
          action: block,
          isLink: false,
        },
  ].filter(({ action }) => action !== undefined); // Remove any undefined values

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {actionButtons.map(({ label, icon, action, isLink }) => {
        const isDisabled = typeof action !== "function" && !isLink;

        return (
          <Tooltip
            key={label}
            title={
              isDisabled && label === "Edit"
                ? "You don't have permission to edit."
                : label
            }
            arrow
            placement="top"
          >
            <span>
              <IconButton
                component={isLink ? NavLink : "button"}
                to={isLink ? action : undefined}
                onClick={
                  !isLink && typeof action === "function" ? action : undefined
                }
                size="small"
                aria-label={label}
                disabled={isDisabled}
              >
                {icon}
              </IconButton>
            </span>
          </Tooltip>
        );
      })}
    </Box>
  );
}

TableAction.propTypes = {
  view: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  edit: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  remove: PropTypes.func,
  block: PropTypes.func,
  unBlock: PropTypes.func,
  isBlocked: PropTypes.bool,
};

export default TableAction;
