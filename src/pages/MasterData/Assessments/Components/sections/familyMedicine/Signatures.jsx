import { useEffect, useRef, useState } from 'react';
import SignaturePad from 'signature_pad';

import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Input from '@/components/commonComponents/input/Input';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import TextArea from '@/components/commonComponents/textArea/index';
import FileUpload from '@/components/commonComponents/upload/FileUpload';

export default function Signatures({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  const s = values?.signatures || {};
  const [activeTab, setActiveTab] = useState('upload');
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (activeTab === 'draw' && canvasRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current, {
        minWidth: 1,
        maxWidth: 3,
        penColor: '#1a1a1a',
      });

      const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d').scale(ratio, ratio);
        signaturePadRef.current.clear();
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        signaturePadRef.current?.off();
      };
    }
  }, [activeTab]);

  const handleSaveSignature = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const dataUrl = signaturePadRef.current.toDataURL('image/png');
      setFieldValue('signatures.drawnSignature', dataUrl);
    }
  };

  const handleClearSignature = () => {
    signaturePadRef.current?.clear();
    setFieldValue('signatures.drawnSignature', null);
  };

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">Signatures</h3>

      {/* ── Patient Signature ── */}
      <div className="flex flex-col gap-4">
        <h4 className="text-sm font-semibold text-text-primary">
          Patient Signature
        </h4>

        <Checkbox
          label="Patient signatures gathered manually"
          checked={!!s.gatheredManually}
          onChange={(checked) =>
            setFieldValue('signatures.gatheredManually', checked)
          }
          variant="blue"
        />

        {/* Tabs */}
        <div className="flex border-b border-border gap-6">
          {['Upload', 'Draw'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === tab.toLowerCase()
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Upload tab */}
        {activeTab === 'upload' && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-text-primary">
              Upload Signature
            </p>
            <FileUpload
              name="signatures.patientSignature"
              allowedFileTypes={['.png', '.jpg']}
              maxFileSize={5}
              onFileSelect={(file) =>
                setFieldValue('signatures.patientSignature', file)
              }
            />
          </div>
        )}

        {/* Draw tab */}
        {activeTab === 'draw' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text-primary">
                Draw Signature
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearSignature}
                  className="h-8 px-4 border border-neutral-300 text-text-secondary text-sm rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleSaveSignature}
                  className="h-8 px-4 bg-neutral-200 text-neutral-500 text-sm rounded-lg hover:bg-neutral-300 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
            <canvas
              ref={canvasRef}
              className="w-full h-48 border border-neutral-300 rounded-lg bg-white cursor-crosshair"
              style={{ touchAction: 'none' }}
            />
            <p className="text-xs text-text-secondary">
              Sign above using your mouse on desktop and finger on touch devices
            </p>
          </div>
        )}
      </div>

      {/* Date */}
      <Input
        label="Date"
        name="signatures.patientDate"
        type="date"
        value={s.patientDate || ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {/* ── Provider Review ── */}
      <div className="flex flex-col gap-4">
        <h4 className="text-sm font-semibold text-text-primary">
          Provider Review
        </h4>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-text-primary">
            Provider
          </label>
          <SelectDropdown
            options={[]}
            value={s.provider || null}
            onChange={(opt) => setFieldValue('signatures.provider', opt)}
            placeholder="Select Provider"
          />
        </div>

        <TextArea
          label="Provider Review"
          name="signatures.providerReview"
          placeholder="Enter note..."
          value={s.providerReview || ''}
          onChangeCb={(e) =>
            setFieldValue('signatures.providerReview', e.target.value)
          }
          rows={5}
        />

        <Input
          label="Date"
          name="signatures.providerDate"
          type="date"
          value={s.providerDate || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}
