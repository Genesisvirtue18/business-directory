import React, { useState } from 'react';

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasUploadedPhotos: boolean;
  onCompleteUpload: () => void;
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  isOpen,
  onClose,
  hasUploadedPhotos,
  onCompleteUpload,
}) => {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>(
    hasUploadedPhotos
      ? [
          'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80',
        ]
      : []
  );

  const samplePhotos = [
    {
      id: 'p1',
      title: 'Reception & Waiting Lounge',
      url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'p2',
      title: 'Orthodontics Consultation Suite',
      url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'p3',
      title: 'Advanced 3D Dental X-Ray & Scanner',
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80',
    },
  ];

  if (!isOpen) return null;

  const togglePhoto = (url: string) => {
    if (selectedPhotos.includes(url)) {
      setSelectedPhotos(selectedPhotos.filter((p) => p !== url));
    } else {
      setSelectedPhotos([...selectedPhotos, url]);
    }
  };

  const handleSave = () => {
    onCompleteUpload();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#ffffff] w-full max-w-md rounded-2xl shadow-2xl border border-[#ccc3d7] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#f0edf1] bg-[#fbf8fc]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5300b7] text-xl">add_photo_alternate</span>
            <h3 className="font-bold text-[16px] text-[#1b1b1e]">Complete Clinic Profile</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#7b7486] hover:text-[#1b1b1e]">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5 font-semibold">
              <span className="text-[#1b1b1e]">
                {selectedPhotos.length > 0 || hasUploadedPhotos ? 'Profile completion — 100%' : 'Profile completion — 85%'}
              </span>
              <span className="text-[#5300b7]">
                {selectedPhotos.length > 0 || hasUploadedPhotos ? 'All steps completed!' : '1 action left'}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#e4e1e6] overflow-hidden">
              <div
                className="h-full bg-[#6d28d9] rounded-full transition-all duration-500"
                style={{ width: selectedPhotos.length > 0 || hasUploadedPhotos ? '100%' : '85%' }}
              ></div>
            </div>
          </div>

          <div className="bg-[#f6f2f7] p-3 rounded-lg border border-[#ccc3d7]/60 space-y-1">
            <h4 className="text-[13px] font-bold text-[#1b1b1e]">Final Step: Upload Clinic Photos</h4>
            <p className="text-[12px] text-[#4a4455]">
              Listings with high-resolution photos receive <strong>4.2x more patient inquiries</strong> and priority directory ranking.
            </p>
          </div>

          {/* Photo selection grid */}
          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-[#1b1b1e]">
              Select from verified clinic gallery or upload:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {samplePhotos.map((photo) => {
                const isSelected = selectedPhotos.includes(photo.url);
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => togglePhoto(photo.url)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all aspect-square group cursor-pointer text-left ${
                      isSelected ? 'border-[#5300b7] ring-2 ring-[#ebdcff]' : 'border-[#ccc3d7] hover:border-[#7b7486]'
                    }`}
                  >
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-[#5300b7] text-white rounded-full p-0.5 shadow-sm">
                        <span className="material-symbols-outlined text-xs block">check</span>
                      </div>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] p-1 truncate">
                      {photo.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulated File Upload Dropzone */}
          <div
            onClick={() => {
              if (samplePhotos[2]) {
                togglePhoto(samplePhotos[2].url);
              }
            }}
            className="border-2 border-dashed border-[#ccc3d7] hover:border-[#5300b7] rounded-xl p-3 text-center cursor-pointer bg-[#fbf8fc] hover:bg-[#ebdcff]/20 transition-all"
          >
            <span className="material-symbols-outlined text-2xl text-[#6d28d9]">cloud_upload</span>
            <p className="text-[12px] font-semibold text-[#1b1b1e] mt-1">Tap to select or drag new photos</p>
            <p className="text-[10px] text-[#7b7486]">PNG, JPG, WEBP up to 10MB</p>
          </div>
        </div>

        <div className="p-4 border-t border-[#f0edf1] bg-[#fbf8fc] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-[#ccc3d7] text-[13px] font-semibold text-[#4a4455] hover:bg-[#f0edf1]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-[#6d28d9] hover:bg-[#5300b7] text-white text-[13px] font-bold shadow-sm transition-all"
          >
            Save &amp; Complete (100%)
          </button>
        </div>
      </div>
    </div>
  );
};
