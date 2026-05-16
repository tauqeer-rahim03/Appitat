import React from "react";
import NotFoundPage from "../pages/NotFoundPage";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Critical Runtime Error Caught by Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <NotFoundPage 
          code="500" 
          title="The Kitchen is in Chaos!" 
          message="Something went wrong while preparing your experience. We've notified the chefs and they're working on it. Try resetting the kitchen."
          subtext="Internal App Error (Critical Crash)"
        />
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
