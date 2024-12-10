# AI Tools

A collection of tools.

## Features
- **PDF Uploader**: From Client to Server
- 🛠 **Server Sent Events**: SSE Server, sends back an answer

## Prerequisites
- **bun**: Ensure bun is installed.

## Installation Dependencies

```bash
bun i
cd client && bun i && cd ..
```

### **Usage of the State Event Manager**

```typescript
(async () => {
    // Creating an Event Manager with In-Memory Adapter
    const manager = new StateEventManager();

    // Send events
    manager.emit('userLogin', { username: 'JohnDoe', time: Date.now() });
    manager.emit('errorLog', ['Error 404', 'Error 500']);
    manager.emit('appStatus', 'running');
    manager.emit('counter', 42);

    // Listen for events
    manager.on('userLogin', (payload) => {
        console.log('User logged in:', payload);
    });

    manager.on('appStatus', (payload) => {
        console.log('Application status:', payload);
    });

    // Save current state
    await manager.saveState();

    // Retrieve entire state
    console.log('Entire State:', manager.getState());

    // Load state
    await manager.loadState();
})();
```

### Usage Sqlite Adapter

```typescript

(async () => {
  const sqliteAdapter = new SQLiteAdapter("./state.db");
  const manager = new StateEventManager(sqliteAdapter);

  // Send events
  manager.emit("userLogin", { username: "JaneDoe", time: Date.now() });
  manager.emit("appStatus", "stopped");

  // Save and load state
  await manager.saveState();
  await manager.loadState();
  console.log("Loaded State:", manager.getState());
})();
```

### Usage Immutable State Event Proxy Manager

```typescript
// Example
const immutableState = new ImmutableStateManager({ theme: 'light', user: null });

immutableState.on('stateChanged', ({ oldState, newState }) => {
  console.log('State updated:', oldState, '->', newState);
});

immutableState.setState({ theme: 'dark' });
console.log(immutableState.getState().theme); // Returns 'dark'

// Direct attempt to change the state fails
try {
  immutableState.getState().theme = 'light'; // Error: State is immutable
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
