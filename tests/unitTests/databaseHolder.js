let assert = require('chai').assert,
	sinon = require('sinon'),
	proxyquire = require('proxyquire').noCallThru();

describe('DatabaseHolder', () => {
	let DatabaseHolder;
	beforeEach(() => {
		DatabaseHolder = require('../../src/DatabaseHolder.js');
	});
	it('Can be loaded', () => {
		assert.isFunction(DatabaseHolder);
	});
	describe('Have basic documented static 0methods', () => {
		it('getCollectionCNT', () => {
			assert.isFunction(DatabaseHolder.getCollectionCNT);
		});
		it('connect', () => {
			assert.isFunction(DatabaseHolder.connect);
		});
		it('getAuthentication', () => {
			assert.isFunction(DatabaseHolder.getAuthentication);
		});
	});
	describe('Methods works as expected', () => {
		describe('getCollections', () => {
			let fakeGetCollections,
				fakeGetCollectionsReturnValue;
				beforeEach(() => {
					fakeGetCollections = sinon.fake(() => {
						return fakeGetCollectionsReturnValue;
					});
					DatabaseHolder = proxyquire.load('../../src/DatabaseHolder.js', {
						'./CollectionsProvider.js': {
							getCollections: fakeGetCollections
						}
					});
				});
				describe('Collections wasn\'t loaded before', () => {
					beforeEach(() => {
						fakeGetCollectionsReturnValue = {};
					});
					describe('Returns correct value', () => {
						it('Returns an object', () => {
							assert.isObject(DatabaseHolder.getCollections());
						});
						it('Returned object is correct', () => {
							assert.equal(DatabaseHolder.getCollections(), fakeGetCollectionsReturnValue);
						});
					});
					describe('Calls methods', () => {
						beforeEach(() => {
							DatabaseHolder.getCollections();
						});
						describe('Calls \'getCollections\' of \'CollectionsProvider\' module', () => {
							it('Called once', () => {
								sinon.assert.calledOnce(fakeGetCollections);
							});
							it('Called with correct parameters', () => {
								assert.deepEqual(fakeGetCollections.getCall(0).args, [
								]);
							});
						});
					});
					describe('Modifies attributes properly', () => {
						beforeEach(() => {
							DatabaseHolder.getCollections();
						});
						it('Modifies \'collections\' attribute properly', () => {
							assert.equal(DatabaseHolder.collections, fakeGetCollectionsReturnValue);
						});
					});
				});
				describe('Collections was loaded before', () => {
					let testCollections;
					beforeEach(() => {
						fakeGetCollectionsReturnValue = {
							a: {}
						};
						testCollections = {};
						DatabaseHolder.collections = testCollections;
					});
					describe('Returns correct value', () => {
						it('Returns an object', () => {
							assert.isObject(DatabaseHolder.getCollections());
						});
						it('Returned object is correct', () => {
							assert.equal(DatabaseHolder.getCollections(), testCollections);
						});
					});
					describe('Calls methods', () => {
						beforeEach(() => {
							DatabaseHolder.getCollections();
						});
						describe('Calls \'getCollections\' of \'CollectionsProvider\' module', () => {
							it('Called once', () => {
								sinon.assert.notCalled(fakeGetCollections);
							});
						});
					});
					describe('Modifies attributes properly', () => {
						beforeEach(() => {
							DatabaseHolder.getCollections();
						});
						it('Doesn\'t modifies \'collections\' attribute', () => {
							assert.equal(DatabaseHolder.collections, testCollections);
						});
					});
				});
		});
		describe('getCollectionCNT', () => {
			let getCollectionsBefore,
				fakeGetCollections,
				fakeGetCollectionsReturnValue;
			beforeEach(() => {
				getCollectionsBefore = DatabaseHolder.getCollections;
				fakeGetCollectionsReturnValue = {};
				fakeGetCollections = sinon.fake(() => {
					return fakeGetCollectionsReturnValue;
				});
				DatabaseHolder.getCollections = fakeGetCollections;
			});
			describe('Returns correct value', () => {
				it('Returns a number', () => {
					assert.isNumber(DatabaseHolder.getCollectionCNT());
				});
				it('Returned number is correct', () => {
					assert.equal(DatabaseHolder.getCollectionCNT(), 0);
				});
			});
			describe('Calls methods', () => {
				beforeEach(() => {
					sinon.spy(Object, 'keys');
					DatabaseHolder.getCollectionCNT();
				});
				describe('Calls \'getCollections\' method of \'DatabaseHolder\' class', () => {
					it('Called once', () => {
						sinon.assert.calledOnce(DatabaseHolder.getCollections);
					});
					it('Called with correct parameters', () => {
						assert.deepEqual(DatabaseHolder.getCollections.getCall(0).args, [
						]);
					});
				});
				describe('Calls \'keys\' method of \'Object\' class', () => {
					it('Called once', () => {
						sinon.assert.calledOnce(Object.keys);
					});
					it('Called with correct parameters', () => {
						assert.deepEqual(Object.keys.getCall(0).args, [
							fakeGetCollectionsReturnValue
						]);
					});
				});
				afterEach(() => {
					sinon.restore();
				});
			});
			afterEach(() => {
				DatabaseHolder.getCollections = getCollectionsBefore;
			});
		});
		describe('connect', () => {
			let fakeGetDb,
				fakeGetDbReturnValue,
				fakeConnect,
				fakeConnectCallback,
				connectCallbackBefore,
				testError,
				testConnection,
				fakeBuildConnectionString,
				fakeBuildConnectionStringReturnValue,
				buildConnectionStringBefore,
				testConnectionString;
			beforeEach(() => {
				fakeGetDbReturnValue = {};
				fakeGetDb = sinon.fake(() => {
					return fakeGetDbReturnValue;
				});
				fakeConnect = sinon.fake((connectionString, options, callback) => {
					callback(testError, testConnection);
				});
				DatabaseHolder = proxyquire.load('../../src/DatabaseHolder.js', {
					'./config/Config.js': {
						GetDb: fakeGetDb
					},
					'mongodb': {
						MongoClient: {
							connect: fakeConnect
						}
					}
				});
				fakeConnectCallback = sinon.fake((database, resolve, reject) => {
					return (error, connection) => {
						resolve();
					};
				});
				connectCallbackBefore = DatabaseHolder.connectCallback;
				DatabaseHolder.connectCallback = fakeConnectCallback;
				fakeBuildConnectionStringReturnValue = 'foo';
				fakeBuildConnectionString = sinon.fake(() => {
					return fakeBuildConnectionStringReturnValue;
				});
				buildConnectionStringBefore = DatabaseHolder.buildConnectionString;
				DatabaseHolder.buildConnectionString = fakeBuildConnectionString;
			});
			describe('The \'connectionString\' parameter has not been set', () => {
				describe('The \'database\' parameter has not been set', () => {
					describe('Returns correct value', () => {
						it('Returned value is an instance of \'Promise\' class', () => {
							assert.instanceOf(DatabaseHolder.connect(testConnectionString), Promise);
						});
					});
					describe('Calls methods', () => {
						describe('Calls \'GetDb\' method of \'Config\' class', () => {
							beforeEach(() => {
								DatabaseHolder.connect(testConnectionString);
							});
							it('Called once', () => {
								sinon.assert.calledOnce(fakeGetDb);
							});
							it('Called with correct parameters', () => {
								assert.deepEqual(fakeGetDb.getCall(0).args, [
								]);
							});
						});
						describe('Calls \'connect\' method of \'MongoClient\' class from \'mongodb\' module', () => {
							it('Called once', (done) => {
								DatabaseHolder.connect(testConnectionString).then(() => {
									sinon.assert.calledOnce(fakeConnect);
									done();
								});
							});
							describe('Called with correct parameters', () => {
								it('Called with three paramaters', (done) => {
									DatabaseHolder.connect(testConnectionString).then(() => {
										assert.lengthOf(fakeConnect.getCall(0).args, 3);
										done();
									});
								});
								it('First parameter is correct', (done) => {
									DatabaseHolder.connect(testConnectionString).then(() => {
										assert.equal(fakeConnect.getCall(0).args[0], fakeBuildConnectionStringReturnValue);
										done();
									});
								});
								it('Second parameter is correct', (done) => {
									DatabaseHolder.connect(testConnectionString).then(() => {
										assert.deepEqual(fakeConnect.getCall(0).args[1], {
											useNewUrlParser: true,
											useUnifiedTopology: true
										});
										done();
									});
								});
								it('Third parameter is correct', (done) => {
									DatabaseHolder.connect(testConnectionString).then(() => {
										assert.isFunction(fakeConnect.getCall(0).args[2]);
										done();
									});
								});
							});
							('Called with correct parameters', (done) => {
								DatabaseHolder.connect(testConnectionString).then(() => {
									assert.deepEqual(fakeConnect.getCall(0).args, [
										fakeBuildConnectionStringReturnValue,
										{
											useNewUrlParser: true,
											useUnifiedTopology: true
										}
									]);
									done();
								});
							});
						});
					});
				});
			});
			describe('The \'connectionString\' parameter has not been set', () => {
				beforeEach(() => {
					testConnectionString = DatabaseHolder.buildConnectionString();
				});
				describe('The \'database\' parameter has not been set', () => {
					describe('Returns correct value', () => {
						it('Returned value is an instance of \'Promise\' class', () => {
							assert.instanceOf(DatabaseHolder.connect(testConnectionString), Promise);
						});
					});
					describe('Calls methods', () => {
						describe('Calls \'GetDb\' method of \'Config\' class', () => {
							beforeEach(() => {
								DatabaseHolder.connect(testConnectionString);
							});
							it('Called once', () => {
								sinon.assert.calledOnce(fakeGetDb);
							});
							it('Called with correct parameters', () => {
								assert.deepEqual(fakeGetDb.getCall(0).args, [
								]);
							});
						});
						describe('Calls \'connect\' method of \'MongoClient\' class from \'mongodb\' module', () => {
							it('Called once', (done) => {
								DatabaseHolder.connect(testConnectionString).then(() => {
									sinon.assert.calledOnce(fakeConnect);
									done();
								});
							});
							describe('Called with correct parameters', () => {
								it('Called with three paramaters', (done) => {
									DatabaseHolder.connect(testConnectionString).then(() => {
										assert.lengthOf(fakeConnect.getCall(0).args, 3);
										done();
									});
								});
								it('First parameter is correct', (done) => {
									DatabaseHolder.connect(testConnectionString).then(() => {
										assert.equal(fakeConnect.getCall(0).args[0], fakeBuildConnectionStringReturnValue);
										done();
									});
								});
								it('Second parameter is correct', (done) => {
									DatabaseHolder.connect(testConnectionString).then(() => {
										assert.deepEqual(fakeConnect.getCall(0).args[1], {
											useNewUrlParser: true,
											useUnifiedTopology: true
										});
										done();
									});
								});
								it('Third parameter is correct', (done) => {
									DatabaseHolder.connect(testConnectionString).then(() => {
										assert.isFunction(fakeConnect.getCall(0).args[2]);
										done();
									});
								});
							});
							('Called with correct parameters', (done) => {
								DatabaseHolder.connect(testConnectionString).then(() => {
									assert.deepEqual(fakeConnect.getCall(0).args, [
										fakeBuildConnectionStringReturnValue,
										{
											useNewUrlParser: true,
											useUnifiedTopology: true
										}
									]);
									done();
								});
							});
						});
					});
				});
			});
			afterEach(() => {
				DatabaseHolder.connectCallback = connectCallbackBefore;
			});
		});
		describe('buildConnectionString', () => {
			let testDbConfig,
				getAuthenticationBefore,
				fakeGetAuthentication,
				fakeGetAuthenticationReturnValue;
			beforeEach(() => {
				testDbConfig = {
					username: "foo",
					password: "bar",
					host: "localhost",
					port: 27017,
					database: "oof"
				};
				fakeGetAuthenticationReturnValue = 'foo:bar@';
				fakeGetAuthentication = sinon.fake(() => {
					return fakeGetAuthenticationReturnValue;
				});
				getAuthenticationBefore = DatabaseHolder.getAuthentication;
				DatabaseHolder.getAuthentication = fakeGetAuthentication;
			});
			describe('The \'dbConfig\' parameter has been set', () => {
				describe('The \'authSource\' attribute in \'dbConfig\' parameter is not defined', () => {
					describe('Returns correct value', () => {
						it('Returned value is a string', () => {
							assert.isString(DatabaseHolder.buildConnectionString(testDbConfig));
						});
						it('Returned string is correct', () => {
							assert.equal(DatabaseHolder.buildConnectionString(testDbConfig), 'mongodb://' + fakeGetAuthenticationReturnValue + testDbConfig.host + ':' + testDbConfig.port + '/');
						});
					});
					describe('Calls methods', () => {
						beforeEach(() => {
							DatabaseHolder.buildConnectionString(testDbConfig);
						});
						describe('Calls \'getAuthentication\' method of \'DatabaseHolder\' class', () => {
							it('Called once', () => {
								sinon.assert.calledOnce(fakeGetAuthentication);
							});
							it('Called with correct parameters', () => {
								assert.deepEqual(fakeGetAuthentication.getCall(0).args, [
									testDbConfig.username,
									testDbConfig.password
								]);
							});
						});
					});
				});
				describe('The \'authSource\' attribute in \'dbConfig\' parameter has been set', () => {
					describe('The \'authSource\' attribute in \'dbConfig\' parameter is an empty string', () => {
						beforeEach(() => {
							testDbConfig.authSource = '';
						});
						describe('Returns correct value', () => {
							it('Returned value is a string', () => {
								assert.isString(DatabaseHolder.buildConnectionString(testDbConfig));
							});
							it('Returned string is correct', () => {
								assert.equal(DatabaseHolder.buildConnectionString(testDbConfig), 'mongodb://' + fakeGetAuthenticationReturnValue + testDbConfig.host + ':' + testDbConfig.port + '/');
							});
						});
						describe('Calls methods', () => {
							beforeEach(() => {
								DatabaseHolder.buildConnectionString(testDbConfig);
							});
							describe('Calls \'getAuthentication\' method of \'DatabaseHolder\' class', () => {
								it('Called once', () => {
									sinon.assert.calledOnce(fakeGetAuthentication);
								});
								it('Called with correct parameters', () => {
									assert.deepEqual(fakeGetAuthentication.getCall(0).args, [
										testDbConfig.username,
										testDbConfig.password
									]);
								});
							});
						});
					});
					describe('The \'authSource\' attribute in \'dbConfig\' parameter is a not empty string', () => {
						beforeEach(() => {
							testDbConfig.authSource = 'authSource';
						});
						describe('Returns correct value', () => {
							it('Returned value is a string', () => {
								assert.isString(DatabaseHolder.buildConnectionString(testDbConfig));
							});
							it('Returned string is correct', () => {
								assert.equal(DatabaseHolder.buildConnectionString(testDbConfig), 'mongodb://' + fakeGetAuthenticationReturnValue + testDbConfig.host + ':' + testDbConfig.port + '/' + "?authSource=" + testDbConfig.authSource);
							});
						});
						describe('Calls methods', () => {
							beforeEach(() => {
								DatabaseHolder.buildConnectionString(testDbConfig);
							});
							describe('Calls \'getAuthentication\' method of \'DatabaseHolder\' class', () => {
								it('Called once', () => {
									sinon.assert.calledOnce(fakeGetAuthentication);
								});
								it('Called with correct parameters', () => {
									assert.deepEqual(fakeGetAuthentication.getCall(0).args, [
										testDbConfig.username,
										testDbConfig.password
									]);
								});
							});
						});
					});
				});
			});
			describe('The \'dbConfig\' parameter has been set', () => {
				let fakeGetDb,
					fakeGetDbReturnValue;
				beforeEach(() => {
					testDbConfig = undefined;
					fakeGetDbReturnValue = {};
					fakeGetDb = sinon.fake(() => {
						return fakeGetDbReturnValue;
					});
					DatabaseHolder = proxyquire.load('../../src/DatabaseHolder.js', {
						'./config/Config.js': {
							GetDb: fakeGetDb
						}
					});
					DatabaseHolder.buildConnectionString(testDbConfig);
				});
				describe('Called the \'getDb\' method of \'Config\' class', () => {
					it('Called once', () => {
						sinon.assert.calledOnce(fakeGetDb);
					});
				});
				afterEach(() => {
					DatabaseHolder = require('../../src/DatabaseHolder.js');
				});
			});
			afterEach(() => {
				DatabaseHolder.getAuthentication = getAuthenticationBefore;
			});
		});
		describe('connectCallback', () => {
			let testDatabase,
				testError,
				testConnection,
				returnedFunction,
				fakeGetCollectionCNT,
				fakeResolve,
				fakeReject,
				fakeCreate,
				getCollectionsBefore,
				fakeGetCollections,
				fakeGetCollectionsReturnValue,
				fakeDb,
				collectionCreatedBefore,
				fakeCollectionCreated;
			beforeEach(() => {
				fakeDb = sinon.fake();
				testConnection = {
					db: fakeDb
				};
				fakeResolve = sinon.fake();
				fakeReject = sinon.fake();
				fakeCreate = sinon.fake.resolves(true);
				testCollection = {
					create: fakeCreate
				};
				fakeGetCollectionsReturnValue = [
					testCollection
				];
				fakeGetCollections = sinon.fake(() => {
					return fakeGetCollectionsReturnValue;
				});
				getCollectionsBefore = DatabaseHolder.getCollections;
				DatabaseHolder.getCollections = fakeGetCollections;
				sinon.spy(DatabaseHolder, 'getCollectionCNT');
				fakeCollectionCreated = sinon.fake((collection, resolve) => {
					resolve(true);
				});
				collectionCreatedBefore = DatabaseHolder.collectionCreated;
				DatabaseHolder.collectionCreated = fakeCollectionCreated;
			});
			describe('The \'error\' parameter of returned callback is undefined', () => {
				describe('The \'database\' parameter is defined', () => {
					beforeEach(() => {
						testDatabase = {};
					});
					describe('More than zero collection returned from \'getCollection\' method', () => {
						beforeEach(() => {
							DatabaseHolder.connectCallback(testDatabase, fakeResolve, fakeReject)(testError, testConnection);
						});
						describe('Called methods', () => {
							describe('Calls \'create\' method of collections', () => {
								it('Called once', () => {
									sinon.assert.callCount(fakeCreate, fakeGetCollectionsReturnValue.length);
								});
							});
							describe('Calls \'collectionCreated\' method of \'DatabaseHolder\'', () => {
								it('Called once', () => {
									sinon.assert.calledOnce(fakeCollectionCreated);
								});
								it('Called with correct parameters', () => {
									assert.deepEqual(fakeCollectionCreated.getCall(0).args, [
										true,
										fakeResolve
									]);
								});
							});
						});
					});
					describe('There are zero collection returned from \'getCollection\' method', () => {
						beforeEach(() => {
							fakeGetCollectionsReturnValue = [];
							DatabaseHolder.connectCallback(testDatabase, fakeResolve, fakeReject)(testError, testConnection);
						});
						describe('Called \'resolve\' method', () => {
							it('Called once', () => {
								sinon.assert.calledOnce(fakeResolve);
							});
							it('Called with correct parameters', () => {
								assert.deepEqual(fakeResolve.getCall(0).args, [
									true
								]);
							});
						});
					});
				});
			});
			describe('The \'error\' parameter of returned callback is truthy', () => {
				beforeEach(() => {
					testError = new Error();
				});
				describe('Returns correct value', () => {
					it('Returned value is a function', () => {
						assert.isFunction(DatabaseHolder.connectCallback(testDatabase, fakeResolve, fakeReject));
					});
				});
				describe('Returned function works correctly', () => {
					beforeEach(() => {
						DatabaseHolder.connectCallback(testDatabase, fakeResolve, fakeReject)(testError, testConnection);
					});
					describe('Calls methods', () => {
						it('Called reject parameter function', () => {
							sinon.assert.calledOnce(fakeReject);
						});
					});
				});
			});
			describe('The \'database\' parameter is undefined', () => {
				let fakeGetDb,
					fakeGetDbReturnValue;
				beforeEach(() => {
					testDatabase = undefined;
					fakeGetDbReturnValue = {};
					fakeGetDb = sinon.fake(() => {
						return fakeGetDbReturnValue;
					});
					DatabaseHolder = proxyquire.load('../../src/DatabaseHolder.js', {
						'./config/Config.js': {
							GetDb: fakeGetDb
						}
					});
				});
				describe('Calls methods', () => {
					describe('Calls \'GetDb\' method of \'Config\' class', () => {
						beforeEach(() => {
							DatabaseHolder.connectCallback(testDatabase, fakeReject, fakeReject)(testError, testConnection);
						});
						it('Called once', () => {
							sinon.assert.calledOnce(fakeGetDb);
						});
						it('Called with correct parameters', () => {
							assert.deepEqual(fakeGetDb.getCall(0).args, [
							]);
						});
					});
				});
				afterEach(() => {
					DatabaseHolder = require('../../src/DatabaseHolder.js');
				});
			});
			afterEach(() => {
				sinon.restore();
				DatabaseHolder.collectionCreated = collectionCreatedBefore;
			});
		});
		describe('collectionCreated', () => {
			let testCollection,
				fakeResolve,
				beforeGetCollectionCNT,
				fakeGetCollectionCNT,
				fakeGetCollectionCNTReturnValue;
			beforeEach(() => {
				testCollection = {};
				fakeResolve = sinon.fake();
			});
			describe('All collection created', () => {
				beforeEach(() => {
					DatabaseHolder.createdCollections = 0;
					beforeGetCollectionCNT = DatabaseHolder.getCollectionCNT;
					fakeGetCollectionCNTReturnValue = 1;
					fakeGetCollectionCNT = sinon.fake(() => {
						return fakeGetCollectionCNTReturnValue;
					});
					DatabaseHolder.getCollectionCNT = fakeGetCollectionCNT;
				});
				describe('Returns correct value', () => {
					it('Returns \'undefined\' value', () => {
						assert.isUndefined(DatabaseHolder.collectionCreated(testCollection, fakeResolve));
					});
				});
				describe('Calls methods', () => {
					beforeEach(() => {
						DatabaseHolder.collectionCreated(testCollection, fakeResolve);
					});
					describe('Calls \'resolve\' method', () => {
						it('Called once', () => {
							sinon.assert.calledOnce(fakeResolve);
						});
						it('Called with correct parameters', () => {
							assert.deepEqual(fakeResolve.getCall(0).args, [
								true
							]);
						});
					});
				});
				afterEach(() => {
					DatabaseHolder.getCollectionCNT = beforeGetCollectionCNT;
				});
			});
			describe('Not created every collection', () => {
				beforeEach(() => {
					DatabaseHolder.createdCollections = 0;
					beforeGetCollectionCNT = DatabaseHolder.getCollectionCNT;
					fakeGetCollectionCNTReturnValue = 2;
					fakeGetCollectionCNT = sinon.fake(() => {
						return fakeGetCollectionCNTReturnValue;
					});
					DatabaseHolder.getCollectionCNT = fakeGetCollectionCNT;
				});
				describe('Returns correct value', () => {
					it('Returns \'undefined\' value', () => {
						assert.isUndefined(DatabaseHolder.collectionCreated(testCollection, fakeResolve));
					});
				});
				describe('Calls methods', () => {
					beforeEach(() => {
						DatabaseHolder.collectionCreated(testCollection, fakeResolve);
					});
					describe('Calls \'resolve\' method', () => {
						it('Not called', () => {
							sinon.assert.notCalled(fakeResolve);
						});
					});
				});
				afterEach(() => {
					DatabaseHolder.getCollectionCNT = beforeGetCollectionCNT;
				});
			});
		});
		describe('getAuthentication', () => {
			let testUsername,
				testPassword;
			beforeEach(() => {
				testUsername = undefined;
				testPassword = undefined;
			});
			describe('Username is undefined', () => {
				describe('Password is undefined', () => {
					describe('Returns correct value', () => {
						it('Returned value is string', () => {
							assert.isString(DatabaseHolder.getAuthentication(testUsername, testPassword));
						});
						it('Returned string length is 0', () => {
							assert.lengthOf(DatabaseHolder.getAuthentication(testUsername, testPassword), 0);
						});
						it('Returned string is empty', () => {
							assert.isEmpty(DatabaseHolder.getAuthentication(testUsername, testPassword));
						});
						it('Returned string is an empty string', () => {
							assert.equal(DatabaseHolder.getAuthentication(testUsername, testPassword), "");
						});
					});
				});
				describe('Password has been set', () => {
					describe('Password is empty', () => {
						beforeEach(() => {
							testPassword = "";
						});
						describe('Returns correct value', () => {
							it('Returned value is string', () => {
								assert.isString(DatabaseHolder.getAuthentication(testUsername, testPassword));
							});
							it('Returned string length is 0', () => {
								assert.lengthOf(DatabaseHolder.getAuthentication(testUsername, testPassword), 0);
							});
							it('Returned string is empty', () => {
								assert.isEmpty(DatabaseHolder.getAuthentication(testUsername, testPassword));
							});
							it('Returned string is an empty string', () => {
								assert.equal(DatabaseHolder.getAuthentication(testUsername, testPassword), "");
							});
						});
					});
					describe('Password is not empty', () => {
						beforeEach(() => {
							testPassword = "bar";
						});
						describe('Returns correct value', () => {
							it('Returned value is string', () => {
								assert.isString(DatabaseHolder.getAuthentication(testUsername, testPassword));
							});
							it('Returned string length is 0', () => {
								assert.lengthOf(DatabaseHolder.getAuthentication(testUsername, testPassword), 0);
							});
							it('Returned string is empty', () => {
								assert.isEmpty(DatabaseHolder.getAuthentication(testUsername, testPassword));
							});
							it('Returned string is an empty string', () => {
								assert.equal(DatabaseHolder.getAuthentication(testUsername, testPassword), "");
							});
						});
					});
				});
			});
			describe('Username has been set', () => {
				describe('Username is empty', () => {
					beforeEach(() => {
						testUsername = "";
					});
					describe('Password is undefined', () => {
						describe('Returns correct value', () => {
							it('Returned value is string', () => {
								assert.isString(DatabaseHolder.getAuthentication(testUsername, testPassword));
							});
							it('Returned string length is 0', () => {
								assert.lengthOf(DatabaseHolder.getAuthentication(testUsername, testPassword), 0);
							});
							it('Returned string is empty', () => {
								assert.isEmpty(DatabaseHolder.getAuthentication(testUsername, testPassword));
							});
							it('Returned string is an empty string', () => {
								assert.equal(DatabaseHolder.getAuthentication(testUsername, testPassword), "");
							});
						});
					});
					describe('Password has been set', () => {
						describe('Password is empty', () => {
							beforeEach(() => {
								testPassword = "";
							});
							describe('Returns correct value', () => {
								it('Returned value is string', () => {
									assert.isString(DatabaseHolder.getAuthentication(testUsername, testPassword));
								});
								it('Returned string length is 0', () => {
									assert.lengthOf(DatabaseHolder.getAuthentication(testUsername, testPassword), 0);
								});
								it('Returned string is empty', () => {
									assert.isEmpty(DatabaseHolder.getAuthentication(testUsername, testPassword));
								});
								it('Returned string is an empty string', () => {
									assert.equal(DatabaseHolder.getAuthentication(testUsername, testPassword), "");
								});
							});
						});
						describe('Password is not empty', () => {
							beforeEach(() => {
								testPassword = "bar";
							});
							describe('Returns correct value', () => {
								it('Returned value is string', () => {
									assert.isString(DatabaseHolder.getAuthentication(testUsername, testPassword));
								});
								it('Returned string length is 0', () => {
									assert.lengthOf(DatabaseHolder.getAuthentication(testUsername, testPassword), 0);
								});
								it('Returned string is empty', () => {
									assert.isEmpty(DatabaseHolder.getAuthentication(testUsername, testPassword));
								});
								it('Returned string is an empty string', () => {
									assert.equal(DatabaseHolder.getAuthentication(testUsername, testPassword), "");
								});
							});
						});
					});
				});
				describe('Username is not empty', () => {
					beforeEach(() => {
						testUsername = "foo";
					});
					describe('Password is undefined', () => {
						describe('Returns correct value', () => {
							it('Returned value is string', () => {
								assert.isString(DatabaseHolder.getAuthentication(testUsername, testPassword));
							});
							it('Returned string length is 0', () => {
								assert.lengthOf(DatabaseHolder.getAuthentication(testUsername, testPassword), 0);
							});
							it('Returned string is empty', () => {
								assert.isEmpty(DatabaseHolder.getAuthentication(testUsername, testPassword));
							});
							it('Returned string is an empty string', () => {
								assert.equal(DatabaseHolder.getAuthentication(testUsername, testPassword), "");
							});
						});
					});
					describe('Password has been set', () => {
						describe('Password is empty', () => {
							beforeEach(() => {
								testPassword = "";
							});
							describe('Returns correct value', () => {
								it('Returned value is string', () => {
									assert.isString(DatabaseHolder.getAuthentication(testUsername, testPassword));
								});
								it('Returned string length is 0', () => {
									assert.lengthOf(DatabaseHolder.getAuthentication(testUsername, testPassword), 0);
								});
								it('Returned string is empty', () => {
									assert.isEmpty(DatabaseHolder.getAuthentication(testUsername, testPassword));
								});
								it('Returned string is an empty string', () => {
									assert.equal(DatabaseHolder.getAuthentication(testUsername, testPassword), "");
								});
							});
						});
						describe('Password is not empty', () => {
							beforeEach(() => {
								testPassword = "bar";
							});
							describe('Returns correct value', () => {
								it('Returned value is string', () => {
									assert.isString(DatabaseHolder.getAuthentication(testUsername, testPassword));
								});
								it('Returned string length is correct', () => {
									assert.lengthOf(DatabaseHolder.getAuthentication(testUsername, testPassword), testUsername.length + testPassword.length + 2);
								});
								it('Returned string is correct', () => {
									assert.equal(DatabaseHolder.getAuthentication(testUsername, testPassword), testUsername + ':' + testPassword + '@');
								});
							});
						});
					});
				});
			});
		});
	});
});