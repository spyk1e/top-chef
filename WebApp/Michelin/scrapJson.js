'use strict';

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function (req, res) {

    url = 'https://restaurant.michelin.fr/search-restaurants?localisation=1424&cooking_type=&gm_selection=0&stars=&bib_gourmand=&piecette=&michelin_plate=&services=&ambiance=&booking_activated=&min_price=&max_price=&number_of_offers=&prev_localisation=1424&latitude=&longitude=&bbox_ne_lat=&bbox_ne_lon=&bbox_sw_lat=&bbox_sw_lon=&page_number=&op=Rechercher&js=true';

    request(url, function (error, response, html) {
        if (!error) {

            let rawdata = fs.readFileSync(html);
            let michelin = JSON.parse(rawdata);
            console.log(michelin);

            var $ = cheerio.load(html);
/*
            var id, title, chef, stars, adress, lat, lon;
            var json = {
                id: "",
                title: "",
                chef: "",
                stars: "",
                adress: "",
                lat: "",
                lon: ""
            };

            //Get name restaurant
            $('title:').filter(function () {
                var data = $(this);
                title = data.text().trim();
                console.log(title);
                json.title = title;
            })*/
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
