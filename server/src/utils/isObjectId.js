// server/src/utils/isObjectId.js
import mongoose from "mongoose";

/**
 * Check if a value is a valid MongoDB ObjectId.
 * Returns true or false.
 */
export const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
