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

	// ─── SCREEN 2: PLACEMENT ───────────────────────────────────────────

	renderPlacementScreen() {
		this.clearApp();

		this.shipsToPlace = SHIPS.map(s => ({ ...s, placed: false, ship: null, orientation: 'H' }));
		this.currentShipIndex = 0;
		this.orientation = 'horizontal';
		this.tempGrid = Array.from({ length: 10 }, () => Array(10).fill(null));

		const screen = this._el('div', 'screen placement-screen');

		const title = this._el('h2', 'screen-title');
		title.textContent = 'PLACE YOUR FLEET';

		const hint = this._el('p', 'placement-hint');
		hint.textContent = `Commander ${this.playerName} — deploy your ships`;

		const content = this._el('div', 'placement-content');

		this.shipListEl = this._el('div', 'ship-list');
		this._renderShipList();

		const gridWrapper = this._el('div', 'grid-wrapper');
		const gridLabel = this._el('p', 'grid-label');
		gridLabel.textContent = 'YOUR WATERS';
		this.placementGrid = this._el('div', 'board placement-board');
		this._renderPlacementGrid();
		gridWrapper.append(gridLabel, this.placementGrid);

		content.append(this.shipListEl, gridWrapper);

		const actions = this._el('div', 'placement-actions');
		const randomBtn = this._el('button', 'btn btn-secondary');
		randomBtn.textContent = 'RANDOM';
		randomBtn.addEventListener('click', () => this._randomPlacement());

		this.startBtn = this._el('button', 'btn btn-primary');
		this.startBtn.textContent = 'START BATTLE';
		this.startBtn.disabled = true;
		this.startBtn.addEventListener('click', () => this._startGame());

		actions.append(randomBtn, this.startBtn);
		screen.append(title, hint, content, actions);
		this.app.appendChild(screen);
	}

	_renderShipList() {
		this.shipListEl.innerHTML = '';
		this.shipsToPlace.forEach((shipData, i) => {
			const isActive = i === this.currentShipIndex && !shipData.placed;
			const item = this._el('div', `ship-item${isActive ? ' active' : ''}${shipData.placed ? ' placed' : ''}`);

			const orient = this._el('span', 'ship-orient');
			orient.textContent = isActive ? this.orientation[0].toUpperCase() : shipData.orientation;

			const name = this._el('span', 'ship-name');
			name.textContent = shipData.name;

			const len = this._el('span', 'ship-length');
			len.textContent = shipData.length;

			const rotateBtn = this._el('button', 'rotate-btn');
			rotateBtn.textContent = '↻';
			rotateBtn.disabled = !isActive;

			if (isActive) {
				rotateBtn.addEventListener('click', () => {
					this.orientation = this.orientation === 'horizontal' ? 'vertical' : 'horizontal';
					this._renderShipList();
				});
			}

			item.append(orient, name, len, rotateBtn);
			this.shipListEl.appendChild(item);
		});
	}

	_renderPlacementGrid() {
		this.placementGrid.innerHTML = '';
		for (let r = 0; r < 10; r++) {
			for (let c = 0; c < 10; c++) {
				const cell = this._el('div', 'cell');
				if (this.tempGrid[r][c] !== null) cell.classList.add('ship');

				cell.addEventListener('mouseenter', () => this._showPreview(r, c));
				cell.addEventListener('mouseleave', () => this._clearPreview());
				cell.addEventListener('click', () => this._placeShipAt(r, c));

				this.placementGrid.appendChild(cell);
			}
		}
	}

	_getShipCells(row, col, length, orientation) {
		const cells = [];
		for (let i = 0; i < length; i++) {
			if (orientation === 'horizontal') cells.push([row, col + i]);
			else cells.push([row + i, col]);
		}
		return cells;
	}

	_isValidPlacement(cells) {
		return cells.every(([r, c]) =>
			r >= 0 && r < 10 && c >= 0 && c < 10 && this.tempGrid[r][c] === null
		);
	}

	_showPreview(row, col) {
		if (this.currentShipIndex >= this.shipsToPlace.length) return;
		const shipData = this.shipsToPlace[this.currentShipIndex];
		if (shipData.placed) return;
		this._clearPreview();
		const cells = this._getShipCells(row, col, shipData.length, this.orientation);
		const valid = this._isValidPlacement(cells);
		cells.forEach(([r, c]) => {
			if (r < 0 || r >= 10 || c < 0 || c >= 10) return;
			const cell = this.placementGrid.children[r * 10 + c];
			if (cell) cell.classList.add(valid ? 'preview-valid' : 'preview-invalid');
		});
	}

	_clearPreview() {
		[...this.placementGrid.children].forEach(cell => {
			cell.classList.remove('preview-valid', 'preview-invalid');
		});
	}

	_placeShipAt(row, col) {
		if (this.currentShipIndex >= this.shipsToPlace.length) return;
		const shipData = this.shipsToPlace[this.currentShipIndex];
		if (shipData.placed) return;

		const cells = this._getShipCells(row, col, shipData.length, this.orientation);
		if (!this._isValidPlacement(cells)) return;

		const ship = new Ship(shipData.length);
		cells.forEach(([r, c]) => { this.tempGrid[r][c] = ship; });

		this.game.playerBoard.board.placeShip(ship, [row, col], this.orientation);

		this.shipsToPlace[this.currentShipIndex].placed = true;
		this.shipsToPlace[this.currentShipIndex].ship = ship;
		this.shipsToPlace[this.currentShipIndex].orientation = this.orientation[0].toUpperCase();

		this.currentShipIndex++;
		this.orientation = 'horizontal';
		this._renderShipList();
		this._renderPlacementGrid();

		if (this.currentShipIndex >= this.shipsToPlace.length) {
			this.startBtn.disabled = false;
		}
	}

	_randomPlacement() {
		this.game.playerBoard.board._grid = Array.from({ length: 10 }, () => Array(10).fill(null));
		this.tempGrid = Array.from({ length: 10 }, () => Array(10).fill(null));
		this.currentShipIndex = 0;
		this.orientation = 'horizontal';
		this.shipsToPlace = SHIPS.map(s => ({ ...s, placed: false, ship: null, orientation: 'H' }));

		SHIPS.forEach((shipData, i) => {
			const ship = new Ship(shipData.length);
			let placed = false;
			while (!placed) {
				const orient = Math.random() < 0.5 ? 'horizontal' : 'vertical';
				const row = Math.floor(Math.random() * 10);
				const col = Math.floor(Math.random() * 10);
				const cells = this._getShipCells(row, col, shipData.length, orient);
				if (this._isValidPlacement(cells)) {
					cells.forEach(([r, c]) => { this.tempGrid[r][c] = ship; });
					this.game.playerBoard.board.placeShip(ship, [row, col], orient);
					this.shipsToPlace[i].placed = true;
					this.shipsToPlace[i].ship = ship;
					this.shipsToPlace[i].orientation = orient[0].toUpperCase();
					placed = true;
				}
			}
		});

		this.currentShipIndex = SHIPS.length;
		this._renderShipList();
		this._renderPlacementGrid();
		this.startBtn.disabled = false;
	}

	_startGame() {
		// Place computer ships randomly
		SHIPS.forEach(shipData => {
			const ship = new Ship(shipData.length);
			let placed = false;
			while (!placed) {
				const orient = Math.random() < 0.5 ? 'horizontal' : 'vertical';
				const row = Math.floor(Math.random() * 10);
				const col = Math.floor(Math.random() * 10);
				const result = this.game.computerBoard.board.placeShip(ship, [row, col], orient);
				if (result !== false) placed = true;
			}
		});
		this.renderGameScreen();
	}

	// ─── SCREEN 3: GAME ────────────────────────────────────────────────

	renderGameScreen() {
		this.clearApp();

		const screen = this._el('div', 'screen game-screen');

		const header = this._el('div', 'game-header');
		const playerInfo = this._el('div', 'player-info');
		const playerLabel = this._el('span', 'player-label');
		playerLabel.textContent = this.playerName.toUpperCase();
		playerInfo.appendChild(playerLabel);

		this.messageEl = this._el('div', 'message');
		this.messageEl.textContent = 'YOUR TURN — Choose a target';

		header.append(playerInfo, this.messageEl);

		const boards = this._el('div', 'boards');

		const playerBoardWrap = this._el('div', 'board-wrap');
		const playerBoardLabel = this._el('p', 'board-label');
		playerBoardLabel.textContent = 'YOUR FLEET';
		this.playerBoardEl = this._el('div', 'board');
		playerBoardWrap.append(playerBoardLabel, this.playerBoardEl);

		const computerBoardWrap = this._el('div', 'board-wrap');
		const computerBoardLabel = this._el('p', 'board-label');
		computerBoardLabel.textContent = 'ENEMY WATERS';
		this.computerBoardEl = this._el('div', 'board');
		computerBoardWrap.append(computerBoardLabel, this.computerBoardEl);

		boards.append(playerBoardWrap, computerBoardWrap);

		const footer = this._el('div', 'game-footer');
		const compInfo = this._el('div', 'computer-info');
		compInfo.textContent = 'COMPUTER';
		footer.appendChild(compInfo);

		screen.append(header, boards, footer);
		this.app.appendChild(screen);

		this._renderGameBoards();
	}

	_renderGameBoards() {
		this._renderBoard(this.game.playerBoard.board, this.playerBoardEl, false);
		this._renderBoard(this.game.computerBoard.board, this.computerBoardEl, true);
	}

	_renderBoard(gameboard, container, isEnemy) {
		container.innerHTML = '';
		for (let r = 0; r < 10; r++) {
			for (let c = 0; c < 10; c++) {
				const cell = this._el('div', 'cell');
				const val = gameboard.grid[r][c];

				if (val === 'hit') cell.classList.add('hit');
				else if (val === 'miss') cell.classList.add('miss');
				else if (val !== null && !isEnemy) cell.classList.add('ship');

				if (isEnemy && val !== 'hit' && val !== 'miss' && !this.game.isGameOver()) {
					cell.classList.add('targetable');
					cell.addEventListener('click', () => this._handlePlayerAttack(r, c));
				}

				container.appendChild(cell);
			}
		}
	}

	_handlePlayerAttack(row, col) {
		if (this.game.isGameOver()) return;

		const cell = this.game.computerBoard.board.grid[row][col];
		if (cell === 'hit' || cell === 'miss') return;

		this.game.handleAttack([row, col]);
		this._renderGameBoards();

		if (this.game.isGameOver()) {
			this._showGameOver();
			return;
		}

		this.updateMessage("COMPUTER IS THINKING...");
		setTimeout(() => {
			this.updateMessage('YOUR TURN — Choose a target');
		}, 600);
	}

	_showGameOver() {
		const isHuman = this.game.winner === 'human';
		this.updateMessage(
			isHuman
				? `VICTORY, ${this.playerName.toUpperCase()}! — All enemy ships destroyed`
				: 'DEFEAT — Your fleet has been eliminated'
		);

		const restartBtn = this._el('button', 'btn btn-primary restart-btn');
		restartBtn.textContent = 'PLAY AGAIN';
		restartBtn.addEventListener('click', () => {
			this.game = new GameController();
			this.renderSetupScreen();
		});

		this.app.appendChild(restartBtn);
	}

	updateMessage(text) {
		if (this.messageEl) this.messageEl.textContent = text;
	}
}