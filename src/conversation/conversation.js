'use strict';

const logger = require('../logger/logger');
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const StickerMessage = require('viber-bot').Message.Sticker;
const ShopAssist = require('../services/shopassist');

function BotConversationConfig(Bot) {
    this._bot = Bot;

    this._bot.onSubscribe(response => {
        response.send([
            new TextMessage(`Hi there ${response.userProfile.name}. I am ${bot.name}!`),
            new StickerMessage(40133)
        ]);
    });    

    this._bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
        logger.info('Received Message - ', message);
        if (!(message instanceof TextMessage)) {
            _respond(response, `Sorry. I can only understand text messages.`);
        }
    });
}

BotConversationConfig.prototype.loadBotConfiguration = function () {
    var scope = this;
    const answers = [
        {
            'question': /^hi|hello$/i,
            'answer': 'Hey there...'
        },
        {
            'question': /^show DOD|DOD$/i,
            'answer': _handlerDOD
        }
    ];

    answers.forEach(function (data) {
        logger.info('Configuring Handler for - ', data.question);
        scope._bot.onTextMessage(data.question, function (message, response) {
            _respond(response, data.answer);
         });
    });

    function _respond(response, answer) {
        logger.info('Type => ', typeof answer);
        logger.info('Is Function => ', _isFunction(answer));

        if(typeof answer === "string") {
            response.send(new TextMessage(answer));
        }else{
            answer.call(this, response, 'Test');
        }
        
    }

    function _handlerDOD(response, message) {
        var _shopAssist = new ShopAssist();
        _shopAssist.getDealOfTheDay(response, message);
        //response.send(new TextMessage(message));
    }

    function _isFunction(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }
};

module.exports = BotConversationConfig;