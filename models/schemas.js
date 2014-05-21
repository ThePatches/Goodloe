/**
 * Created by Patrick Taylor on 3/1/14.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var PlayerSchema = new Schema({
    name: String,
    games: Number,
    active: Boolean,
    wins: Number
});

var DeckSchema = new Schema({
    name: String,
    color: String,
    builder: String,
    commander: String,
    deckList: [{card: String, qty: Number}] //TODO: Consider only pulling certain information when getting the list versus getting an individual instance
});

var GameSchema = new Schema({
    //players: [{player: String, deckName: String, winner: Boolean}], // Working on the new stuff
    players: [{
        player: {type: ObjectId, ref: 'Players'},
        deckName: {type: ObjectId, ref: 'Deck'},
        winner: Boolean }
    ],
    playedOn: Date,
    winType: String,
    gameType: String,
    description: String,
    story: String,
    timePlayed: Number
});

var UserSchema = new Schema({
    username: String,
    hash: String,
    active: Boolean,
    adminRights: Number,
    email: String,
    wantemail: Boolean
});

var VersionSchema = new Schema({
    _id: Number,
    version: String,
    changes: [ String ],
    published: Boolean
});

module.exports = {
    PlayerSchema: PlayerSchema,
    DeckSchema: DeckSchema,
    GameSchema: GameSchema,
    UserSchema: UserSchema,
    VersionSchema: VersionSchema
};