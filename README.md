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
      cd payment-service-integration
      npm install
      npm install -g .

## 2. Set Up Environment Variables

Create a `.env` file in the project root directory running this command `cp .env.example .env`. Don't forget to adjusting for your credentials:


### RUN through DOCKER


> **Note:** Ensure that docker is running on the host machine.

Run the below command to start the node project

      docker compose up --build --force-recreate -d


# API Endpoints

~ If you are using VSCode for development, you might be intesrested to install Rest Client extension. Then go to the request folder in the root directory from where you can make request from `payment.http` file. There will be button `Send Request` which will make a request.s

Here is the extension link to install on VS Code.

      https://marketplace.visualstudio.com/items?itemName=humao.rest-client

### Process Payment with `Shift4` using curl example:

> **Note:** I assume you are using port `3000` on your `local machine`

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
            "message": "SHIFT4 Payment processed successfully",
            "data": {
                  "custom_tnx_id": "630ff944-4a89-442c-9e7a-53a3a2b06f98",
                  "tnx_id": "char_9ipdYbO99PSSJ5Sue3ezYdEG",
                  "amount": "10002",
                  "currency": "USD",
                  "card_bin": "401200",
                  "created_at": "2024-08-27 14:52:08.000+0000"
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
            "message": "ACI Payment processed successfully",
            "data": {
                  "custom_tnx_id": "ee18dbd7-bb1e-4ce3-b3c8-d8aecbdfb5bf",
                  "tnx_id": "8ac7a4a291929f7e01919454f5126230",
                  "amount": "10002.00",
                  "currency": "EUR",
                  "card_bin": "401200",
                  "created_at": "2024-08-27 14:54:41.533+0000"
            }
      }

### Get the transaction histry (Get the `custom_tnx_id` from payment response to get your transaction history)

      curl -X GET http://localhost:3000/api/v1/payments/a998b0b4-673e-4dd8-8314-ca844f1a7497


### To make request via Command Line interface:

Get the docker container ID using command

      docker ps

To make `SHIFT4` Payment request:

      docker exec -it <container_id> paymentcli pay_with shift4 --amount 100 --currency USD --card_number 4012000100000007 --expiry_date 12/2024 --cvv 123

To make `ACI` payment request:

      docker exec -it <container_id> paymentcli pay_with aci --amount 100 --currency EUR --card_number 4012000100000007 --expiry_date 12/2024 --cvv 123

Get the transaction history use `the custom_tnx_id` key from response body to get the transaction history

        docker exec -it fdf849e7dfa7 paymentcli get_payment_status --payment_id 7f4c38de-0340-4c59-a3ae-071343205cf0

### To stop the docker container, run this command

      docker compose down

### To execute the API using command line if you don't use `docker` to run you project, you can use these commands. (Go to the project directory)

Pay with `SHIFT4`:

      paymentcli pay_with shift4 --amount 100 --currency USD --card_number 4012000100000007 --expiry_date 12/2024 --cvv 123

Pay with `ACI`:

> **Note:** Currently, We only accept EUR as payment currency

      paymentcli pay_with aci --amount 100 --currency EUR --card_number 4012000100000007 --expiry_date 12/2024 --cvv 123

Get the transaction history (use the `custom_tnx_id` key from response body to get the transaction history)

      paymentcli get_payment_status --payment_id 60483844-4865-4e10-a3d3-05c9959975c1


