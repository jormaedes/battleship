import { Player } from "./Player.js";

export class GameController {
	constructor() {
		this.playerBoard = new Player('human');
		this.computerBoard = new Player('computer');
		this.winner = null;
	}

	isGameOver() {
		return (this.playerBoard.board.allSunk() || this.computerBoard.board.allSunk());
	}

	handleAttack([row, col]) {
		this.playerBoard.attack(this.computerBoard.board, [row, col]);
		if (this.isGameOver()) {
			this.winner = 'human';
			return ;
		}
		this.computerBoard.randomAttack(this.playerBoard.board);
		if (this.isGameOver()) {
			this.winner = 'computer';
			return ;
		}
	}
}
