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
    builder: String
});

var GameSchema = new Schema({
    players: [{player: String, deckName: String, winner: Boolean}], // Working on the new stuff
    playedOn: Date,
    winType: String,
    gameType: String,
    description: String,
    story: String
});

var UserSchema = new Schema({
    username: String,
    hash: String,
    active: Boolean,
    isAdmin: Boolean
});

module.exports = {
    PlayerSchema: PlayerSchema,
    DeckSchema: DeckSchema,
    GameSchema: GameSchema,
    UserSchema: UserSchema
};