"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import von benötigten Bibliotheken
const Http = require("http");
const Url = require("url");
const mongo = require("mongodb");
//initialisieren des Connection Strings, welcher alle Daten enthält um sich mit der Datenbank zu verbinden
const uri = process.env.CONNECTION_STRING;
//Initialisieren des Clients um sich mit der Datenbank verbinden zu können
const client = new mongo.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//Erstelung der variable fireworks welches die Liste der Konfigurationen für das Feuerwerk enthält
let fireworks;
//Aufbauen einer Verbindung zur datenbank
client.connect(_err => {
    //Wenn verbunden, initialisiere variable fireworks mit der Liste aus der Datenbank (Referenz nicht das eigentliche Objekt)
    fireworks = client.db("Firework").collection("fireworks");
    console.log("firework collection initialized!");
});
//Erstellen eines HTTP servers, mit welchem man HTTP Anfragen empfangen kann
let server = Http.createServer();
//Port für Server definieren (wird von Heroku vorgegeben über process.env.PORT
let port = process.env.PORT;
if (port == undefined)
    port = 5001;
console.log("Server starting on port:" + port);
//Server hört auf alle Nachrichten welche über den spezifizierten Port hereinkommen
server.listen(port);
//Eventlistener, welcher immer ausgelöst wird, wenn der server eine HTTP Anfrage erhält
server.addListener("request", handleRequest);
//funktion zum bearbeiten und antworten der HTTP Anfrage
async function handleRequest(_request, _response) {
    //Header setzen um dem Client zu sagen, dass die Antwort vom server json daten enthält
    _response.setHeader("content-type", "text/json; charset=utf-8");
    //notwendig um von überall aus Anfragen an diesen Server schicken zu dürfen (Sicherheitsmechanismus von Browsern)
    _response.setHeader("Access-Control-Allow-Origin", "*");
    //überprüfen ob url verfügbar ist
    if (_request.url != undefined) {
        //Url parsen damit man auf die queryparameter zugreifen kann
        let url = Url.parse(_request.url, true);
        //Wenn type auf put gesetzt ist, dann schreibe übergebenes objekt in datenbank
        if (url.query["type"] == "put") {
            //umwandeln des übergebenen Objektes zu einem json Objekt
            let recipe = JSON.parse(url.query["fireworkconfig"]);
            //Übergebenes Objekt in die Datenbankcollection einfügen
            fireworks.insertOne(recipe);
        }
        //Wenn type auf get gesetzt, dann gebe alle konfigurationen aus der Datenbank aus
        else if (url.query["type"] == "get") {
            //Alle Konfigurationen aus der Datenbank holen
            let allFireworks = await fireworks.find().toArray();
            //Alle Konfigurationen in die Antwort reinschreiben
            _response.write(JSON.stringify(allFireworks));
        }
    }
    _response.end();
}
//# sourceMappingURL=server.js.map