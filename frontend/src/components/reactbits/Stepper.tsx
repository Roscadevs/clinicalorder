import React, {
  useState,
  Children,
  useRef,
  useLayoutEffect,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './Stepper.css';

interface StepperProps {
  children: ReactNode;
  /** Paso actual (1-indexed). Controlado desde el padre. */
  currentStep: number;
  /** Dirección de la última transición: 1 avanzar, -1 retroceder. */
  direction?: number;
  disableStepIndicators?: boolean;
  onStepClick?: (step: number) => void;
  className?: string;
}

/**
 * Indicador de pasos + transición deslizante del contenido.
 * Versión controlada (el padre maneja currentStep y la navegación),
 * adaptada de ReactBits a TS y a la paleta de marca. Íconos vía lucide.
 */
export default function Stepper({
  children,
  currentStep,
  direction = 1,
  disableStepIndicators = false,
  onStepClick,
  className = '',
}: StepperProps) {
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;

  return (
    <div className={`rb-stepper ${className}`}>
      <div className="step-indicator-row mb-2">
        {stepsArray.map((_, index) => {
          const stepNumber = index + 1;
          const isNotLastStep = index < totalSteps - 1;
          return (
            <React.Fragment key={stepNumber}>
              <StepIndicator
                step={stepNumber}
                currentStep={currentStep}
                disableStepIndicators={disableStepIndicators}
                onClickStep={(clicked) => onStepClick?.(clicked)}
              />
              {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
            </React.Fragment>
          );
        })}
      </div>

      <StepContentWrapper currentStep={currentStep} direction={direction}>
        {stepsArray[currentStep - 1]}
      </StepContentWrapper>
    </div>
  );
}

export function Step({ children }: { children: ReactNode }) {
  return <div className="step-default">{children}</div>;
}

interface StepContentWrapperProps {
  currentStep: number;
  direction: number;
  children: ReactNode;
}

function StepContentWrapper({ currentStep, direction, children }: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState(0);

  return (
    <motion.div
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: parentHeight }}
      transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        <SlideTransition key={currentStep} direction={direction} onHeightReady={(h) => setParentHeight(h)}>
          {children}
        </SlideTransition>
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}

function SlideTransition({ children, direction, onHeightReady }: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    onHeightReady(el.offsetHeight);
    // Re-mide cuando el contenido del paso cambia de tamaño (estado interno de
    // componentes hijos), no sólo al cambiar de paso.
    const ro = new ResizeObserver(() => onHeightReady(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? '-100%' : '100%',
    opacity: 0,
  }),
  center: {
    x: '0%',
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? '50%' : '-50%',
    opacity: 0,
  }),
};

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (step: number) => void;
  disableStepIndicators?: boolean;
}

function StepIndicator({ step, currentStep, onClickStep, disableStepIndicators }: StepIndicatorProps) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) onClickStep(step);
  };

  return (
    <motion.div
      onClick={handleClick}
      className="step-indicator"
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: '#E9E2DC', color: '#7C6A59' },
          active: { scale: 1, backgroundColor: '#93654F', color: '#fff' },
          complete: { scale: 1, backgroundColor: '#93654F', color: '#fff' },
        }}
        transition={{ duration: 0.3 }}
        className="step-indicator-inner"
      >
        {status === 'complete' ? (
          <CheckIcon className="check-icon" />
        ) : status === 'active' ? (
          <div className="active-dot" />
        ) : (
          <span className="step-number">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  const lineVariants = {
    incomplete: { width: 0, backgroundColor: 'transparent' },
    complete: { width: '100%', backgroundColor: '#93654F' },
  };

  return (
    <div className="step-connector">
      <motion.div
        className="step-connector-inner"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? 'complete' : 'incomplete'}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function CheckIcon(props: HTMLAttributes<SVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: 'tween', ease: 'easeOut', duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
