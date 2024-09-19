# Payment Processing Service

This project involves building a payment processing service that handles payments using Shift4 and ACI payment gateways. The service exposes RESTful endpoints for processing payments and provides a command-line interface (CLI) for interacting with these endpoints. The goal is to create a unified and standardized payment processing system using Node.js with Express.

Here, I am using SQLite database to save the custom unique id, transaction ids, payment type (SHIFT4 or ACI), and transaction details for ACI as I did not find the API endpoint to retrieve the transaction history from ACI.

## Key Features

- **RESTful API**: Endpoints for payment processing.
- **Security**: Implemented with Helmet, CORS, XSS protection, and more.
- **Dockerization**: Easy deployment using Docker.
- **CLI Commands**: Interact with the API via command-line commands.
- **Rate Limiting**: Configure maximum requests per API endpoint using the `MAX_REQUEST_PER_15_MINS` variable in the `.env` file.

## Requirements

- **Node.js**: Version 18 or higher.
- **Docker**: Optional, for containerization.

## Installation

### 1. Clone the Repository

      git clone https://github.com/ParvezHossain/payment-service-integration
      cd payment-processing-service
      npm install
      npm install -g .

## 2. Set Up Environment Variables

Create a `.env` file in the project root directory and add the following content, adjusting for your credentials:

      HOST=localhost
      PORT=3000
      MAX_REQUEST_PER_15_MINS=100
      SHIFT4_API_KEY=sk_test_NC6AbQAq0i6Xw82ju0LT4n15
      ACI_API_KEY=OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=
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

Example Response for Shift4 Payment

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

### Process Payment with ACI (Currently only accepts EUR)

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

Pay with SHIFT4:

      paymentcli pay_with shift4 --amount 100 --currency USD --card_number 4012000100000007 --expiry_date 12/2024 --cvv 123
      docker exec -it <container_id> paymentcli pay_with shift4 --amount 100 --currency USD --card_number 4012000100000007 --expiry_date 12/2024 --cvv 123

Pay with ACI:

> **Note:** Currently, We only accept EUR as payment currency

      paymentcli pay_with aci --amount 100 --currency EUR --card_number 4012000100000007 --expiry_date 12/2024 --cvv 123
      docker exec -it <container_id> paymentcli pay_with aci --amount 100 --currency EUR --card_number 4012000100000007 --expiry_date 12/2024 --cvv 123

Get the transaction history (use the `custom_tnx_id` key from response body to get the transaction history)

      paymentcli get_payment_status --payment_id 60483844-4865-4e10-a3d3-05c9959975c1
      docker exec -it <container_id> paymentcli get_payment_status --payment_id 60483844-4865-4e10-a3d3-05c9959975c1

### RUN through DOCKER

Go to the project folder root directory and run the first command to build the image and run the container in detached mode. And run the second command to stop the image. After successfully install, you can access tha APIs.

      docker-compose up --build -d
      docker-compose down
