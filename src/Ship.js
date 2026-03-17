export class Ship {
	constructor(length) {
		this._length = length;
		this._hit = 0;
	}

	isSunk() {
		return this._hit >= this._length;
	}

	hit() {
		if (this.isSunk()) return;
		this._hit++;
	}
}
