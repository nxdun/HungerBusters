# What is this

# How to run

- go to backend folder
- `npm update & npm i` update/install deps
- create .env file
    -   DB - mongodb Connection Path Or Url
    -   JWTPRIVATEKEY - your own private key (keep it secure)
    -   SALT - add salt number here for JWT
    -   STRIPE_SECRET_KEY - For Stripe payments
- `npm start` for run as nodemon or `npm run go` for production init

- go to the frontend folder 
- `npm i` install deps (Keep EXPO SDK on 51 so dont update)
- `npx expo start` to serve expo toolkit 


