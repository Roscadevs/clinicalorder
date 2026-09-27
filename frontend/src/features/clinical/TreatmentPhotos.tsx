import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ImagePlus, Trash2, ImageOff } from 'lucide-react';
import { ClinicalPhoto } from '../../types';
import { photoStore } from './photoStore';
import { Button } from '../../components/ui';
import { cn } from '../../utils/cn';

interface TreatmentPhotosProps {
  appointmentId: number;
  patientId: number;
  serviceName?: string;
  /** Permite subir/eliminar (solo médico). */
  editable?: boolean;
}

/**
 * Carrusel de fotos de un tratamiento (turno). Guardado local temporal.
 * Si hay más de una foto, permite navegar entre ellas.
 */
export const TreatmentPhotos: React.FC<TreatmentPhotosProps> = ({ appointmentId, patientId, serviceName, editable = true }) => {
  const [photos, setPhotos] = useState<ClinicalPhoto[]>([]);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reload = () => {
    const list = photoStore.getByAppointment(appointmentId);
    setPhotos(list);
    setIndex((i) => Math.min(i, Math.max(0, list.length - 1)));
  };

  useEffect(reload, [appointmentId]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        await photoStore.add(appointmentId, patientId, file);
      }
      reload();
      setIndex(photoStore.getByAppointment(appointmentId).length - 1);
    } catch (e: any) {
      setError(e?.message || 'No se pudo guardar la foto.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeCurrent = () => {
    const photo = photos[index];
    if (!photo || !confirm('¿Eliminar esta foto del tratamiento?')) return;
    photoStore.remove(photo.id);
    reload();
  };

  const current = photos[index];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-sand-800">
          Fotos del tratamiento{serviceName ? ` · ${serviceName}` : ''}
        </h4>
        {editable && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <Button size="sm" variant="secondary" isLoading={busy} onClick={() => fileRef.current?.click()} leftIcon={<ImagePlus className="w-4 h-4" />}>
              Agregar foto
            </Button>
          </>
        )}
      </div>

      {error && <p role="alert" className="text-xs text-danger-600 font-medium">{error}</p>}

      {photos.length === 0 ? (
        <div className="aspect-[4/3] w-full rounded-xl border border-dashed border-sand-300 bg-sand-50 flex flex-col items-center justify-center text-sand-400 gap-2">
          <ImageOff className="w-8 h-8" />
          <span className="text-xs">Sin fotos para este turno</span>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-sand-200 bg-sand-900">
          <img src={current.dataUrl} alt={`Foto ${index + 1} del tratamiento`} className="w-full aspect-[4/3] object-contain bg-sand-900" />

          {photos.length > 1 && (
            <>
              <button
                onClick={() => setIndex((i) => (i - 1 + photos.length) % photos.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-sand-800 flex items-center justify-center shadow"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIndex((i) => (i + 1) % photos.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-sand-800 flex items-center justify-center shadow"
                aria-label="Foto siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="absolute bottom-2 inset-x-0 flex items-center justify-between px-3">
            <span className="text-[11px] font-semibold text-white bg-black/40 px-2 py-0.5 rounded-full">
              {index + 1} / {photos.length}
            </span>
            {editable && (
              <button
                onClick={removeCurrent}
                className="w-8 h-8 rounded-full bg-danger-500/90 hover:bg-danger-600 text-white flex items-center justify-center shadow"
                aria-label="Eliminar foto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setIndex(i)}
              className={cn(
                'w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0',
                i === index ? 'border-primary-500' : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <img src={p.dataUrl} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <p className="text-[11px] text-sand-400">
        Las fotos se guardan localmente de forma temporal; próximamente se migrarán a servidor.
      </p>
    </div>
  );
};
