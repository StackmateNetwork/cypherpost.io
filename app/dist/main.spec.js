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
        while (_) try {
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
/*
cypherpost.io
Developed @ Stackmate India
*/
// IMPORTS
var chai_1 = __importDefault(require("chai"));
var chai_http_1 = __importDefault(require("chai-http"));
var crypto = __importStar(require("crypto"));
require("mocha");
var bitcoin_1 = require("./lib/bitcoin/bitcoin");
var crypto_1 = require("./lib/crypto/crypto");
var e_1 = require("./lib/errors/e");
var winston_1 = require("./lib/logger/winston");
var express = __importStar(require("./server"));
var mongo_1 = require("./lib/storage/mongo");
var announcements_1 = require("./services/announcements/announcements");
var interface_1 = require("./services/announcements/interface");
var identity_1 = require("./services/identity/identity");
var post_keys_1 = require("./services/posts/keys/post_keys");
var posts_1 = require("./services/posts/posts");
var sinon = require('sinon');
var ws_1 = __importDefault(require("ws"));
var bitcoin = new bitcoin_1.CypherpostBitcoinOps();
var s5crypto = new crypto_1.S5Crypto();
var identity = new identity_1.CypherpostIdentity();
var announcements = new announcements_1.CypherpostAnnouncements();
var posts = new posts_1.CypherpostPosts();
var post_keys = new post_keys_1.CypherpostPostKeys();
var db = new mongo_1.MongoDatabase();
var invite_secret = "098f6bcd4621d373cade4e832627b4f6";
var a_invitation;
var b_invitation;
var c_invitation;
var server;
var TEST_PORT = "13021";
var expect = chai_1.default.expect;
var should = chai_1.default.should();
chai_1.default.use(chai_http_1.default);
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
/**
 * Create identities A B C
 * -t> represents trusted announcement
 * A -t> B -t> C
 * A allows entire trusted chain (B & C) to view profile and posts
 * A also trusts C
 * A revokes trust in B => A's profile and posts are only visible to C
 * C trusts A => A can view C's profile and posts
 * A deletes their identity
 */
var PostType;
(function (PostType) {
    PostType["Profile"] = "Profile";
    PostType["Ad"] = "Ad";
    PostType["Preferences"] = "Preferences";
})(PostType || (PostType = {}));
;
;
var OrderType;
(function (OrderType) {
    OrderType["Buy"] = "Buy";
    OrderType["Sell"] = "Sell";
})(OrderType || (OrderType = {}));
var BitcoinNetwork;
(function (BitcoinNetwork) {
    BitcoinNetwork["OnChain"] = "OnChain";
    BitcoinNetwork["Lightning"] = "Lightning";
    BitcoinNetwork["Liquid"] = "Liquid";
})(BitcoinNetwork || (BitcoinNetwork = {}));
var FiatCurrency;
(function (FiatCurrency) {
    FiatCurrency["INR"] = "INR";
    FiatCurrency["CAD"] = "CAD";
    FiatCurrency["AUD"] = "AUD";
    FiatCurrency["USD"] = "USD";
    FiatCurrency["EUR"] = "EUR";
})(FiatCurrency || (FiatCurrency = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["UPI"] = "UPI";
    PaymentMethod["IMPS"] = "IMPS";
    PaymentMethod["Cash"] = "Cash";
    PaymentMethod["Aangadiya"] = "Aangadiya";
    PaymentMethod["Cheque"] = "Cheque";
    PaymentMethod["Paypal"] = "Paypal";
})(PaymentMethod || (PaymentMethod = {}));
var RateType;
(function (RateType) {
    RateType["Fixed"] = "Fixed";
    RateType["Variable"] = "Variable";
})(RateType || (RateType = {}));
var ReferenceExchange;
(function (ReferenceExchange) {
    ReferenceExchange["LocalBicoins"] = "LocalBitcoins";
    ReferenceExchange["BullBitcoin"] = "BullBitcoin";
    ReferenceExchange["WazirX"] = "WazirX";
    ReferenceExchange["Kraken"] = "Kraken";
    ReferenceExchange["BitFinex"] = "Bitfinex";
    ReferenceExchange["None"] = "None";
})(ReferenceExchange || (ReferenceExchange = {}));
;
var init_identity_ds = "m/0h/0h/0h";
var init_profile_ds = "m/1h/0h/0h";
var init_posts_ds = "m/3h/0h/0h";
var a_key_set;
var b_key_set;
var c_key_set;
var a_profile_set;
var b_profile_set;
var c_profile_set;
var a_post_set;
var b_post_set;
var c_post_set;
var c_post_edit_set;
var all_identities;
var all_announcements;
var a_trust = [];
var b_trust = [];
var c_trust = [];
var a_preferences = {
    muted: [],
};
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// ------------------ INITIALIZERS ------------------
function createTestKeySet() {
    return __awaiter(this, void 0, void 0, function () {
        var mnemonic, root_xprv, cypherpost_parent, identity_parent, identity_ecdsa, set, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    mnemonic = bitcoin.generate_mnemonic();
                    if (mnemonic instanceof Error)
                        throw mnemonic;
                    return [4 /*yield*/, bitcoin.seed_root(mnemonic)];
                case 1:
                    root_xprv = _a.sent();
                    if (root_xprv instanceof Error)
                        throw root_xprv;
                    cypherpost_parent = bitcoin.derive_parent_128(root_xprv);
                    if (cypherpost_parent instanceof Error)
                        throw cypherpost_parent;
                    return [4 /*yield*/, bitcoin.derive_hardened_str(cypherpost_parent.xprv, init_identity_ds)];
                case 2:
                    identity_parent = _a.sent();
                    if (identity_parent instanceof Error)
                        throw identity_parent;
                    return [4 /*yield*/, bitcoin.extract_ecdsa_pair(identity_parent)];
                case 3:
                    identity_ecdsa = _a.sent();
                    if (identity_ecdsa instanceof Error)
                        throw identity_ecdsa;
                    set = {
                        mnemonic: mnemonic,
                        root_xprv: root_xprv,
                        cypherpost_parent: cypherpost_parent,
                        identity_xpub: identity_parent.xpub,
                        identity_private: identity_ecdsa.privkey,
                        identity_pubkey: identity_ecdsa.pubkey
                    };
                    return [2 /*return*/, set];
                case 4:
                    e_2 = _a.sent();
                    (0, e_1.handleError)(e_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function createProfileSet(plain_profile, cypherpost_parent, derivation_scheme) {
    var profile_xkey = bitcoin.derive_hardened_str(cypherpost_parent['xprv'], derivation_scheme);
    var encryption_key = crypto.createHash('sha256').update(profile_xkey['xprv']).digest('hex');
    var cypher = s5crypto.encryptAESMessageWithIV(JSON.stringify(plain_profile), encryption_key);
    return {
        plain: plain_profile,
        cypher: cypher,
        encryption_key: encryption_key
    };
}
function createPostSet(plain_post, cypherpost_parent, derivation_scheme) {
    var ppost_xkey = bitcoin.derive_hardened_str(cypherpost_parent['xprv'], derivation_scheme);
    var encryption_key = crypto.createHash('sha256').update(ppost_xkey['xprv']).digest('hex');
    var cypher = s5crypto.encryptAESMessageWithIV(JSON.stringify(plain_post), encryption_key);
    return {
        plain: plain_post,
        cypher: cypher,
        encryption_key: encryption_key,
        post_id: "unset"
    };
}
function createDefaultTestPost(type, order, message, fixed) {
    return {
        message: message,
        type: type,
        order: order,
        network: BitcoinNetwork.OnChain,
        minimum: 1000,
        maximum: 100000,
        fiat_currency: FiatCurrency.INR,
        payment_method: PaymentMethod.UPI,
        rate_type: RateType.Variable,
        fixed_rate: (fixed) ? 50000000 : 0,
        reference_exchange: (fixed) ? ReferenceExchange.None : ReferenceExchange.WazirX,
        reference_percent: (fixed) ? 0 : 5
    };
}
function adminGetInvitationRequest() {
    var endpoint = "/api/v2/identity/admin/invitation";
    return {
        endpoint: endpoint,
        invite_secret: invite_secret,
    };
}
function createIdentityRegistrationRequest(username, key_set) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, body, nonce, message, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = "/api/v2/identity";
                    body = {
                        username: username,
                    };
                    nonce = Date.now();
                    message = "POST ".concat(endpoint, " ").concat(nonce);
                    return [4 /*yield*/, bitcoin.sign(message, key_set.identity_private)];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/, {
                            nonce: nonce,
                            endpoint: endpoint,
                            body: body,
                            signature: signature,
                            pubkey: key_set.identity_pubkey
                        }];
            }
        });
    });
}
function createIdentityGetRequest(key_set) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, nonce, body, message, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = "/api/v2/identity/all";
                    nonce = Date.now();
                    body = {};
                    message = "GET ".concat(endpoint, " ").concat(nonce);
                    return [4 /*yield*/, bitcoin.sign(message, key_set.identity_private)];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/, {
                            nonce: nonce,
                            endpoint: endpoint,
                            signature: signature,
                            pubkey: key_set.identity_pubkey
                        }];
            }
        });
    });
}
function createAnnouncementIssueRequest(announcement, to_pubkey, key_set) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, nonce, announcement_signature, body, message, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = "/api/v2/announcement/trust";
                    nonce = Date.now();
                    return [4 /*yield*/, bitcoin.sign("".concat(key_set.identity_pubkey, ":").concat(to_pubkey, ":").concat(announcement.toString(), ":").concat(nonce), key_set.identity_private)];
                case 1:
                    announcement_signature = _a.sent();
                    body = {
                        recipient: to_pubkey,
                        nonce: nonce,
                        signature: announcement_signature
                    };
                    message = "POST ".concat(endpoint, " ").concat(nonce);
                    return [4 /*yield*/, bitcoin.sign(message, key_set.identity_private)];
                case 2:
                    signature = _a.sent();
                    return [2 /*return*/, {
                            nonce: nonce,
                            endpoint: endpoint,
                            body: body,
                            signature: signature,
                            pubkey: key_set.identity_pubkey
                        }];
            }
        });
    });
}
function createGetAllAnnouncementsRequest(key_set) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, nonce, body, message, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = "/api/v2/announcement/all";
                    nonce = Date.now();
                    body = {};
                    message = "GET ".concat(endpoint, " ").concat(nonce);
                    return [4 /*yield*/, bitcoin.sign(message, key_set.identity_private)];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/, {
                            nonce: nonce,
                            endpoint: endpoint,
                            signature: signature,
                            pubkey: key_set.identity_pubkey
                        }];
            }
        });
    });
}
function createPostRequest(expiry, post_set, key_set) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, nonce, body, message, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = "/api/v2/post";
                    nonce = Date.now();
                    body = {
                        expiry: expiry,
                        cypher_json: post_set.cypher,
                        derivation_scheme: init_posts_ds
                    };
                    message = "PUT ".concat(endpoint, " ").concat(nonce);
                    return [4 /*yield*/, bitcoin.sign(message, key_set.identity_private)];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/, {
                            nonce: nonce,
                            endpoint: endpoint,
                            body: body,
                            signature: signature,
                            pubkey: key_set.identity_pubkey
                        }];
            }
        });
    });
}
function editPostRequest(post_set, key_set) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, nonce, body, message, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = "/api/v2/post/edit";
                    nonce = Date.now();
                    body = {
                        post_id: post_set.post_id,
                        cypher_json: post_set.cypher,
                    };
                    message = "POST ".concat(endpoint, " ").concat(nonce);
                    return [4 /*yield*/, bitcoin.sign(message, key_set.identity_private)];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/, {
                            nonce: nonce,
                            endpoint: endpoint,
                            body: body,
                            signature: signature,
                            pubkey: key_set.identity_pubkey
                        }];
            }
        });
    });
}
function createPostsGetSelfRequest(key_set) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, nonce, body, message, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = "/api/v2/post/self";
                    nonce = Date.now();
                    body = {};
                    message = "GET ".concat(endpoint, " ").concat(nonce);
                    return [4 /*yield*/, bitcoin.sign(message, key_set.identity_private)];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/, {
                            nonce: nonce,
                            endpoint: endpoint,
                            body: body,
                            signature: signature,
                            pubkey: key_set.identity_pubkey
                        }];
            }
        });
    });
}
function createPostsGetOthersRequest(key_set) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, nonce, body, message, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = "/api/v2/post/others";
                    nonce = Date.now();
                    body = {};
                    message = "GET ".concat(endpoint, " ").concat(nonce);
                    return [4 /*yield*/, bitcoin.sign(message, key_set.identity_private)];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/, {
                            nonce: nonce,
                            endpoint: endpoint,
                            body: body,
                            signature: signature,
                            pubkey: key_set.identity_pubkey
                        }];
            }
        });
    });
}
function createKeyStoreUpdate(post_set, trusted_list, key_set) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, nonce, body, signature;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = "/api/v2/post/keys";
                    nonce = Date.now();
                    body = {
                        decryption_keys: [],
                        post_id: post_set.post_id
                    };
                    trusted_list.map(function (trusted_pubkey) { return __awaiter(_this, void 0, void 0, function () {
                        var shared_sercret, decryption_key, dk_entry;
                        return __generator(this, function (_a) {
                            shared_sercret = bitcoin.calculate_shared_secret({
                                privkey: key_set.identity_private,
                                pubkey: trusted_pubkey
                            });
                            decryption_key = s5crypto.encryptAESMessageWithIV(post_set.encryption_key, shared_sercret);
                            dk_entry = {
                                decryption_key: decryption_key,
                                receiver: trusted_pubkey
                            };
                            body.decryption_keys.push(dk_entry);
                            return [2 /*return*/];
                        });
                    }); });
                    return [4 /*yield*/, bitcoin.sign("PUT ".concat(endpoint, " ").concat(nonce), key_set.identity_private)];
                case 1:
                    signature = _a.sent();
                    // console.log( JSON.stringify({body},null,2))
                    return [2 /*return*/, {
                            nonce: nonce,
                            endpoint: endpoint,
                            body: body,
                            signature: signature,
                            pubkey: key_set.identity_pubkey
                        }];
            }
        });
    });
}
function createRevokeTrustRequest(revoke, key_set) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, body, nonce, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = "/api/v2/announcement/trust/revoke";
                    body = {
                        revoking: revoke,
                    };
                    nonce = Date.now();
                    return [4 /*yield*/, bitcoin.sign("POST ".concat(endpoint, " ").concat(nonce), key_set.identity_private)];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/, {
                            nonce: nonce,
                            endpoint: endpoint,
                            body: body,
                            signature: signature,
                            pubkey: key_set.identity_pubkey
                        }];
            }
        });
    });
}
function createDeleteIdentityRequest(key_set) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, nonce, body, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = "/api/v2/identity";
                    nonce = Date.now();
                    body = {};
                    return [4 /*yield*/, bitcoin.sign("DELETE ".concat(endpoint, " ").concat(nonce), key_set.identity_private)];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/, {
                            nonce: nonce,
                            endpoint: endpoint,
                            signature: signature,
                            pubkey: key_set.identity_pubkey
                        }];
            }
        });
    });
}
function createServerIdentityRequest(key_set) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, nonce, body, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = "/api/v2/identity/server";
                    nonce = Date.now();
                    body = {};
                    return [4 /*yield*/, bitcoin.sign("GET ".concat(endpoint, " ").concat(nonce), key_set.identity_private)];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/, {
                            nonce: nonce,
                            endpoint: endpoint,
                            signature: signature,
                            pubkey: key_set.identity_pubkey
                        }];
            }
        });
    });
}
function createSocketConnectionRequest(key_set) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, nonce, body, message, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = "/api/v3/notifications";
                    nonce = Date.now();
                    body = {};
                    message = "GET ".concat(endpoint, " ").concat(nonce);
                    console.log({ message: message });
                    return [4 /*yield*/, bitcoin.sign(message, key_set.identity_private)];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/, {
                            nonce: nonce,
                            endpoint: endpoint,
                            signature: signature,
                            pubkey: key_set.identity_pubkey
                        }];
            }
        });
    });
}
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("CYPHERPOST: API BEHAVIOUR SIMULATION", function () {
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        connection = {
                            port: process.env.DB_PORT,
                            ip: process.env.DB_IP,
                            name: process.env.DB_NAME,
                            auth: process.env.DB_AUTH,
                        };
                        sinon.stub(winston_1.logger, "debug");
                        console.log({ connection: connection });
                        return [4 /*yield*/, db.connect(connection)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, express.start(TEST_PORT)];
                    case 2:
                        server = _a.sent();
                        return [4 /*yield*/, createTestKeySet()];
                    case 3:
                        // ------------------ (◣_◢) ------------------
                        a_key_set = (_a.sent());
                        return [4 /*yield*/, createTestKeySet()];
                    case 4:
                        b_key_set = (_a.sent());
                        return [4 /*yield*/, createTestKeySet()];
                    case 5:
                        c_key_set = (_a.sent());
                        // ------------------ (◣_◢) ------------------
                        a_profile_set = createProfileSet({
                            type: PostType.Profile,
                            nickname: "Alice Articulates",
                            status: "Sound Money, Sound World.",
                            contact: "@alice3us on Telegram"
                        }, a_key_set.cypherpost_parent, init_profile_ds);
                        b_profile_set = createProfileSet({
                            type: PostType.Profile,
                            nickname: "Bobby Breeds",
                            status: "Making Babies.",
                            contact: "@bob3us on Telegram"
                        }, b_key_set.cypherpost_parent, init_profile_ds);
                        c_profile_set = createProfileSet({
                            type: PostType.Profile,
                            nickname: "Carol Cares",
                            status: "Trying Hard Not To Cry.",
                            contact: "@carol3us on Telegram"
                        }, c_key_set.cypherpost_parent, init_profile_ds);
                        // ------------------ (◣_◢) ------------------
                        a_post_set = createPostSet(createDefaultTestPost(PostType.Ad, OrderType.Sell, "Urgent", true), a_key_set.cypherpost_parent, init_posts_ds);
                        b_post_set = createPostSet(createDefaultTestPost(PostType.Ad, OrderType.Buy, "Stacking", false), b_key_set.cypherpost_parent, init_posts_ds);
                        c_post_set = createPostSet(createDefaultTestPost(PostType.Ad, OrderType.Sell, "Contact me on Signal.", false), c_key_set.cypherpost_parent, init_posts_ds);
                        c_post_edit_set = createPostSet(createDefaultTestPost(PostType.Ad, OrderType.Sell, "Contact me on Threema.", false), c_key_set.cypherpost_parent, init_posts_ds);
                        return [2 /*return*/];
                }
            });
        });
    });
    after(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, identity.remove(a_key_set.identity_pubkey)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, identity.remove(b_key_set.identity_pubkey)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, identity.remove(c_key_set.identity_pubkey)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, announcements.removeAllOfUser(a_key_set.identity_pubkey)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, announcements.removeAllOfUser(b_key_set.identity_pubkey)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, announcements.removeAllOfUser(c_key_set.identity_pubkey)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, posts.removeAllByOwner(a_key_set.identity_pubkey)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, posts.removeAllByOwner(b_key_set.identity_pubkey)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, posts.removeAllByOwner(c_key_set.identity_pubkey)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, post_keys.removePostDecryptionKeyByGiver(a_key_set.identity_pubkey)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, post_keys.removePostDecryptionKeyByGiver(b_key_set.identity_pubkey)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, post_keys.removePostDecryptionKeyByGiver(c_key_set.identity_pubkey)];
                    case 12:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    describe("ADMIN CREATES INVITE CODES for A B C to register", function () {
        var request_admin;
        it("CREATES REQUEST OBJECTS", function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, adminGetInvitationRequest()];
                        case 1:
                            request_admin = _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("GETS A's INVITATION", function (done) {
            console.log({ request_admin: request_admin });
            chai_1.default
                .request(server)
                .get(request_admin.endpoint)
                .set({
                "x-admin-invite-secret": request_admin.invite_secret
            })
                .end(function (err, res) {
                res.should.have.status(200);
                console.log(res.body);
                expect(res.body['invite_code']).to.be.a('string');
                a_invitation = res.body['invite_code'];
                done();
            });
        });
        it("GETS B's INVITATION", function (done) {
            // console.log({ request_a })
            chai_1.default
                .request(server)
                .get(request_admin.endpoint)
                .set({
                "x-admin-invite-secret": request_admin.invite_secret
            })
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['invite_code']).to.be.a('string');
                b_invitation = res.body['invite_code'];
                done();
            });
        });
        it("GETS C's INVITATION", function (done) {
            // console.log({ request_a })
            chai_1.default
                .request(server)
                .get(request_admin.endpoint)
                .set({
                "x-admin-invite-secret": request_admin.invite_secret
            })
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['invite_code']).to.be.a('string');
                c_invitation = res.body['invite_code'];
                done();
            });
        });
    });
    describe("REGISTER IDENTITIES for A B C and VERIFY REGISTRATION via GET ALL", function () {
        var request_a;
        var request_b;
        var request_c;
        var request_c_get;
        it("CREATES REQUEST OBJECTS", function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, createIdentityRegistrationRequest("alice", a_key_set)];
                        case 1:
                            request_a = _a.sent();
                            return [4 /*yield*/, createIdentityRegistrationRequest("bob", b_key_set)];
                        case 2:
                            request_b = _a.sent();
                            return [4 /*yield*/, createIdentityRegistrationRequest("carol", c_key_set)];
                        case 3:
                            request_c = _a.sent();
                            return [4 /*yield*/, createIdentityGetRequest(c_key_set)];
                        case 4:
                            request_c_get = _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("REGISTERS IDENTITY A", function (done) {
            // console.log({ request_a })
            chai_1.default
                .request(server)
                .post(request_a.endpoint)
                .set({
                "x-client-pubkey": request_a.pubkey,
                "x-nonce": request_a.nonce,
                "x-client-signature": request_a.signature,
                "x-client-invite-code": a_invitation
            })
                .send(request_a.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['status']).to.equal(true);
                done();
            });
        });
        it("REGISTERS IDENTITY B", function (done) {
            // console.log({ request_b })
            chai_1.default
                .request(server)
                .post(request_b.endpoint)
                .set({
                "x-client-pubkey": request_b.pubkey,
                "x-nonce": request_b.nonce,
                "x-client-signature": request_b.signature,
                "x-client-invite-code": b_invitation
            })
                .send(request_b.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['status']).to.equal(true);
                done();
            });
        });
        it("REGISTERS IDENTITY C", function (done) {
            // console.log({ request_c })
            chai_1.default
                .request(server)
                .post(request_c.endpoint)
                .set({
                "x-client-pubkey": request_c.pubkey,
                "x-nonce": request_c.nonce,
                "x-client-signature": request_c.signature,
                "x-client-invite-code": c_invitation
            })
                .send(request_c.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['status']).to.equal(true);
                done();
            });
        });
        it("GETS ALL IDENTITIES as C", function (done) {
            chai_1.default
                .request(server)
                .get(request_c_get.endpoint)
                .set({
                "x-client-pubkey": request_c_get.pubkey,
                "x-nonce": request_c_get.nonce,
                "x-client-signature": request_c_get.signature,
            })
                .end(function (err, res) {
                res.should.have.status(200);
                all_identities = res.body['identities'];
                var counter = 0;
                // console.log({ all_identities });
                all_identities.map(function (eachIdentity) {
                    if (eachIdentity.pubkey === a_key_set.identity_pubkey ||
                        eachIdentity.pubkey === b_key_set.identity_pubkey ||
                        eachIdentity.pubkey === c_key_set.identity_pubkey)
                        counter++;
                });
                expect(counter).to.equal(3);
                done();
            });
        });
    });
    describe("ISSUE TRUST ANNOUNCEMENT A->B->C and VERIFY via GET ALL", function () {
        var request_a;
        var request_b;
        var request_c;
        // let request_c_get_self;
        var request_c_get_all;
        it("CREATES REQUEST OBJECTS", function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, createAnnouncementIssueRequest(interface_1.AnnouncementType.Trust, b_key_set.identity_pubkey, a_key_set)];
                        case 1:
                            request_a = _a.sent();
                            return [4 /*yield*/, createAnnouncementIssueRequest(interface_1.AnnouncementType.Trust, c_key_set.identity_pubkey, b_key_set)];
                        case 2:
                            request_b = _a.sent();
                            return [4 /*yield*/, createAnnouncementIssueRequest(interface_1.AnnouncementType.Trust, a_key_set.identity_pubkey, c_key_set)];
                        case 3:
                            request_c = _a.sent();
                            return [4 /*yield*/, createGetAllAnnouncementsRequest(c_key_set)];
                        case 4:
                            request_c_get_all = _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("ISSUES TRUST ANNOUNCEMENT A->B", function (done) {
            chai_1.default
                .request(server)
                .post(request_a.endpoint)
                .set({
                "x-client-pubkey": request_a.pubkey,
                "x-nonce": request_a.nonce,
                "x-client-signature": request_a.signature,
            })
                .send(request_a.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['status']).to.equal(true);
                done();
            });
        });
        it("ISSUES TRUST ANNOUNCEMENT B->C", function (done) {
            chai_1.default
                .request(server)
                .post(request_b.endpoint)
                .set({
                "x-client-pubkey": request_b.pubkey,
                "x-nonce": request_b.nonce,
                "x-client-signature": request_b.signature,
            })
                .send(request_b.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['status']).to.equal(true);
                done();
            });
        });
        it("ISSUES TRUST ANNOUNCEMENT C->A", function (done) {
            chai_1.default
                .request(server)
                .post(request_c.endpoint)
                .set({
                "x-client-pubkey": request_c.pubkey,
                "x-nonce": request_c.nonce,
                "x-client-signature": request_c.signature
            })
                .send(request_c.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['status']).to.equal(true);
                done();
            });
        });
        it("GETS ALL ANNOUNCEMENTS as C", function (done) {
            chai_1.default
                .request(server)
                .get(request_c_get_all.endpoint)
                .set({
                "x-client-pubkey": request_c_get_all.pubkey,
                "x-nonce": request_c_get_all.nonce,
                "x-client-signature": request_c_get_all.signature,
            })
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['announcements'].length).to.equal(3);
                all_announcements = res.body['announcements'];
                done();
            });
        });
        it("VERIFIES ALL ANNOUNCEMENTS ISSUED and POPULATES EACH USER's TRUSTED", function (done) {
            var _this = this;
            all_announcements.map(function (announcement) { return __awaiter(_this, void 0, void 0, function () {
                var message, verify, failedSig;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            message = "".concat(announcement.by, ":").concat(announcement.to, ":").concat(announcement.kind, ":").concat(announcement.nonce);
                            return [4 /*yield*/, bitcoin.verify(message, announcement.signature, announcement.by)];
                        case 1:
                            verify = _a.sent();
                            failedSig = "Announcement Signature failed.";
                            if (!verify)
                                throw failedSig;
                            if (announcement.by === a_key_set.identity_pubkey)
                                a_trust.push(announcement.to);
                            if (announcement.by === b_key_set.identity_pubkey)
                                b_trust.push(announcement.to);
                            if (announcement.by === c_key_set.identity_pubkey)
                                c_trust.push(announcement.to);
                            return [2 /*return*/];
                    }
                });
            }); });
            done();
        });
    });
    describe("CREATES POSTS for A, B & C and VERIFY via GET SELF", function () {
        var request_a;
        var request_a0;
        var request_a_get_self;
        var request_b;
        var request_b_get_self;
        var request_c;
        var request_c_get_self;
        var request_c_get_others;
        it("CREATES REQUEST OBJECTS", function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, createPostRequest(Date.now() + 10, a_post_set, a_key_set)];
                        case 1:
                            request_a = _a.sent();
                            return [4 /*yield*/, createPostRequest(Date.now() + 10000, a_post_set, a_key_set)];
                        case 2:
                            request_a0 = _a.sent();
                            return [4 /*yield*/, createPostRequest(Date.now() + 10000, b_post_set, b_key_set)];
                        case 3:
                            request_b = _a.sent();
                            return [4 /*yield*/, createPostRequest(Date.now() + 10000, c_post_set, c_key_set)];
                        case 4:
                            request_c = _a.sent();
                            return [4 /*yield*/, createPostsGetSelfRequest(a_key_set)];
                        case 5:
                            request_a_get_self = _a.sent();
                            return [4 /*yield*/, createPostsGetSelfRequest(b_key_set)];
                        case 6:
                            request_b_get_self = _a.sent();
                            return [4 /*yield*/, createPostsGetSelfRequest(c_key_set)];
                        case 7:
                            request_c_get_self = _a.sent();
                            return [4 /*yield*/, createPostsGetOthersRequest(c_key_set)];
                        case 8:
                            request_c_get_others = _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("CREATES POSTS: A - 1 expires", function (done) {
            chai_1.default
                .request(server)
                .put(request_a.endpoint)
                .set({
                "x-client-pubkey": request_a.pubkey,
                "x-nonce": request_a.nonce,
                "x-client-signature": request_a.signature,
            })
                .send(request_a.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['id'].startsWith('s5')).to.equal(true);
                done();
            });
        });
        it("CREATES POSTS: A - 1 persists", function (done) {
            chai_1.default
                .request(server)
                .put(request_a0.endpoint)
                .set({
                "x-client-pubkey": request_a0.pubkey,
                "x-nonce": request_a0.nonce,
                "x-client-signature": request_a0.signature,
            })
                .send(request_a0.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['id'].startsWith('s5')).to.equal(true);
                a_post_set.post_id = res.body['id'];
                done();
            });
        });
        it("CREATES POSTS: B - 1 persists", function (done) {
            chai_1.default
                .request(server)
                .put(request_b.endpoint)
                .set({
                "x-client-pubkey": request_b.pubkey,
                "x-nonce": request_b.nonce,
                "x-client-signature": request_b.signature,
            })
                .send(request_b.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['id'].startsWith('s5')).to.equal(true);
                b_post_set.post_id = res.body['id'];
                done();
            });
        });
        it("CREATES POSTS: C - 1 persists", function (done) {
            chai_1.default
                .request(server)
                .put(request_c.endpoint)
                .set({
                "x-client-pubkey": request_c.pubkey,
                "x-nonce": request_c.nonce,
                "x-client-signature": request_c.signature
            })
                .send(request_c.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['id'].startsWith('s5')).to.equal(true);
                c_post_set.post_id = res.body['id'];
                done();
            });
        });
        // it("EDITS POSTS: C ", function (done) {
        //   chai
        //     .request(server)
        //     .post(request_c_edit.endpoint)
        //     .set({
        //       "x-client-pubkey": request_c_edit.pubkey,
        //       "x-nonce": request_c_edit.nonce,
        //       "x-client-signature": request_c_edit.signature
        //     })
        //     .send({
        //       post_id: c_post_set.post_id,
        //       cypher_json: c_post_edit_set.cypher
        //     })
        //     .end((err, res) => {
        //       res.should.have.status(200);
        //       expect(res.body['status']).to.equal(true);
        //       done();
        //     });
        // });
        it("GETS A SELF POSTS", function (done) {
            chai_1.default
                .request(server)
                .get(request_a_get_self.endpoint)
                .set({
                "x-client-pubkey": request_a_get_self.pubkey,
                "x-nonce": request_a_get_self.nonce,
                "x-client-signature": request_a_get_self.signature,
            })
                .end(function (err, res) {
                res.should.have.status(200);
                // 1 EXPIRED, 1 PERSISTED
                expect(res.body['posts'].length === 1).to.equal(true);
                expect(res.body['posts'][0].cypher_json).to.equal(a_post_set.cypher);
                done();
            });
        });
        it("GETS B SELF POSTS", function (done) {
            chai_1.default
                .request(server)
                .get(request_b_get_self.endpoint)
                .set({
                "x-client-pubkey": request_b_get_self.pubkey,
                "x-nonce": request_b_get_self.nonce,
                "x-client-signature": request_b_get_self.signature,
            })
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['posts'].length === 1).to.equal(true);
                expect(res.body['posts'][0].cypher_json).to.equal(b_post_set.cypher);
                done();
            });
        });
        it("GETS C SELF POSTS", function (done) {
            chai_1.default
                .request(server)
                .get(request_c_get_self.endpoint)
                .set({
                "x-client-pubkey": request_c_get_self.pubkey,
                "x-nonce": request_c_get_self.nonce,
                "x-client-signature": request_c_get_self.signature,
            })
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['posts'].length === 1).to.equal(true);
                expect(res.body['posts'][0].cypher_json).to.equal(c_post_set.cypher);
                // expect(res.body['posts'][0].edited).to.equal(true);
                done();
            });
        });
        it("GETS C OTHERS POSTS -> None as B has not shared keys", function (done) {
            chai_1.default
                .request(server)
                .get(request_c_get_others.endpoint)
                .set({
                "x-client-pubkey": request_c_get_others.pubkey,
                "x-nonce": request_c_get_others.nonce,
                "x-client-signature": request_c_get_others.signature,
            })
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['posts'].length === 0).to.equal(true);
                // expect(res.body['posts'][0].cypher_json).to.equal(b_post_set.cypher);
                done();
            });
        });
    });
    describe("UPDATE POST KEYS based on Trust Announcements and VERIFY via GET OTHERS", function () {
        var request_a;
        var request_b;
        var request_c;
        var request_a_get_others;
        var request_b_get_others;
        var request_c_get_others;
        it("CREATES POST KEY REQUESTS", function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, createKeyStoreUpdate(a_post_set, a_trust, a_key_set)];
                        case 1:
                            request_a = _a.sent();
                            return [4 /*yield*/, createKeyStoreUpdate(b_post_set, b_trust, b_key_set)];
                        case 2:
                            request_b = _a.sent();
                            return [4 /*yield*/, createKeyStoreUpdate(c_post_set, c_trust, c_key_set)];
                        case 3:
                            request_c = _a.sent();
                            return [4 /*yield*/, createPostsGetOthersRequest(a_key_set)];
                        case 4:
                            request_a_get_others = _a.sent();
                            return [4 /*yield*/, createPostsGetOthersRequest(b_key_set)];
                        case 5:
                            request_b_get_others = _a.sent();
                            return [4 /*yield*/, createPostsGetOthersRequest(c_key_set)];
                        case 6:
                            request_c_get_others = _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("UPDATES POST DECRYPTION KEYS of A TRUSTED", function (done) {
            chai_1.default
                .request(server)
                .put(request_a.endpoint)
                .set({
                "x-client-pubkey": request_a.pubkey,
                "x-nonce": request_a.nonce,
                "x-client-signature": request_a.signature,
            })
                .send(request_a.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['status']).to.equal(true);
                done();
            });
        });
        it("UPDATES POST DECRYPTION KEYS of B TRUSTED", function (done) {
            chai_1.default
                .request(server)
                .put(request_b.endpoint)
                .set({
                "x-client-pubkey": request_b.pubkey,
                "x-nonce": request_b.nonce,
                "x-client-signature": request_b.signature,
            })
                .send(request_b.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['status']).to.equal(true);
                done();
            });
        });
        it("UPDATES POST DECRYPTION KEYS of C TRUSTED", function (done) {
            chai_1.default
                .request(server)
                .put(request_c.endpoint)
                .set({
                "x-client-pubkey": request_c.pubkey,
                "x-nonce": request_c.nonce,
                "x-client-signature": request_c.signature,
            })
                .send(request_c.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['status']).to.equal(true);
                done();
            });
        });
        it("GETS A OTHERS POSTS and VERIFY via ABILITY TO DECRYPT", function (done) {
            chai_1.default
                .request(server)
                .get(request_a_get_others.endpoint)
                .set({
                "x-client-pubkey": request_a_get_others.pubkey,
                "x-nonce": request_a_get_others.nonce,
                "x-client-signature": request_a_get_others.signature,
            })
                .send(request_a_get_others.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['posts'].length).to.equal(1);
                var shared_sercret = bitcoin.calculate_shared_secret({
                    privkey: a_key_set.identity_private,
                    pubkey: c_key_set.identity_pubkey
                });
                var c_decryption_key = s5crypto.decryptAESMessageWithIV(res.body['posts'][0].decryption_key, shared_sercret);
                var c_decrypted_post = s5crypto.decryptAESMessageWithIV(res.body['posts'][0].cypher_json, c_decryption_key);
                expect(JSON.parse(c_decrypted_post)['type']).to.equal(c_post_set.plain.type);
                done();
            });
        });
        it("GETS B OTHERS POSTS and VERIFY via ABILITY TO DECRYPT", function (done) {
            chai_1.default
                .request(server)
                .get(request_b_get_others.endpoint)
                .set({
                "x-client-pubkey": request_b_get_others.pubkey,
                "x-nonce": request_b_get_others.nonce,
                "x-client-signature": request_b_get_others.signature,
            })
                .send(request_b_get_others.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['posts'].length).to.equal(1);
                var shared_sercret = bitcoin.calculate_shared_secret({
                    privkey: b_key_set.identity_private,
                    pubkey: a_key_set.identity_pubkey
                });
                var a_decryption_key = s5crypto.decryptAESMessageWithIV(res.body['posts'][0].decryption_key, shared_sercret);
                var a_decrypted_post = s5crypto.decryptAESMessageWithIV(res.body['posts'][0].cypher_json, a_decryption_key);
                expect(JSON.parse(a_decrypted_post)['type']).to.equal(a_post_set.plain.type);
                done();
            });
        });
        it("GETS C OTHERS POSTS and VERIFY via ABILITY TO DECRYPT", function (done) {
            chai_1.default
                .request(server)
                .get(request_c_get_others.endpoint)
                .set({
                "x-client-pubkey": request_c_get_others.pubkey,
                "x-nonce": request_c_get_others.nonce,
                "x-client-signature": request_c_get_others.signature,
            })
                .send(request_c_get_others.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['posts'].length).to.equal(1);
                var shared_sercret = bitcoin.calculate_shared_secret({
                    privkey: c_key_set.identity_private,
                    pubkey: b_key_set.identity_pubkey
                });
                var b_decryption_key = s5crypto.decryptAESMessageWithIV(res.body['posts'][0].decryption_key, shared_sercret);
                var b_decrypted_post = s5crypto.decryptAESMessageWithIV(res.body['posts'][0].cypher_json, b_decryption_key);
                expect(JSON.parse(b_decrypted_post)['type']).to.equal(b_post_set.plain.type);
                done();
            });
        });
    });
    describe("UPDATED POST BY C", function () {
        var request_c_edit;
        var request_c_get_self;
        it("CREATES EDIT/GET POST REQUESTS", function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, editPostRequest(c_post_set, c_key_set)];
                        case 1:
                            request_c_edit = _a.sent();
                            return [4 /*yield*/, createPostsGetSelfRequest(c_key_set)];
                        case 2:
                            request_c_get_self = _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("EDITS POSTS: C ", function (done) {
            chai_1.default
                .request(server)
                .post(request_c_edit.endpoint)
                .set({
                "x-client-pubkey": request_c_edit.pubkey,
                "x-nonce": request_c_edit.nonce,
                "x-client-signature": request_c_edit.signature
            })
                .send(request_c_edit.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['status']).to.equal(true);
                done();
            });
        });
        it("GETS C SELF POSTS", function (done) {
            chai_1.default
                .request(server)
                .get(request_c_get_self.endpoint)
                .set({
                "x-client-pubkey": request_c_get_self.pubkey,
                "x-nonce": request_c_get_self.nonce,
                "x-client-signature": request_c_get_self.signature,
            })
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['posts'].length === 1).to.equal(true);
                expect(res.body['posts'][0].cypher_json).to.equal(c_post_set.cypher);
                expect(res.body['posts'][0].edited).to.equal(true);
                done();
            });
        });
    });
    describe("REVOKE A->B TRUST", function () {
        var request_a;
        it("CREATES REVOKE REQUEST", function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, createRevokeTrustRequest(b_key_set.identity_pubkey, a_key_set)];
                        case 1:
                            request_a = _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("REVOKES TRUST FROM A->B", function (done) {
            chai_1.default
                .request(server)
                .post(request_a.endpoint)
                .set({
                "x-client-pubkey": request_a.pubkey,
                "x-nonce": request_a.nonce,
                "x-client-signature": request_a.signature,
            })
                .send(request_a.body)
                .end(function (err, res) {
                res.should.have.status(200);
                expect(res.body['status']).to.equal(true);
                done();
            });
        });
    });
    describe("TEST NOTIFICATION SOCKETS", function () {
        var b_sock_req;
        var c_sock_req;
        var b_sock;
        var c_sock;
        var options = {
            headers: {},
        };
        var socketUrl = "ws://localhost:".concat(TEST_PORT, "/api/v3/notifications");
        it("CREATE SOCKET OPEN REQUESTS", function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, createSocketConnectionRequest(c_key_set)];
                        case 1:
                            c_sock_req = _a.sent();
                            return [4 /*yield*/, createSocketConnectionRequest(b_key_set)];
                        case 2:
                            b_sock_req = _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("TEST SOCKET CONNECTIONS", function (done) {
            options.headers['x-nonce'] = c_sock_req.nonce;
            options.headers['x-client-pubkey'] = c_sock_req.pubkey;
            options.headers['x-client-signature'] = c_sock_req.signature;
            c_sock = new ws_1.default(socketUrl, options);
            c_sock.on('message', function (msg) {
                console.log('C (inbox): ' + msg.toString());
                // expect(msg.toString()).to.be.equal('Securely connected to cypherpost notification stream.');
            });
            c_sock.on('connect_error', function (msg) {
                console.log(msg);
            });
            options.headers['x-nonce'] = b_sock_req.nonce;
            options.headers['x-client-pubkey'] = b_sock_req.pubkey;
            options.headers['x-client-signature'] = b_sock_req.signature;
            b_sock = new ws_1.default(socketUrl, options);
            b_sock.on('message', function (msg) {
                console.log('B (inbox): ' + msg.toString());
                // expect(msg.toString()).to.be.equal('Securely connected to cypherpost notification stream.');
            });
            b_sock.on('connect_error', function (msg) {
                console.log(msg);
            });
            setTimeout(function () {
                b_sock.send(b_post_set.post_id); // C will get this in her inbox
                c_sock.send("This message will not be accepted by cypherpost stream.");
                done();
            }, 5000);
        });
    });
    describe("E: 409's", function () {
        var request_a;
        var request_b;
        var request_c;
        it("CREATES REQUEST OBJECTS", function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, createIdentityRegistrationRequest("alivf", a_key_set)];
                        case 1:
                            request_a = _a.sent();
                            return [4 /*yield*/, createAnnouncementIssueRequest(interface_1.AnnouncementType.Trust, c_key_set.identity_pubkey, b_key_set)];
                        case 2:
                            // console.log({ request_a })
                            request_b = _a.sent();
                            return [4 /*yield*/, createKeyStoreUpdate(c_post_set, c_trust, c_key_set)];
                        case 3:
                            request_c = _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("PREVENTS REUSING INVITATION", function (done) {
            // console.log({request_a})
            chai_1.default
                .request(server)
                .post(request_a.endpoint)
                .set({
                "x-client-pubkey": request_a.pubkey,
                "x-nonce": request_a.nonce,
                "x-client-signature": request_a.signature,
                "x-client-invite-code": a_invitation
            })
                .send(request_a.body)
                .end(function (err, res) {
                res.should.have.status(400);
                done();
            });
        });
        it("PREVENTS DUPLICATE TRUST ANNOUNCEMENT", function (done) {
            chai_1.default
                .request(server)
                .post(request_b.endpoint)
                .set({
                "x-client-pubkey": request_b.pubkey,
                "x-nonce": request_b.nonce,
                "x-client-signature": request_b.signature,
            })
                .send(request_b.body)
                .end(function (err, res) {
                res.should.have.status(409);
                done();
            });
        });
        it("PREVENTS DUPLICATE POSTS DECRYPTION KEY ENTRY", function (done) {
            chai_1.default
                .request(server)
                .put(request_c.endpoint)
                .set({
                "x-client-pubkey": request_c.pubkey,
                "x-nonce": request_c.nonce,
                "x-client-signature": request_c.signature,
            })
                .send(request_c.body)
                .end(function (err, res) {
                res.should.have.status(409);
                done();
            });
        });
    });
    describe("GLOBAL", function () {
        // tslint:disable-next-line: one-variable-per-declaration
        var request_a, request_b, request_c;
        it("CREATES SERVER IDENTITY REQUEST", function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, createServerIdentityRequest(a_key_set)];
                        case 1:
                            request_a = _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("GETS SERVER PUBKEY", function (done) {
            chai_1.default
                .request(server)
                .get(request_a.endpoint)
                .set({
                "x-client-pubkey": request_a.pubkey,
                "x-nonce": request_a.nonce,
                "x-client-signature": request_a.signature,
            })
                .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
        });
        it("CREATES DELETE REQUEST", function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, createDeleteIdentityRequest(a_key_set)];
                        case 1:
                            request_a = _a.sent();
                            return [4 /*yield*/, createDeleteIdentityRequest(b_key_set)];
                        case 2:
                            request_b = _a.sent();
                            return [4 /*yield*/, createDeleteIdentityRequest(c_key_set)];
                        case 3:
                            request_c = _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("DELETES ALL CREATED IDENTITIES AND ALL ASSOCIATIONS", function (done) {
            chai_1.default
                .request(server)
                .delete(request_a.endpoint)
                .set({
                "x-client-pubkey": request_a.pubkey,
                "x-nonce": request_a.nonce,
                "x-client-signature": request_a.signature,
            })
                .send(request_a.body)
                .end(function (err, res) {
                res.should.have.status(200);
            });
            chai_1.default
                .request(server)
                .delete(request_b.endpoint)
                .set({
                "x-client-pubkey": request_b.pubkey,
                "x-nonce": request_b.nonce,
                "x-client-signature": request_b.signature,
            })
                .send(request_b.body)
                .end(function (err, res) {
                res.should.have.status(200);
            });
            chai_1.default
                .request(server)
                .delete(request_c.endpoint)
                .set({
                "x-client-pubkey": request_c.pubkey,
                "x-nonce": request_c.nonce,
                "x-client-signature": request_c.signature,
            })
                .send(request_c.body)
                .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
        });
    });
});
//# sourceMappingURL=main.spec.js.map