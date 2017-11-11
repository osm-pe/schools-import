var osmAuth = require('osm-auth');
var config = require('./config')

module.exports = function(cb) {
    var auth = osmAuth(config.osmAuth);
    document.getElementById('authenticate').onclick = function() {
        loadAuth(auth, cb)
    };
    document.getElementById('logout').onclick = function() {
        auth.logout();
        window.location.reload()
    };
    if (auth.authenticated()) {
        loadAuth(auth, cb)
    }
}

function loadAuth(auth, cb) {
    auth.xhr({
        method: 'GET',
        path: '/api/0.6/user/details'
    }, function(err, res) {
        if (err) {
            cb(err)
        } else {
            var user = parseUser(res);
            display(user)
            cb(user);
        }
    });
}

function parseUser(res) {
    var u = res.getElementsByTagName('user')[0];
    var changesets = res.getElementsByTagName('changesets')[0];
    var o = {
        display_name: u.getAttribute('display_name'),
        id: u.getAttribute('id'),
        count: changesets.getAttribute('count')
    };
    return o;
}


function display(user) {
    var divLogin = document.getElementById('authenticate');
    divLogin.className = 'off'
    var divLogout = document.getElementById('logout');
    var classContent = divLogout.className;
    divLogout.className = classContent.replace("off", "").trim();
    var userDiv = document.getElementById('user');
    userDiv.innerHTML = user.display_name;
}