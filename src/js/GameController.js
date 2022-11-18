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
    this.gamePlay = gamePlay;
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
    console.log(positions[-1])
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
    return position;
  }

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(position) {
    const characterPositionCheck = this.getCharPosition(position);

    if (characterPositionCheck.character) {
      const character = characterPositionCheck.character;
      const lvlIcon = '\u{1F396}';
      const attackIcon = '\u{2694}';
      const defenceIcon = '\u{1F6E1}';
      const healthIcon = '\u{2764}';
      const toolTip = `${lvlIcon} ${character.level} ${attackIcon} ${character.attack} ${defenceIcon} ${character.defence} ${healthIcon} ${character.health}`;
      this.gamePlay.showCellTooltip(toolTip, position);
    }

    // TODO: react to mouse enter
  }

  onCellLeave(position) {
    this.gamePlay.hideCellTooltip(position);

    // TODO: react to mouse leave
  }
}
