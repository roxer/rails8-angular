# Rails 8 + Angular 21 demo app

* Ruby 4.0.2, Rails 8.1.3, Sqlite 3.53, Angular 21.2

* Deployment instructions

```shell
$ rails db:prepare
$ cd angular-ror && ng build --configuration production
$ cp ./angular-ror/dist/angular-ror/browser/* ./public/
$ rails server
```

