var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function (req, res) {
    
    url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-michelin/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';

    request(url, function (error, response, html) {
        var listTitle=[];
        
        
        
        if (!error) {
            var $ = cheerio.load(html);

            var title, release, rating;
            
            

            /*
      $('.title_wrapper').filter(function(){
        var data = $(this);
        title = data.children().first().text().trim();
        release = data.children().last().children().last().text().trim();

        json.title = title;
        json.release = release;
      })
*/
            //Get title restaurant
            $('.poi_card-display-title').filter(function () {
                var json = {
                id_Mich:"",
                id_LaFour:"",
                title: "",
                chef:"",
                stars: "",
                adress: "",
                lat:"",
                lon:""
            };
                var data = $(this);
                title = data.text().trim();
                json.title = title;
                listTitle.push(json);
            })
        }


        //Output on Json
        fs.writeFile('output.json', JSON.stringify(listTitle, null, 4), function (err) {
            console.log('File successfully written! - Check your project directory for the output.json file');
            console.log(listTitle);
        })
        
        
        

        res.send('Check your console!')
    })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
