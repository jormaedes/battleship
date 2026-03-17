export class Gameboard {
	constructor() {
		this._missedAttacks = [];
		this._grid = Array.from({ length: 10 }, () => Array(10).fill(null));
	}

	#isSafeHorizontal(ship, coord) {
		if (coord[1] + ship.length > 10) return false;
		for (let col = coord[1]; col < (ship.length + coord[1]); col++) {
			if (this._grid[coord[0]][col] !== null)
				return false;
		}
		return true;
	}

	#isSafeVertical(ship, coord) {
		if (coord[0] + ship.length > 10) return false;
		for (let row = coord[0]; row < (ship.length + coord[0]); row++) {
			if (this._grid[row][coord[1]] !== null)
				return false;
		}
		return true;
	}

	#placeShipHorizontal(ship, coord) {
		if (!this.#isSafeHorizontal(ship, coord))
			return false;
		for (let col = coord[1]; col < (ship.length + coord[1]); col++) {
			this._grid[coord[0]][col] = ship;
		}
		return true;
	}

	#placeShipVertical(ship, coord) {
		if (!this.#isSafeVertical(ship, coord))
			return false;
		for (let row = coord[0]; row < (ship.length + coord[0]); row++) {
			this._grid[row][coord[1]] = ship;
		}
		return true;
	}

	placeShip(ship, coord, pos) {
		if (pos === 'horizontal')
			return this.#placeShipHorizontal(ship, coord);
		return this.#placeShipVertical(ship, coord);
	}

	receiveAttack([row, col]) {
		const cell = this.grid[row][col];

		if (cell === 'hit' || cell === 'miss') return;

		if (cell !== null) {
			cell.hit();
			this.grid[row][col] = 'hit';
		} else {
			this.grid[row][col] = 'miss';
			this.missedAttacks.push([row, col]);
		}
	}

	allSunk() {
		for (let i = 0; i < 10; i++){
			for (let j = 0; j < 10; j++) {
				if (this._grid[i][j] !== 'hit' && this._grid[i][j] !== 'miss' && this._grid[i][j] !== null)
				return false;
			}
		}		return (true);
	}

	get grid() {
		return this._grid;
	}

	get missedAttacks() {
		return this._missedAttacks;
	}
}
