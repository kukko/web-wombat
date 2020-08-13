class CookieService{
	static setCookie(request, response, name, value) {
		let newCookies = response.getHeader('Set-Cookie'),
			cookies = [],
			added = false;
		for (let index in newCookies){
			let cookie = this.cookie.parse(newCookies[index]);
			if (cookie[name] === "undefined"){
				cookies.push(this.cookie.serialize(name, value));
				added = true;
			}
			else{
				cookies.push(newCookies[index]);
			}
		}
		if (!added){
			cookies.push(this.cookie.serialize(name, value));
		}
		response.setHeader('Set-Cookie', cookies);
		request.cookies[name] = value;
	}
}

CookieService.cookie = require("cookie");

module.exports = CookieService;