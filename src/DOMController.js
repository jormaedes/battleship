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