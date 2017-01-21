var assert = require('assert');
var db = require("../../database/db");
var tokenId;

describe('DB refresh token', function () {
    this.timeout(20000);
    describe('#connect()', function () {
        it('should connect to db and create pool', function (done) {
            db.connect("localhost", "admin", "admin", "ulbora_oauth2_server", 5);
            setTimeout(function () {
                done();
            }, 1000);
        });
    });
    
    describe('#addRefreshToken()', function () {
        it('should add a refresh token in db', function (done) {             
           var json = {
                token: 'djfjoiqjldksflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf'
            };
            setTimeout(function () {
                db.addRefreshToken(json, function (result) {
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
    
    describe('#updateRefreshToken()', function () {
        it('should update a refresh token in db', function (done) {             
           var json = {
                token: '111djfjoiqjldksflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf',
                id: tokenId
            };
            setTimeout(function () {
                db.updateRefreshToken(json, function (result) {
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
   
    describe('#getRefreshToken()', function () {
        it('should read refresh token in db', function (done) {           
            setTimeout(function () {                
                db.getRefreshToken( tokenId, function (result) {
                    console.log("refresh token value:" + result.token);
                    if (result && result.token === '111djfjoiqjldksflkdfjdskdsoidsljdsjdsljdlsjfljsdlfjdlsfdsjfdslfkdsjffldskf') {                        
                        assert(true);
                    } else {
                        assert(false);
                    }
                    done();
                });
            }, 1000);           
        });
    });
    
    
    describe('#deleteRefreshToken()', function () {
        it('should delete refresh token in db', function (done) {           
            setTimeout(function () {                
                db.deleteRefreshToken(tokenId, function (result) {
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

