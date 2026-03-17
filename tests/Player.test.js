import { Player } from "../src/Player.js";
import { Gameboard } from "../src/Gameboard.js";

test("player has a gameboard", () => {
	const player = new Player('human');
	expect(player.board).toBeInstanceOf(Gameboard);
});

test("attack hits enemy board", () => {
	const human = new Player('human');
	const computer = new Player('computer');
	human.attack(computer.board, [0, 0]);
	// o que é que esperas que mude no tabuleiro do computador?
	expect(computer.board.grid[0][0]).toEqual('miss');
});

test("randomAttack never repeats a coordinate", () => {
	const computer = new Player('computer');
	const enemy = new Player('human');
	// ataca 10 vezes e verifica que não repetiu
	for (let i = 0; i < 10; i++) {
		computer.randomAttack(enemy.board);
	}
	// conta quantas células foram atacadas
	// deve ser exactamente 10, não menos
	expect(enemy.board.missedAttacks.length).toEqual(10);
});