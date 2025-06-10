import { Types } from "mongoose";

const validateObjectId = (id: string) => Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;

export default validateObjectId;
