import { existsSync, mkdirSync, promises as fsPromises } from "fs";
import { join } from "path";
import { base64 } from "@shared/utils/base64";
import { app } from "electron";
import Encryption from "encryption.js";

const cachePath = join(app.getPath("userData"), "cache");
if (!existsSync(cachePath)) mkdirSync(cachePath);
export async function cacheWithFile<T>(fn: () => Promise<T>, key: string): Promise<T> {
	const enc = new Encryption({ secret: base64.encode(key) });
	const cacheFile = join(cachePath, key + ".ytm");
	if (existsSync(cacheFile)) {
		return enc.decrypt(await fsPromises.readFile(cacheFile, "utf8"));
	}
	const result = (await fn()) as T;
	await fsPromises.writeFile(cacheFile, enc.encrypt(result));
	return result;
}
