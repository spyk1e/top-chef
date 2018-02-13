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

    for (var i = 1; i < 36; i++) {

        var urli = url + i;
        request(urli, function (error, response, html) {

            console.log(urli);



            if (!error) {
                var $ = cheerio.load(html);

                var title, release, rating;



                //Get title restaurant
                $('.poi_card-display-title').filter(function () {
                    var json = {
                        id_Mich: "",
                        id_LaFour: "",
                        title: "",
                        chef: "",
                        stars: "",
                        adress: "",
                        lat: "",
                        lon: ""
                    };
                    var data = $(this);
                    title = data.text().trim();
                    json.title = title;
                    listTitle.push(json);
                })
            }


            //Output on Json
            fs.writeFile('Michelin.json', JSON.stringify(listTitle, null, 4), function (err) {
                console.log('File successfully written! - Check your project directory for the output.json file');
                console.log(listTitle);
            })




            res.end();
        })
    }
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
