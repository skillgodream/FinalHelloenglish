import React, { ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  isSubView?: boolean;
  onRecover?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleQuickRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRecover) {
      this.props.onRecover();
    } else {
      window.location.reload();
    }
  };

  private handleFullReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.pathname;
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.isSubView) {
        return (
          <div className="w-full py-12 px-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white mb-1">
              {this.props.fallbackTitle || 'Screen Load Issue'}
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mb-5">
              There was a problem displaying this screen. You can return to Home or retry.
            </p>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <button
                type="button"
                onClick={this.handleQuickRetry}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry (पुनः प्रयास करें)</span>
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen w-full bg-[#060a14] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-400">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            HELLO ENGLISH
          </h1>
          <p className="text-sm text-slate-400 max-w-xs mb-6">
            An unexpected error occurred. Tap below to reload or reset clean state.
          </p>

          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <button
              onClick={this.handleQuickRetry}
              className="w-full py-3.5 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-sky-500/20 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload App (रीलोड करें)</span>
            </button>

            <button
              onClick={this.handleFullReset}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-medium text-xs border border-zinc-800 cursor-pointer transition-colors"
            >
              <span>Reset Cached State & Start Fresh</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
