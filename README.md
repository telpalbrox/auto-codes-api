#  Autocodes JSON API

OBDII Codes API written in NodeJS + TypeScript.

This API retrieves the data from http://www.autocodes.com/ .

## Getting started

```
git clone https://github.com/telpalbrox/auto-codes-api.git
cd auto-codes-api
npm install
npm start
```

## Endpoints

### GET /carbrands
Get a list of all car brands supported by the API

Response body

```json
[
  "Acura",
  "Audi",
  "BMW",
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Dodge",
  "Eagle",
  "Ford",
  "GEO",
  "GMC",
  "Honda",
  "Hummer",
  "Hyundai",
  "Infiniti",
  "Isuzu",
  "Jaguar",
  "Jeep",
  "KIA",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Mazda",
  "Mercedes-Benz",
  "Mercury",
  "MINI",
  "Mitsubishi",
  "Nissan",
  "Oldsmobile",
  "Pontiac",
  "Saab",
  "Saturn",
  "Scion",
  "Subaru",
  "Suzuki",
  "Toyota",
  "Volkswagen",
  "Volvo"
]
```

### GET /:brand/:code?language={language}
Where :brand is one of the supported car brands and code is a valid OBDII Code.
You can also indicate a language (i.e. es) and it will translate the response into that language.

Response body /audi/P0720

```json
{
  "possiblesCauses": "- Faulty Speed Sensor- Speed Sensor harness is open or shorted- Speed Sensor circuit poor electrical connection?",
  "whenCodeDetected": "Diagnostic trouble code is detected when Transmission Control Module (TCM) does not receive the proper voltage signal from the sensor.",
  "possibleSymptoms": "- Engine Light ON (or Service Engine Soon Warning Light)- Speedometer improper reading- Possible shifting problems",
  "description": "The speed sensor detects the revolution of the idler gear parking pawl lock gear and emits a pulse signal. The pulse signal is sent to the Transmission Control Module (TCM) which converts it into vehicle speed."
}
```

## Enable translation
In order to translate responses you have to create two environment variables: BING_CLIENT_ID and BING_CLIENT_SECRET

More information: https://www.microsoft.com/en-us/translator/getstarted.aspx
