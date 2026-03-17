import { Gameboard } from "./Gameboard.js";

export class Player {
	constructor(typePlayer) {
		this.type = typePlayer;
		this.board = new Gameboard();
	}

	attack(enemyBoard, [row, col]) {
		enemyBoard.receiveAttack([row, col])
	}

	randomAttack(enemyBoard) {
		while(1) {
			let row = Math.floor(Math.random() * 9);
			let col = Math.floor(Math.random() * 9);
			if (enemyBoard.grid[row][col] !== 'miss' && enemyBoard.grid[row][col] !== 'hit') {
				enemyBoard.receiveAttack([row, col]);
				return ;
			}
		}
	}
}