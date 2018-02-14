var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();


function sleep(milliseconds) {
    var start = new Date().getTime();
    while (true) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

var listUrlMich = [];
var listJson = [];


function ScrapeTitleUrl(req, res, i, callback) {

    url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-michelin/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-';


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

        /*
        //Output on Json
        fs.writeFile('Michelin.json', JSON.stringify(listJson, null, 4), function (err) {
            console.log('File successfully written! - Check your project directory for the Michelin.json file');
        })
        */
    })


    console.log(listJson);



    callback(listJson);
}

/*
function ScrapeZip(listUrlMich) {
    //Open the json to add the zipcode of every restaurant
    var nbRestMich = listUrlMich.length;
    console.log(nbRestMich);
    
}
*/

/*
function ScrapeZip(req, res) {

    for (var i = 1; i < 35; i++) {

        ScrapeTitleUrl(req, res, i, function (listJson) {}
            console.log(listJson);

            //Output on Json
            fs.writeFile('Michelin.json', JSON.stringify(listJson, null, 4), function (err) {
                console.log('File successfully written! - Check your project directory for the Michelin.json file');
            })

            console.log('sec funct');
            //Open the json to add the zipcode of every restaurant
            var nbRestMich = listUrlMich.length; console.log(nbRestMich);
        });
}*/


app.get('/scrape', function (req, res) {


    for (var i = 1; i < 35; i++) {

        ScrapeTitleUrl(req, res, i, function (listJson) {
            //Output on Json
            fs.writeFile('Michelin.json', JSON.stringify(listJson, null, 4), function (err) {
                console.log('File successfully written! - Check your project directory for the Michelin.json file');
            })
        });
    }

    /*
        var listUrlMich = ScrapeTitleUrl(req, res);

        sleep(10000);

        ScrapeZip(listUrlMich);
    */





})

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;
