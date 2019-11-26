const mongoose = require ('mongoose');


const TokenSchema = mongoose.Schema({
    tokenId: String,
    userId: String
});

module.exports = mongoose.model('Token', TokenSchema);