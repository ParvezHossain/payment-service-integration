# Payment Processing Service

This project involves building a payment processing service that handles payments using Shift4 and ACI payment gateways. The service will expose RESTful endpoints to process payments and provide a command-line interface (CLI) for interacting with these endpoints. The goal is to create a unified and standardized payment processing system using Node.js with Express.

Here, I am using SQLite database to save the custom unique id, transaction ids, payment type (SHIFT4 or ACI), and transaction details for ACI as I did not find the API endpoint to retrieve the transaction history from ACI.

## Features
- RESTful API for payment processing
- Secure coding practices with Helmet, CORS, XSS protection, and more
- Dockerized for easy deployment
- CLI commands for interacting with the API
- You can set maximum request for an API end point by overriding this MAX_REQUEST_PER_15_MINS in .env file

## Requirements
- Node.js v14+
- Docker (optional, for containerization)

## Installation
1. Clone the repository:
   ```bash
   https://github.com/ParvezHossain/payment-service-integration
   cd payment-processing-service
   npm install

## Set Up Environment Variables:

      touch .env

Add the following content to the .env file, and adjust you credentials

      HOST=localhost 
      PORT=3000
      MAX_REQUEST_PER_15_MINS=100
      SHIFT4_API_KEY=sk_test_NC6AbQAq0i6Xw82ju0LT4n15:
      ACI_API_KEY=ifE4djkhMTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=
      ACI_ENTITY_ID=8a8294174b7ecb28014b9699220015ca
      NODE_ENV=development


## API Endpoints

### Process Payment with Shift4: 
      
      curl -X POST http://localhost:3000/api/v1/payments/shift4 \
      -H "Content-Type: application/json" \
      -d '{
      "amount": "10002",
      "currency": "USD",
      "cardNumber": "4012000100000007", 
      "cvv": "123",
      "expMonth": "08",
      "expYear": "2024"
      }'


This is example response body for successful charge request

      {
         "status": "success",
         "message": "Payment processed successfully",
         "data": {
            "custom_tnx_id": "7953a400-5017-45fe-a9f9-368191ff076f",
            "tnx_id": "char_wUoIbQdtE1D0iUnl1lVGACVo",
            "created_at": 1724317452,
            "amount": 10002,
            "currency": "USD",
            "card_bin": "401200"
         }
      }

### Process Payment with ACI: [Currently we only accept EURO as paymeny currency]

      curl -X POST http://localhost:3000/api/v1/payments/aci \
      -H "Content-Type: application/json" \
      -d '{
      "amount": "10002",
      "currency": "EUR",
      "cardNumber": "4012000100000007", 
      "cvv": "123",
      "expMonth": "08",
      "expYear": "2024"
      }'

This is the example response body for ACI payment

      {
         "status": "success",
         "message": "Payment processed successfully",
         "data": {
            "custom_tnx_id": "7953a400-5017-45fe-a9f9-368191ff076f",
            "tnx_id": "8ac7a4a291780bc00191795b395e3937",
            "amount": "10002.00",
            "currency": "EUR",
            "card_bin": "401200",
            "created_at": "2024-08-22 09:11:47.684+0000"
         }
      }

### To execute the API using command line, you can use these commands. (Go to the project directory)

Pay with SHIFT4


      node cli/cliCommands.js pay_with shift4 --amount 100 --currency USD --card_number 4012000100000007 --expiry_date 12/2024 --cvv 123

Pay with ACI

      node cli/cliCommands.js pay_with aci --amount 100 --currency EUR --card_number 4012000100000007 --expiry_date 12/2024 --cvv 123

Get the transaction history (use the custom_tnx_id key from response body to get the transaction history)

      node cli/cliCommands.js get_payment_status --payment_id 60483844-4865-4e10-a3d3-05c9959975c1