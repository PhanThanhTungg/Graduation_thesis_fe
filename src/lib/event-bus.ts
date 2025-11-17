type Listener<T = any> = (data: T) => void;

interface ListenersMap {
  [event: string]: Listener[];
}

const listeners: ListenersMap = {};

const eventBus = {
  on<T = any>(event: string, callback: Listener<T>) {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event].push(callback as Listener);
  },

  off<T = any>(event: string, callback: Listener<T>) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(cb => cb !== callback);
  },

  emit<T = any>(event: string, data: T) {
    if (!listeners[event]) return;
    listeners[event].forEach(callback => callback(data));
  }
};

export default eventBus;