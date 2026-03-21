import { stringifyJson } from "@main/lib/json";
import { createLogger } from "@shared/utils/console";
import { Event, IpcMainEvent, IpcMainInvokeEvent } from "electron";
import { debounce } from "lodash-es";
import { serverMain } from "./serverEvents";
const classIpcStoreSymbol = Symbol("__ipcEvents");
type IpcFilterOption<T extends Event> = (ev: T, ...args: any[]) => boolean;
interface IpcContextEvent {
  name: string;
  type?: "once" | "handle";
  options?: {
    debounce?: number;
    filter?: IpcFilterOption<IpcMainEvent | IpcMainInvokeEvent> | ((...args: any[]) => boolean);
    passive?: boolean;
    debug?: boolean;
  };
}
export interface IpcContextOptions {
  prefix?: string;
}

export function IpcContextWithOptions(contextOptions?: IpcContextOptions) {
  return function <T extends { new (...args: any[]): {} }>(IpcContextBase: T) {
    return class extends IpcContextBase {
      public get __registeredIpcEvents() {
        return this[Object.getOwnPropertySymbols(this)[0]]?.values?.();
      }
      constructor(...args: any[]) {
        super(...args);
        const symbols: any = IpcContextBase.prototype[classIpcStoreSymbol];
        if (symbols) {
          symbols.forEach(({ name, type, options }: IpcContextEvent, method: string) => {
            const eventName = contextOptions?.prefix ? `${contextOptions.prefix}${name}` : name;
            const log = createLogger("IPC").child(`${eventName}:ipc.${type ?? "on"}`);
            const func = (...args: any[]) => {
              if (options?.debug)
                log.debug(
                  `hit, payload size: ${new Blob([stringifyJson(args ?? null)]).size} bytes`,
                );
              if (
                typeof (this as any)[method] === "function" &&
                (options && options.filter && typeof options.filter === "function"
                  ? options.filter(args[0], ...args.slice(1))
                  : true)
              ) {
                return type === "handle"
                  ? Promise.resolve((this as any)[method](...args))
                  : (this as any)[method](...args);
              }
              return Promise.resolve(null);
            };
            serverMain[type === "once" ? "once" : type === "handle" ? "handle" : "on"](
              eventName,
              options && options.debounce ? debounce(func, options.debounce) : func,
            );
          });
        }
      }
    };
  };
}

export function IpcContext<T extends { new (...args: any[]): {} }>(IpcContextBase: T) {
  return IpcContextWithOptions()(IpcContextBase);
}

export function IpcOnce(event: string): MethodDecorator {
  return function <T>(
    target: any,
    propertyKey: string | symbol,
    _descriptor?: TypedPropertyDescriptor<T>,
  ) {
    target[classIpcStoreSymbol] = target[classIpcStoreSymbol] || new Map();
    target[classIpcStoreSymbol].set(propertyKey, <IpcContextEvent>{
      name: event,
      type: "once",
    });
  };
}
export function IpcOn(event: string, options?: IpcContextEvent["options"]): MethodDecorator {
  return function <T>(
    target: any,
    propertyKey: string | symbol,
    _descriptor?: TypedPropertyDescriptor<T>,
  ) {
    target[classIpcStoreSymbol] = target[classIpcStoreSymbol] || new Map();
    target[classIpcStoreSymbol].set(propertyKey, <IpcContextEvent>{
      name: event,
      options,
    });
  };
}
export function IpcHandle(event: string, options?: IpcContextEvent["options"]): MethodDecorator {
  return function <T = any>(
    target: any,
    propertyKey: string | symbol,
    _descriptor?: TypedPropertyDescriptor<T>,
  ) {
    target[classIpcStoreSymbol] = target[classIpcStoreSymbol] || new Map();
    target[classIpcStoreSymbol].set(propertyKey, <IpcContextEvent>{
      name: event,
      type: "handle",
      options,
    });
  };
}
