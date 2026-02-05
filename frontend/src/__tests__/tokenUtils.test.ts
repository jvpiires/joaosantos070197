const { createToken, validateToken, isTokenExpired } = require('../tokenUtils');

test('createToken should return a valid token', () => {
	const token = createToken({ userId: 1 });
	expect(token).toBeDefined();
	expect(typeof token).toBe('string');
});

test('validateToken should return true for a valid token', () => {
	const token = createToken({ userId: 1 });
	const isValid = validateToken(token);
	expect(isValid).toBe(true);
});

test('validateToken should return false for an invalid token', () => {
	const isValid = validateToken('invalid.token.string');
	expect(isValid).toBe(false);
});

test('isTokenExpired should return false for a non-expired token', () => {
	const token = createToken({ userId: 1 }, { expiresIn: '1h' });
	const expired = isTokenExpired(token);
	expect(expired).toBe(false);
});

test('isTokenExpired should return true for an expired token', () => {
	const token = createToken({ userId: 1 }, { expiresIn: '-1s' });
	const expired = isTokenExpired(token);
	expect(expired).toBe(true);
});