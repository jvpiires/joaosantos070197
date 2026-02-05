import { beforeEach, describe, expect, it, vi } from 'vitest';
import { albumService } from '../services/albumService';
import apiClient from '../services/apiClient';

vi.mock('../services/apiClient', () => ({
	default: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
	},
}));

const mockedApi = apiClient as unknown as {
	get: ReturnType<typeof vi.fn>;
	post: ReturnType<typeof vi.fn>;
	put: ReturnType<typeof vi.fn>;
	delete: ReturnType<typeof vi.fn>;
};

describe('albumService', () => {
	beforeEach(() => {
		mockedApi.get.mockReset();
		mockedApi.post.mockReset();
		mockedApi.put.mockReset();
		mockedApi.delete.mockReset();
	});

	it('getAll requests the albums endpoint', async () => {
		const payload = { content: [], totalElements: 0, totalPages: 0, size: 10 };
		mockedApi.get.mockResolvedValue({ data: payload });

		const result = await albumService.getAll({ page: 0 });

		expect(mockedApi.get).toHaveBeenCalledWith('/api/v1/albums', { params: { page: 0 } });
		expect(result).toEqual(payload);
	});

	it('getById returns album data', async () => {
		const album = { id: 1, title: 'Test', artistId: 2 };
		mockedApi.get.mockResolvedValue({ data: album });

		const result = await albumService.getById(1);

		expect(mockedApi.get).toHaveBeenCalledWith('/api/v1/albums/1');
		expect(result).toEqual(album);
	});

	it('delete issues a delete request', async () => {
		mockedApi.delete.mockResolvedValue({});

		await albumService.delete(10);

		expect(mockedApi.delete).toHaveBeenCalledWith('/api/v1/albums/10');
	});
});