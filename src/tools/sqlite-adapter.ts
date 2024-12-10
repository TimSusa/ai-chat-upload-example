import sqlite3 from "sqlite3";
import { open } from "sqlite";

export class SQLiteAdapter implements StateAdapter {
  private db: sqlite3.Database;

  constructor(dbPath: string) {
    this.db = new sqlite3.Database(dbPath);
    this.db.run(
      `CREATE TABLE IF NOT EXISTS state (
                key TEXT PRIMARY KEY,
                value TEXT
            )`
    );
  }

  async save(state: Map<string, EventPayload>): Promise<void> {
    const db = await open({ filename: ":memory:", driver: sqlite3.Database });
    await db.run("BEGIN TRANSACTION");
    for (const [key, value] of state.entries()) {
      await db.run(
        "INSERT OR REPLACE INTO state (key, value) VALUES (?, ?)",
        key,
        JSON.stringify(value)
      );
    }
    await db.run("COMMIT");
    console.log("State in SQLite gespeichert.");
  }

  async load(): Promise<Map<string, EventPayload>> {
    const db = await open({ filename: ":memory:", driver: sqlite3.Database });
    const rows = await db.all("SELECT * FROM state");
    const loadedState: Map<string, EventPayload> = new Map();
    rows.forEach((row) => {
      loadedState.set(row.key, JSON.parse(row.value));
    });
    console.log("State aus SQLite geladen.");
    return loadedState;
  }
}

// Usage:
// (async () => {
//   const sqliteAdapter = new SQLiteAdapter("./state.db");
//   const manager = new StateEventManager(sqliteAdapter);

//   // Event senden
//   manager.emit("userLogin", { username: "JaneDoe", time: Date.now() });
//   manager.emit("appStatus", "stopped");

//   // State speichern und laden
//   await manager.saveState();
//   await manager.loadState();
//   console.log("Geladener State:", manager.getState());
// })();
