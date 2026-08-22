import React, { useState, useEffect } from 'react'; // React hooks
import { servicesApi } from '../../services/api'; // API services
import { DermatologicService } from '../../types'; // Tipos
import { Sparkles, Plus, Edit2, Check, X, DollarSign, Clock, ShieldAlert } from 'lucide-react'; // Iconos

export const AdminServicesView: React.FC = () => {
  const [services, setServices] = useState<DermatologicService[]>([]);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDeposit, setEditDeposit] = useState<number>(50);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Nuevo servicio
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDuration, setNewDuration] = useState(45);
  const [newPrice, setNewPrice] = useState(40000);
  const [newDeposit, setNewDeposit] = useState(50);

  useEffect(() => {
    servicesApi.getActiveServices().then(setServices).catch(console.error);
  }, []);

  const handleStartEdit = (svc: DermatologicService) => {
    setEditingServiceId(svc.id);
    setEditPrice(svc.basePrice);
    setEditDeposit(svc.depositPercentage);
  };

  const handleSaveEdit = (id: number) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, basePrice: editPrice, depositPercentage: editDeposit } : s
      )
    );
    setEditingServiceId(null);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const created: DermatologicService = {
      id: Date.now(),
      name: newName,
      description: newDescription,
      durationMinutes: newDuration,
      basePrice: newPrice,
      depositPercentage: newDeposit,
      active: true,
    };
    setServices([...services, created]);
    setIsModalOpen(false);
    setNewName('');
    setNewDescription('');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-teal-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Catálogo Oficial de Tratamientos & Tarifas</h2>
            <p className="text-xs text-slate-500">Configuración de precios, señas online (%) y duraciones médicas</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Tratamiento</span>
        </button>
      </div>

      {/* Tabla de Servicios */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Tratamiento</th>
              <th className="p-3.5">Duración</th>
              <th className="p-3.5 text-right">Precio Base</th>
              <th className="p-3.5 text-right">Seña Requerida</th>
              <th className="p-3.5 text-center">Estado</th>
              <th className="p-3.5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.map((svc) => (
              <tr key={svc.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5">
                  <div className="font-bold text-slate-900">{svc.name}</div>
                  <div className="text-xs text-slate-500 line-clamp-1">{svc.description}</div>
                </td>
                <td className="p-3.5 font-semibold text-slate-700 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600 mr-1" />
                  <span>{svc.durationMinutes} min</span>
                </td>
                <td className="p-3.5 text-right font-bold text-slate-900">
                  {editingServiceId === svc.id ? (
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-24 border border-teal-500 rounded p-1 text-right text-xs"
                    />
                  ) : (
                    `$${svc.basePrice.toLocaleString()} ARS`
                  )}
                </td>
                <td className="p-3.5 text-right font-semibold text-teal-700">
                  {editingServiceId === svc.id ? (
                    <input
                      type="number"
                      value={editDeposit}
                      onChange={(e) => setEditDeposit(Number(e.target.value))}
                      className="w-16 border border-teal-500 rounded p-1 text-right text-xs"
                    />
                  ) : (
                    `${svc.depositPercentage}% ($${(svc.basePrice * (svc.depositPercentage / 100)).toLocaleString()})`
                  )}
                </td>
                <td className="p-3.5 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    Activo
                  </span>
                </td>
                <td className="p-3.5 text-center">
                  {editingServiceId === svc.id ? (
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => handleSaveEdit(svc.id)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        title="Guardar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingServiceId(null)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        title="Cancelar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(svc)}
                      className="p-1 text-slate-500 hover:text-teal-600 hover:bg-slate-100 rounded"
                      title="Editar tarifas"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Nuevo Tratamiento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateService} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Agregar Nuevo Tratamiento Estético</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre del Tratamiento *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Bioestimulación con Hidroxiapatita Cálcica"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción y Protocolo Clínico</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detalle clínico del procedimiento e indicaciones para el paciente..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duración (min)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Precio Total (ARS)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">% de Seña</label>
                  <input
                    type="number"
                    value={newDeposit}
                    onChange={(e) => setNewDeposit(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm"
              >
                Guardar Tratamiento
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
