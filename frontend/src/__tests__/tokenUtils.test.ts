import { describe, expect, it } from 'vitest';
import { tokenUtils } from '../utils/tokenUtils';

const base64Url = (value: string) =>
	btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const createJwt = (payload: object) => {
	const header = base64Url(JSON.stringify({ alg: 'none', typ: 'JWT' }));
	const body = base64Url(JSON.stringify(payload));
	return `${header}.${body}.`;
};

describe('tokenUtils', () => {
	it('saveToken/getToken/removeToken work with localStorage', () => {
		tokenUtils.saveToken('test-token');
		expect(tokenUtils.getToken()).toBe('test-token');

		tokenUtils.removeToken();
		expect(tokenUtils.getToken()).toBeNull();
	});

	it('decodeToken returns payload data', () => {
		const token = createJwt({ sub: 'user', exp: 9999999999, iat: 1, role: 'USER' });
		const decoded = tokenUtils.decodeToken(token);

		expect(decoded?.sub).toBe('user');
		expect(decoded?.role).toBe('USER');
	});

	it('isTokenExpired is false when exp is in the future', () => {
		const exp = Math.floor(Date.now() / 1000) + 60;
		const token = createJwt({ sub: 'user', exp, iat: exp - 60, role: 'USER' });

		expect(tokenUtils.isTokenExpired(token)).toBe(false);
	});
});