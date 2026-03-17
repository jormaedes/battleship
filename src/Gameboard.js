import { Ship } from "./Ship.js";

export class Gameboard {
	constructor() {
		this._ships = [];
		this._missedAttacks = [];
		this._grid = Array.from({ length: 10 }, () => Array(10).fill(null));
	}

	#isSafeHorizontal(ship, coord) {
		if (ship.length + coord[1] > 9) return false;
		for (let col = coord[1]; col < (ship.length + coord[1]); col++) {
			if (this._grid[coord[0]][col] !== null)
				return false;
		}
		return true;
	}

	#isSafeVertical(ship, coord) {
		if (ship.length + coord[0] > 9) return false;
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
			cell.ship.hit();
			this.grid[row][col] = 'hit';
		} else {
			this.grid[row][col] = 'miss';
			this.missedAttacks.push([row, col]);
		}
	}

	get grid() {
		return this._grid;
	}

	get missedAttacks() {
		return this._missedAttacks;
	}
}
