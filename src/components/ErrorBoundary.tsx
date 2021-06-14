import React, { ErrorInfo } from "react";
import ErrorMessage from "../containers/ErrorMessage";

class ErrorBoundary extends React.Component<{}, {hasError: boolean}> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // We have to use a service to log the errors
    console.error()
  }

  render() {
    if (this.state.hasError) {
      return <ErrorMessage/>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
