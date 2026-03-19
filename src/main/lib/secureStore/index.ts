import { createEncryptedStore } from "../store/createYmlStore";
type Credential = {
	account: string;
	password: string;
};
type Credentials = Array<Credential>;
type CredentialStore = {
	credentials: Record<string, any | null | undefined>;
};
const storePromise = createEncryptedStore<CredentialStore>("credentials", {
	defaults: { credentials: {} },
});
class SecureStore {
	async getAll(): Promise<Credentials> {
		return Object.entries((await storePromise).get("credentials", {})).map(
			([account, password]) =>
				({
					account,
					password,
				}) as Credential,
		);
	}
	async set(key: string, value: string): Promise<string | null> {
		(await storePromise).set(`credentials.${key}`, value);
		return value;
	}
	async get<T = any>(key: string): Promise<T | null> {
		const value = (await storePromise).get(`credentials.${key}`, null);
		return value;
	}
	async delete(key: string): Promise<boolean> {
		(await storePromise).delete(`credentials.${key}`);
		return true;
	}
	readonly setPassword: typeof this.set = this.set.bind(this);
	readonly getPassword: typeof this.get = this.get.bind(this);
}

const secureStore = new SecureStore();
export default secureStore;
