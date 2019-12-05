const mongoose = require ('mongoose');


const TokenSchema = mongoose.Schema({
    token: String,
    tokenId: String
});

module.exports = mongoose.model('Token', TokenSchema);