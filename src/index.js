'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = 'amzn1.ask.skill.52f00a17-5e5a-45bb-a861-8a7928e96c78';
var SKILL_NAME = 'Verwandtschafts Meister';

//Adding greater variety to startSession
var WELCOME = [
  "Hey! du kannst mich nach Verwandtschaftsgraden fragen.",
  "Hi! Du bist hier richtig, wenn du wissen willst wie die Tochter deiner Tante genannt wird. Leg los und frage mich was.",
  "Hallo! Frag mich einfach nach Verwandtschaftsgraden.",
  "Hi! Wie kann ich dir helfen?",
];


//Adding greater variety to endSession
var GOODBYE = [
    "Ok! Tschüss!",
    "Alles klar. Wir hören uns.",
    "Natürlich! Bis dann!",
    "Hat mich gefreut!",
    "Ok, wir sprechen später!",
];


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};


var handlers = {
    'LaunchRequest': function () {
        var wIndex = Math.floor(Math.random() * WELCOME.length);
        var randomWelcome = WELCOME[wIndex];
        this.attributes['speechOutput'] = randomWelcome;
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = 'Wenn du nicht weist was du sagen sollst, sag einfach "Hilfe".';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },
    'RelativeIntent': function () {
        var recipes = require('./recipes');
        console.log('Using relative recipes');

        var relativeSlot = this.event.request.intent.slots.Relative;
        var relativeName;
        if (relativeSlot && relativeSlot.value) {
            relativeName = relativeSlot.value;
            relativeName = relativeName.toLowerCase();
            relativeName = relativeName.replace(/[^\w\s]/gi, '')
            console.log('Cleaned relative slot value: ' + relativeName);
        } else  {
            console.log('Could not access relative slot value');
        }

        var recipe = recipes[relativeName];
        console.log ('fetched recipe: ' + recipe);

        if (recipe !== undefined) {
            this.attributes['speechOutput'] = recipe + '<break time="300ms"/> ' + ' Was willst du noch wissen?';
            this.attributes['repromptSpeech'] = 'Wenn du du die letzte Antwort noch mal hören willst, sag bitte "Wiederholen". Was willst du noch wissen?';
            this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
        } else {
            var speechOutput = 'Vielleicht das schwarze Schaf der Familie? Entschuldige, ich konnte dich leider nicht verstehen. ';
            var repromptSpeech = 'Bei welcher Frage kann ich dir weiterhelfen?';

            speechOutput += repromptSpeech;

            this.attributes['speechOutput'] = speechOutput;
            this.attributes['repromptSpeech'] = repromptSpeech;

            this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = 'Frage mich zum Beispiel: "Was ist der Onkel meines Ehepartners?", oder "Was ist mein Onkel 2. Grades?". Wie kann ich dir helfen?';
        this.attributes['repromptSpeech'] = 'Frage mich zum Beispiel: "Was ist meine Nichte?". Wie kann ich dir helfen?';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },
    "AMAZON.NoIntent": function (intent, session, response) {
        this.emit(':tell', randomGoodbye());
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', randomGoodbye());
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', randomGoodbye());
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', randomGoodbye());
    },
    'Unhandled': function() {
        console.error("unexpected event received: " + this.event);
        this.emit(':tell', 'Entschuldige, ich konnte dich nicht verstehen.');
     }
};

var randomGoodbye = function() {
    var goodbyeIndex = Math.floor(Math.random() * GOODBYE.length);
    return GOODBYE[goodbyeIndex];
};
