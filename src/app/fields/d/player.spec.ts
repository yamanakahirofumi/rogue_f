import { Player } from './player';

describe('Player', () => {
  it('should create an instance', () => {
    expect(new Player("1", "name")).toBeTruthy();
  });
});
