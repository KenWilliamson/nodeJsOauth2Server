var assert = require('assert');
var crud = require("../../../../database/mysql/crud/mysqlCrud");
var accessTokenProcessor = require("../../../../database/mysql/processors/accessTokenProcessor");
var clientProcessor = require("../../../../database/mysql/processors/clientProcessor");
var implicitGrantProcessor = require("../../../../database/mysql/processors/implicitGrantProcessor");
var clientId;
var tokenId;
var impId;

describe('implicitGrantProcessor', function () {
    this.timeout(10000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            crud.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            crud.testConnection(function (success) {
                if (success) {                    
                    accessTokenProcessor.init(crud); 
                    clientProcessor.init(crud); 
                    implicitGrantProcessor.init(crud);
                    assert(true);
                } else {
                    assert(false);
                }
                done();
            });
        });
    });
   
    describe('#addClient()', function () {
        it('should add a client in clientProcessor', function (done) { 
            
           var json = {
                secret: '12345',                
                name: 'ulbora',
                webSite: 'www.ulboralabs.com',
                email: 'ulbora@ulbora.com',
                enabled: true
            };
            setTimeout(function () {
                clientProcessor.addClient(null, json, function (result) {
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
    
   describe('#addAccessToken()', function () {
        it('should add a access token in processor', function (done) { 
           var today = new Date();
           today.setTime(today.getTime() + (8*60*60*1000)); 
           var json = {
                token: 'djfjoiqjldktrtryrtyrytrsflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf',
                expires: today
            };
            setTimeout(function () {
                accessTokenProcessor.addAccessToken(null, json, function (result) {
                    if (result.id > -1) {
                        tokenId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    
    describe('#addImplicitGrant()', function () {
        it('should add an implicit grant in processor', function (done) { 
           var today = new Date();
           today.setTime(today.getTime() + (8*60*60*1000)); 
           var json = {
                clientId: clientId,
                userId: "admin",                
                accessTokenId: tokenId
            };
            setTimeout(function () {
                implicitGrantProcessor.addImplicitGrant(null, json, function (result) {
                    if (result.id > -1) {
                        acId = result.id;
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
        
   
   describe('#getImplicitGrant()', function () {
        it('should read ImplicitGrant in processor', function (done) {           
            setTimeout(function () {                
                implicitGrantProcessor.getImplicitGrant( clientId, "admin", function (result) {
                    if (result && result.userId === 'admin') {                        
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
        it('should delete ImplicitGrant in processor', function (done) {           
            setTimeout(function () {                
                implicitGrantProcessor.deleteImplicitGrant(null, clientId, "admin", function (result) {
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
    
    describe('#deleteAccessToken()', function () {
        it('should delete access token', function (done) {           
            setTimeout(function () {                
                accessTokenProcessor.deleteAccessToken(null, tokenId, function (result) {
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
                clientProcessor.deleteClient(null, clientId, function (result) {
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

