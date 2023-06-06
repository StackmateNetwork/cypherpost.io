"use strict";
/*
cypherpost.io
Developed @ Stackmate India
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetTreasurePage = exports.handleGetProtocolPage = exports.handleGetLandingPage = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var winston_1 = require("../lib/logger/winston");
var handler_1 = require("../lib/http/handler");
var base_path = "/home/node/cypherpost.io/app/src/client/public";
function handleGetLandingPage(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, exists, result;
        return __generator(this, function (_a) {
            request = (0, handler_1.parseRequest)(req);
            try {
                exists = fs.existsSync("".concat(base_path, "/index.html"));
                if (!exists)
                    throw { code: 404, message: { html_exists_at_path: exists } };
                res.sendFile(path.join(base_path, "/index.html"));
            }
            catch (e) {
                result = (0, handler_1.filterError)(e, winston_1.r_500, request);
                winston_1.logger.debug({
                    e: e
                });
                (0, handler_1.respond)(result.code, result.message, res, request);
            }
            return [2 /*return*/];
        });
    });
}
exports.handleGetLandingPage = handleGetLandingPage;
function handleGetProtocolPage(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, exists, result;
        return __generator(this, function (_a) {
            request = (0, handler_1.parseRequest)(req);
            try {
                exists = fs.existsSync("".concat(base_path, "/protocol.html"));
                if (!exists)
                    throw { code: 404, message: { html_exists_at_path: exists } };
                res.sendFile(path.join(base_path, "/protocol.html"));
            }
            catch (e) {
                result = (0, handler_1.filterError)(e, winston_1.r_500, request);
                winston_1.logger.debug({
                    e: e
                });
                (0, handler_1.respond)(result.code, result.message, res, request);
            }
            return [2 /*return*/];
        });
    });
}
exports.handleGetProtocolPage = handleGetProtocolPage;
function handleGetTreasurePage(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, exists, result;
        return __generator(this, function (_a) {
            request = (0, handler_1.parseRequest)(req);
            try {
                exists = fs.existsSync("".concat(base_path, "/treasure.html"));
                if (!exists)
                    throw { code: 404, message: { html_exists_at_path: exists } };
                res.sendFile(path.join(base_path, "/treasure.html"));
            }
            catch (e) {
                result = (0, handler_1.filterError)(e, winston_1.r_500, request);
                winston_1.logger.debug({
                    e: e
                });
                (0, handler_1.respond)(result.code, result.message, res, request);
            }
            return [2 /*return*/];
        });
    });
}
exports.handleGetTreasurePage = handleGetTreasurePage;
//# sourceMappingURL=dto.js.map