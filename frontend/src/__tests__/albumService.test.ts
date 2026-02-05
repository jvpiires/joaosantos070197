const albumService = require('../albumService');

test('getAlbum should return album data for a valid ID', async () => {
	const albumId = 1;
	const albumData = await albumService.getAlbum(albumId);
	expect(albumData).toHaveProperty('id', albumId);
});

test('getAlbum should throw an error for an invalid ID', async () => {
	await expect(albumService.getAlbum(-1)).rejects.toThrow('Album not found');
});

test('createAlbum should return the created album', async () => {
	const newAlbum = { title: 'New Album', artist: 'Artist Name' };
	const createdAlbum = await albumService.createAlbum(newAlbum);
	expect(createdAlbum).toHaveProperty('id');
	expect(createdAlbum).toHaveProperty('title', newAlbum.title);
});

test('updateAlbum should return the updated album', async () => {
	const updatedData = { title: 'Updated Album' };
	const updatedAlbum = await albumService.updateAlbum(1, updatedData);
	expect(updatedAlbum).toHaveProperty('title', updatedData.title);
});

test('deleteAlbum should return a success message', async () => {
	const response = await albumService.deleteAlbum(1);
	expect(response).toBe('Album deleted successfully');
});