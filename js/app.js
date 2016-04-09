var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  //On Start
  recognition.onstart = function() {
    recognizing = true;
    console.log("recognition-started");
  };

  //On Error
  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      console.log("error no-speech");
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      console.log("error audio-capture");
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        console.log("info-blocked");
      } else {
        console.log("info-denied");
      }
      ignore_onend = true;
    }
  };

  //On End
  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    if (!final_transcript) {
      console.log("info_start");
      return;
    }
    console.log("end");
  };

  //On Result
    recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);
    if (final_transcript || interim_transcript) {
      console.log(final_transcript);
      console.log(interim_transcript);
    }
  };


  function upgrade() {
  console.log("upgrade");
  }

  //Formating Utilities
  var two_line = /\n\n/g;
  var one_line = /\n/g;
  function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
  }

  var first_char = /\S/;
  function capitalize(s) {
    return s.replace(first_char, function(m) { return m.toUpperCase(); });
  }

  // Start Button
  function startButton(event) {
    if (recognizing) {
      recognition.stop();
      return;
    }
    final_transcript = '';
    recognition.lang = "English";
    recognition.start();
    ignore_onend = false;
    // final_span.innerHTML = '';
    // interim_span.innerHTML = '';
    // start_img.src = 'mic-slash.gif';
    console.log("info-allow");
    start_timestamp = event.timeStamp;
  }


  $(document).ready(function() {
    $("#start_dictation").click(function(event) {
      startButton(event);
    });
  });

}
