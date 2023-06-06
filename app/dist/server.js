"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
var express_1 = __importDefault(require("express"));
var helmet_1 = __importDefault(require("helmet"));
var http = __importStar(require("http"));
var winston_1 = require("./lib/logger/winston");
var router_1 = require("./client/router");
var handler_1 = require("./lib/http/handler");
var base_path = "/home/node/cypherpost.io/app/src/client/public";
// ------------------ '(◣ ◢)' ---------------------
function start(port) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var app_1, server;
                    var _this = this;
                    return __generator(this, function (_a) {
                        try {
                            app_1 = (0, express_1.default)();
                            app_1.set("etag", false);
                            app_1.disable("x-powered-by");
                            app_1.use((0, helmet_1.default)());
                            app_1.use(express_1.default.json());
                            app_1.use(express_1.default.urlencoded());
                            app_1.use(express_1.default.static(base_path));
                            app_1.use(function (err, req, res, next) {
                                // res.setHeader('Access-Control-Allow-Origin', '*');
                                if (err) {
                                    winston_1.logger.warn({ err: err });
                                    (0, handler_1.respond)(400, { error: 'Invalid Request data format. Try another format like form, or url-encoded.' }, res, req);
                                }
                                else {
                                    next();
                                }
                            });
                            server = http.createServer(app_1);
                            app_1.use("/", router_1.router);
                            handleGracefulShutdown(server.listen(port, function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    winston_1.logger.verbose("Server listening...");
                                    resolve(app_1);
                                    return [2 /*return*/];
                                });
                            }); }));
                        }
                        catch (e) {
                            winston_1.logger.error({ EXPRESS_ERROR: e });
                            reject(e);
                        }
                        return [2 /*return*/];
                    });
                }); })];
        });
    });
}
exports.start = start;
;
// ------------------ '(◣ ◢)' ---------------------
function handleGracefulShutdown(server) {
    process.on("SIGINT", function () {
        winston_1.logger.info({
            SIGINT: "Got SIGINT. Gracefully shutting down Http server"
        });
        server.close(function () {
            winston_1.logger.info("Http server closed.");
        });
    });
    // quit properly on docker stop
    process.on("SIGTERM", function () {
        winston_1.logger.info({
            SIGTERM: "Got SIGTERM. Gracefully shutting down Http server."
        });
        server.close(function () {
            winston_1.logger.info("Http server closed.");
        });
    });
    var sockets = {};
    var nextSocketId = 0;
    server.on("connection", function (socket) {
        var socketId = nextSocketId++;
        sockets[socketId] = socket;
        socket.once("close", function () {
            delete sockets[socketId];
        });
    });
}
// ------------------ '(◣ ◢)' ---------------------
//# sourceMappingURL=server.js.map