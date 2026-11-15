import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

/** Keeps one broken demo from blanking the whole gallery. */
export class DemoBoundary extends Component<{ name: string; children: ReactNode }, { error: Error | null }> {
  override state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Demo "${this.props.name}" crashed:`, error, info.componentStack);
  }

  override render() {
    if (!this.state.error) return this.props.children;
    return (
      <pre style={{ margin: 0, padding: 12, border: '1px solid #ef4444', borderRadius: 8, background: '#fef2f2', color: '#991b1b', fontSize: 12, whiteSpace: 'pre-wrap' }}>
        {`"${this.props.name}" failed to render\n${this.state.error.message}`}
      </pre>
    );
  }
}
