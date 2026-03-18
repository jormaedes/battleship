import { GameController } from './GameController.js';
import { Ship } from './Ship.js';

const SHIPS = [
  { name: 'Carrier', length: 5 },
  { name: 'Battleship', length: 4 },
  { name: 'Destroyer', length: 3 },
  { name: 'Submarine', length: 3 },
  { name: 'Patrol Boat', length: 2 },
];

export class DOMController {
  constructor(gameController) {
    this.game = gameController;
    this.app = document.getElementById('app');
    this.playerName = '';
  }

  init() {
    this.renderSetupScreen();
  }

  renderSetupScreen() {  }
  renderPlacementScreen() {  }
  renderGameScreen() {  }

  // helpers
  renderBoard(gameboard, container, isEnemy = false) {  }
  updateMessage(text) {  }
  clearApp() { this.app.innerHTML = ''; }
}