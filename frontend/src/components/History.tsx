import { type JSX } from "react";
import {
  Edit3,
  Loader2,
  Trash2,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useHistoryData } from "../hooks/data/useHistoryData";

export default function History(): JSX.Element {
  const {
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
    hasModal,
    itemsPerPage,
  } = useHistoryData();

  return (
    <div className="pb-12">
      <div className="flex flex-col gap-6 mt-6 max-w-4xl mx-auto px-4 sm:px-0">
        <div className="bg-gray-900/60 backdrop-blur-md rounded-[32px] p-4 sm:p-5 flex flex-col gap-4 border border-white/10 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 w-full">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                <select
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="pl-9 pr-8 py-2.5 bg-gray-950/50 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none min-w-[160px] cursor-pointer hover:border-gray-600 transition-colors"
                >
                  {monthOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-slate-950 text-white"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="ml-2 rounded-3xl bg-white/5 px-4 py-3 text-sm text-gray-300">
                {pagination.total} total entries · {itemsPerPage} per page
              </div>
            </div>

            <div className="ml-auto" />
          </div>
        </div>

        {error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="bg-gray-900/40 backdrop-blur-sm rounded-[32px] p-6 sm:p-8 shadow-xl border border-white/5 min-h-[300px] overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4 rounded-t-[32px]">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-gray-400">
                History
              </p>
              <p className="text-xs text-gray-500">
                Page {pagination.page} of {pagination.pages}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-[240px] items-center justify-center px-6 py-20">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
          ) : rows.length === 0 ? (
            <div className="p-10 text-center text-gray-300">
              No history found for this month. Change the filter or add more
              logs.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="rounded-b-[32px] overflow-hidden">
                <table className="min-w-full divide-y divide-white/10 text-sm text-gray-200">
                  <thead className="bg-slate-950/80 text-left text-xs uppercase tracking-[0.3em] text-gray-400">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Weight</th>
                      <th className="px-6 py-4">Note</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-slate-950/70">
                    {rows.map((log) => (
                      <tr
                        key={log._id}
                        className="transition-colors hover:bg-white/5"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="font-semibold text-white">
                            {log.formattedDate}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-white">
                          {log.weightKg.toFixed(1)} kg
                        </td>
                        <td className="max-w-xl px-6 py-4 text-gray-300">
                          <div className="line-clamp-2 break-words">
                            {log.noteText}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2 justify-end">
                            <button
                              type="button"
                              onClick={log.onEdit}
                              aria-label="Edit weight entry"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-emerald-500/10 text-emerald-300 transition hover:bg-emerald-500/20"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={log.onDelete}
                              aria-label="Delete weight entry"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-4">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {pageButtons.map((page) => (
                <button
                  key={page.number}
                  onClick={page.onClick}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                    pagination.page === page.number
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105"
                      : "bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                  }`}
                >
                  {page.number}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={goToNextPage}
              disabled={pagination.page === pagination.pages}
              className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {hasModal && activeLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
            <div className="w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out sm:p-8">
              {modalType === "edit" ? (
                <>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Confirm edit entry
                      </h3>
                      <p className="text-gray-400 mt-2">
                        Update the weight log and confirm before saving the
                        change.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-gray-400 transition hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm text-gray-300">
                      <span className="mb-2 inline-block text-gray-400">
                        Weight (kg)
                      </span>
                      <input
                        type="number"
                        step="0.1"
                        name="weightKg"
                        value={editData.weightKg}
                        onChange={updateEditData}
                        className="w-full rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-emerald-500"
                      />
                    </label>
                    <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-500">
                        Logged date
                      </p>
                      <p className="mt-2 font-semibold text-white">
                        {new Date(activeLog.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <label className="mt-6 block text-sm text-gray-300">
                    <span className="mb-2 inline-block text-gray-400">
                      Note
                    </span>
                    <textarea
                      rows={4}
                      name="note"
                      value={editData.note}
                      onChange={updateEditData}
                      className="w-full resize-none rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-emerald-500"
                    />
                  </label>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSaving ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Delete entry
                      </h3>
                      <p className="text-gray-400 mt-2">
                        This action permanently removes the weight log from your
                        history.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-gray-400 transition hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-gray-300">
                    <p className="font-semibold text-white">
                      {new Date(activeLog.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-1">{activeLog.weightKg.toFixed(1)} kg</p>
                    <p className="mt-3 text-gray-400">
                      {activeLog.note || "No note attached."}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="rounded-3xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isDeleting ? "Deleting..." : "Delete entry"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
