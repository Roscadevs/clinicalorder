import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import './GlideSelect.css';

export interface GlideOption {
  value: string;
  label: string;
  tag?: string;
}

type OptionInput = string | GlideOption;

interface GlideSelectProps {
  options?: OptionInput[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option: GlideOption) => void;
  placeholder?: string;
  showTags?: boolean;
  accentColor?: string;
  surfaceColor?: string;
  highlightColor?: string;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg';
  radius?: number;
  menuWidth?: number;
  placement?: 'top' | 'bottom';
  align?: 'left' | 'right';
  popDuration?: number;
  glideDuration?: number;
  rememberPosition?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

const SIZES = {
  sm: { chip: 28, row: 26, font: 12 },
  md: { chip: 32, row: 30, font: 13 },
  lg: { chip: 44, row: 40, font: 14 },
};

const PAD = 4;
const GAP = 1;
const MENU_GAP = 6;
const MENU_MARGIN = 12;
const DEFAULT_OPTIONS: OptionInput[] = ['One', 'Two', 'Three'];

const norm = (o: OptionInput): GlideOption => (typeof o === 'string' ? { value: o, label: o } : o);
const textOf = (it: GlideOption) => (typeof it.label === 'string' ? it.label : it.value);

const typeaheadIndex = (items: GlideOption[], from: number, ch: string) => {
  const c = ch.toLowerCase();
  const n = items.length;
  for (let k = 1; k <= n; k++) {
    const i = (from + k) % n;
    if (textOf(items[i]).toLowerCase().startsWith(c)) return i;
  }
  return from;
};

type Phase = 'closed' | 'open' | 'closing';

interface MenuBox {
  left: number;
  top?: number;
  bottom?: number;
  width: number;
  maxHeight: number;
  side: 'top' | 'bottom';
}

export default function GlideSelect({
  options = DEFAULT_OPTIONS,
  value,
  defaultValue,
  onChange,
  placeholder = 'Seleccionar…',
  showTags = true,
  accentColor = '#93654F',
  surfaceColor = '#ffffff',
  highlightColor = '#E4D5C6',
  textColor = '#2C251F',
  size = 'lg',
  radius = 12,
  menuWidth = 176,
  placement = 'bottom',
  align = 'left',
  popDuration = 180,
  glideDuration = 220,
  rememberPosition = true,
  disabled = false,
  ariaLabel = 'Seleccionar',
  className = '',
}: GlideSelectProps) {
  const items = options.map(norm);
  const [inner, setInner] = useState(defaultValue ?? '');
  const current = value ?? inner;
  const selected = items.findIndex((it) => it.value === current);

  const [phase, setPhase] = useState<Phase>('closed');
  const [active, setActive] = useState<number | null>(null);
  const [box, setBox] = useState<MenuBox | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const instant = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const scrub = useRef<{ id: number; top: number } | null>(null);
  const id = useId();

  const S = SIZES[size] ?? SIZES.md;
  const step = S.row + GAP;
  const popOut = Math.round((popDuration * 2) / 3);

  // Posición del menú (portal, position: fixed) respecto al trigger.
  const computeBox = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const r = trigger.getBoundingClientRect();
    const width = Math.max(menuWidth, r.width);
    const spaceBelow = window.innerHeight - r.bottom - MENU_GAP - MENU_MARGIN;
    const spaceAbove = r.top - MENU_GAP - MENU_MARGIN;

    let side: 'top' | 'bottom' = placement;
    if (placement === 'bottom' && spaceBelow < 180 && spaceAbove > spaceBelow) side = 'top';
    else if (placement === 'top' && spaceAbove < 180 && spaceBelow > spaceAbove) side = 'bottom';

    const maxHeight = Math.max(140, side === 'bottom' ? spaceBelow : spaceAbove);

    let left = align === 'right' ? r.right - width : r.left;
    left = Math.min(Math.max(MENU_MARGIN, left), window.innerWidth - width - MENU_MARGIN);

    if (side === 'bottom') {
      setBox({ left, top: r.bottom + MENU_GAP, width, maxHeight, side });
    } else {
      setBox({ left, bottom: window.innerHeight - r.top + MENU_GAP, width, maxHeight, side });
    }
  };

  useLayoutEffect(() => {
    if (phase !== 'open') return;
    computeBox();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== 'open') return;
    const handler = () => computeBox();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Anima la aparición del menú.
  useLayoutEffect(() => {
    if (phase !== 'open') return;
    const el = menuRef.current;
    if (!el) return;
    el.dataset.state = 'closed';
    void el.offsetHeight;
    el.dataset.state = 'open';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const open = (viaKey: boolean) => {
    if (disabled) return;
    clearTimeout(closeTimer.current);
    instant.current = true;
    setActive(selected >= 0 ? selected : viaKey ? 0 : null);
    setPhase('open');
  };

  const close = (mode: 'instant' | 'pop') => {
    setActive(null);
    clearTimeout(closeTimer.current);
    const el = menuRef.current;
    if (mode === 'instant' || !el) {
      setPhase('closed');
      return;
    }
    el.dataset.state = 'closed';
    setPhase('closing');
    closeTimer.current = setTimeout(() => setPhase('closed'), popOut + 20);
  };

  const pick = (i: number, viaKey: boolean) => {
    const it = items[i];
    if (!it) {
      close('instant');
      return;
    }
    if (it.value !== current) {
      if (value === undefined) setInner(it.value);
      onChange?.(it.value, it);
      if (!viaKey && rootRef.current) rootRef.current.dataset.swap = '';
    }
    close('instant');
    triggerRef.current?.focus({ preventScroll: true });
  };

  const onTriggerKey = (e: React.KeyboardEvent) => {
    const k = e.key;
    const n = items.length;
    const cur = active ?? Math.max(0, selected);
    if (phase !== 'open') {
      if (k === 'Enter' || k === ' ' || k === 'ArrowDown' || k === 'ArrowUp') {
        e.preventDefault();
        open(true);
      }
      return;
    }
    const go = (i: number) => {
      e.preventDefault();
      instant.current = true;
      const next = Math.min(n - 1, Math.max(0, i));
      setActive(next);
      requestAnimationFrame(() => {
        listRef.current?.querySelector<HTMLElement>(`[data-index="${next}"]`)?.scrollIntoView({ block: 'nearest' });
      });
    };
    if (k === 'ArrowDown' || k === 'ArrowUp') go(active === null ? cur : cur + (k === 'ArrowDown' ? 1 : -1));
    else if (k === 'Home' || k === 'End') go(k === 'Home' ? 0 : n - 1);
    else if (k === 'Enter' || k === ' ') {
      e.preventDefault();
      pick(cur, true);
    } else if (k === 'Escape' || k === 'Tab') {
      if (k === 'Escape') e.preventDefault();
      close('instant');
    } else if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) go(typeaheadIndex(items, cur, k));
  };

  useEffect(() => {
    if (phase === 'closed') return undefined;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      close('pop');
    };
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (disabled && phase !== 'closed') close('instant');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Scrub táctil: mapea la posición Y al índice, considerando el scroll del list.
  const rowAt = (y: number) => {
    const listEl = listRef.current;
    if (!listEl) return null;
    const top = listEl.getBoundingClientRect().top;
    const i = Math.floor((y - top - PAD + listEl.scrollTop) / step);
    return i >= 0 && i < items.length ? i : null;
  };

  const onListDown = (e: React.PointerEvent) => {
    // Sólo iniciamos scrub con mouse/pen; en touch dejamos el scroll nativo.
    if (e.pointerType === 'touch' || scrub.current) return;
    scrub.current = { id: e.pointerId, top: 0 };
    instant.current = true;
    setActive(rowAt(e.clientY));
  };

  const onListMove = (e: React.PointerEvent) => {
    if (!scrub.current || scrub.current.id !== e.pointerId) return;
    const i = rowAt(e.clientY);
    if (i !== null && i !== active) setActive(i);
  };

  const onListUp = (e: React.PointerEvent) => {
    if (!scrub.current || scrub.current.id !== e.pointerId) return;
    const i = e.type === 'pointerup' ? rowAt(e.clientY) : null;
    scrub.current = null;
    if (i !== null) pick(i, false);
    else if (!rememberPosition) setActive(null);
  };

  const onListOver = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch' || scrub.current) return;
    const row = (e.target as HTMLElement).closest('[data-index]') as HTMLElement | null;
    if (!row) return;
    const i = Number(row.dataset.index);
    if (i !== active) setActive(i);
  };

  const rootStyle = {
    '--gs-accent': accentColor,
    '--gs-surface': surfaceColor,
    '--gs-highlight': highlightColor,
    '--gs-text': textColor,
    '--gs-radius': `${radius}px`,
    '--gs-inner-radius': `${Math.max(3, radius - 4)}px`,
    '--gs-chip': `${S.chip}px`,
    '--gs-row': `${S.row}px`,
    '--gs-font': `${S.font}px`,
    '--gs-pop': `${popDuration}ms`,
    '--gs-pop-out': `${popOut}ms`,
    '--gs-glide': `${glideDuration}ms`,
  } as CSSProperties;

  // IMPORTANTE: el menú se renderiza en un portal (document.body), fuera del
  // árbol del componente, por lo que NO hereda las CSS variables del root.
  // Hay que aplicarlas también acá para que el pill y los colores funcionen.
  const menuStyle: CSSProperties = {
    ...rootStyle,
    ...(box
      ? {
          position: 'fixed' as const,
          left: box.left,
          top: box.top,
          bottom: box.bottom,
          width: box.width,
          transformOrigin: box.side === 'bottom' ? 'top center' : 'bottom center',
        }
      : { position: 'fixed' as const, left: -9999, top: -9999 }),
  };

  return (
    <div
      ref={rootRef}
      className={`glide-select${className ? ` ${className}` : ''}`}
      data-size={size}
      data-disabled={disabled ? '' : undefined}
      style={rootStyle}
      onAnimationEnd={(e) => {
        if (e.animationName === 'gs-swap' && rootRef.current) delete rootRef.current.dataset.swap;
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={phase === 'open'}
        aria-controls={`${id}-list`}
        aria-activedescendant={active !== null ? `${id}-${active}` : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        className="glide-select__trigger"
        onPointerDown={(e) => {
          if (e.button !== 0 || disabled) return;
          e.currentTarget.focus({ preventScroll: true });
          if (phase === 'open') close('pop');
          else open(false);
        }}
        onKeyDown={onTriggerKey}
      >
        <span className="glide-select__label" key={current} data-empty={selected < 0 ? '' : undefined}>
          {selected >= 0 ? items[selected].label : placeholder}
        </span>
        <span className="glide-select__chevron" aria-hidden="true">
          <ChevronDown size={16} strokeWidth={2.5} />
        </span>
      </button>

      {phase !== 'closed'
        ? createPortal(
            <div
              ref={menuRef}
              className="glide-select__menu"
              data-state="open"
              data-side={box?.side ?? placement}
              style={menuStyle}
            >
              <div
                ref={listRef}
                id={`${id}-list`}
                role="listbox"
                aria-label={ariaLabel}
                className="glide-select__list"
                style={{ maxHeight: box?.maxHeight }}
                data-live={active !== null ? '' : undefined}
                onPointerOver={onListOver}
                onPointerLeave={() => {
                  if (!scrub.current && !rememberPosition) setActive(null);
                }}
                onPointerDown={onListDown}
                onPointerMove={onListMove}
                onPointerUp={onListUp}
                onPointerCancel={onListUp}
                onLostPointerCapture={onListUp}
              >
                {/* Píldora deslizante: posición y visibilidad derivadas del
                    estado `active` (determinista, sin refs imperativas). */}
                <span
                  ref={pillRef}
                  className="glide-select__pill"
                  aria-hidden="true"
                  style={{
                    transform: `translateY(${(active ?? Math.max(0, selected)) * step}px)`,
                    opacity: active === null ? 0 : 1,
                  }}
                />
                {items.map((it, i) => (
                  <div
                    key={it.value}
                    id={`${id}-${i}`}
                    role="option"
                    aria-selected={i === selected}
                    data-index={i}
                    className="glide-select__option"
                    onClick={() => pick(i, false)}
                  >
                    <span className="glide-select__name">{it.label}</span>
                    {showTags && it.tag ? <span className="glide-select__tag">{it.tag}</span> : null}
                    <span className="glide-select__check" data-on={i === selected ? '' : undefined} aria-hidden="true">
                      <Check size={15} strokeWidth={2.5} />
                    </span>
                  </div>
                ))}
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
