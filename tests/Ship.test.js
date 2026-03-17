import { Ship } from "../src/Ship.js";

test("Ship is not sunk", () => {
	const ship = new Ship(3);
	expect(ship.isSunk()).toEqual(false);
});

test("Ship length", () => {
	const ship = new Ship(3);
	expect(ship._length).toEqual(3);
});

test("Ship is sunk", () => {
	const ship = new Ship(3);
	ship.hit();
	ship.hit();
	ship.hit();
	expect(ship.isSunk()).toEqual(true);
});