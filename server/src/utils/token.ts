import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "abc";

export function generateToken(payload: JwtPayload, jwtOptions?: SignOptions) {
	const token = jwt.sign(payload, jwtSecret, jwtOptions);
	return { success: true, token };
}

export function verifyToken(token: string) {
	const payload = jwt.verify(token, jwtSecret);
	// Handle case where jwt.verify returns a string (for invalid tokens)
	if (typeof payload === "string") {
		throw new Error("Invalid token format");
	}

	return { success: true, payload: payload as JwtPayload };
}
