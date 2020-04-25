import { handleUserIsInPreview } from './socketEventHandlers';

describe('socketEventHandlers', () => {
  test('handleUserIsInPreview()', () => {
    const socket = {
      join: jest.fn(),
    };
    const onUserIsInPreview = handleUserIsInPreview(socket);
    onUserIsInPreview({ roomId: 'foobar' });
    expect(socket.join).toHaveBeenCalledTimes(1);
    expect(socket.join).toHaveBeenCalledWith('foobar');
  });
});
