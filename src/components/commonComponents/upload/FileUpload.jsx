import { useRef, useState, useCallback } from "react";
import { ErrorMessage } from "formik";
import { Icon } from "@/components/icons";
import Button from "@/components/commonComponents/button/Button";
import PdfIcon from "@/assets/Pdf.png";

const FILE_TYPE_CONFIG = {
  pdf: { icon: "FileText", color: "text-red-600", bg: "bg-red-50" },
  doc: { icon: "FileText", color: "text-blue-600", bg: "bg-blue-50" },
  docx: { icon: "FileText", color: "text-blue-600", bg: "bg-blue-50" },
  ppt: { icon: "Presentation", color: "text-orange-500", bg: "bg-orange-50" },
  pptx: { icon: "Presentation", color: "text-orange-500", bg: "bg-orange-50" },
  xls: { icon: "Sheet", color: "text-green-600", bg: "bg-green-50" },
  xlsx: { icon: "Sheet", color: "text-green-600", bg: "bg-green-50" },
  csv: { icon: "Sheet", color: "text-green-600", bg: "bg-green-50" },
  png: { icon: "Image", color: "text-purple-500", bg: "bg-purple-50" },
  jpg: { icon: "Image", color: "text-purple-500", bg: "bg-purple-50" },
  jpeg: { icon: "Image", color: "text-purple-500", bg: "bg-purple-50" },
  gif: { icon: "Image", color: "text-purple-500", bg: "bg-purple-50" },
  svg: { icon: "Image", color: "text-purple-500", bg: "bg-purple-50" },
  mp4: { icon: "Video", color: "text-pink-500", bg: "bg-pink-50" },
  mov: { icon: "Video", color: "text-pink-500", bg: "bg-pink-50" },
  mp3: { icon: "Music", color: "text-teal-500", bg: "bg-teal-50" },
  wav: { icon: "Music", color: "text-teal-500", bg: "bg-teal-50" },
  zip: { icon: "Archive", color: "text-yellow-600", bg: "bg-yellow-50" },
  rar: { icon: "Archive", color: "text-yellow-600", bg: "bg-yellow-50" },
};

const DEFAULT_FILE_CONFIG = { icon: "File", color: "text-neutral-500", bg: "bg-neutral-100" };

const getFileConfig = (fileName) => {
  const ext = fileName?.split(".").pop()?.toLowerCase();
  return FILE_TYPE_CONFIG[ext] || DEFAULT_FILE_CONFIG;
};

const formatDate = (date) => {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

const FileUpload = ({
  name = "",
  label = "",
  isRequired = false,
  maxFileSize = 5,
  allowedFileTypes = [".csv"],
  onFileSelect = () => {},
  onDownloadTemplate = () => {},
  showDownloadTemplate = false,
  downloadTemplateLabel = "Download Template",
  description = "",
  disabled = false,
  error = null,
  touched = false,
  className = "",
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const maxSizeBytes = maxFileSize * 1024 * 1024;

  const acceptString = allowedFileTypes.join(",");

  const displayTypes = allowedFileTypes.map((t) => t.replace(".", "")).join(", ");
  const hint = description || `.${displayTypes}, up to ${maxFileSize}MB.`;

  const validate = useCallback(
    (file) => {
      if (!file) return "No file selected.";

      const ext = `.${file.name.split(".").pop().toLowerCase()}`;
      if (!allowedFileTypes.some((t) => t.toLowerCase() === ext)) {
        return `Invalid file type. Allowed: ${displayTypes}`;
      }

      if (file.size > maxSizeBytes) {
        return `File size exceeds ${maxFileSize}MB limit.`;
      }

      return "";
    },
    [allowedFileTypes, displayTypes, maxSizeBytes, maxFileSize]
  );

  const handleFile = useCallback(
    (file) => {
      const validationError = validate(file);
      setFileError(validationError);

      if (validationError) {
        setSelectedFile(null);
        onFileSelect(null, validationError);
        return;
      }

      setSelectedFile(file);
      onFileSelect(file, "");
    },
    [validate, onFileSelect]
  );

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setFileError("");
    onFileSelect(null, "");
  };

  const showError = (touched && error) || fileError;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-normal text-text-primary">
          {label}
          {isRequired && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={acceptString}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      {!selectedFile && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!disabled) inputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center gap-3 py-10 px-6
            border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isDragging ? "border-primary bg-primary/5" : "border-neutral-300 bg-surface"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary"}
            ${showError ? "border-error-400" : ""}
          `}
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-neutral-100">
            <Icon name="Image" size={22} className="text-neutral-400" />
          </div>
          <p className="text-sm text-text-primary">
            Drop your document here, or{" "}
            <span className="text-primary underline font-medium">click to browse</span>
          </p>
          <p className="text-xs text-text-secondary">{hint}</p>
        </div>
      )}

      {selectedFile && (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 bg-neutral-50">
          <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg ${getFileConfig(selectedFile.name).bg}`}>
            {selectedFile.name.toLowerCase().endsWith(".pdf") ? (
              <img src={PdfIcon} alt="PDF" className="w-6 h-6 object-contain" />
            ) : (
              <Icon
                name={getFileConfig(selectedFile.name).icon}
                size={22}
                className={getFileConfig(selectedFile.name).color}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-text-secondary">
              {formatDate(selectedFile.lastModified)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="flex-shrink-0 text-neutral-400 hover:text-error-500 transition-colors"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
      )}

      {showError && (
        <p className="text-xs text-error-500">{fileError || error}</p>
      )}

      {!showError && name && (
        <ErrorMessage name={name}>
          {(msg) => (
            <p className="text-xs text-error-500">
              {typeof msg === "string" ? msg : msg?.label}
            </p>
          )}
        </ErrorMessage>
      )}

      {showDownloadTemplate && (
        <Button
          variant="link"
          size="sm"
          type="button"
          onClick={onDownloadTemplate}
          className="self-start !text-primary-500 !px-0"
        >
          {downloadTemplateLabel}
        </Button>
      )}
    </div>
  );
};

export default FileUpload;
