# Inventory Api
This isa a crud application that allows items of different quantity to be added and sold provided they are not expired. Expired items are automatically removed from the database on a routine bases.

# Development set up
Make sure you have a postgres service running.

Create the database of your choice

Set the following environment variables:
```
cexport DATABASE_URL=postgres://{db_username}:{db_password}@{host}:{port}/{db_name}
export PORT=8990
export NODE_ENV=development
```

Add the variables to the current terminal process by typing the following in your terminal

``` source .env ``` 

Run the command below to start the service

``` npm run start:dev:all ```

# Documentation
Please find the postman documentation here: https://documenter.getpostman.com/view/10001732/TzJuAy8v
