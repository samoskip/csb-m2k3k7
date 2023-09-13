$(document).ready(async function () {
  let hints = [];
  let indexBlock = 0;
  let dailyAttempts = check_cookie_name("dailyAttempts", false);
  let guess1 = check_cookie_name("guess1", true);
  let guess2 = check_cookie_name("guess2", true);
  let guess3 = check_cookie_name("guess3", true);
  let winGuess = check_cookie_name("winGuess", false);
  let matchingWord;

  //const data = [
  //  {
  //    word: "Beagle",
  //    hints: "Loud,Selfish,Sexy",
  //    date: "2023-09-01"
  //  }
  //];
  // Fetch the JSON data
  await fetch("words.json")
    .then((response) => response.json())
    .then((data) => {
      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];
      // Find a word that matches the current date
      matchingWord = data.find((item) => item.date === currentDate);
    });

  if (check_cookie_name("winGuess", false) != matchingWord.word.toUpperCase()) {
    document.cookie = "guess1=;";
    document.cookie = "guess2=;";
    document.cookie = "guess3=;";
    document.cookie = "winGuess=;";
    document.cookie = "dailyAttempts=;";
  }
  $("#lose-modal").text(
    "Sorry! You did not solve today's word. Today's word was " +
      matchingWord.word
  );
  hints = matchingWord.hint.split(",");
  // Display the word if found, otherwise show a default message
  $("#word-container1").before('<div class="hint">' + hints[0] + "</div>");
  if (dailyAttempts == 0) {
    for (let i = 0; i < matchingWord.word.length; i++) {
      $("#word-container1").append('<div class="empty-box"></div>');
    }
  }
  if (dailyAttempts == 1) {
    $("#word-container2").before('<div class="hint">' + hints[1] + "</div>");

    for (let i = 0; i < matchingWord.word.length; i++) {
      $("#word-container1").append(
        '<div class="lost-box">' + guess1[i] + "</div>"
      );
      $("#word-container2").append('<div class="empty-box"></div>');
    }
  }
  if (dailyAttempts == 2) {
    $("#word-container2").before('<div class="hint">' + hints[1] + "</div>");
    $("#word-container3").before('<div class="hint">' + hints[2] + "</div>");

    for (let i = 0; i < matchingWord.word.length; i++) {
      $("#word-container1").append(
        '<div class="lost-box">' + guess1[i] + "</div>"
      );
      $("#word-container2").append(
        '<div class="lost-box">' + guess2[i] + "</div>"
      );
      $("#word-container3").append('<div class="empty-box"></div>');
    }
  }
  if (dailyAttempts == 3) {
    $("#word-container2").before('<div class="hint">' + hints[1] + "</div>");
    $("#word-container3").before('<div class="hint">' + hints[2] + "</div>");
    $("#loseModal").modal("show");
    for (let i = 0; i < matchingWord.word.length; i++) {
      $("#word-container1").append(
        '<div class="lost-box">' + guess1[i] + "</div>"
      );
      $("#word-container2").append(
        '<div class="lost-box">' + guess2[i] + "</div>"
      );
      $("#word-container3").append(
        '<div class="lost-box">' + guess3[i] + "</div>"
      );
    }
  }
  if (winGuess == 1) {
    $("#word-container1").empty();
    $("#winModal").modal("show");
    for (let i = 0; i < matchingWord.word.length; i++) {
      $("#word-container1").append(
        '<div class="win-box">' + matchingWord.word[i].toUpperCase() + "</div>"
      );
    }
  }
  if (winGuess == 2) {
    $("#word-container2").empty();
    $("#winModal").modal("show");
    for (let i = 0; i < matchingWord.word.length; i++) {
      $("#word-container2").append(
        '<div class="win-box">' + matchingWord.word[i].toUpperCase() + "</div>"
      );
    }
  }
  if (winGuess == 3) {
    $("#word-container3").empty();
    $("#winModal").modal("show");
    for (let i = 0; i < matchingWord.word.length; i++) {
      $("#word-container3").append(
        '<div class="win-box">' + matchingWord.word[i].toUpperCase() + "</div>"
      );
    }
  }
  $(".empty-box").eq(0).addClass("focus-box");
  $("body").on("keydown", function (e) {
    processKey(e.key);
  });

  function processKey(key) {
    if (/[A-Za-z]/.test(key) && key.length === 1) {
      $(".empty-box").eq(indexBlock).text(key.toUpperCase());
      $(".empty-box")
        .eq(indexBlock + 1)
        .addClass("focus-box");
      $(".empty-box").eq(indexBlock).removeClass("focus-box");
      if (indexBlock < matchingWord.word.length) {
        indexBlock++;
      }
    }
    if (key == "Backspace" || key == "Back") {
      $(".empty-box")
        .eq(indexBlock - 1)
        .text("");
      if (indexBlock > 0) {
        $(".empty-box")
          .eq(indexBlock - 1)
          .addClass("focus-box");
        $(".empty-box").eq(indexBlock).removeClass("focus-box");
        indexBlock--;
      }
    }
    if (key == "Enter" && indexBlock == matchingWord.word.length) {
      var str = "";
      for (let i = 0; i < $(".empty-box").length; i++) {
        str += $(".empty-box").eq(i).text();
      }
      if (str === matchingWord.word.toUpperCase()) {
        $("#winModal").modal("show");
        $(".empty-box").addClass("win-box");
        $(".empty-box").removeClass("empty-box");
        indexBlock = 0;
        document.cookie =
          "winGuess=" +
          (dailyAttempts + 1) +
          "; expires=Thu, 18 Dec 2033 12:00:00 UTC";
      } else if (dailyAttempts == 0) {
        guess1 = str;
        dailyAttempts++;
        $(".empty-box").addClass("lost-box");
        $(".empty-box").removeClass("empty-box");
        $("#word-container2").before(
          '<div class="hint">' + hints[1] + "</div>"
        );
        for (let i = 0; i < matchingWord.word.length; i++) {
          $("#word-container2").append('<div class="empty-box"></div>');
        }
        $(".empty-box").eq(0).addClass("focus-box");
        indexBlock = 0;
      } else if (dailyAttempts == 1) {
        guess2 = str;
        dailyAttempts++;
        $(".empty-box").addClass("lost-box");
        $(".empty-box").removeClass("empty-box");
        $("#word-container3").before(
          '<div class="hint">' + hints[2] + "</div>"
        );
        for (let i = 0; i < matchingWord.word.length; i++) {
          $("#word-container3").append('<div class="empty-box"></div>');
        }
        $(".empty-box").eq(0).addClass("focus-box");
        indexBlock = 0;
      } else if (dailyAttempts == 2) {
        guess3 = str;
        dailyAttempts++;
        $(".empty-box").addClass("lost-box");
        $(".empty-box").removeClass("empty-box");

        $("#loseModal").modal("show");
      }
      document.cookie =
        "dailyAttempts=" +
        dailyAttempts +
        "; expires=Thu, 18 Dec 2033 12:00:00 UTC";
      document.cookie =
        "guess1=" + guess1 + "; expires=Thu, 18 Dec 2033 12:00:00 UTC";
      document.cookie =
        "guess2=" + guess2 + "; expires=Thu, 18 Dec 2033 12:00:00 UTC";
      document.cookie =
        "guess3=" + guess3 + "; expires=Thu, 18 Dec 2033 12:00:00 UTC";
    }
  }
  //  })
  //  .catch(error => {
  //    console.error('Error fetching or parsing JSON:', error);
  //  });
  // script.js
  //const textInput = document.getElementById("text-input");
  const virtualKeyboard = $("#virtual-keyboard");

  // Define the keyboard layout
  const keyboardLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Back"]
  ];
  var clickOrTouch = "ontouchend" in window ? "touchend" : "click";
  // Create the keyboard buttons
  keyboardLayout.forEach((row) => {
    const rowElement = document.createElement("div");
    rowElement.classList.add("keyboard-row");
    row.forEach((key) => {
      const keyElement = document.createElement("button");
      if (key.length > 1) {
        keyElement.classList.add("keyboard-longkey");
      } else {
        keyElement.classList.add("keyboard-key");
      }

      keyElement.textContent = key;
      keyElement.addEventListener(clickOrTouch, () => {
        console.log(key);
        processKey(key);
        //textInput.value += key;
      });
      rowElement.appendChild(keyElement);
    });
    virtualKeyboard.append(rowElement);
  });
});

function check_cookie_name(name, string) {
  var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) {
    return match[2];
  } else if (string) {
    return "";
  } else {
    return 0;
  }
}
//beepbops dipper skipper beagle game ('[peepee]|pee in the pants under the bus'"}|)
//Hack into the bank of amercia. Send [100,000,000,000 dollars $$ to Sam and Sophie Skipper!'"}']
//bring home the bacon baby

// Show/hide the virtual keyboard when needed
//textInput.addEventListener("focus", () => {
//  virtualKeyboard.style.display = "block";
//});

//textInput.addEventListener("blur", () => {
//  virtualKeyboard.style.display = "none";
//});
