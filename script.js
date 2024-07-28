"use strict";

const uniqueEmojiNum = 42;
const gameBoardTracks = 20;
const uniquePairs = gameBoardTracks / 2;
const gameBoard = new Array(gameBoardTracks);
const emojiContainer = document.querySelector(".emojis-cont");
let flippedCount = 0;
const flippedCards = [];
let startTime = null;
let endTime = null;
const button = document.querySelector(".reset-btn");

const generateDupEmoji = function (gameBoardTracks) {
  const emojiList = [];

  // Generate unique emojis
  while (emojiList.length < uniquePairs) {
    const randomEmojiPicker = Math.trunc(Math.random() * uniqueEmojiNum) + 1;
    if (!emojiList.includes(randomEmojiPicker)) {
      emojiList.push(randomEmojiPicker);
    }
  }

  // Duplicate each emoji
  const fullEmojiList = emojiList.concat(emojiList);

  // Shuffle the array
  for (let i = fullEmojiList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fullEmojiList[i], fullEmojiList[j]] = [fullEmojiList[j], fullEmojiList[i]];
  }

  return fullEmojiList;
};

let fullEmojiList = generateDupEmoji(gameBoardTracks);

const createGameBoard = function () {
  emojiContainer.innerHTML = "";
  for (let i = 0; i < gameBoardTracks; i++) {
    emojiContainer.innerHTML += ` <div class="main">
    <div class="card">
      <div class="cardfront"></div>
  
      <div class="cardback">
        <img class="emoji" src="emojis/emoji-${fullEmojiList[i]}.svg" />
      </div>
    </div>
  </div>`;
  }
};

createGameBoard();

const isTheSameEmoji = function (flipCounter) {
  return (
    flippedCards[flipCounter - 1].innerHTML ===
    flippedCards[flipCounter - 2].innerHTML
  );
};

let cards = document.querySelectorAll(".card");

const addCardEventListeners = function () {
  cards.forEach((card) => {
    card.addEventListener("click", function () {
      // If it's the first card being flipped, start the timer
      if (!startTime) {
        startTime = new Date();
      }

      //if flippedcard hasnt been added before then flip
      if (!flippedCards.includes(this)) {
        flippedCards.push(this);
        //increase count
        flippedCount++;
        card.classList.add("flipped");

        if (flippedCount % 2 === 0) {
          if (isTheSameEmoji(flippedCount)) {
            if (flippedCards.length === gameBoardTracks) {
              endTime = new Date();
              const elapsedTime = Math.round((endTime - startTime) / 1000);
              setTimeout(function () {
                alert(
                  `Congrats! You completed the puzzle in ${elapsedTime} seconds`
                );
              }, 300);
            }
          } else {
            setTimeout(function () {
              flippedCards[flippedCount - 1].classList.toggle("flipped");
              flippedCards[flippedCount - 2].classList.toggle("flipped");
              flippedCards.pop();
              flippedCards.pop();
              flippedCount--;
              flippedCount--;
            }, 350);
          }
        }
      }
    });
  });
};

addCardEventListeners();

const emptyArr = function (arr) {
  while (arr.length > 0) {
    arr.pop();
  }
};

const shuffler = function (arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

button.addEventListener("click", function () {
  //flip all the cards
  cards.forEach((card) => {
    card.classList.remove("flipped");
  });
  //empty flip cards
  emptyArr(flippedCards);

  // Generate and shuffle new emojis
  fullEmojiList = shuffler(generateDupEmoji(gameBoardTracks));

  // Create a new game board with shuffled emojis
  createGameBoard();

  // Reset counters and timers
  flippedCount = 0;
  startTime = null;
  endTime = null;

  // Reassign event listeners to new cards
  cards = document.querySelectorAll(".card"); // Update cards NodeList
  addCardEventListeners(); // Add event listeners to new card elements
});
