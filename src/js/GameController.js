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
    this.gameLevel = 1;
    this.playerCharPull = [Bowman, Swordsman, Magician];
    this.enemyCharPull = [Daemon, Undead, Vampire];
    this.selectedCharacters = new Map();
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
  moveChar(clickedPosition) {
    this.characters.forEach((item) => {
      if (item.position == Array.from(this.selectedCharacters.keys())[0]) {
        item.position = clickedPosition;
        this.gamePlay.redrawPositions(this.characters);
        let a = this.characters.find((char) => char.position == clickedPosition)
        this.gamePlay.selectCell(a.position)
      }
    })
  }
  getCharClassDistance(character) {
    const charObj = {};
    charObj['position'] = Array.from(character.keys())[0];
    charObj['type'] = Array.from(character.values())[0];
    if (charObj.type  instanceof Magician || charObj.type instanceof Daemon) {
      return 1
    }
    else if (charObj.type instanceof Bowman || charObj.type instanceof Vampire) {
      return 2
    }
    else if (charObj.type instanceof Swordsman || charObj.type  instanceof Undead) {
      return 4
    }
  }
  getCharAttackRange(character) {
    const charObj = {};
    charObj['position'] = Array.from(character.keys())[0];
    charObj['type'] = Array.from(character.values())[0];
    if (charObj.type  instanceof Magician || charObj.type instanceof Daemon) {
      return 4
    }
    else if (charObj.type instanceof Bowman || charObj.type instanceof Vampire) {
      return 2
    }
    else if (charObj.type instanceof Swordsman || charObj.type  instanceof Undead) {
      return 1
    }
  }
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService

  onCellClick(index) {
    // TODO: react to click
    const checkChar = this.characters.find((item) => item.position === index && item?.character);
    const checkCharClass = Boolean(this.playerCharPull.find((item) => checkChar?.character && checkChar.character instanceof item));
    const checkCharEnemy = Boolean(this.enemyCharPull.find((item) => checkChar?.character && checkChar.character instanceof item ));
    const charDistance = this.getCharClassDistance(this.selectedCharacters);
    const charMovePoints = this.getAvalibleMove(Array.from(this.selectedCharacters.keys())[0], charDistance);
    this.characters.forEach((item) => {
      this.gamePlay.deselectCell(item.position);
    })

    if (checkChar?.character && checkCharClass) {
      this.selectedCharacters.clear();
      this.selectedCharacters.set(index, checkChar.character);
      this.gamePlay.selectCell(Array.from(this.selectedCharacters.keys())[0])
    } 
    if (checkChar?.character && checkCharEnemy) {
      GamePlay.showError('test');
    }
    if (!this.characters.includes(this.getCharPosition(index)) && charMovePoints.includes(index)) {
      this.moveChar(index);
    }
  }
  
  onCellEnter(position) {
    // TODO: react to mouse enter
    const charPosCheck = this.getCharPosition(position);
    const checkEnemy = Boolean(this.enemyCharPull.find((item) => charPosCheck?.character && charPosCheck.character instanceof item ))
    const checkPlayer = Boolean(this.playerCharPull.find((item) => charPosCheck?.character && charPosCheck.character instanceof item ))
    const charDistance = this.getCharClassDistance(this.selectedCharacters);
    const charMovePoints = this.getAvalibleMove(Array.from(this.selectedCharacters.keys())[0], charDistance);
    const charAttackDist = this.getCharAttackRange(this.selectedCharacters);
    const charAttackRange = this.getAvalibleMove(Array.from(this.selectedCharacters.keys())[0], charAttackDist);

    this.gamePlay.setCursor(cursors.auto);

    if (charPosCheck !== undefined) {
      const character = charPosCheck.character;
      const lvlIcon = '\u{1F396}';
      const attackIcon = '\u{2694}';
      const defenceIcon = '\u{1F6E1}';
      const healthIcon = '\u{2764}';
      const toolTip = `${lvlIcon} ${character.level} ${attackIcon} ${character.attack} ${defenceIcon} ${character.defence} ${healthIcon} ${character.health}`;
      this.gamePlay.showCellTooltip(toolTip, position);
    }

    if (charPosCheck?.character && charPosCheck?.character instanceof Character) {
      this.gamePlay.setCursor(cursors.pointer);
    }
    else if (charPosCheck != position && !checkEnemy && charMovePoints.includes(position)) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(position, 'green');
    }
    if(checkEnemy && charAttackRange.includes(position)) {
      this.gamePlay.setCursor(cursors.crosshair);
      this.gamePlay.selectCell(position, 'red');
    }
    else if (charPosCheck != position && !charMovePoints.includes(position) && !checkPlayer && !charAttackRange.includes(position)) {
      this.gamePlay.setCursor(cursors.notallowed);
    }
  }

  onCellLeave(position) {
    this.gamePlay.deselectCell(position)
    if (Array.from(this.selectedCharacters.keys())[0] == position) {
      this.gamePlay.selectCell(position)
    }
  }
  getAvalibleMove(charPosition, distance) {
    const moveArr = [];
    for (let i = 0; i <= distance * 2; i += 1) {
      let n = charPosition - distance * 9 + i * 8;
      const x = charPosition - distance * 8 + i * 8;
      for (let y = 0; y <= distance * 2; y += 1) {
        if (Math.trunc(n / 8) === Math.trunc(x / 8) && n >= 0 && n <= 63) {
          moveArr.push(n++);
        } 
        else { n++; }
      }
    }
    return moveArr;
  }
}
