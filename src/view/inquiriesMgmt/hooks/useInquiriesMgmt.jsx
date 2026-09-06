import { useState, useEffect } from "react";
import { formatDateTime } from "TheOdcMfUI/utility";
import { StatusChip } from "TheOdcMfUI/sharedComp";
import { TableAction } from "../../../sharedComponents";

import { useFetchContactInquiriesQuery } from "../../../store/rtkServices/inquiries";
import { useInquiriesConfirmationAlert } from "./useInquiriesConfirmationAlert";
import { useInquiryDetails } from "./useInquiryDetails";

export default function useInquiriesMgmt() {
  /*
    Local State Declarations
  */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  /*
    Side Effects
  */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  /*
    RTK Query API Queries
  */
  const {
    data: inquiriesPayload,
    isLoading,
    isFetching,
    refetch,
  } = useFetchContactInquiriesQuery(
    {
      page: page + 1,
      limit: rowsPerPage,
      status,
      search: debouncedSearch,
    },
    {
      pollingInterval: 60 * 60 * 1000, // Refetch inquiry data every 1 hour (3,600,000 ms)
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  /*
    Computed Values & Memos (State Aggregates)
  */
  const inquiries =
    (Array.isArray(inquiriesPayload?.data) ? inquiriesPayload.data : null) ||
    inquiriesPayload?.inquiries ||
    inquiriesPayload?.data?.inquiries ||
    (Array.isArray(inquiriesPayload) ? inquiriesPayload : []);

  const total =
    inquiriesPayload?.total ??
    inquiriesPayload?.pagination?.total ??
    inquiriesPayload?.data?.pagination?.total ??
    inquiries.length ??
    0;

  const stats = inquiriesPayload?.stats ||
    inquiriesPayload?.data?.stats || {
      totalCount: 0,
      newCount: 0,
      contactedCount: 0,
      resolvedCount: 0,
    };

  /*
    Composed Modular Hooks
  */
  const {
    selectedInquiry,
    detailsOpen,
    newNoteText,
    setNewNoteText,
    isUpdatingStatus,
    isAddingNote,
    handleOpenDetails,
    handleCloseDetails,
    handleStatusChange,
    handleAddNote,
  } = useInquiryDetails(inquiries);

  const {
    deleteConfirm,
    isDeleting,
    handleOpenDeleteConfirm,
    handleCloseDeleteConfirm,
    handleConfirmDelete,
  } = useInquiriesConfirmationAlert((deletedId) => {
    if (
      selectedInquiry &&
      (selectedInquiry._id === deletedId || selectedInquiry.id === deletedId)
    ) {
      handleCloseDetails();
    }
  });

  /*
    Event Handler Callbacks
  */
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusTabChange = (newStatus) => {
    setStatus(newStatus);
    setPage(0);
  };

  /*
    Derived Rows for DataTable
  */
  const rows = inquiries.map((item, index) => {
    const actions = (
      <TableAction
        view={() => handleOpenDetails(item)}
        remove={() => handleOpenDeleteConfirm(item._id || item.id)}
      />
    );
    const sr_no = index + 1 + page * rowsPerPage;
    const status = <StatusChip status={item.status} />;
    const customer = item.name;
    const contact = item.phone ? `${item.email} (${item.phone})` : item.email;
    const subject = item.subject;
    const adminNotes =
      item.adminNotes?.length > 0 ? `${item.adminNotes.length} Note(s)` : "-";
    const createdAt = formatDateTime(item.createdAt);

    return {
      ...item,
      actions,
      sr_no,
      customer,
      contact,
      subject,
      adminNotes,
      status,
      createdAt,
    };
  });

  return {
    /*
      Pagination & Filters
    */
    page,
    rowsPerPage,
    status,
    search,
    setSearch,
    handleChangePage,
    handleChangeRowsPerPage,
    handleStatusTabChange,

    /*
      Table Data & Stats
    */
    inquiries,
    rows,
    total,
    stats,
    isLoading: isLoading || isFetching,
    refetch,

    /*
      Details Dialog State & Handlers
    */
    selectedInquiry,
    detailsOpen,
    newNoteText,
    setNewNoteText,
    isUpdatingStatus,
    isAddingNote,
    handleOpenDetails,
    handleCloseDetails,
    handleStatusChange,
    handleAddNote,

    /*
      Delete Confirmation State & Handlers
    */
    deleteConfirm,
    isDeleting,
    handleOpenDeleteConfirm,
    handleCloseDeleteConfirm,
    handleConfirmDelete,
  };
}
