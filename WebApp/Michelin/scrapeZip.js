var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();



var listUrlMich = [];
var listJson = [];

function GetUrlListFromJson() {


}




function ScrapeZip(req, res) {


    var nbUrlMich = listUrlMich.length;

    for (var i = 1; i < nbUrlMich; i++) {

        var url = listUrlMich[i];

        request(url, function (error, response, html) {

            //console.log(urli);

            if (!error) {
                var $ = cheerio.load(html);

                //Get restaurant
                $('.poi_intro-description').filter(function () {
                    var json = {
                        title: "",
                        urlMich: listUrlMich[i],
                        urlLaFourch: "",
                        adress: "",
                        zipCode: "",
                        promo: "",
                        meanPrice ""
                    };
                    //Get title and url
                    var resto = $(this);
                    var title = resto.children().children().next().next().next().text().trim();
                    var zipCode = resto.children().next().next().children().children().children().children().next().children().text().trim();
                    var adress = resto;

                    //Put this restaurant in the json
                    json.adress = adress;
                    json.title = title;
                    json.zipCode = zipCode;
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


app.get('/scrapeZip', function (req, res) {

    ScrapeZip(req, res);

})

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;
