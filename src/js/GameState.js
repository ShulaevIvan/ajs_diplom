export default class GameState {
  static from(object) {
    // TODO: create object
    const {
      stage,
      teams,
      motion,
      scores,
    } = object;
    return new GameState(stage, teams, motion, scores);
  }

  constructor(stage, teams, motion, scores) {
    this.stage = stage;
    this.teams = teams;
    this.motion = motion;
    this.scores = scores || 0;
    this.availableSteps = null;
    this.availableAttack = null;
    this.selectedCharacter = null;
  }

  clear() {
    this.availableSteps = null;
    this.availableAttack = null;
    this.selectedCharacter = null;
  }

  removeCharacter(index) {
    this.teams = this.teams.filter((member) => member.position !== index);
  }

  addScores() {
    const sum = this.teams.reduce((acc, member) => {
      if (member.character.player === 'player') {
        return acc + member.character.health;
      }
      return acc;
    }, 0);
    this.scores += sum;
  }
}
