"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
var express_1 = __importDefault(require("express"));
var dto_1 = require("./dto");
// ------------------ '(◣ ◢' ---------------------
exports.router = express_1.default.Router();
exports.router.get("/", dto_1.handleGetLandingPage);
exports.router.get("/protocol", dto_1.handleGetProtocolPage);
exports.router.get("/treasure", dto_1.handleGetTreasurePage);
// ------------------ '(◣ ◢)' ---------------------
//# sourceMappingURL=router.js.map