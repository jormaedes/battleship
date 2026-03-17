import { Gameboard } from "./Gameboard.js";

export class Player {
	constructor(typePlayer) {
		this.type = typePlayer;
		this.board = new Gameboard();
	}

	attack(enemyBoard, [row, col]) {
		enemyBoard.receiveAttack([row, col])
	}
}