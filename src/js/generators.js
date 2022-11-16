/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
 export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const randIndex = Math.floor(Math.random() * allowedTypes.length);
    yield new allowedTypes[randIndex](Math.floor(Math.random() * maxLevel) + 1);
  }
}

export default function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = [];
  const character = characterGenerator(allowedTypes, maxLevel);

  for (let i = 0; i < characterCount; i++) {
    team.push(character.next(i).value);
  }

  return team;
}