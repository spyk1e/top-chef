var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function (req, res) {

    url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-michelin/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-';
    /*
    url1star = 'https://restaurant.michelin.fr/restaurants/france/restaurants-michelin/restaurants-1-etoile-michelin/page-'; //29 pages
    url2star = 'https://restaurant.michelin.fr/restaurants/france/restaurants-michelin/restaurants-2-etoiles-michelin/page-'; //5 pages
    url3star = 'https://restaurant.michelin.fr/restaurants/france/restaurants-michelin/restaurants-3-etoiles-michelin/page-'; //2 pages
    */

    var listTitle = [];
    var listUrlMich = [];
    var listJson = [];

    for (var i = 1; i < 36; i++) {

        var urli = url + i;
        request(urli, function (error, response, html) {

            //console.log(urli);

            if (!error) {
                var $ = cheerio.load(html);



                //Get restaurant
                $('.view-mode-poi_card').filter(function () {
                    var json = {
                        //id_Mich: "",
                        //id_LaFour: "",
                        title: "",
                        urlMich: "", //"https://restaurant.michelin.fr",
                        urlLaFourch: "",
                        //chef: "",
                        //stars: "",
                        adress: "",
                        zipCode: ""
                    };


                    var resto = $(this);
                    var urlMich = "https://restaurant.michelin.fr" + resto.children().attr('href');
                    var title = resto.attr('attr-gtm-title');
                    console.log(title);
                    //resto.children().next().children().children().next().text().trim();

                    //Put this restaurant in the json
                    json.urlMich = urlMich;
                    json.title = title;
                    listJson.push(json);
                })

            }

            res.end();

            //Output on Json
            fs.writeFile('Michelin.json', JSON.stringify(listJson, null, 4), function (err) {
                console.log('File successfully written! - Check your project directory for the Michelin.json file');
                //console.log(listJson);
            })
        })



    }


})

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;
