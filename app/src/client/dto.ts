/*
cypherpost.io
Developed @ Stackmate India
*/

import * as fs from "fs";
import * as path from "path";
import { logger, r_500 } from "../lib/logger/winston";
import { filterError, parseRequest, respond } from "../lib/http/handler";

const base_path = `/home/node/cypherpost.io/app/src/client/public`

export async function handleGetLandingPage(req, res) {
  const request = parseRequest(req);
  try {
    const exists = fs.existsSync(`${base_path}/index.html`);
    if (!exists) throw { code: 404, message: { html_exists_at_path: exists } };

    res.sendFile(path.join(base_path, "/index.html"));
  } catch (e) {
    let result = filterError(e, r_500, request);
    logger.debug({
      e
    });
    respond(result.code, result.message, res, request);
  }
}

export async function handleGetProtocolPage(req, res) {
  const request = parseRequest(req);
  try {
    const exists = fs.existsSync(`${base_path}/protocol.html`);
    if (!exists) throw { code: 404, message: { html_exists_at_path: exists } };

    res.sendFile(path.join(base_path, "/protocol.html"));
  } catch (e) {
    let result = filterError(e, r_500, request);
    logger.debug({
      e
    });
    respond(result.code, result.message, res, request);
  }
}

export async function handleGetTreasurePage(req, res) {
  const request = parseRequest(req);
  try {
    const exists = fs.existsSync(`${base_path}/treasure.html`);
    if (!exists) throw { code: 404, message: { html_exists_at_path: exists } };

    res.sendFile(path.join(base_path, "/treasure.html"));
  } catch (e) {
    let result = filterError(e, r_500, request);
    logger.debug({
      e
    });
    respond(result.code, result.message, res, request);
  }
}