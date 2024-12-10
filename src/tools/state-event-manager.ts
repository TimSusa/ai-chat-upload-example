type EventPayload = string | number | object | any[]; // Zulässige Typen für Events

// Adapter-Schnittstelle für die Speicherung des States (In-Memory oder Datenbank)
interface StateAdapter {
  save(state: Map<string, EventPayload>): Promise<void>;
  load(): Promise<Map<string, EventPayload>>;
}

// In-Memory-Adapter (Standard-Adapter)
class InMemoryAdapter implements StateAdapter {
  private memoryState: Map<string, EventPayload> = new Map();

  async save(state: Map<string, EventPayload>): Promise<void> {
    this.memoryState = new Map(state); // Speichert den aktuellen State in Memory
    console.log("State in Memory gespeichert.");
  }

  async load(): Promise<Map<string, EventPayload>> {
    console.log("State aus Memory geladen.");
    return this.memoryState; // Gibt den gespeicherten State zurück
  }
}

// Hauptklasse für den State-Event-Händler
class StateEventManager {
  private state: Map<string, EventPayload> = new Map(); // Verwaltet den State
  private adapter: StateAdapter;

  constructor(adapter: StateAdapter = new InMemoryAdapter()) {
    this.adapter = adapter; // Der Adapter bestimmt, wo der State gespeichert wird
  }

  // Event senden: Fügt ein Event mit einem Namen und einer Payload zum State hinzu
  emit(eventName: string, payload: EventPayload): void {
    this.state.set(eventName, payload);
    console.log(
      `Event "${eventName}" empfangen und gespeichert mit Payload:`,
      payload
    );
  }

  // Auf ein Event hören: Führt die Callback-Funktion aus, wenn das Event vorhanden ist
  on(eventName: string, callback: (payload: EventPayload) => void): void {
    if (this.state.has(eventName)) {
      callback(this.state.get(eventName)!); // Ruft das Event mit der Payload ab
    }
  }

  // Den aktuellen State speichern (z. B. in Memory oder einer Datenbank)
  async saveState(): Promise<void> {
    await this.adapter.save(this.state); // State über den Adapter speichern
  }

  // Den State aus dem Speicher laden
  async loadState(): Promise<void> {
    this.state = await this.adapter.load(); // State über den Adapter laden
    console.log("Aktueller State:", this.state);
  }

  // Den gesamten aktuellen State abrufen
  getState(): [string, EventPayload][] {
    return Array.from(this.state.entries()); // Gibt alle Events als Array von Tupeln zurück
  }
}

// ### **Beispielverwendung**

// ```typescript
// (async () => {
//     // Erstellen eines Event-Managers mit In-Memory-Adapter
//     const manager = new StateEventManager();

//     // Event senden
//     manager.emit('userLogin', { username: 'JohnDoe', time: Date.now() });
//     manager.emit('errorLog', ['Error 404', 'Error 500']);
//     manager.emit('appStatus', 'running');
//     manager.emit('counter', 42);

//     // Auf Events hören
//     manager.on('userLogin', (payload) => {
//         console.log('Benutzer eingeloggt:', payload);
//     });

//     manager.on('appStatus', (payload) => {
//         console.log('Anwendungsstatus:', payload);
//     });

//     // Aktuellen State speichern
//     await manager.saveState();

//     // Gesamten State abrufen
//     console.log('Gesamter State:', manager.getState());

//     // State laden
//     await manager.loadState();
// })();
