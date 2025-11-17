type Listener<T = unknown> = (data: T) => void;

interface ListenersMap {
  [event: string]: Listener[];
}

const listeners: ListenersMap = {};

const eventBus = {
  on<T = unknown>(event: string, callback: Listener<T>) {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event].push(callback as Listener);
  },

  off<T = unknown>(event: string, callback: Listener<T>) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(cb => cb !== callback);
  },

  emit<T = unknown>(event: string, data: T) {
    if (!listeners[event]) return;
    listeners[event].forEach(callback => callback(data));
  }
};

export default eventBus;