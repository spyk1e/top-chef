var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();



var listUrlMich = [];
var listJson = [];


function ScrapeTitleUrl(req, res) {

    url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-michelin/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-';
    for (var i = 1; i < 35; i++) {


        var urli = url + i;
        request(urli, function (error, response, html) {

            //console.log(urli);

            if (!error) {
                var $ = cheerio.load(html);

                //Get restaurant
                $('.view-mode-poi_card').filter(function () {
                    var json = {
                        title: "",
                        urlMich: "",
                        urlLaFourch: "",
                        adress: "",
                        zipCode: ""
                    };
                    //Get title and url
                    var resto = $(this);
                    var urlMich = "https://restaurant.michelin.fr" + resto.children().attr('href');
                    var title = resto.attr('attr-gtm-title');

                    //Put this restaurant in the json
                    json.urlMich = urlMich;
                    json.title = title;
                    listJson.push(json);
                })
            }

            res.end();


            //Output on Json
            fs.writeFile('MichelinTitleUrl.json', JSON.stringify(listJson, null, 4), function (err) {
                console.log('File successfully written! - Check your project directory for the MichelinTitleUrl.json file');
            })
        })
    }
}


app.get('/scrape', function (req, res) {

    ScrapeTitleUrl(req, res);

})

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;