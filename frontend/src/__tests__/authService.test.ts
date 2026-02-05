import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authService } from '../services/authService';

const mocks = vi.hoisted(() => {
	const authClientPost = vi.fn();
	const axiosPost = vi.fn();
	const axiosCreate = vi.fn(() => ({ post: authClientPost }));

	return { authClientPost, axiosPost, axiosCreate };
});

vi.mock('axios', () => ({
	default: {
		post: mocks.axiosPost,
		create: mocks.axiosCreate,
	},
}));

describe('authService', () => {
	beforeEach(() => {
		mocks.axiosPost.mockReset();
		mocks.authClientPost.mockReset();
		mocks.axiosCreate.mockClear();
	});

	it('login posts to /auth/login and returns data', async () => {
		const response = { token: 'token', userRole: 'USER' };
			mocks.axiosPost.mockResolvedValue({ data: response });

		const result = await authService.login({ login: 'user', password: 'pass' });

			expect(mocks.axiosPost).toHaveBeenCalledWith('http://localhost:3333/auth/login', {
			login: 'user',
			password: 'pass',
		});
		expect(result).toEqual(response);
	});

	it('register posts to /auth/register', async () => {
			mocks.axiosPost.mockResolvedValue({ data: {} });

		await authService.register({ login: 'user', password: 'pass', userRole: 'USER' });

			expect(mocks.axiosPost).toHaveBeenCalledWith('http://localhost:3333/auth/register', {
			login: 'user',
			password: 'pass',
			userRole: 'USER',
		});
	});

	it('refreshToken uses authClient with Authorization header', async () => {
		const response = { token: 'new-token', userRole: 'ADMIN' };
			mocks.authClientPost.mockResolvedValue({ data: response });

		const result = await authService.refreshToken('old-token');

			expect(mocks.authClientPost).toHaveBeenCalledWith(
			'/auth/refresh',
			{},
			{
				headers: {
					Authorization: 'Bearer old-token',
					'Content-Type': 'application/json',
				},
			}
		);
		expect(result).toEqual(response);
	});
});