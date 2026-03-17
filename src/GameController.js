import { Player } from "./Player.js";

class GameController {
	constructor() {
		this.playerBoard = new Player('human');
		this.computerBoard = new Player('computer');
		this.winner = null;
	}
}