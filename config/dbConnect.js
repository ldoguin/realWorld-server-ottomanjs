const {model, registerGlobalPlugin, getDefaultInstance, Ottoman } = require('ottoman');
const {userSchema, User} = require('../models/User');
const {articleSchema, Article} = require('../models/Article');
const {commentSchema, Comment} = require('../models/Comment');
const  {Logger} = require('../config/logger');
const log = Logger.child({
    namespace: 'DBConnect',
});


const endpoint = process.env.CB_CONNECT_STRING || "couchbase://localhost";
const username = process.env.CB_USERNAME || "Administrator";
const password = process.env.CB_PASSWORD || "password";
const bucketName = process.env.CB_BUCKET || "default";
const scopeName = process.env.CB_SCOPE || "_default";

const setupOttoman = async function(){

  // TODO: Fix global plugin registration
    await registerGlobalPlugin((schema) => {
        schema.pre('save', function (doc) {
          log.info("SAAAAAVE");
        });
      });

    let ottoman = getDefaultInstance();
    if (!ottoman) {
      // if not exist default one, then create
      ottoman = new Ottoman();
    };
  

    try {
      await ottoman.connect({
        connectionString: endpoint,
        username: username,
        password: password,
        bucketName: bucketName,
      });
    } catch (e) {
      throw(e);
    }

    const User = model('User', userSchema, { scopeName: scopeName });
    const Comment = model('Comment', commentSchema, { scopeName: scopeName });
    const Article = model('Article', articleSchema, { scopeName: scopeName });

    await ottoman.start();
    log.info('Connected to Couchbase');
}

module.exports = {setupOttoman, User, Comment, Article, bucketName, scopeName}

