import './css/style.css';
import { GameController } from './GameController.js';
import { DOMController } from './DOMController.js';

const game = new GameController();
const dom = new DOMController(game);
dom.init();