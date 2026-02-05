const authService = require('../authService');

test('login function should return user data on successful login', async () => {
	const userData = await authService.login('testUser', 'testPassword');
	expect(userData).toHaveProperty('id');
	expect(userData).toHaveProperty('username', 'testUser');
});

test('login function should throw error on failed login', async () => {
	await expect(authService.login('wrongUser', 'wrongPassword')).rejects.toThrow('Invalid credentials');
});

test('logout function should clear user session', () => {
	authService.logout();
	expect(authService.getCurrentUser()).toBeNull();
});

test('session management should return current user', () => {
	authService.login('testUser', 'testPassword');
	const currentUser = authService.getCurrentUser();
	expect(currentUser).toHaveProperty('username', 'testUser');
});

test('session management should return null if no user is logged in', () => {
	authService.logout();
	const currentUser = authService.getCurrentUser();
	expect(currentUser).toBeNull();
});