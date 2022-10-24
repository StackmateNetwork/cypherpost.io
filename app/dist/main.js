"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
cypherpost.io
Developed @ Stackmate India
*/
// -----° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °-----------
var winston_1 = require("./lib/logger/winston");
var server_1 = require("./server");
// -----° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °-----------
(0, server_1.start)(process.env.MOLTRES_PORT).catch(function (e) {
    winston_1.logger.error(e);
    process.exit(1);
});
// -----° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °-----------
//# sourceMappingURL=main.js.map