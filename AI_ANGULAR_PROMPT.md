# AI wokflow

## Tolls

* Google Antigravity v1.22.2
* Gemini 3.1 Pro (High)

## Steps

step 1
```
You have running api service for listing and creating articles. Endpoints:
GET 127.0.0.1:3000/api/v1/articles
POST 127.0.0.1:3000/api/v1/articles
with json example
{ "article": {
    "title": "foo",
    "author": "auth",
    "body": "body"
}}

Create Angular components to list articles and form to add a new article
```

step 2
```
You have running api service for comments. Endpoints:
GET 127.0.0.1:3000/api/v1/articles/1/comments
POST 127.0.0.1:3000/api/v1/articles/1/comments
with json example
{
    "comment": {
        "body": "example"
    }
}

Display each article with all comments. Each comment displays body, author name, and creation date.
 Allow to add new comment.
A list of articles is displayed, showing title, author name, creation date, and number of comments.
```

step 3
```
Fix - correct api payload for comment 
{
    "comment": {
        "body": "example",
        "author": "autttt"
    }
}
```

step 4
```
Fix - On Articles list comments counter should display actual number of comments
```

step 5
```
extract comment to own model  from models/article.ts
```

step 6
```
Add to the header number of all articles and number of all comments
```

step 7
```
Fix all deprecation warnings for Angular 21
```


