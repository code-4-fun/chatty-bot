'use strict';

const logger = require('../logger/logger');
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const StickerMessage  = require('viber-bot').Message.Sticker;

var bot = undefined
function BotConversationConfig(Bot) {
    bot = Bot;

    bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
        logger.info('Received Message - ', message);
        console.log('Received Message - ', message);
        if (!(message instanceof TextMessage)) {
            _respond(response, `Sorry. I can only understand text messages.`);
        }
    });
}

BotConversationConfig.prototype.loadBotConfiguration = function () {
    const answers = [
        {
            'question': /^hi|hello$/i,
            'answer': 'Hey there...'
        }
    ];

    answers.forEach(function (data) {
        logger.info('Configuring Handler for - ', data.question);
         bot.onTextMessage(data.question, function (message, response) {
            _respond(response, data.answer);
         });
    });

    function _respond(response, message) {
        response.send(new TextMessage(message));
    }
};

module.exports = BotConversationConfig;