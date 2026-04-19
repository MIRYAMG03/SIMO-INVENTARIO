import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="panel">
          <span className="badge">Error</span>
          <h2>Ocurrió un error</h2>
          <p>La pantalla falló. Recarga la página o vuelve a intentar.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;