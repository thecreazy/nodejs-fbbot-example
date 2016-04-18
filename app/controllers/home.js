var express = require('express'),
    router = express.Router(),
    request = require('request'),
    Article = require('../models/article'),
    token = "<access_page_token_>";
module.exports = function(app) {
    app.use('/', router);
};

router.get('/', function(req, res, next) {
    var articles = [new Article(), new Article()];
    res.render('index', {
        title: 'Repo for fb bot example',
        articles: articles
    });
});

router.get('/webhook', function(req, res, next) {
    if (req.query['hub.verify_token'] === "<access_token>") {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});

router.post('/webhook', function(req, res, next) {
    var messaging_events = req.body.entry[0].messaging,
        replayMessages = [];
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            text = event.message.text;
            findRespType(sender, text);
        }
    }
    res.sendStatus(200);
});

function findRespType(sender, text) {
    var _textMessage;
    if (text.toLowerCase().indexOf("ciao") > -1) {
        _messageData = {
            text: "Ciao a te caro, dimmi la città di cui vuoi saper il tempo:"
        };
        sendTextMessage(sender, _messageData);
    } else {
        var weatherSourceUrl = "https://api.forecast.io/forecast/<forecast_token>/41.931907,12.456304?lang=it&units=si";
        request(weatherSourceUrl, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var _body = JSON.parse(body).daily.data;
                var _elements = [];
                for (var i in _body) {
                    _elements.push({
                        "title": _body[i].summary,
                        "subtitle": _body[i].icon,
                        "buttons": [{
                            "type": "postback",
                            "title": "Max°: " + _body[i].temperatureMax,
                            "payload": "Can not be empty"
                        }, {
                            "type": "postback",
                            "title": "Min° : " + _body[i].apparentTemperatureMin,
                            "payload": "Can not be empty",
                        }, {
                            "type": "postback",
                            "title": "Umidità: " + _body[i].humidity,
                            "payload": "Can not be empty",
                        }]
                    });
                }
                _messageData = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": _elements
                        }
                    }
                };
                sendTextMessage(sender, _messageData);
            } else {
                new Error("Error " + response.statusCode);
            }
        });
    }

}

function sendTextMessage(sender, messageData) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}
