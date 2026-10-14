import React, { Component, ErrorInfo, ReactNode } from 'react';
import { HumanFriendlyErrorFallback } from './HumanFriendlyErrorFallback';

export interface ErrorBoundaryProps {
  children?: ReactNode;
  moduleTitle?: string;
  supportPhone?: string;
  fallback?: ReactNode;
  onReset?: () => void;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary robusto y empático adaptado para React 18.
 * Captura errores en tiempo de renderizado y presenta una experiencia amable
 * respetando la paleta de diseño de la clínica dermatológica.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[Error capturado en ${this.props.moduleTitle || 'aplicación'}]:`, error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public resetErrorBoundary = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <HumanFriendlyErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
          moduleTitle={this.props.moduleTitle}
          supportPhone={this.props.supportPhone}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
