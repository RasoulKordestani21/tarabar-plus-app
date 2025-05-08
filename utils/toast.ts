// utils/toast.js

// Simple custom event emitter for React Native
class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => {
      callback(data);
    });
  }
}

// Create a global event emitter
const emitter = new EventEmitter();

// Export the showToast methods for use in apiClient
export const showToast = {
  success: message => {
    console.log("Toast Success:", message); // Add logging
    emitter.emit("toast", { type: "success", message });
  },
  error: message => {
    console.log("Toast Error:", message); // Add logging
    emitter.emit("toast", { type: "error", message });
  },
  info: message => {
    console.log("Toast Info:", message); // Add logging
    emitter.emit("toast", { type: "info", message });
  },
  warning: message => {
    console.log("Toast Warning:", message); // Add logging
    emitter.emit("toast", { type: "warning", message });
  }
};

// Export the emitter for the ToastProvider
export const toastEmitter = emitter;
