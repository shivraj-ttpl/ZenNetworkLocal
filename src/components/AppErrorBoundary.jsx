import { Component } from 'react';

import Button from '@/components/commonComponents/button/Button';
import Icon from '@/components/icons/Icon';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log only non-PHI info — never log patient data, names, IDs, or clinical content
    const safeError = {
      message: error?.message,
      componentStack: info?.componentStack?.slice(0, 500),
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
    };

    // TODO: Send to monitoring service (Sentry, DataDog, etc.)
    // reportError(safeError);

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary]', safeError);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="h-screen w-screen flex items-center justify-center"
        >
          <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-75">
            <div className="w-16 h-16 rounded-full bg-error-50 flex items-center justify-center">
              <Icon name="AlertTriangle" size={32} className="text-error-500" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">
              Something went wrong
            </h2>
            <p className="text-sm text-neutral-500 text-center max-w-md">
              An unexpected error occurred. Please try again or contact support
              if the problem persists.
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="primaryBlue"
                size="sm"
                onClick={this.handleRetry}
              >
                Try Again
              </Button>
              <Button
                variant="outlineBlue"
                size="sm"
                onClick={() => (window.location.href = '/master-data')}
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
