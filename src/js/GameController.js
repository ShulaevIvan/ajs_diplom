import themes from './themes.js';
import GamePlay from './GamePlay.js';
import Bowman from './characters/Bowman.js'
import Swordsman from './characters/Swordsman.js';
import Magician from './characters/Magican.js';
import Daemon from './characters/Deamon.js';
import Undead from './characters/Undead.js';
import Vampire from './characters/Vampire.js';
import generateTeam  from './generators.js';
import PositionedCharacter from './PositionedCharacter.js';
import Team from './Team.js';
import cursors from './cursors.js';
import Character from './Character.js';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay
    this.stateService = stateService;
    this.playerTeam = new Team();
    this.aiTeam = new Team();
    this.characters = [];
    this.counter = 0;
    this.indexChar = null;
    this.indexCursor = null;
    this.gameLevel = 1;
    this.points = 0;
    this.pointsHistory = [];
    this.playerCharPull = [Bowman, Swordsman, Magician];
    this.enemyCharPull = [Daemon, Undead, Vampire];
    this.selectedCharacters = new Map()
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.playerTeam.addAllChars(...generateTeam(this.playerCharPull, 3, 4));
    this.aiTeam.addAllChars(...generateTeam(this.enemyCharPull, 3, 4));
    this.createBaseTeamPositions(this.playerTeam, true);
    this.createBaseTeamPositions(this.aiTeam);
    this.gamePlay.redrawPositions(this.characters);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  setCharPoitions(positions) {
    let position = positions[Math.floor(Math.random() * positions.length)];
    if (this.checkDuplicatePos(position)) {
      return this.setCharPoitions(positions);
    }
    return position;
  }

  checkDuplicatePos(position) {
    return this.characters.some((character) => character.position === position);
  }

  createBaseTeamPositions(team, teamPos) {

    if (teamPos) {
      teamPos = [
        0, 1, 8, 
        9, 16, 17, 
        24, 25, 32, 
        33, 40, 41, 
        48, 49, 56, 
        57,
      ];
    } 
    else {
      teamPos = [
        6, 7, 14, 
        15, 22, 23, 
        30, 31, 38, 
        39, 46, 47, 
        54, 55, 62, 
        63,
      ];
    }

    for (const character of team) {
      const position = this.setCharPoitions(teamPos);
      const positionedCharacter = new PositionedCharacter(character, position);
      this.characters.push(positionedCharacter);
    }
    return this.characters;
  }

  getCharPosition(position) {
    const checkChar = this.characters.find((item) => item.position === position);
    if (checkChar) {
      return checkChar;
    }
  }
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  
  checkSelectedChar(position) {
    const selectedChar = this.selectedCharacters.get(position)
    return position;
  }

  onCellClick(index) {
    // TODO: react to click
    const checkChar = this.characters.find((item) => item.position === index && item?.character);
    const checkCharClass = Boolean(this.playerCharPull.find((item) => checkChar?.character && checkChar.character instanceof item));
    const checkCharEnemy = Boolean(this.enemyCharPull.find((item) => checkChar?.character && checkChar.character instanceof item ));

    if (checkChar?.character && checkCharClass) {
      this.characters.forEach((item) => {
        this.gamePlay.deselectCell(item.position);
      })
      this.selectedCharacters.clear()
      this.selectedCharacters.set(index, checkChar.character)
      this.gamePlay.selectCell(index);
    } else if (checkChar?.character && checkCharEnemy) {
      GamePlay.showError('test');
    }

  }
  
  onCellEnter(position) {
    // TODO: react to mouse enter
    this.gamePlay.setCursor(cursors.auto);
    const charPosCheck = this.getCharPosition(position);
    let selectedChar = undefined;
    let checkEnemy = Boolean(this.enemyCharPull.find((item) => charPosCheck?.character && charPosCheck.character instanceof item ))
    for (let [key] of this.selectedCharacters) {
      selectedChar = key;
    }
    if (charPosCheck !== undefined) {
      const character = charPosCheck.character;
      const lvlIcon = '\u{1F396}';
      const attackIcon = '\u{2694}';
      const defenceIcon = '\u{1F6E1}';
      const healthIcon = '\u{2764}';
      const toolTip = `${lvlIcon} ${character.level} ${attackIcon} ${character.attack} ${defenceIcon} ${character.defence} ${healthIcon} ${character.health}`;
      this.gamePlay.showCellTooltip(toolTip, position);
    }

    if (charPosCheck?.character && charPosCheck.character instanceof Character) {
      this.gamePlay.setCursor(cursors.pointer);
    }
    else if (charPosCheck !== position && selectedChar && !checkEnemy) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(position, 'green')
    }
    if (checkEnemy && selectedChar) {
      this.gamePlay.setCursor(cursors.crosshair);
      this.gamePlay.selectCell(position, 'red')
    }
    console.log(checkEnemy)
    console.log(selectedChar)
  }


  onCellLeave(position) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(position);
    this.gamePlay.setCursor(cursors.auto)
  }
}
