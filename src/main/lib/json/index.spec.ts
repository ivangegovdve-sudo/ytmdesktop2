import { describe, it, expect, vi } from 'vitest';
import { parseJson, stringifyJson } from './index';

describe('json utility', () => {
	describe('parseJson', () => {
		it('should correctly parse a valid JSON string', () => {
			expect(parseJson('{"foo": "bar"}')).toEqual({ foo: 'bar' });
			expect(parseJson('[1, 2, 3]')).toEqual([1, 2, 3]);
			expect(parseJson('"hello"')).toEqual('hello');
			expect(parseJson('123')).toEqual(123);
		});

		it('should return null for non-string values', () => {
			expect(parseJson(123)).toBeNull();
			expect(parseJson({ foo: 'bar' })).toBeNull();
			expect(parseJson(null)).toBeNull();
			expect(parseJson(undefined)).toBeNull();
			expect(parseJson([1, 2, 3])).toBeNull();
		});

		it('should return null and log error for invalid JSON strings', () => {
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			expect(parseJson('{foo: "bar"}')).toBeNull(); // Missing quotes around key
			expect(parseJson('{"foo": }')).toBeNull(); // Missing value
			expect(parseJson('invalid')).toBeNull(); // Not a valid string representation

			expect(consoleSpy).toHaveBeenCalled();
			consoleSpy.mockRestore();
		});
	});

	describe('stringifyJson', () => {
		it('should correctly stringify a valid object or primitive', () => {
			expect(stringifyJson({ foo: 'bar' })).toBe('{"foo":"bar"}');
			expect(stringifyJson([1, 2, 3])).toBe('[1,2,3]');
			expect(stringifyJson('hello')).toBe('"hello"');
			expect(stringifyJson(123)).toBe('123');
			expect(stringifyJson(null)).toBe('null');
			expect(stringifyJson(true)).toBe('true');
		});
	});
});
