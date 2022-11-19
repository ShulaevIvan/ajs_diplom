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
  
  saveSelectedChar(position) {
    const selectedChar = this.selectedCharacters.get(position)
    if (selectedChar != undefined) {
      this.selectedCharacters.clear()
      return position;
    }
  }

  onCellClick(index) {
    // TODO: react to click
    const checkChar = this.characters.find((item) => item.position === index && item.character != undefined);
    const checkCharClass = Boolean(this.playerCharPull.find((item) => checkChar?.character && checkChar.character instanceof item));
    const checkCharEnemy = Boolean(this.enemyCharPull.find((item) => checkChar?.character && checkChar.character instanceof item ));

    if (checkChar?.character && checkCharClass) {
      this.characters.forEach((item) => {
        this.gamePlay.deselectCell(item.position);
      })
      this.selectedCharacters.set(index, checkChar.character)
      this.gamePlay.selectCell(index);
      this.saveSelectedChar(index,  checkChar.character)
    } else if (checkChar?.character && checkCharEnemy) {
      GamePlay.showError('test');
    }
  }
  
  onCellEnter(position) {
    // TODO: react to mouse enter
    const characterPositionCheck = this.getCharPosition(position);
    if (characterPositionCheck !== undefined) {
      const character = characterPositionCheck.character;
      const lvlIcon = '\u{1F396}';
      const attackIcon = '\u{2694}';
      const defenceIcon = '\u{1F6E1}';
      const healthIcon = '\u{2764}';
      const toolTip = `${lvlIcon} ${character.level} ${attackIcon} ${character.attack} ${defenceIcon} ${character.defence} ${healthIcon} ${character.health}`;
      this.gamePlay.showCellTooltip(toolTip, position);
    }
  }

  onCellLeave(position) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(position);
  }
}
