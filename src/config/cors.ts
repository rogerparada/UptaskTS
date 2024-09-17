import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
	origin: function (origin, callback) {
		const whiteList = process.env.ALLOWED_CORS.split(",");
		if (whiteList.includes(origin) || origin === undefined) {
			callback(null, true);
		} else {
			callback(new Error("CORS Error"));
		}
	},
};
