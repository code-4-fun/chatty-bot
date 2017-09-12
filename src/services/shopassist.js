"use strict";

const logger = require('../logger/logger');
const TextMessage = require('viber-bot').Message.Text;
const StickerMessage = require('viber-bot').Message.Sticker;
const PictureMessage = require('viber-bot').Message.Picture;
const RichMediaMessage  = require('viber-bot').Message.RichMedia;

function ShopAssist(){
    this._request = require('request');
    this.MAX_ITEMS_IN_ROW = 6;

    if (!process.env.AFFILIATE_ID || !process.env.AFFILIATE_TOKEN) {
        logger.debug('Could not find the Flipkart Affiliate ID details in your environment variables.');
        throw new Error('Could not find the Flipkart Affiliate ID details in your environment variables.');
    }
}

ShopAssist.prototype.getDealOfTheDay = function(botResponse, message) {
    var scope = this;
    var options = {
        url: "https://affiliate-api.flipkart.net/affiliate/offers/v1/dotd/json",
        headers: {
            "Fk-Affiliate-Id": process.env.AFFILIATE_ID,
            "Fk-Affiliate-Token": process.env.AFFILIATE_TOKEN
        }
    };

    scope._request(options, _handleResponse);

    function _handleResponse(err, resp, body) {
        if (!err && resp.statusCode == 200) {
            var respBody = JSON.parse(body);
            logger.debug(respBody);
            var deals = respBody.dotdList;

            if(deals && deals.length > 0) {
                var dealsOfTheDay = [];
                dealsOfTheDay.push(new TextMessage('There are total ' + deals.length + ' deals today'));
                dealsOfTheDay.push(new StickerMessage(114423));
                
                deals.forEach(function(deal) {
                    logger.info('checking deal - ', deal);
                    var thumbnail = deal.imageUrls[0].url;
                    dealsOfTheDay.push(new PictureMessage(encodeURI(deal.url), deal.title, thumbnail));
                });
                botResponse.send(dealsOfTheDay);
            } else {
                botResponse.send([
                    new StickerMessage(40133),
                    new TextMessage('Could not find any deals for today!')
                ]);
            }
        }
    }
}

module.exports = ShopAssist;