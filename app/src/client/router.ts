/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import express from "express";
import {
    handleGetLandingPage,handleGetProtocolPage
} from "./dto";
// ------------------ '(◣ ◢' ---------------------
export const router = express.Router();

router.get("/", handleGetLandingPage);
router.get("/protocol", handleGetProtocolPage);

// ------------------ '(◣ ◢)' ---------------------