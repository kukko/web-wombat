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
			this.state = this.getWorkingState();
			this.persistSessions(sessions).then((result) => {
				this.state = this.getIdleState();
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
					console.log(error);
					reject(error);
				});
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