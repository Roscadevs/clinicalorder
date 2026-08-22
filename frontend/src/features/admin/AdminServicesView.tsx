import React, { useState, useEffect } from 'react'; // React hooks
import { servicesApi } from '../../services/api'; // API services
import { DermatologicService } from '../../types'; // Types
import { Settings, Plus, Edit2, CheckCircle } from 'lucide-react'; // Icons

export const AdminServicesView: React.FC = () => {
  const [services, setServices] = useState<DermatologicService[]>([]);
  const [editingService, setEditingService] = useState<DermatologicService | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newDepositPercent, setNewDepositPercent] = useState<number>(50);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Service Modal State
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(30000);
  const [durationMinutes, setDurationMinutes] = useState(45);

  const fetchServices = () => {
    servicesApi.getActiveServices().then(setServices).catch(console.error);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleStartEdit = (svc: DermatologicService) => {
    setEditingService(svc);
    setNewPrice(svc.basePrice);
    setNewDepositPercent(50);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setIsSaving(true);
    try {
      await servicesApi.updateServicePrice(editingService.id, newPrice, newDepositPercent);
      setSaveSuccess(true);
      setEditingService(null);
      fetchServices();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Error al actualizar arancel del servicio');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await servicesApi.createService({
        name,
        description,
        basePrice,
        durationMinutes,
        depositPercentage: 50,
      });
      setIsAdding(false);
      setName('');
      setDescription('');
      fetchServices();
    } catch (err) {
      alert('Error al dar de alta el nuevo tratamiento');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Catálogo de Procedimientos & Tarifas</h2>
            <p className="text-xs text-slate-500">Gestión de precios oficiales y porcentaje de seña obligatoria</p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Tratamiento</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>¡Arancel actualizado correctamente! Impactará en todas las reservas futuras.</span>
        </div>
      )}

      {/* Lista de Servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((svc) => (
          <div key={svc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{svc.name}</h3>
                <span className="text-[11px] text-slate-400 font-semibold">{svc.durationMinutes} minutos de sesión</span>
              </div>
              <button
                onClick={() => handleStartEdit(svc)}
                className="text-teal-600 hover:text-teal-800 p-1.5 rounded-lg hover:bg-teal-50"
                title="Modificar Precios"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{svc.description}</p>

            <div className="flex justify-between items-baseline pt-3 border-t border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Arancel Total</span>
                <span className="text-base font-extrabold text-slate-900">${svc.basePrice.toLocaleString()} ARS</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-teal-600 uppercase font-bold block">Seña (50%)</span>
                <span className="text-sm font-bold text-teal-700">${(svc.basePrice * 0.5).toLocaleString()} ARS</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edición de Precio */}
      {editingService && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Modificar Arancel: {editingService.name}</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Precio Total Acordado (ARS) *</label>
              <input
                type="number"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Porcentaje de Seña Obligatoria (%) *</label>
              <input
                type="number"
                required
                min={10}
                max={100}
                value={newDepositPercent}
                onChange={(e) => setNewDepositPercent(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-teal-50 text-xs text-teal-800 space-y-1">
              <div className="flex justify-between">
                <span>Nueva Seña Requerida:</span>
                <span className="font-bold">${((newPrice * newDepositPercent) / 100).toLocaleString()} ARS</span>
              </div>
              <div className="flex justify-between">
                <span>Saldo en Consultorio:</span>
                <span className="font-bold">${(newPrice - (newPrice * newDepositPercent) / 100).toLocaleString()} ARS</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 text-xs text-slate-600 font-semibold hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm"
              >
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de Nuevo Servicio */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateService} className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Alta de Nuevo Procedimiento Estético</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Tratamiento *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Bioestimulación de Colágeno"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Descripción Clínica *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Indicar protocolo, zonas de aplicación y beneficios..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Precio Total (ARS) *</label>
                <input
                  type="number"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duración (min) *</label>
                <input
                  type="number"
                  required
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-xs text-slate-600 font-semibold hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm"
              >
                {isSaving ? 'Creando...' : 'Crear Tratamiento'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
