/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import express from "express";
import {
    handleGetLandingPage
} from "./dto";
// ------------------ '(◣ ◢' ---------------------
export const router = express.Router();

router.get("/", handleGetLandingPage);
// ------------------ '(◣ ◢)' ---------------------