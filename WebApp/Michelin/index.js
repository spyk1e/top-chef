var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

//Variables
var listUrlMich = [];
var listJson = [];
var listJsonMichDet = [];
var listZipMich = [];
var listJsonLafourchette = [];
urlp = 'https://restaurant.michelin.fr/restaurants/france/restaurants-michelin/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-';

function sleep(milliseconds) {
    var start = new Date().getTime();
    while (true) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

//GENERAL
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'index.html'));
});


///MICHELIN
//Get urls of restaurant on michelin
function MichelinLoop(req, res, callback) {
    for (var i = 1; i < 36; i++) {
        ScrapeTitleUrl(req, res, i, function () {
            /*WriteJson(function () {
                console.log("Write");
            });*/

            callback(i);
        });
    }
}

function ScrapeTitleUrl(req, res, i, callback) {

    var urlpi = urlp + i;
    request(urlpi, function (error, response, html) {

        console.log(urlpi);

        if (!error) {
            var $ = cheerio.load(html);

            GetTitleUrlMichelin($, function () {
                //WriteJson(function () {

                //res.end();
                callback();
                //});
                //console.log(listJson);;
            });
        }
    })
}

function GetTitleUrlMichelin($, callback) {
    //Get restaurant
    $('.view-mode-poi_card').filter(function () {
        var json = {
            title: "",
            urlMich: "",
        };
        //Get title and url
        var resto = $(this);
        var urlMich = "https://restaurant.michelin.fr" + resto.children().attr('href');
        var title = resto.attr('attr-gtm-title');

        //Put this restaurant in the json
        listUrlMich.push(urlMich);
        json.urlMich = urlMich;
        json.title = title;
        listJson.push(json);
    })

    callback();
}

function WriteJson(callback) {
    //Output on Json            
    fs.writeFile('Michelin.json', JSON.stringify(listJson, null, 4), function (err) {
        console.log('File successfully written! - Check your project directory for the Michelin.json file ');
        callback();
    })
}


//Get details on each michelin restaurant
function MichelinDetailsLoop(req, res, callback) {
    //console.log("\nMichDetLoopStart");
    for (var i = 0; i < listUrlMich.length; i++) {
        urli = listUrlMich[i];
        ScrapeMichelinDetails(req, res, urli, function () {
            //console.log("get details fin");
            /*WriteMichelinDetails(function () {
                console.log("Details Writed");
            });*/
            callback();
        });
    }
}

function ScrapeMichelinDetails(req, res, url, callback) {
    const configuration = {
        'uri': url,
        'headers': {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
        }
    };

    request(configuration, (err, response, html) => {
        //console.log(url);
        if (html == undefined) {
            ScrapeMichelinDetails(req, res, url, function () {
                callback();
            })
        }

        if (!err) {
            var $ = cheerio.load(html);

            GetMichelinDetails($, url, function () {
                //console.log(listJson);;
                //res.end();
                callback();
            });
        }
    })
    //console.log(listJson);
}

function GetMichelinDetails($, url, callback) {
    //Get details

    $('.poi_intro-description').filter(function () {
        var michDetails = {
            title: "",
            zipCode: "",
            city: "",
            mich_url: url
        };

        //Get details
        var resto = $(this);
        var title = resto.children().next().first().text().trim();
        var zipCode = resto.children().next().next().children().children().children().children().next().children().first().text().trim();
        var city = resto.children().next().next().children().children().children().children().next().children().first().next().text().trim();
        var adress = resto.children().children().next().next().next().text().trim();

        //Put this restaurant in the json
        //console.log(url);


        //console.log(title + " " + adress + " " + " " + zipCode + " " + city + " " + url);
        michDetails.adress = adress;
        michDetails.title = title;
        michDetails.zipCode = zipCode;
        michDetails.city = city;
        listZipMich.push(zipCode);
        listJsonMichDet.push(michDetails);

    })

    callback();
}

function WriteMichelinDetails(callback) {
    //Output on Json            
    fs.writeFile('MichelinDetails.json', JSON.stringify(listJsonMichDet, null, 4), function (err) {
        console.log('File successfully written! - Check your project directory for the MichelinDetails.json file');
        callback();
    })
}


app.get('/GetMichelin', function (req, res) {

    res.write("Start");
    console.log("start");



    MichelinLoop(req, res, function (i) {
        console.log(listUrlMich.length);

        if (listUrlMich.length == 613) { //When we get all the urls

            console.log("Michelin URL acquired");

            /*WriteJson(function () {
            });
            */

            MichelinDetailsLoop(req, res, function () {
                //console.log(listUrlMich[listZipMich.length]);
                console.log(listJsonMichDet.length + "/" + listUrlMich.length);


                if (listJsonMichDet.length == listUrlMich.length) {
                    WriteMichelinDetails(function () {
                        console.log("Details Writed End");
                    });
                }
            })
        }
    });
})


///LAFOURCHETTE
//Match restaurants
function GetMichelinJsonInfos(callback) {
    fs.readFile('MichelinDetails.json', 'utf8', function (err, data) {
        if (err) throw err;
        var MichelinList = [];
        for (var restaurant in JSON.parse(data)) {
            MichelinList.push(JSON.parse(data)[restaurant]);
        }
        callback(MichelinList);
    });
};

//Check infos on lafourchette and get ids
function LafourchetteLoop(req, res, MichelinList, callback) {
    for (var i = 1; i < MichelinList.length; i++) {
        var restaurant = MichelinList[i];
        ScrapeLafourchette(req, res, restaurant, function () {

            callback();
        });
    }
}

function ScrapeLafourchette(req, res, restaurant, callback) {
    var title = restaurant.title.replace(/ /g, "%20");
    var url = "https://m.lafourchette.com/api/restaurant-prediction?name=" + title;

    console.log(url);
    request(url, function (error, response, html) {
        if (html == undefined) {
            ScrapeLafourchette(req, res, restaurant, function () {
                callback();
            })
        }

        if (!error && response.statusCode == 200) {
            GetLafourchetteId(html, restaurant, function () {
                callback();
            });
        }
    })
}

function GetLafourchetteId(html, restaurant, callback) {
    var lafourchetteSearchJSON = JSON.parse(html);
    //console.log(lafourchetteSearchJSON);

    for (var searchResult in lafourchetteSearchJSON) {
        var lafourchDetails = {
            id: lafourchetteSearchJSON[searchResult].id,
            title: restaurant.title,
            address: restaurant.address,
            zipCode: lafourchetteSearchJSON[searchResult].address.postal_code,
            city: lafourchetteSearchJSON[searchResult].address.address_locality,
        };

        //Verify if the zipCode or city is correct
        if ((lafourchDetails.zipCode == restaurant.zipCode) || (lafourchDetails.city == restaurant.city)) {
            //Put this restaurant in the json
            listJsonLafourchette.push(lafourchDetails);
        }
    }
    callback();
}

function WriteLaFourchette(callback) {
    //Output on Json            
    fs.writeFile('Lafourchette.json', JSON.stringify(listJsonLafourchette, null, 4), function (err) {
        callback();
    })
}

app.get('/GetLaFourchette', function (req, res) {
    res.write("Start");
    console.log("Start matching restaurants");

    GetMichelinJsonInfos(function (MichelinList) {
        console.log(MichelinList.length);

        LafourchetteLoop(req, res, MichelinList, function (nbRestChecked) {
            console.log("Restaurant matched: " + listJsonLafourchette.length + "/" + MichelinList.length);

            if (listJsonLafourchette.length >= 230) {
                setTimeout(function () {
                    console.log('\033[2J');

                    console.log("Matching finished")
                    console.log("Restaurant matched: " + listJsonLafourchette.length);

                    WriteLaFourchette(function () {}, 10000); // Adjust delay if it's too short
                });
            }
        });
    });
});

///Check promotions
function GetLafourchetteInfos(callback){
    fs.readFile('Lafourchette.json', 'utf8', function (err, data) {
        if (err) throw err;
        var LafourchetteList = [];
        for (var restaurant in JSON.parse(data)) {
            LafourchetteList.push(JSON.parse(data)[restaurant]);
        }
        callback(MichelinList);
    });
    
}

app.get('/Promo', function (req, res) {

});


app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;
