import Character from '../Character';
import GameController from '../GameController';
import { calcTileType } from '../utils';

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
