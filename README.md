# AI Tools

A collection of tools.

## Features
- 🛠 **Server Sent Events**: SSE Server


## Prerequisites
- **buns**: Ensure bun is installed.

## Installation Dependencies

```bash
bun i
cd client && bun i && cd ..
```

### **Usage of the State Event Manager**

```typescript
(async () => {
    // Erstellen eines Event-Managers mit In-Memory-Adapter
    const manager = new StateEventManager();

    // Event senden
    manager.emit('userLogin', { username: 'JohnDoe', time: Date.now() });
    manager.emit('errorLog', ['Error 404', 'Error 500']);
    manager.emit('appStatus', 'running');
    manager.emit('counter', 42);

    // Auf Events hören
    manager.on('userLogin', (payload) => {
        console.log('Benutzer eingeloggt:', payload);
    });

    manager.on('appStatus', (payload) => {
        console.log('Anwendungsstatus:', payload);
    });

    // Aktuellen State speichern
    await manager.saveState();

    // Gesamten State abrufen
    console.log('Gesamter State:', manager.getState());

    // State laden
    await manager.loadState();
})();
```

### Usage Sqlite Adapter

```typescript

(async () => {
  const sqliteAdapter = new SQLiteAdapter("./state.db");
  const manager = new StateEventManager(sqliteAdapter);

  // Event senden
  manager.emit("userLogin", { username: "JaneDoe", time: Date.now() });
  manager.emit("appStatus", "stopped");

  // State speichern und laden
  await manager.saveState();
  await manager.loadState();
  console.log("Geladener State:", manager.getState());
})();
```

### Usage Immutable State Event Proxy Manager

```typescript
// Beispiel
const immutableState = new ImmutableStateManager({ theme: 'light', user: null });

immutableState.on('stateChanged', ({ oldState, newState }) => {
  console.log('State updated:', oldState, '->', newState);
});

immutableState.setState({ theme: 'dark' });
console.log(immutableState.getState().theme); // Gibt 'dark' zurück

// Direkter Versuch, den Zustand zu ändern, schlägt fehl
try {
  immutableState.getState().theme = 'light'; // Fehler: State is immutable
} catch (e) {
  console.error(e.message);
}
```

### Server Start
```bash
bun start:server
```

### Client Start
- Open a new console
```bash
bun start:client
```

## License
This project is licensed under the ISC License. See the LICENSE file for details.

---


