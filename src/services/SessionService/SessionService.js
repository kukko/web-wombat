class SessionService{
    static getSessions(){
        return this.sessions;
    }
    static getSession(request){
        return this.sessions[request.cookies[this.sessionIdCookie]];
    }
    static setSessions(sessions){
        this.sessions = sessions;
    }
    static setSession(uuid, data){
        this.sessions[uuid] = data;
    }
    static writeToSession(request, key, value){
        if (!this.sessionExists(request.cookies[this.sessionIdCookie])){
            this.createSession(request.cookies[this.sessionIdCookie]);
        }
        this.sessions[request.cookies[this.sessionIdCookie]][key] = value;
    }
    static sessionStarted(request){
        return typeof request.cookies[this.sessionIdCookie] !== 'undefined';
    }
    static startSession(request, response){
        let uuid = this.generateUUID();
        this.CookieService.setCookie(request, response, this.sessionIdCookie, uuid);
        this.createSession(uuid);
    }
    static sessionExists(uuid){
        return typeof this.sessions[uuid] !== 'undefined';
    }
    static createSession(uuid){
        this.sessions[uuid] = {};
    }
    static generateUUID(length = 8, possibleChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'){
        let output;
        do{
            output = "";
            for (let i = 0; i < length; i++){
                output += possibleChars[Math.floor(Math.random() * possibleChars.length)];
            }
        } while (typeof this.sessions[output] !== "undefined");
        return output;
    }
	static setWithSessions(){
		this.startSessions = true;
	}
	static setWithoutSessions(){
		this.startSessions = false;
    }
    static isWithSessions(){
        return this.startSessions;
    }
    static setPersistInterval(persistInterval){
        this.persistInterval = persistInterval;
    }
    static getPersistInterval(){
        return this.persistInterval;
    }
    static setPersister(persister){
        this.persister = persister;
    }
    static getPersister(){
        return this.persister;
    }
}

SessionService.sessions = {};

SessionService.sessionIdCookie = 'node-sessid';

SessionService.startSessions = true;

SessionService.CookieService = require('../CookieService/CookieService');

SessionService.persistInterval = 60000;

SessionService.persister = require('./SessionPersisters/FilePersister/FilePersister');

module.exports = SessionService;