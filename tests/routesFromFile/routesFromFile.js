let { WombatServer } = require('../../index.js');

WombatServer.withoutDatabase().setUnsecure().init();