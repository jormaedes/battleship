import { Gameboard } from "../src/Gameboard.js";
import { Ship } from "../src/Ship.js";

test("ships are not sunk", () => {
	const game = new Gameboard();
	const ship1 = new Ship(5);
	const ship2 = new Ship(2);
	game.placeShip(ship1, [0, 0], "horizontal");
	game.placeShip(ship2, [1, 0], "horizontal");
	expect(game.allSunk()).toEqual(false);
});

test("ships are sunk", () => {
	const game = new Gameboard();
	const ship1 = new Ship(2);
	const ship2 = new Ship(3);
	game.placeShip(ship1, [0, 0], "horizontal");
	game.receiveAttack([0, 0]);
	game.receiveAttack([0, 1]);

	game.placeShip(ship2, [1, 0], "vertical");
	game.receiveAttack([1, 0]);
	game.receiveAttack([2, 0]);
	game.receiveAttack([3, 0]);
	expect(game.allSunk()).toEqual(true);
});

// Grid começa a null
test("grid starts empty", () => {
	const game = new Gameboard();
	expect(game.grid[0][0]).toBeNull();
	expect(game.grid[9][9]).toBeNull();
});

// placeShip coloca nas células certas
test("placeShip horizontal places ship in correct cells", () => {
	const game = new Gameboard();
	const ship = new Ship(3);
	game.placeShip(ship, [0, 0], "horizontal");
	expect(game.grid[0][0]).not.toBeNull();
	expect(game.grid[0][1]).not.toBeNull();
	expect(game.grid[0][2]).not.toBeNull();
	expect(game.grid[0][3]).toBeNull();
});

test("placeShip vertical places ship in correct cells", () => {
	const game = new Gameboard();
	const ship = new Ship(3);
	game.placeShip(ship, [0, 0], "vertical");
	expect(game.grid[0][0]).not.toBeNull();
	expect(game.grid[1][0]).not.toBeNull();
	expect(game.grid[2][0]).not.toBeNull();
	expect(game.grid[3][0]).toBeNull();
});

test("receiveAttack on empty cell registers miss", () => {
	const game = new Gameboard();
	const ship1 = new Ship(5);
	game.placeShip(ship1, [0, 0], "vertical");
	game.receiveAttack([2, 2]);
	expect(game.missedAttacks.find(e => e[0] === 2 && e[1] === 2)).toEqual([2, 2]);
});

test("receiveAttack on same cell twice does nothing", () => {
	const game = new Gameboard();
	const ship = new Ship(5);
	game.placeShip(ship, [0, 0], "vertical");
	game.receiveAttack([0, 0]);
	game.receiveAttack([0, 0]);
	expect(ship.hits).toEqual(1);
});