export function generateToken() {
	return Math.floor(100000 + Math.random() * 999999).toString();
}
