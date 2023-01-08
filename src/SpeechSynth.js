(function() {

    "use strict";

    var sdk = require("microsoft-cognitiveservices-speech-sdk");
    var readline = require("readline");
    var config = require('./config.json');

    var audioFile = "YourAudioFile.wav";
    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    const speechConfig = sdk.SpeechConfig.fromSubscription(config.cognitiveService.key1, config.cognitiveService.region);
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

    // The language of the voice that speaks.
    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural"; 

    // Create the speech synthesizer.
    var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const story = 'Once upon a time, in a faraway land, there was a little bunny named Boo. Boo lived in a cozy little bunny burrow with his mom and dad. Every day, Boo would hop and play in the fields and gardens, chasing butterflies and eating yummy carrots. One day, Boo saw a beautiful butterfly fluttering in the meadow. He hopped and hopped, trying to catch it, but the butterfly flew just out of reach. Boo was determined to catch the butterfly, so he kept on hopping and chasing it. Finally, after a long and tiring chase, Boo caught the butterfly in his tiny paws. He was so happy and proud of himself! From that day on, Boo was known as the best butterfly catcher in the land. The end.'
    rl.question("Enter some text that you want to speak >\n> ", function (text) {
      rl.close();
      // Start the synthesizer and wait for a result.
      synthesizer.speakTextAsync(text,
          function (result) {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("synthesis finished.");
        } else {
          console.error("Speech synthesis canceled, " + result.errorDetails +
              "\nDid you set the speech resource key and region values?");
        }
        synthesizer.close();
        synthesizer = null;
      },
          function (err) {
        console.trace("err - " + err);
        synthesizer.close();
        synthesizer = null;
      });
      console.log("Now synthesizing to: " + audioFile);
    });
}());