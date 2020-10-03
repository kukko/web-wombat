class AbstractSessionPersister{
    static persistSessions(sessions){
		throw new Error(
			"Not implemented 'persistSessions' method in class: " +
				this.constructor.name +
				"!"
		);
	}
    static loadSessions(){
		throw new Error(
			"Not implemented 'loadSessions' method in class: " +
				this.constructor.name +
				"!"
		);
    }
	static persist(sessions){
        if (this.canStartPeristing()){
			this.switchToWorkingState();
			this.persistSessions(sessions).then((result) => {
				this.switchToIdleState();
			})
			.catch((error) => {
				this.switchToIdleState();
				console.error(error);
			});
        }
	}
	static load(){
		return new Promise((resolve, reject) => {
			if (this.canLoadPersistedData()){
				this.switchToWorkingState();
				this.loadSessions().then((result) => {
					this.switchToIdleState();
					resolve(result);
				}).catch((error) => {
					this.switchToIdleState();
					console.error(error);
					reject(error);
				});
			}
			else{
				reject(new Error("Persister works, can not load sessions"));
			}
		});
	}
    static getState(){
        return this.state;
    }
    static getIdleState(){
        return 'IDLE';
    }
    static getWorkingState(){
        return 'WORKING';
    }
    static switchToIdleState(){
        this.state = this.getIdleState();
    }
    static switchToWorkingState(){
        this.state = this.getWorkingState();
    }
    static canStartPeristing(){
        return this.getState() === this.getIdleState();
    }
    static canLoadPersistedData(){
        return this.getState() === this.getIdleState();
    }
}

AbstractSessionPersister.switchToIdleState();

module.exports = AbstractSessionPersister;