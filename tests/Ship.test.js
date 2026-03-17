import { Ship } from "../src/Ship.js";

test("Ship is not sunk", () => {
	const ship = new Ship(3);
	expect(ship.isSunk()).toEqual(false);
});

test("Ship length", () => {
	const ship = new Ship(3);
	expect(ship.length).toEqual(3);
});

test("Ship is sunk", () => {
	const ship = new Ship(3);
	ship.hit();
	ship.hit();
	ship.hit();
	expect(ship.isSunk()).toEqual(true);
});

test("Ship hit increments hits", () => {
  const ship = new Ship(3);
  ship.hit();
  expect(ship.hits).toEqual(1);
});

test("Ship cannot be hit after sunk", () => {
  const ship = new Ship(1);
  ship.hit();
  ship.hit();
  expect(ship.hits).toEqual(1);
});