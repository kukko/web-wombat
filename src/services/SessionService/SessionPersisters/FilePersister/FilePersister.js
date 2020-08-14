let AbstractSessionPersister = require('../AbstractSessionPersister'),
    { existsSync, writeFileSync, readFileSync } = require('fs');

class FilePersister extends AbstractSessionPersister{
    static persistSessions(sessions){
        return new Promise((resolve, reject) => {
            writeFileSync(this.getPersistedFilePath(), JSON.stringify(sessions));
            resolve(true);
        });
    }
    static loadSessions(){
        return new Promise((resolve, reject) => {
            if (existsSync(this.getPersistedFilePath())){
                resolve(JSON.parse(readFileSync(this.getPersistedFilePath(), {
                    encoding: 'UTF-8'
                })));
            }
            else{
                resolve(null);
            }
        });
    }
    static setPersistedFilePath(persistedFilePath){
        this.persistedFilePath = persistedFilePath;
    }
    static getPersistedFilePath(){
        return this.persistedFilePath;
    }
}

FilePersister.persistedFilePath = './persistedSessions.json';

module.exports = FilePersister;