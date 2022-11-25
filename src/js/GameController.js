/* eslint-disable */
import themes from './themes';
import GameState from './GameState';
import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import side from './checkSide';
/* eslint-disable */
import { startFieldGenerator, getAvalibleMove, getCharAttackRange } from './generators';
import generateTeam from './generators';
import cursors from './cursors';
/* eslint-enable */
/* eslint-disable max-len */

const playerCharPull = [Swordsman, Bowman, Magician];
const enemyCharPull = [Daemon, Undead, Vampire];

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = null;
  }

  static teamGeneration(teamType, prayer, maxLevel, count) {
    let newTeam = generateTeam(teamType, maxLevel, count);
    const positionList = [];
    if (this.gameState.teams.length) {
      this.gameState.teams.forEach((item) => positionList.push(item.position));
    }
    newTeam = newTeam.toArray.reduce((prev, character) => {
      let randomNumber = startFieldGenerator(prayer);
      while (positionList.includes(randomNumber)) {
        randomNumber = startFieldGenerator(prayer);
      }
      positionList.push(randomNumber);
      prev.push(new PositionedCharacter(character, randomNumber));
      return prev;
    }, []);
    this.gameState.teams.push(...newTeam);
  }

  static levelUp() {
    for (const member of this.gameState.teams) {
      const parameter = member.character;
      member.position = startFieldGenerator(side.USER);
      parameter.level += 1;
      parameter.health = parameter.health + 80 >= 100 ? 100 : parameter.health + 80;
      parameter.attack = Math.floor(Math.max(parameter.attack, parameter.attack * (0.8 + parameter.health / 100)));
    }
  }

  static clearLocalStorage(clearParam) {
    localStorage.removeItem(clearParam);
  }

  init() {
    this.loadGame();
  }

  checkCell() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
  }

  onCellClick(position) {
    // TODO: react to click
    const character = this.gameState.teams.find((item) => item.position === position);
    if (character && character.character.player === side.USER) {
      if (this.gameState.selectedCharacter) this.gamePlay.deselectCell(this.gameState.selectedCharacter.position);
      this.gamePlay.selectCell(position);
      this.gameState.availableSteps = getAvalibleMove(position, character.character.stepsRadius);
      this.gameState.availableAttack = getCharAttackRange(position, character.character.attackRadius);
      this.gameState.selectedCharacter = character;
      return;
    }

    if (this.gameState.selectedCharacter) {
      if (this.gameState.availableSteps.includes(position) && !character) {
        this.gamePlay.deselectCell(this.gameState.selectedCharacter.position);
        this.gameState.selectedCharacter.position = position;
        this.gamePlay.deselectCell(position);
        this.checkLevel();
      }
      if (character && character.character.player === side.ai && this.gameState.availableAttack.includes(position)) {
        this.attackFunc(character, this.gameState.selectedCharacter, position);
      }
      if (character && character.character.player === side.ai && !this.gameState.availableAttack.includes(position)) {
        this.gamePlay.showPopup('Слишком далеко');
      }
      return;
    }
    // Сообщения об ошибке
    if (!this.gameState.selectedCharacter && character && character.character.player === side.ai) {
      let { type } = character.character;
      type = type[0].toUpperCase() + type.slice(1);
      this.gamePlay.showPopup('Ошибка, это персонаж противника');
    }
  }

  onCellLeave(position) {
    this.gamePlay.hideCellTooltip(position);
    if (this.gameState.selectedCharacter && (this.gameState.selectedCharacter.position !== position)) {
      this.gamePlay.deselectCell(position);
    }
  }

  onCellEnter(position) {
    const character = this.gameState.teams.find((elem) => elem.position === position);

    if (character) {
      const toolTip = this.constructor.toolTipTemplate.call(this, character.character);
      this.gamePlay.showCellTooltip(toolTip, position);
    }
    this.activateCursor(character);

    if (this.gameState.selectedCharacter) {
      this.selectCharacterCursor(position, character);
    }
  }

  activateCursor(character) {
    if (character) {
      const pointer = character.character.player === side.USER ? cursors.pointer : cursors.notallowed;
      this.gamePlay.setCursor(pointer);
    } else {
      this.gamePlay.setCursor(cursors.auto);
    }
  }

  selectCharacterCursor(position, character) {
    if (this.gameState.availableSteps.includes(position) && !character) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(position, 'green');
    } else if (character && character.character.player === side.ai && this.gameState.availableAttack.includes(position)) {
      this.gamePlay.setCursor(cursors.crosshair);
      this.gamePlay.selectCell(position, 'red');
    } else if (character && character.character.player === side.USER) {
      this.gamePlay.setCursor(cursors.pointer);
    } else {
      this.gamePlay.setCursor(cursors.notallowed);
    }
  }

  saveGame() {
    this.stateService.save(this.gameState);
    this.gamePlay.showPopup('Игра сохранена');
  }

  loadGame() {
    // Чтобы не добавлялись лишние события при загрузке во время игры
    if (this.gamePlay.cellClickListeners.length === 0) {
      this.checkCell();
    }
    try {
      const load = this.stateService.load();
      if (load) {
        this.gameState = GameState.from(load);
        this.gamePlay.drawUi(Object.values(themes)[this.gameState.stage - 1]);
        this.gamePlay.redrawPositions(this.gameState.teams);
      } else {
        this.newGame();
      }
    } catch (error) {
      this.constructor.clearLocalStorage('state');
      this.gamePlay.showPopup(`Ошибка загрузки: "${error.message}"`);
      this.newGame();
    }
  }

  newGame() {
    if (this.gamePlay.cellClickListeners.length === 0) {
      this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    }
    const totalScores = this.gameState ? this.gameState.scores : 0;
    this.gameState = new GameState(1, [], side.USER, totalScores);
    this.nextLevel(this.gameState.stage);
  }

  nextTurn() {
    this.gameState.motion = (this.gameState.motion === side.USER) ? side.ai : side.USER;
    if (this.gameState.motion === side.ai) {
      this.aiAttack();
    }
    this.gameState.clear();
  }

  checkLevel() {
    const playerValue = this.gameState.teams.some((member) => member.character.player === side.USER);
    const computerValue = this.gameState.teams.some((member) => member.character.player === side.ai);
    if (playerValue && computerValue) {
      this.nextTurn();
      return;
    }
    if (!computerValue) {
      this.gameState.clear();
      this.gameState.addScores();
      this.nextLevel(this.gameState.stage += 1);
    }
    if (!playerValue) {
      this.gamePlay.showPopup('Вы проиграли!');
    }
  }

  nextLevel(stage) {
    if (stage === 1) {
      this.constructor.teamGeneration.call(this, playerCharPull, side.USER, 1, 2);
      this.constructor.teamGeneration.call(this, enemyCharPull, side.ai, 1, 2);
    }

    if (stage > 1 && stage < 5) {
      this.constructor.levelUp.call(this);
      const count = (stage === 2) ? 1 : 2;
      this.constructor.teamGeneration.call(this, playerCharPull, side.USER, stage - 1, count);
      const userCount = this.gameState.teams.filter((member) => member.character.player === side.USER).length;
      this.constructor.teamGeneration.call(this, enemyCharPull, side.ai, stage, userCount);
      this.gamePlay.showPopup(`Уровень ${stage} Счет: ${this.gameState.scores}`);
    }

    if (stage >= 5) {
      this.gamePlay.cellClickListeners.length = 0;
      this.gamePlay.showPopup(`Победа! Счет: ${this.gameState.scores}`);
    } else {
      this.gamePlay.drawUi(Object.values(themes)[this.gameState.stage - 1]);
      this.gamePlay.redrawPositions(this.gameState.teams);
    }
  }

  async attackFunc(attacked, attacker, indexAttacked) {
    const { attack } = attacker.character;
    const { defense } = attacked.character;
    const attackedCharacter = attacked.character;
    const damage = 2 * Math.round(Math.max((attack - defense, attack * 0.1)));
    attackedCharacter.health -= damage;
    if (attacked.character.health <= 0) {
      this.gameState.removeHero(indexAttacked);
    }
    this.gamePlay.selectCell(attacker.position);
    this.gamePlay.selectCell(attacked.position, 'red');
    this.gamePlay.redrawPositions(this.gameState.teams);
    this.gameState.selectedCharacter = null;
    await this.gamePlay.showDamage(indexAttacked, damage);
    this.gamePlay.deselectCell(attacker.position);
    this.gamePlay.deselectCell(attacked.position);
    this.checkLevel();
  }

  aiAttack() {
    const { teams } = this.gameState;
    const aiTeam = teams.filter((member) => member.character.player === side.ai);
    const playerTeam = teams.filter((member) => member.character.player === side.USER);
    const attack = aiTeam.some((aiCharacter) => {
      this.gameState.availableAttack = getCharAttackRange(aiCharacter.position, aiCharacter.character.attackRadius);
      const attacked = playerTeam.find((userUnit) => this.gameState.availableAttack.includes(userUnit.position));
      if (attacked) {
        this.attackFunc(attacked, aiCharacter, attacked.position);
        return true;
      }
      return false;
    });
    if (!attack && aiTeam.length && playerTeam.length) {
      const unit = Math.floor(Math.random() * aiTeam.length);
      const steps = getAvalibleMove(aiTeam[unit].position, aiTeam[unit].character.stepsRadius);
      const step = Math.floor(Math.random() * steps.length);
      aiTeam[unit].position = steps[step];
      this.checkLevel();
      this.gamePlay.redrawPositions(this.gameState.teams);
    }
  }

  static toolTipTemplate(character) {
    const {
      level,
      health,
      attack,
      defence,
    } = character;
    return `\u{1F396} ${level} \u{2694} ${attack} \u{1F6E1} ${defence} \u{2764} ${health}`;
  }
}
