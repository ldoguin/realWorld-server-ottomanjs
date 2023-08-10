const {setupOttoman, bucketName, scopeName} = require('./config/dbConnect');
const { faker } = require('@faker-js/faker');
const { getDefaultInstance } = require('ottoman');
const userNumber = process.env.USER_NUMBER || 10;
const articleNumber = process.env.ARTICLE_NUMBER || 100;

function createRandomUser() {
    return {
    "_type": "User",
    "bio": faker.person.bio(),
    "createdAt": faker.date.recent(),
    "email": faker.internet.email(),
    "favouriteArticles": [],
    "followingUsers": [],
    "id": faker.string.uuid(),
    "image": faker.internet.avatar(),
    "password": "$2b$10$SoVQMa9G.5qvDdGPAzOC2uRJ1sMIhOk98qK1pB0rKF3Q3Th1iw8u.",
    "updatedAt": faker.date.recent(),
    "username": faker.internet.userName(),
    "authorArticleSearchable": faker.datatype.boolean()
    };
  }
  
const users = faker.helpers.multiple(createRandomUser, {
    count: userNumber,
});
function createEnum(values) {
    const enumObject = {};
    for (const val of values) {
      enumObject[val] = val;
    }
    return Object.freeze(enumObject);
  }

const enumIds = createEnum(users.map(u => u.id));

function createRandomArticle() {
    return {
    "title": faker.lorem.sentence({min:1,max:10}),
    "description": faker.lorem.sentence(),
    "body": faker.lorem.sentences(),
    "tagList": faker.lorem.words().split(" "),
    "favouritesCount": 0,
    "comments": [],
    "createdAt": faker.date.recent(),
    "updatedAt": faker.date.recent(),
    "id": faker.string.uuid(),
    "_type": "Article",
    "author": faker.helpers.enumValue(enumIds),
    "slug": faker.lorem.slug()
    };
  }
  
const articles = faker.helpers.multiple(createRandomArticle, {
    count: articleNumber,
});
setupOttoman().then(() => {

    const ottoman = getDefaultInstance();
    const cluster = ottoman.cluster;
    
    const bucket = cluster.bucket(bucketName);
    const userCollection = bucket
      .scope(scopeName)
      .collection('User');
    const articleCollection = bucket
      .scope(scopeName)
      .collection('Article');
    
      Promise.all(users.map(u =>   userCollection.upsert('User::'+u.id, u)))
      Promise.all(articles.map(a =>   articleCollection.upsert('Article::'+a.id, a)))

})
