var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function (req, res) {

    url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-michelin/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';

    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var i = 0;
            var json, title;
            var json = {
                title: ""
            };


            //Get name restaurant
            $('.poi_card-display-title').each(function () {
                i = i + 1;
                var data = $(this);
                title = data.text().trim();
                console.log(i, title);

                json.title[i] = title;
            })
        }


        //Output on Json
        fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
            console.log('File successfully written! - Check your project directory for the output.json file');
        })

        res.send('Check your console!')
    })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
