import Input from "@/components/commonComponents/input/Input";
import TextArea from "@/components/commonComponents/textArea/index";
import FileUpload from "@/components/commonComponents/upload/FileUpload";

export default function Signatures({ values, handleChange, handleBlur, setFieldValue }) {
  const s = values?.signatures || {};

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">Patient Signature</p>
        <FileUpload
          name="signatures.patientSignature"
          allowedFileTypes={[".png", ".jpg"]}
          maxFileSize={5}
          onFileSelect={(file) => setFieldValue("signatures.patientSignature", file)}
        />
      </div>

      <Input
        label="Date"
        name="signatures.patientDate"
        type="date"
        placeholder="Select Date"
        value={s.patientDate || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-[340px]"
      />

      <TextArea
        label="Provider Review"
        name="signatures.providerReview"
        placeholder="Type here..."
        value={s.providerReview || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        rows={4}
      />

      <Input
        label="Date"
        name="signatures.providerDate"
        type="date"
        placeholder="Select Date"
        value={s.providerDate || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-[340px]"
      />
    </div>
  );
}
