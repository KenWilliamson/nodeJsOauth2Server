var tokenManager = require("../managers/tokenManager");
exports.init = function (db) {
    tokenManager.init(db);
};
exports.token = function (req, res) {
    var grantType = req.query.grant_type;

    if (grantType === "authorization_code") {
        var clientIdStr = req.query.client_id;
        var secret = req.query.client_secret;
        var code = req.query.code;
        var redirectUri = req.query.redirect_uri;
        var clientId = getClientId(clientIdStr);        
       
        var tokenReq = {            
            clientId: clientId,
            secret: secret,
            code: code,
            redirectUri: redirectUri
        };
        tokenManager.authCodeToken(tokenReq, function(tokenResult){
            console.log("res in tokenController:" + JSON.stringify(res));
            if(tokenResult.error){
                res.status(401).send(tokenResult);                      
            }else{
                res.send(tokenResult);
            }            
        });
        
    } else if (grantType === "password") {

    } else if (grantType === "client_credentials") {

    } else if (grantType) {
        //res.render('oauthError', {error: "invalid_grant"});
        res.redirect('/oauthError?error=invalid_grant');
    } else {
        //res.render('oauthError', {error: "invalid_grant"});
        res.redirect('/oauthError?error=invalid_grant');
    }

};

var getClientId = function (clientIdStr) {
    var clientId;
    if (clientIdStr) {
        try {
            clientId = parseInt(clientIdStr);
        } catch (err) {
            clientId = clientIdStr;
        }
    } else {
        clientId = clientIdStr;
    }
    return clientId;
};
