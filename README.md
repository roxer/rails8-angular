# Rails 8 + Angular 21 demo app

## Ruby 4.0.2, Rails 8.1.3, Sqlite 3.53, Angular 21.2

## Deployment instructions

```shell
$ rails db:prepare
$ cd angular-ror && ng build --configuration production
$ cp ./angular-ror/dist/angular-ror/browser/* ./public/
$ rails server
```

## Next steps (API)

* add full API validation
* add User model with auhentication (+ JWT API key)
* change author (article, comment) to user from session (authenticated API key)
* automate Angular build process for prouction 
* update `.gitinore` to exclude Angular artefacts from build process
* add full text coverage for Rails and Angular
* consider indexes for DB schema
* add pagination to fetch limited number of articles and comments
* dockerize apps for deploment
* setup full CI/CD

## Next steps (Angular)

* add authentication
* add pagination
* add edit/delete/search/sort funcionality 
