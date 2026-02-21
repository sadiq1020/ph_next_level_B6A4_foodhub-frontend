"use client";

import { Button } from "@/components/ui/button";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Something went wrong
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = "/";
              }}
              className="rounded-full bg-orange-500 hover:bg-orange-600"
            >
              Go to Home
            </Button>
          </div>
        </div>
      );
    }

    // ✅ CRITICAL: Return children directly, not wrapped in anything
    return this.props.children;
  }
}
