class CookieService{
	static setCookie(request, response, name, value, options) {
		let newCookies = response.getHeader('Set-Cookie'),
			cookies = [];
		for (let index in newCookies){
			let cookie = this.cookie.parse(newCookies[index]);
			if (typeof cookie[name] === "undefined"){
				cookies.push(newCookies[index]);
			}
		}
		cookies.push(this.cookie.serialize(name, value, options));
		response.setHeader('Set-Cookie', cookies);
		if (typeof request.cookies === "undefined"){
			request.cookies = [];
		}
		request.cookies[name] = value;
	}
}

CookieService.cookie = require("cookie");

module.exports = CookieService;