import { connect } from "mongoose";
const mongoUrl = process.env.MONGO_URL!;

async function connectDatabase() {
	try {
		await connect(mongoUrl);
		console.log("Database connected✅");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
}

export default connectDatabase;
