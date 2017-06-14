/**
 * Created by JohnMak on 29/10/15.
 */


module.exports.DB_URI = (process.env.MONGOLAB_URI || 'mongodb://localhost/firetour');
module.exports.DB_POOL_SIZE = (process.env.DB_POOL_SIZE || 1);
