const EventEmitter = require("events");

class ImmutableStateManager extends EventEmitter {
  constructor(initialState = {}) {
    super();
    // Zuerst die interne Variable einfrieren
    this._state = Object.freeze({ ...initialState });

    // Den Proxy erstellen, der nicht verändert werden kann
    this.state = new Proxy(this._state, {
      set: () => {
        throw new Error("State is immutable. Use setState to update.");
      },
    });
  }

  // Unveränderbaren Zustand zurückgeben
  getState() {
    return this.state;
  }

  // Unveränderbaren Zustand aktualisieren (stellt sicher, dass keine direkte Modifikation stattfindet)
  setState(updates) {
    const oldState = { ...this._state };
    this._state = Object.freeze({ ...this._state, ...updates });

    // Ereignisse für die Änderungen auslösen
    Object.keys(updates).forEach((key) => {
      this.emit(`change:${key}`, {
        oldValue: oldState[key],
        newValue: updates[key],
      });
    });

    // Allgemeines Ereignis für Zustandsänderungen
    this.emit("stateChanged", { oldState, newState: this._state });

    // Den Proxy nach der Aktualisierung neu erstellen
    this.state = new Proxy(this._state, {
      set: () => {
        throw new Error("State is immutable. Use setState to update.");
      },
    });
  }
}

// // Beispiel
// const immutableState = new ImmutableStateManager({ theme: 'light', user: null });

// immutableState.on('stateChanged', ({ oldState, newState }) => {
//   console.log('State updated:', oldState, '->', newState);
// });

// immutableState.setState({ theme: 'dark' });
// console.log(immutableState.getState().theme); // Gibt 'dark' zurück

// // Direkter Versuch, den Zustand zu ändern, schlägt fehl
// try {
//   immutableState.getState().theme = 'light'; // Fehler: State is immutable
// } catch (e) {
//   console.error(e.message);
// }
