var express = require('express'),
    router = express.Router(),
    request = require('request'),
    Article = require('../models/article'),
    token = "CAAYs2ZCX4bPsBAFCJAgdB2eIq6yhwD9WESkghIpE10GQ2LG7ostZALF5LUIIKfo6DOIePIbiO3HBRJkFv4wO9wJBNy3sQZBr8ZCv8LGkcngdGsRMr5uCWu9KZCsM6OJ5xlcrWHiZCXOJC4Wq6gZA4m0jtvoyS0nOgxYyz5nK2dGn8E0I5hy87HUHRt8kL2DJ3QZD";
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
    if (req.query['hub.verify_token'] === "CAAYs2ZCX4bPsBAIFzomk6DvZBnczQxTr9IRn5kotcZCJqzBlbFeNxet0O2ZB1HookjngJ0h4Rs1F0ZC3ldt1916oZCi2S1qmk75JCela5W676wk3HxzAOKoO3upU40Sp6YGSOx8SmhRCfP7tbZC17A6zr1ZAvHFI0Co9JZAZBTUNOmDDme1g3sFNssnoWZBXy2UUNMNmjYl39HWAQZDZD") {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});

router.post('/webhook', function(req, res, next) {
    console.log("ciao");
    console.log(JSON.stringify(req.body));
    var messaging_events = req.body.entry[0].messaging,
        replayMessages = [];
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            text = event.message.text;
            sendTextMessage(sender, text.substring(0, 200));
        }
    }
    res.sendStatus(200);
});


function sendTextMessage(sender, text) {
    var messageData = {
        text: text
    }
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
