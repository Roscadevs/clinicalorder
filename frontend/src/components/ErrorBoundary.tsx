import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
          <div className="bg-white p-8 rounded-2xl border border-rose-200 shadow-xl max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-rose-600 mb-4">Algo salió mal en la aplicación</h1>
            <p className="text-slate-700 mb-4">Por favor, toma una captura de este error para soporte:</p>
            <pre className="bg-slate-100 p-4 rounded-xl text-xs text-slate-800 overflow-x-auto border border-slate-200 font-mono whitespace-pre-wrap">
              {this.state.error?.toString()}
              {'\n\n'}
              {this.state.error?.stack}
            </pre>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-6 px-4 py-2 bg-slate-900 text-white font-bold rounded-xl"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
