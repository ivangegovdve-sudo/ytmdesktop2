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
	protected itemMap: Map<string, T> = new Map();
	protected cachedNames: string[] = [];
	protected logger = logger.child(this.constructor.name);

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

		// Iterate backwards so that if duplicates exist, the first item added (index 0)
		// will overwrite the later items in the Map, matching the behavior of `.find()`
		for (let i = this.items.length - 1; i >= 0; i--) {
			const item = this.items[i];
			const name = item.getName?.();
			const eventName = item.eventName;

			if (name !== undefined) this.itemMap.set(name, item);
			if (eventName !== undefined) this.itemMap.set(eventName, item);
		}

		// Precompute cachedNames to avoid O(n) map on every getProviderNames() call
		this.cachedNames = this.items.map((x) => x.getName?.() ?? x.eventName ?? "");
	}

	getProviderNames(): string[] {
		// Return a copy so callers cannot mutate the internal cache
		return [...this.cachedNames];
	}

	getProvider<K extends string>(name: K): T | undefined {
		return this.itemMap.get(name);
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
