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

	_el(tag, className = '') {
		const el = document.createElement(tag);
		if (className) el.className = className;
		return el;
	}

	// ─── SCREEN 1: SETUP ─────────────────────────
	renderSetupScreen() {
		this.clearApp();

		const screen = this._el('div', 'screen setup-screen');

		const title = this._el('h1', 'game-title');
		title.textContent = 'BATTLESHIP';

		const subtitle = this._el('p', 'subtitle');
		subtitle.textContent = 'Naval Combat Simulator';

		const card = this._el('div', 'setup-card');

		const label = this._el('label', 'input-label');
		label.textContent = 'Commander Name';

		const input = this._el('input', 'name-input');
		input.type = 'text';
		input.placeholder = 'Enter your name...';
		input.maxLength = 20;

		const btn = this._el('button', 'btn btn-primary');
		btn.textContent = 'CONTINUE';

		btn.addEventListener('click', () => {
			const name = input.value.trim();
			if (!name) {
				input.classList.add('error');
				return;
			}
			input.classList.remove('error');
			this.playerName = name;
			this.renderPlacementScreen();
		});

		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') btn.click();
		});

		card.append(label, input, btn);
		screen.append(title, subtitle, card);
		this.app.appendChild(screen);
		setTimeout(() => input.focus(), 50);
	}
	renderPlacementScreen() { }
	renderGameScreen() { }

	// helpers
	renderBoard(gameboard, container, isEnemy = false) { }
	updateMessage(text) { }
	clearApp() { this.app.innerHTML = ''; }
}