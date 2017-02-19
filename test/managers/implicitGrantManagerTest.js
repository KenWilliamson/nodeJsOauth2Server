var assert = require('assert');
var db = require("../../database/db");
var implicitGrantManager = require("../../managers/implicitGrantManager");
var clientManager = require("../../managers/clientManager");
var clientGrantTypeManager = require("../../managers/clientGrantTypeManager");
var clientId;
var clientObj;
var clientGrantTypeId;
var id;
describe('Client Implicit Grant Manager', function () {
    this.timeout(40000);
    describe('#init()', function () {
        it('should init manager', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                clientManager.init(db);
                implicitGrantManager.init(db);
                clientGrantTypeManager.init(db);
                done();
            }, 1000);
        });
    });

    describe('#addClient()', function () {
        it('should add a client', function (done) {

            var clientJson = {
                secret: null,
                name: 'ulbora',
                webSite: 'www.ulboralabs.com',
                email: 'ulbora@ulbora.com',
                enabled: true,
                redirectUrls: [
                    {
                        uri: 'http://www.google.com',
                        clientId: null
                    },
                    {
                        uri: 'http://www.ulboralabs.com',
                        clientId: null
                    }
                ]
            };

            setTimeout(function () {
                clientManager.addClient(clientJson, function (result) {
                    if (result.clientId > -1) {
                        clientId = result.clientId;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });



    describe('#addClientRole()', function () {
        it('should add a client role', function (done) {

            var json = {
                role: 'superuser',
                clientId: clientId
            };
            setTimeout(function () {
                db.addClientRole(json, function (result) {
                    if (result.id > -1) {
                        clientRoleId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });


    describe('#addClientAllowedUri()', function () {
        it('should add a client allowed URI', function (done) {

            var json = {
                uri: 'http://ulboralabs.com',
                clientId: clientId
            };
            setTimeout(function () {
                db.addClientAllowedUri(json, function (result) {
                    if (result.id > -1) {
                        clientAllowedUriId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });


    describe('#addClientRoleUri()', function () {
        it('should add a client Role Uri', function (done) {

            var json = {
                clientRoleId: clientRoleId,
                clientAllowedUriId: clientAllowedUriId
            };
            setTimeout(function () {
                db.addClientRoleUri(json, function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });


    describe('#addClientGrantType()', function () {
        it('should add a client grant type in db', function (done) {

            var json = {
                grantType: 'implicit',
                clientId: clientId
            };
            setTimeout(function () {
                clientGrantTypeManager.addClientGrantType(json, function (result) {
                    console.log("addClientGrantType: " + JSON.stringify(result));
                    if (result.id > -1) {
                        clientGrantTypeId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#addClientRedirectUri()', function () {
        it('should add a client redirect uri', function (done) {

            var json = {
                uri: 'http://www.google.com',
                clientId: clientId
            };
            setTimeout(function () {
                db.addClientRedirectUri(json, function (result) {
                    if (result.id > -1) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });


    describe('#authorize()', function () {
        it('should fail to authorize a client user because redirect uri is not allowed', function (done) {
            var json = {
                clientId: clientId,
                userId: "admin",
                scope: "read",
                redirectUri: "http://www.google.org"
            };
            setTimeout(function () {
                implicitGrantManager.authorize(json, function (result) {
                    console.log("implicit grant: " + JSON.stringify(result));
                    if (result.id === null && result.error === "access_denied") {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#authorize()', function () {
        it('should authorize a client user ', function (done) {
            var json = {
                clientId: clientId,
                userId: "admin",
                scope: "read",
                redirectUri: "http://www.google.com"
            };
            setTimeout(function () {
                implicitGrantManager.authorize(json, function (result) {
                    console.log("implicit grant: " + JSON.stringify(result));
                    if (result.id && result.id > -1 && result.token) {
                        id = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#authorize()', function () {
        it('should authorize a client user with the same scope ', function (done) {
            var json = {
                clientId: clientId,
                userId: "admin",
                scope: "read",
                redirectUri: "http://www.google.com"
            };
            setTimeout(function () {
                implicitGrantManager.authorize(json, function (result) {
                    console.log("implicit grant: " + JSON.stringify(result));
                    if (result.id && result.id > -1 && result.token) {
                        id = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#authorize()', function () {
        it('should authorize a second scope for a client user', function (done) {
            var json = {
                clientId: clientId,
                userId: "admin",
                scope: "addUser",
                redirectUri: "http://www.google.com"
            };
            setTimeout(function () {
                implicitGrantManager.authorize(json, function (result) {
                    console.log("implicit grant 2: " + JSON.stringify(result));
                    if (result.id && result.id > -1 && result.token) {
                        id = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });



    describe('#checkApplicationAuthorization()', function () {
        it('should checkApplicationAuthorization', function (done) {
            setTimeout(function () {
                var json = {
                    clientId: clientId,
                    userId: "admin",
                    scope: "addUser"
                }
                implicitGrantManager.checkApplicationAuthorization(json, function (result) {
                    if (result && result.authorized) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#validateClientCallback()', function () {
        it('should validateClientCallback', function (done) {
            setTimeout(function () {
                var json = {
                    clientId: clientId,
                    callbackUri: "http://www.google.com"
                }
                implicitGrantManager.validateClientAndCallback(json, function (result) {
                    if (result && result.valid) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#deleteImplicitGrant()', function () {
        it('should delete ImplicitGrant in db', function (done) {
            setTimeout(function () {
                db.deleteImplicitGrant(clientId, "admin", function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#deleteClientRedirectUri()', function () {
        it('should delete client redirect uri', function (done) {
            setTimeout(function () {
                db.deleteAllClientRedirectUri(clientId, function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#deleteClientGrantType()', function () {
        it('should delete client grant type', function (done) {
            setTimeout(function () {
                clientGrantTypeManager.deleteClientGrantType(clientGrantTypeId, function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });


    describe('#deleteClientRoleUri()', function () {
        it('should delete a client Role Uri', function (done) {
            var json = {
                clientRoleId: clientRoleId,
                clientAllowedUriId: clientAllowedUriId
            };
            setTimeout(function () {
                db.deleteClientRoleUri(json, function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#deleteClientRole()', function () {
        it('should delete client role', function (done) {
            setTimeout(function () {
                db.deleteClientRole(clientRoleId, function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });

    describe('#deleteClientAllowedUri()', function () {
        it('should delete client allowed URI', function (done) {
            setTimeout(function () {
                db.deleteClientAllowedUri(clientAllowedUriId, function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });


    describe('#deleteClient()', function () {
        it('should delete client', function (done) {
            setTimeout(function () {
                clientManager.deleteClient(clientId, function (result) {
                    if (result.success) {
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);
        });
    });
});



