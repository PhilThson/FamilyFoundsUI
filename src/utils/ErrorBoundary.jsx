import { Component } from "react";
import styles from "./ErrorBoundary.module.css";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    const content = (
      <div className={styles.error}>
        <h1 className={styles["error-message"]}>Coś poszło nie tak!</h1>
        <p>Proszę odświezyć stronę.</p>
        <p>
          W przypadku powtarzania się problemu proszę skontaktować się z
          administratorem.
        </p>
      </div>
    );

    if (this.state.hasError) {
      return content;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
