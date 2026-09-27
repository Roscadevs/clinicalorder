import { ClinicalPhoto } from '../../types';

/**
 * Almacén LOCAL de fotos clínicas (temporal, hasta migrar a servidor).
 * Las imágenes se guardan como dataURL en localStorage, agrupadas por turno.
 *
 * Limitación conocida: localStorage ronda los 5 MB por origen. Al agregar una
 * foto se comprime a JPEG y se redimensiona para no agotar el espacio.
 */
const KEY = 'clinical_photos_v1';
const MAX_DIMENSION = 1280; // px del lado mayor
const JPEG_QUALITY = 0.8;

const readAll = (): ClinicalPhoto[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ClinicalPhoto[]) : [];
  } catch {
    return [];
  }
};

const writeAll = (photos: ClinicalPhoto[]) => {
  localStorage.setItem(KEY, JSON.stringify(photos));
};

/** Redimensiona y comprime un File a un dataURL JPEG. */
function fileToCompressedDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Archivo de imagen inválido'));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('No se pudo procesar la imagen'));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const photoStore = {
  getByAppointment(appointmentId: number): ClinicalPhoto[] {
    return readAll()
      .filter((p) => p.appointmentId === appointmentId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  async add(appointmentId: number, patientId: number, file: File, caption?: string): Promise<ClinicalPhoto> {
    const dataUrl = await fileToCompressedDataUrl(file);
    const photo: ClinicalPhoto = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      appointmentId,
      patientId,
      dataUrl,
      caption,
      createdAt: new Date().toISOString(),
    };
    const all = readAll();
    all.push(photo);
    try {
      writeAll(all);
    } catch {
      throw new Error('No hay espacio local para guardar más fotos. Se migrarán a servidor próximamente.');
    }
    return photo;
  },

  remove(id: string): void {
    writeAll(readAll().filter((p) => p.id !== id));
  },
};
