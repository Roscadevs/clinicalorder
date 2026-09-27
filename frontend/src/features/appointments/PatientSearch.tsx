import React, { useEffect, useId, useRef, useState } from 'react';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { patientsApi } from '../../services/api';
import { Patient } from '../../types';
import { cn } from '../../utils/cn';

interface PatientSearchProps {
  onSelect: (patient: Patient) => void;
  /** E-1: el paciente no existe. Recibe lo tipeado para precargar el alta. */
  onAddNew: (query: string) => void;
  autoFocus?: boolean;
}

const MIN_CHARS = 2;
const DEBOUNCE_MS = 250;

/** Resalta la parte del texto que coincide con la búsqueda. */
const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  const q = query.trim();
  const idx = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary-100 text-sand-900 rounded-sm px-0.5">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
};

/**
 * Búsqueda predictiva de pacientes por DNI o por nombre y apellido.
 * Muestra coincidencias mientras se escribe; si no hay resultados ofrece
 * "Agregar nuevo paciente" (flujo excepcional E-1).
 */
export const PatientSearch: React.FC<PatientSearchProps> = ({ onSelect, onAddNew, autoFocus }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(0);
  const requestId = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const trimmed = query.trim();
  const canSearch = trimmed.length >= MIN_CHARS;
  const showAddNew = canSearch && !isLoading && results.length === 0;
  // Cantidad de opciones navegables (resultados + opción "agregar" si aplica)
  const optionCount = showAddNew ? 1 : results.length;

  // Búsqueda con debounce; descarta respuestas viejas si el usuario siguió tipeando.
  useEffect(() => {
    if (!canSearch) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const id = ++requestId.current;
    const timer = setTimeout(() => {
      patientsApi
        .getPatients(trimmed)
        .then((list) => {
          if (id !== requestId.current) return;
          setResults(list.filter((p) => p.active !== false).slice(0, 8));
          setActive(0);
        })
        .catch(() => {
          if (id === requestId.current) setResults([]);
        })
        .finally(() => {
          if (id === requestId.current) setIsLoading(false);
        });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [trimmed, canSearch]);

  // Cierra la lista al hacer click afuera
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, []);

  const choose = (index: number) => {
    if (showAddNew) {
      onAddNew(trimmed);
      setIsOpen(false);
      return;
    }
    const patient = results[index];
    if (!patient) return;
    onSelect(patient);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(optionCount - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      if (isOpen && optionCount > 0) {
        e.preventDefault();
        choose(active);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const listVisible = isOpen && canSearch;

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor={`${listId}-input`} className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-2">
        Buscar paciente
      </label>
      <div className="relative">
        <Search className="w-4 h-4 text-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          id={`${listId}-input`}
          type="text"
          role="combobox"
          aria-expanded={listVisible}
          aria-controls={`${listId}-list`}
          aria-autocomplete="list"
          aria-activedescendant={listVisible && optionCount > 0 ? `${listId}-opt-${active}` : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="DNI o nombre y apellido"
          className="w-full bg-white border border-sand-300 rounded-xl pl-10 pr-10 py-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
        />
        {isLoading && (
          <Loader2 className="w-4 h-4 text-primary-500 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
        )}
      </div>
      <p className="mt-1.5 text-[11px] text-sand-500">
        Escribí al menos {MIN_CHARS} caracteres. Podés buscar por número de DNI o por nombre.
      </p>

      {listVisible && (
        <div
          id={`${listId}-list`}
          role="listbox"
          aria-label="Pacientes encontrados"
          className="absolute z-40 mt-1 w-full bg-white border border-sand-200 rounded-xl shadow-lift p-1 max-h-56 overflow-y-auto"
        >
          {isLoading && results.length === 0 ? (
            <p className="px-3 py-2.5 text-sm text-sand-500">Buscando…</p>
          ) : showAddNew ? (
            <>
              <p className="px-3 pt-2 pb-1 text-xs text-sand-500">
                No hay pacientes que coincidan con “{trimmed}”.
              </p>
              <button
                id={`${listId}-opt-0`}
                role="option"
                aria-selected={active === 0}
                type="button"
                onPointerEnter={() => setActive(0)}
                onClick={() => choose(0)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-primary-600 text-left',
                  active === 0 && 'bg-primary-50'
                )}
              >
                <UserPlus className="w-4 h-4" />
                Agregar nuevo paciente
              </button>
            </>
          ) : (
            results.map((p, i) => (
              <button
                key={p.id}
                id={`${listId}-opt-${i}`}
                role="option"
                aria-selected={active === i}
                type="button"
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(i)}
                className={cn(
                  'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                  active === i ? 'bg-sand-100' : 'hover:bg-sand-50'
                )}
              >
                <span className="text-sm font-semibold text-sand-900 truncate">
                  <Highlight text={p.name} query={trimmed} />
                </span>
                <span className="text-xs font-mono text-sand-600 flex-shrink-0">
                  DNI <Highlight text={p.dni} query={trimmed} />
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
