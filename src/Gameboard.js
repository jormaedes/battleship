import { Ship } from "./Ship.js";

export class Gameboard {
	constructor() {
		this._ships = [];
		this._missedAttacks = [];
		this._grid = new Array(10).fill(new Array(10).fill(null));
	}

	get grid() {
		return this._grid;
	}

	get missedAttacks() {
		return this._missedAttacks;
	}
}
