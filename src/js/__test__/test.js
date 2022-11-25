import Character from '../Character';
import { calcTileType } from '../utils';
import GameController from '../GameController';
import checkSide from '../checkSide';
import GamePlay from '../GamePlay';

jest.mock('../GamePlay');

test.each([
  [0, 'top-left'],
  [1, 'top'],
  [4, 'top'],
  [7, 'top-right'],
  [8, 'left'],
  [9, 'center'],
  [15, 'right'],
  [56, 'bottom-left'],
  [60, 'bottom'],
  [63, 'bottom-right'],
])('Field cell type %s', (value, expected) => {
  expect(calcTileType(value, 8)).toEqual(expected);
});

test('test create character', () => {
  function fn() {
    const char = new Character();
  }
  expect(fn).toThrowError('err ....');
});

test('test toolTipTemplate', () => {
  const data = {
    character: {
      level: 2,
      health: 90,
      attack: 100,
      defence: 45,
    },
  };
  const received = GameController.toolTipTemplate(data.character);
  const expected = '\u{1F396} 2 \u{2694} 100 \u{1F6E1} 45 \u{2764} 90';
  expect(received).toBe(expected);
});

test('test attack move', () => {
  const gamePlay = new GamePlay();
  const gameController = new GameController(gamePlay, '');
  const position = 1;
  const data = {
    character: {
      player: checkSide.ai,
    },
  };
  gameController.gameState = {
    availableSteps: [1],
    availableAttack: [1],
  };
  gameController.selectCharacterCursor(position, data);
  expect(gameController.gamePlay.setCursor).toBeCalledWith('crosshair');
});

test('test hover ally char', () => {
  const gamePlay = new GamePlay();
  const gameController = new GameController(gamePlay, '');
  const param = {
    character: {
      player: checkSide.USER,
    },
  };
  gameController.activateCursor(param);
  expect(gameController.gamePlay.setCursor).toBeCalledWith('pointer');
});

test('test hover enemy char', () => {
  const gamePlay = new GamePlay();
  const gameController = new GameController(gamePlay, '');
  const param = {
    character: {
      player: checkSide.ai,
    },
  };
  gameController.activateCursor(param);
  expect(gameController.gamePlay.setCursor).toBeCalledWith('not-allowed');
});
