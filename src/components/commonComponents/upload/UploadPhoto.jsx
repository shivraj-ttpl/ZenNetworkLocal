import { useRef, useState } from "react";
import { ErrorMessage } from "formik";
import { Icon } from "@/components/icons";

const UploadPhoto = ({
  name = "",
  label = "Upload Photo",
  isRequired = false,
  maxFileSize = 5,
  onFileSelect = () => {},
  error = null,
  touched = false,
  disabled = false,
  className = "",
}) => {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState("");

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("Only image files are allowed.");
      setSelectedFile(null);
      setPreview(null);
      onFileSelect(null, "Invalid file type");
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      setFileError(`File size exceeds ${maxFileSize}MB limit.`);
      setSelectedFile(null);
      setPreview(null);
      onFileSelect(null, "File too large");
      return;
    }

    setFileError("");
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    onFileSelect(file, "");
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setFileError("");
    onFileSelect(null, "");
  };

  const showError = (touched && error) || fileError;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm text-text-primary">
          {label}
          {isRequired && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      {!selectedFile && (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          className={`
            flex flex-col items-center justify-center gap-3 py-10 px-6
            border-2 border-dashed rounded-lg cursor-pointer
            border-neutral-300 bg-surface hover:border-primary
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${showError ? "border-error-400" : ""}
          `}
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-neutral-100">
            <Icon name="Image" size={22} className="text-neutral-400" />
          </div>
          <p className="text-sm text-text-primary">
            Click to upload image
          </p>
          <p className="text-xs text-text-secondary">
            .png, .jpg, up to {maxFileSize}MB.
          </p>
        </div>
      )}

      {selectedFile && (
        <div className="relative rounded-lg border border-neutral-200 bg-neutral-50 overflow-hidden">
          <img
            src={preview}
            alt="preview"
            className="w-full h-auto object-contain rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white/80 text-neutral-500 hover:text-error-500 hover:bg-white shadow-sm cursor-pointer"
          >
            <Icon name="X" size={14} />
          </button>
          <p className="text-xs text-text-secondary truncate px-2 py-1.5 border-t border-neutral-200 bg-white">
            {selectedFile.name}
          </p>
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
    </div>
  );
};

export default UploadPhoto;