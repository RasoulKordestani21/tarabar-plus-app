// utils/authErrorManager.js
import { EventEmitter } from "events";

// Create a custom event emitter
class CustomEventEmitter {
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

const emitter = new CustomEventEmitter();

// Function to show auth error modal
export const showAuthErrorModal = message => {
  emitter.emit("authError", { visible: true, message });
};

// Export the emitter for the AuthErrorProvider
export const authErrorEmitter = emitter;
