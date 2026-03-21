import { readFileSync, rmSync } from "fs";
import path from "path";
import { app } from "electron";
import { Migration } from "electron-conf";
import type { SettingsStore } from "./settings.service";

const migrations: Omit<Migration<SettingsStore>, "version">[] = [
  {
    hook(store) {
      const { migratedFromJson } = store.store?.__meta ?? {};
      if (migratedFromJson) return;
      const oldConfigPath = path.resolve(app.getPath("userData"), "app-settings.json");
      let oldConfigBody;
      try {
        oldConfigBody = readFileSync(oldConfigPath, "utf8");
      } catch (err: unknown) {
        if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
          store.set("__meta.migratedFromJson", true);
          return;
        }
        throw err;
      }
      if (!oldConfigBody) return;
      rmSync(oldConfigPath);
      const oldConfig = JSON.parse(oldConfigBody);
      store.set(oldConfig);
      store.set("__meta.migratedFromJson", true);
    },
  },
  {
    hook(store) {
      store.set("volumeRatio", {
        enabled: true,
        volume: 0.1,
      });
    },
  },
  {
    hook(store) {
      store.set("plugins", {
        bypass_age_restrictions: {
          enabled: true,
        },
      });
    },
  },
  {
    hook(store) {
      store.set("app.enableTaskbarProgress", true);
    },
  },
  {
    hook(store) {
      store.set("customcss.thumbnailBackground", true);
    },
  },
];

export default migrations;
