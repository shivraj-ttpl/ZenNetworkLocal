import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Icon } from "@/components/icons";
import Checkbox from "@/components/commonComponents/checkbox/Checkbox";
import AppDataService from "@/services/appDataService/AppDataService";
import useDropdownPosition from "./useDropdownPosition";

// ─── Helpers ───────────────────────────────────────────
function getLabel(option, labelKey, labelKey2) {
  if (typeof option === "string") return option;
  const primary = option?.[labelKey] ?? "";
  if (!labelKey2 || !option?.[labelKey2]) return primary;
  return `${primary} ${option[labelKey2]}`;
}

function getValue(option, valueKey) {
  if (typeof option === "string") return option;
  return option?.[valueKey] ?? option;
}

function isSelected(option, selected, valueKey) {
  const val = getValue(option, valueKey);
  if (Array.isArray(selected)) {
    return selected.some((s) => getValue(s, valueKey) === val);
  }
  return selected ? getValue(selected, valueKey) === val : false;
}

/**
 * Resolves a dot-path like "data.results" from an object.
 */
function resolvePath(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

// ─── Component ─────────────────────────────────────────
/**
 * AsyncSelectDropdown — API-driven select with server-side search and infinite scroll.
 *
 * Two ways to provide data:
 *
 * 1) `url` — pass the API endpoint, component fetches via AppDataService:
 *      <AsyncSelectDropdown url="providers" searchKey="name" />
 *
 * 2) `fetchOptions` — full custom fetch (overrides url):
 *      <AsyncSelectDropdown fetchOptions={({ search, page, limit }) => myApi.get(...)} />
 *
 * @param {string}   label           — field label
 * @param {string}   name            — field name / id
 * @param {string}   placeholder     — trigger placeholder
 * @param {*}        value           — controlled value (object or array for multi)
 * @param {Function} onChange        — (selected) => void
 * @param {string}   url             — API endpoint path (fetched via AppDataService)
 * @param {Function} fetchOptions    — custom fetch: ({ search, page, limit, signal }) => Promise<{ data, totalRecords }>
 * @param {string}   searchKey       — query param name for search when using url (default: "search")
 * @param {string}   dataPath        — dot path to extract array from API response (default: "data")
 * @param {string}   totalPath       — dot path to extract total count from API response (default: "totalRecords")
 * @param {string}   labelKey        — key for display text (default: "label")
 * @param {string}   labelKey2       — optional secondary key appended to label (e.g. "description")
 * @param {string}   valueKey        — key for value (default: "value")
 * @param {number}   limit           — items per page (default: 20)
 * @param {number}   debounceMs      — search debounce delay (default: 400)
 * @param {boolean}  isMulti         — enable multi-select
 * @param {boolean}  required        — show asterisk
 * @param {boolean}  disabled        — disable interaction
 * @param {string}   error           — error message
 * @param {boolean}  touched         — show error only when touched
 * @param {Function} renderOption    — (option, { isSelected }) => JSX
 * @param {string}   className       — wrapper className
 */
export default function AsyncSelectDropdown({
  label,
  name,
  placeholder = "Select...",
  value,
  onChange,
  url,
  fetchOptions: fetchOptionsProp,
  searchKey = "search",
  dataPath = "data",
  totalPath = "totalRecords",
  labelKey = "label",
  labelKey2,
  valueKey = "value",
  limit = 20,
  debounceMs = 400,
  isMulti = false,
  required = false,
  disabled = false,
  error,
  touched,
  renderOption,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);

  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const sentinelRef = useRef(null);
  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  const { direction, maxHeight } = useDropdownPosition(triggerRef, isOpen);
  const showError = touched && error;

  // ── Resolve fetch function: custom fetchOptions OR url via AppDataService ──
  const fetchOptions = useCallback(
    async ({ search: searchTerm, page: pageNum, limit: pageLimit, signal }) => {
      // Custom fetch takes priority
      if (fetchOptionsProp) {
        return fetchOptionsProp({ search: searchTerm, page: pageNum, limit: pageLimit, signal });
      }

      // URL-based fetch via AppDataService
      if (!url) return { data: [], totalRecords: 0 };

      const params = {
        page: pageNum,
        limit: pageLimit,
        ...(searchTerm && { [searchKey]: searchTerm }),
      };

      const response = await AppDataService.get(url, {
        params,
        _skipGlobalLoader: true,
        signal,
      });

      const responseData = response?.data?.data;
      const items = Array.isArray(responseData)
        ? responseData
        : resolvePath(responseData, dataPath) ?? [];
      const total = Array.isArray(responseData)
        ? responseData.length
        : resolvePath(responseData, totalPath) ?? Infinity;

      return { data: items, totalRecords: total };
    },
    [fetchOptionsProp, url, searchKey, dataPath, totalPath]
  );

  // ── Fetch wrapper ──
  const loadOptions = useCallback(
    async (searchTerm, pageNum, append = false) => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        const result = await fetchOptions({
          search: searchTerm,
          page: pageNum,
          limit,
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        const data = result?.data ?? result?.results ?? result ?? [];
        const total = result?.totalRecords ?? result?.total ?? Infinity;

        setOptions((prev) => (append ? [...prev, ...data] : data));
        setHasMore(pageNum * limit < total);
        setPage(pageNum);
      } catch (err) {
        if (err?.name === "AbortError") return;
        if (!append) setOptions([]);
        setHasMore(false);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [fetchOptions, limit]
  );

  // ── Load on open ──
  useEffect(() => {
    if (isOpen && !initialLoad) {
      setInitialLoad(true);
      loadOptions("", 1, false);
    }
  }, [isOpen, initialLoad, loadOptions]);

  // ── Debounced search ──
  useEffect(() => {
    if (!isOpen) return;
    if (!initialLoad) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setOptions([]);
      setHasMore(true);
      loadOptions(search, 1, false);
    }, debounceMs);

    return () => clearTimeout(debounceRef.current);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Infinite scroll via IntersectionObserver ──
  useEffect(() => {
    if (!isOpen || !hasMore || loading) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          loadOptions(search, page + 1, true);
        }
      },
      { root: sentinel.closest("[data-scroll-container]"), threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isOpen, hasMore, loading, page, search, loadOptions]);

  // ── Close on outside click ──
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e) {
      if (
        triggerRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      ) return;
      setIsOpen(false);
      setSearch("");
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // ── Focus search on open ──
  useEffect(() => {
    if (isOpen) setTimeout(() => searchRef.current?.focus(), 0);
  }, [isOpen]);

  // ── Reset on close ──
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearch("");
    setOptions([]);
    setPage(1);
    setHasMore(true);
    setInitialLoad(false);
    if (abortRef.current) abortRef.current.abort();
  }, []);

  // ── Display text ──
  const displayText = useMemo(() => {
    if (isMulti) {
      if (!Array.isArray(value) || value.length === 0) return "";
      if (value.length === 1) return getLabel(value[0], labelKey, labelKey2);
      return `${value.length} selected`;
    }
    return value ? getLabel(value, labelKey, labelKey2) : "";
  }, [value, isMulti, labelKey, labelKey2]);

  // ── Handlers ──
  const toggle = useCallback(() => {
    if (disabled) return;
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  }, [disabled, isOpen, handleClose]);

  const handleSelect = useCallback(
    (option) => {
      if (isMulti) {
        const current = Array.isArray(value) ? value : [];
        const val = getValue(option, valueKey);
        const exists = current.some((s) => getValue(s, valueKey) === val);
        const next = exists
          ? current.filter((s) => getValue(s, valueKey) !== val)
          : [...current, option];
        onChange?.(next);
      } else {
        onChange?.(option);
        handleClose();
      }
    },
    [isMulti, value, valueKey, onChange, handleClose]
  );

  const handleClear = useCallback(
    (e) => {
      e.stopPropagation();
      onChange?.(isMulti ? [] : null);
    },
    [isMulti, onChange]
  );

  const hasValue = isMulti ? Array.isArray(value) && value.length > 0 : !!value;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-normal text-text-primary">
          {label}
          {required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {/* ── Trigger ── */}
        <button
          ref={triggerRef}
          id={name}
          type="button"
          onClick={toggle}
          disabled={disabled}
          className={[
            "w-full h-10 px-4 rounded-lg border bg-surface cursor-pointer",
            "text-sm text-left outline-none transition-colors",
            "flex items-center justify-between gap-2",
            "disabled:bg-neutral-50 disabled:cursor-not-allowed",
            isOpen ? "border-primary ring-[0.5] " : "",
            showError ? "border-error-400" : !isOpen ? "border-border" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className={hasValue ? "text-neutral-800 truncate" : "text-text-placeholder truncate"}>
            {displayText || placeholder}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            {hasValue && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                onClick={handleClear}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <Icon name="X" size={14} />
              </span>
            )}
            <Icon
              name="ChevronDown"
              size={16}
              className={`text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </span>
        </button>

        {/* ── Dropdown Panel ── */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className={[
              "absolute left-0 right-0 z-50",
              "bg-surface border border-border rounded-lg shadow-lg",
              "flex flex-col",
              direction === "up" ? "bottom-full mb-1" : "top-full mt-1",
            ].join(" ")}
            style={{ maxHeight }}
          >
            {/* Search — always shown for async */}
            <div className="p-2 border-b border-border-light">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-50">
                <Icon name="Search" size={14} className="text-neutral-400 shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    <Icon name="X" size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Options List */}
            <div
              data-scroll-container
              className="overflow-y-auto overscroll-contain"
              style={{ maxHeight: maxHeight - 52 }}
            >
              {options.length === 0 && !loading ? (
                <div className="px-4 py-6 text-sm text-neutral-400 text-center">
                  {search ? "No results found" : "No options available"}
                </div>
              ) : (
                options.map((option, idx) => {
                  const selected = isSelected(option, value, valueKey);
                  return (
                    <button
                      key={getValue(option, valueKey) ?? idx}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={[
                        "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer",
                        selected && !isMulti ? "bg-primary-50 text-primary-700" : "text-neutral-700",
                        "hover:bg-neutral-50",
                      ].join(" ")}
                    >
                      {isMulti && (
                        <span className="pointer-events-none">
                          <Checkbox checked={selected} readOnly variant="blue" size="sm" />
                        </span>
                      )}
                      {renderOption ? (
                        renderOption(option, { isSelected: selected })
                      ) : (
                        <span className="truncate">{getLabel(option, labelKey, labelKey2)}</span>
                      )}
                      {selected && !isMulti && (
                        <Icon name="Check" size={16} className="ml-auto text-primary shrink-0" />
                      )}
                    </button>
                  );
                })
              )}

              {/* Sentinel for infinite scroll */}
              {hasMore && (
                <div ref={sentinelRef} className="flex items-center justify-center py-3">
                  {loading && (
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <Icon name="Loader2" size={14} className="animate-spin" />
                      Loading...
                    </div>
                  )}
                </div>
              )}

              {/* Initial loading state */}
              {loading && options.length === 0 && (
                <div className="flex items-center justify-center py-6">
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    Loading options...
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showError && <p className="text-xs text-error-500">{error}</p>}
    </div>
  );
}
