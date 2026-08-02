import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import type {
  UpdateWeightLogPayload,
  WeightLogEntry,
} from "@weight-tracker/shared";
import { profileService } from "../../services/profileService";
import { weightLogService } from "../../services/weightLogService";

const ITEMS_PER_PAGE = 30;

type ModalType = "edit" | "delete" | null;

interface MonthOption {
  value: string;
  label: string;
}

const buildMonthOptions = (): MonthOption[] => {
  const options: MonthOption[] = [{ value: "all", label: "All months" }];

  const today = new Date();
  for (let i = 0; i < 12; i += 1) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const value = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
    const label = month.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    options.push({ value, label });
  }

  return options;
};

export function useHistoryData() {
  const [logs, setLogs] = useState<WeightLogEntry[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [activeLog, setActiveLog] = useState<WeightLogEntry | null>(null);
  const [editData, setEditData] = useState({
    weightKg: "",
    date: "",
    note: "",
  });
  const [selectedMonth, setSelectedMonth] = useState("all");

  const monthOptions = useMemo(() => buildMonthOptions(), []);

  const fetchLogs = useCallback(
    async (page = 1, month?: string) => {
      if (!profileId) return;

      setIsLoading(true);
      setError("");

      try {
        const response = await weightLogService.getWeightLogs(
          profileId,
          page,
          month,
        );
        setLogs(response.data);

        const total = response.pagination?.total ?? 0;
        const currentPage = response.pagination?.page ?? page;
        const pages =
          response.pagination?.pages ??
          Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
        setPagination({ total, page: currentPage, pages });
      } catch (err: any) {
        console.error("Failed to load weight logs:", err);
        setError(err.response?.data?.error || "Unable to load weight history.");
      } finally {
        setIsLoading(false);
      }
    },
    [profileId],
  );

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError("");

      try {
        const profile = await profileService.getProfile();
        setProfileId(profile._id);
      } catch (err: any) {
        console.error("Failed to load profile for history:", err);
        setError(err.response?.data?.error || "Unable to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, []);

  useEffect(() => {
    if (!profileId) return;
    void fetchLogs(
      pagination.page,
      selectedMonth === "all" ? undefined : selectedMonth,
    );
  }, [fetchLogs, pagination.page, profileId, selectedMonth]);

  const openEditModal = useCallback((log: WeightLogEntry) => {
    setActiveLog(log);
    setEditData({
      weightKg: log.weightKg.toString(),
      date: new Date(log.date).toISOString().slice(0, 10),
      note: log.note || "",
    });
    setModalType("edit");
  }, []);

  const openDeleteModal = useCallback((log: WeightLogEntry) => {
    setActiveLog(log);
    setModalType("delete");
  }, []);

  const closeModal = useCallback(() => {
    setModalType(null);
    setActiveLog(null);
    setEditData({ weightKg: "", date: "", note: "" });
  }, []);

  const updateEditData = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEditData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleMonthChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const goToPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const goToPreviousPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }));
  }, []);

  const goToNextPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(prev.pages, prev.page + 1),
    }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!activeLog || !profileId) return;

    setIsSaving(true);
    setError("");

    try {
      const payload: UpdateWeightLogPayload = {
        userId: profileId,
        weightKg: parseFloat(editData.weightKg),
        date: new Date(editData.date),
        note: editData.note || undefined,
      };

      await weightLogService.updateWeightLog(activeLog._id, payload);
      await fetchLogs(
        pagination.page,
        selectedMonth === "all" ? undefined : selectedMonth,
      );
      closeModal();
    } catch (err: any) {
      console.error("Failed to save weight log:", err);
      setError(err.response?.data?.error || "Unable to save changes.");
    } finally {
      setIsSaving(false);
    }
  }, [
    activeLog,
    closeModal,
    editData.date,
    editData.note,
    editData.weightKg,
    fetchLogs,
    pagination.page,
    profileId,
    selectedMonth,
  ]);

  const handleDelete = useCallback(async () => {
    if (!activeLog || !profileId) return;

    setIsDeleting(true);
    setError("");

    try {
      await weightLogService.deleteWeightLog(activeLog._id, profileId);
      await fetchLogs(
        pagination.page,
        selectedMonth === "all" ? undefined : selectedMonth,
      );
      closeModal();
    } catch (err: any) {
      console.error("Failed to delete weight log:", err);
      setError(err.response?.data?.error || "Unable to delete entry.");
    } finally {
      setIsDeleting(false);
    }
  }, [
    activeLog,
    closeModal,
    fetchLogs,
    pagination.page,
    profileId,
    selectedMonth,
  ]);

  const pageNumbers = useMemo(() => {
    const total = pagination.pages;
    const current = pagination.page;
    const result: number[] = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i += 1) result.push(i);
      return result;
    }

    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (end - start < 4) {
      if (start === 1) end = Math.min(total, start + 4);
      else if (end === total) start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i += 1) result.push(i);
    return result;
  }, [pagination.page, pagination.pages]);

  const pageButtons = useMemo(
    () =>
      pageNumbers.map((pageNum) => ({
        number: pageNum,
        isActive: pagination.page === pageNum,
        onClick: () => goToPage(pageNum),
      })),
    [goToPage, pageNumbers, pagination.page],
  );

  const rows = useMemo(
    () =>
      logs.map((log) => ({
        ...log,
        formattedDate: new Date(log.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        noteText: log.note || "No note",
        onEdit: () => openEditModal(log),
        onDelete: () => openDeleteModal(log),
      })),
    [logs, openDeleteModal, openEditModal],
  );

  return {
    rows,
    monthOptions,
    pagination,
    isLoading,
    isSaving,
    isDeleting,
    error,
    modalType,
    activeLog,
    editData,
    selectedMonth,
    pageButtons,
    goToPreviousPage,
    goToNextPage,
    handleMonthChange,
    updateEditData,
    closeModal,
    handleSave,
    handleDelete,
    hasModal: modalType !== null && activeLog !== null,
    itemsPerPage: ITEMS_PER_PAGE,
  };
}
