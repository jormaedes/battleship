export class Ship {
	constructor(length) {
		this._length = length;
		this._hit = 0;
		this._sunk = false;
	}

	isSunk() {
		return this._sunk;
	}
}
