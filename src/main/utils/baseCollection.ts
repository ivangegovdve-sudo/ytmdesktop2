import logger from "@shared/utils/Logger";
import { App } from "electron";
import { BaseProvider } from "./baseProvider";

export interface CollectionItem {
	getName?(): string;
	eventName?: string;
	__registerProviders?(providers: BaseProvider[]): void;
	__registerApp?(app: App): void;
	__registerWindows?(context: any): void;
}

export type LifecycleEvent = "OnInit" | "OnDestroy" | "AfterInit" | "BeforeStart";

const GLOB_PATTERNS = {
	services: () => import.meta.glob("../services/*.service.ts", { eager: true }),
	providers: () => import.meta.glob("../providers/*.provider.ts", { eager: true }),
	events: () => import.meta.glob("../events/*.event.ts", { eager: true }),
} as const;
export abstract class BaseCollection<T extends CollectionItem> {
	protected items: T[] = [];
	protected logger = logger.child(this.constructor.name);
	private _itemsMap: Map<string, T> = new Map();
	private _cachedNames: string[] = [];

	constructor(protected readonly app: App) {}

	protected async initializeItems(globPattern: keyof typeof GLOB_PATTERNS) {
		const patternImport = GLOB_PATTERNS[globPattern];
		if (!patternImport) {
			throw new Error(`Invalid glob pattern: ${globPattern}`);
		}
		const collectionEntries = patternImport();
		this.items = Object.values(collectionEntries)
			.map((m: any) => m.default)
			.filter(Boolean)
			.map((item: any) => new item(this.app));

		// ⚡ Bolt: Cache provider names and build an O(1) lookup map to optimize getProvider calls.
		// Replaces O(n) array traversals with constant-time Map lookups for frequently accessed services.
		this._itemsMap.clear();
		this._cachedNames = [];
		this.items.forEach((item) => {
			const name = item.getName?.() ?? item.eventName ?? "";
			this._cachedNames.push(name);
			// Array.find returns the FIRST match, so we only set in Map if it doesn't exist yet
			if (name && !this._itemsMap.has(name)) {
				this._itemsMap.set(name, item);
			}
			if (item.eventName && item.eventName !== name && !this._itemsMap.has(item.eventName)) {
				this._itemsMap.set(item.eventName, item);
			}
		});
	}

	getProviderNames(): string[] {
		return this._cachedNames;
	}

	getProvider<K extends string>(name: K): T | undefined {
		return this._itemsMap.get(name);
	}

	protected async executeMethod(methodName: string, ...args: any[]): Promise<any[]> {
		const itemsWithMethod = this.items.filter((x) => typeof (x as any)[methodName] === "function");
		if (itemsWithMethod.length === 0) return [];

		return await Promise.all(itemsWithMethod.map((x) => Promise.resolve((x as any)[methodName](...args))));
	}

	getItems(): T[] {
		return this.items;
	}

	async executeLifecycleEvent(event: LifecycleEvent, ...args: any[]): Promise<any[]> {
		try {
			return await this.executeMethod(event, ...args);
		} catch (err) {
			this.logger.error(`Error executing ${event}`, err);
			throw err;
		}
	}

	registerWindows(context: any) {
		this.items.forEach((item) => {
			if (typeof item.__registerWindows === "function") {
				item.__registerWindows(context);
			}
		});
	}

	registerProviders(providers: BaseProvider[]) {
		this.items.forEach((item) => {
			if (typeof item.__registerProviders === "function") {
				item.__registerProviders(providers);
			}
		});
	}

	registerApp() {
		this.items.forEach((item) => {
			if (typeof item.__registerApp === "function") {
				item.__registerApp(this.app);
			}
		});
	}
}
