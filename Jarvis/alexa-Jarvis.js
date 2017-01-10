var https = require('https')
var count = 0;
var laundryDate = new Date("January 1, 2017")
var shoppingList = [];

exports.handler = (event, context) => {

  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION")
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log(`LAUNCH REQUEST`)
        context.succeed(

          generateResponse(
            buildSpeechletResponse("Hi I'm Jarvis, an Alexa Skill. How can I help you? ", true),
            {}
          )
        )
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`)

        switch (event.request.intent.name) {
          case "GetLaundryDetails":

            console.log(`Intent: GetLaundryDetails`)
            laundryDate
            context.succeed(

              generateResponse(
                buildSpeechletResponse("The last time you did laundry was on " + laundryDate.toDateString() + ". It's been " + getDateDifference(laundryDate, new Date()) + " days", true),
                {}
              )
            )
            /*var endpoint = "" // ENDPOINT GOES HERE
            var body = ""
            https.get(endpoint, (response) => {
              response.on('data', (chunk) => { body += chunk })
              response.on('end', () => {
                var data = JSON.parse(body)
                var subscriberCount = data.items[0].statistics.subscriberCount
                context.succeed(
                  generateResponse(
                    buildSpeechletResponse(`Current subscriber count is ${subscriberCount}`, true),
                    {}
                  )
                )
              })
            })*/
            break;

          case "UpdateLaundryDetails":
            // Launch Request
            console.log(`LAUNCH REQUEST`)

            laundryDate = new Date();
            context.succeed(

              generateResponse(
                buildSpeechletResponse("Updated Laundry to today ", true),
                {}
              )
            )
            break;

          case "GetShoppingList":
            console.log(`LAUNCH REQUEST`)
            console.log(`Intent: GetShoppingList`)


            context.succeed(

              generateResponse(
                buildSpeechletResponse("Your shopping list has these items. " + shoppingList.join(", "), true),
                {}
              )
            )
            break;


          case "AddShopItem":
            console.log(`LAUNCH REQUEST`)
            console.log(`Intent: AddShopItem`)
            // console.log(event.request.intent.slots)
            var msg = "";
            Object.keys(event.request.intent.slots).some(function (key, index) {
              // key: the name of the object key
              // index: the ordinal position of the key within the object 
              var value = event.request.intent.slots[key].value;

              if (value) {
                console.log("item to be added : " + value)

                if (shoppingList.indexOf(value) != -1) {
                  msg = "Item alreday present in the list."
                } else {
                  shoppingList.push(value);
                  msg = "Item Added."

                }
                console.log(shoppingList)
                return true;
              }


            });


            context.succeed(

              generateResponse(
                buildSpeechletResponse(msg, true),
                {}
              )
            )
            break;

          case "RemoveShopItem":
            console.log(`LAUNCH REQUEST`)
            console.log(`Intent: RemoveShopItem`)
            var msg = "";
            Object.keys(event.request.intent.slots).some(function (key, index) {
              // key: the name of the object key
              // index: the ordinal position of the key within the object 
              var value = event.request.intent.slots[key].value;

              if (value) {
                console.log("item to be Removed : " + value)

                if (shoppingList.indexOf(value) != -1) {
                  shoppingList.splice(shoppingList.indexOf(value), 1)
                  msg = "Item Removed."
                } else {

                  msg = "Item not present in the list."

                }
                console.log(shoppingList)
                return true;
              }


            });


            context.succeed(

              generateResponse(
                buildSpeechletResponse(msg, true),
                {}
              )
            )
            break;

          case "CheckShopItem":
            console.log(`LAUNCH REQUEST`)
            console.log(`Intent: CheckShopItem`)
            var msg = "";
            Object.keys(event.request.intent.slots).some(function (key, index) {
              // key: the name of the object key
              // index: the ordinal position of the key within the object 
              var value = event.request.intent.slots[key].value;

              if (value) {
                console.log("item to be Removed : " + value)

                if (shoppingList.indexOf(value) != -1) {

                  msg = "Item present in the list."
                } else {

                  msg = "Item not present in the list."

                }

                return true;
              }


            });


            context.succeed(

              generateResponse(
                buildSpeechletResponse(msg, true),
                {}
              )
            )
            break;

          case "GetVideoViewCount":
            var endpoint = "" // ENDPOINT GOES HERE
            var body = ""
            https.get(endpoint, (response) => {
              response.on('data', (chunk) => { body += chunk })
              response.on('end', () => {
                var data = JSON.parse(body)
                var viewCount = data.items[0].statistics.viewCount
                context.succeed(
                  generateResponse(
                    buildSpeechletResponse(`Current view count is ${viewCount}`, true),
                    {}
                  )
                )
              })
            })
            break;

          case "GetVideoViewCountSinceDate":
            console.log(event.request.intent.slots.SinceDate.value)
            var endpoint = "" // ENDPOINT GOES HERE
            var body = ""
            https.get(endpoint, (response) => {
              response.on('data', (chunk) => { body += chunk })
              response.on('end', () => {
                var data = JSON.parse(body)
                var viewCount = data.items[0].statistics.viewCount
                context.succeed(
                  generateResponse(
                    buildSpeechletResponse(`Current view count is ${viewCount}`, true),
                    {}
                  )
                )
              })
            })
            break;

          default:
            throw "Invalid intent"
        }

        break;

      case "SessionEndedRequest":
        // Session Ended Request
        console.log(`SESSION ENDED REQUEST`)
        break;

      default:
        context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

    }

  } catch (error) { context.fail(`Exception: ${error}`) }

}

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

  count++;

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }

}

getDateDifference = function (date1, date2) {
  //Get 1 day in milliseconds
  var one_day = 1000 * 60 * 60 * 24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;

  // Convert back to days and return
  return Math.round(difference_ms / one_day);
}