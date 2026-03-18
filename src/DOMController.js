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
		this.shipsToPlace = [];
		this.currentShipIndex = 0;
		this.orientation = 'horizontal';
		this.tempGrid = null;
		this.messageEl = null;
		this.startBtn = null;
		this.shipListEl = null;
		this.placementGrid = null;
		this.playerBoardEl = null;
		this.computerBoardEl = null;
	}

	clearApp() {
		this.app.innerHTML = '';
	}

	init() {
		this.renderSetupScreen();
	}

	renderSetupScreen() { }
	renderPlacementScreen() { }
	renderGameScreen() { }

	// helpers
	renderBoard(gameboard, container, isEnemy = false) { }
	updateMessage(text) { }
	clearApp() { this.app.innerHTML = ''; }
}