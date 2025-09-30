# Street Fighter Memory Game

This document details the structure and functionality of the Memory Game, explaining each part of the code (HTML, CSS, and JavaScript).

## Gameplay

![Gameplay GIF](https://example.com/gameplay.gif)

## Overview

The project is a classic Memory Game with a Street Fighter theme. The player must find pairs of characters by flipping cards. The game has been modernized with new features, such as a timer, move counter, and a leaderboard with the top 10 best times.

## Folder Structure

The project is organized as follows:

```
/
├─── css/
│   └─── style.css
├─── js/
│   └─── action.js
├─── img/
│   ├─── (Character images and logo)
├─── index.html
└─── README.md
```

- **css/**: Contains the visual styles for the page.
- **js/**: Contains all the logic and interactivity of the game.
- **img/**: Stores all the images used in the game.
- **index.html**: Contains the basic structure of the game page.


---

## Code Analysis

### 1. HTML (`index.html`)

The HTML is the skeleton of our application. It has been structured semantically to divide the game into logical sections.

- **`<div class="main-wrapper">`**: This is the main container that wraps the game and the leaderboard. We use `display: flex` on it to create the two-column layout.
- **`<div class="game-container">`**: The left column, which contains the title, the current match's score (time and moves), and the game board (`<section class="memory-game">`).
- **`<div class="leaderboard-container">`**: The right column, dedicated to displaying the top 10 best times, read from `localStorage`.
- **`<div id="win-modal">`**: A screen (modal) that is hidden and only appears when the player wins. Inside it, there is a form for the player to enter their name and save their score.

### 2. CSS (`style.css`)

The CSS is responsible for the entire appearance of the game, from colors and fonts to animations.

- **Flexbox Layout**: We use `display: flex` on the `<body>` and `.main-wrapper` to center and organize the main elements (game and leaderboard) flexibly.
- **Font and Theme**: The "Press Start 2P" font was imported from Google Fonts to give it a retro video game aesthetic. The color theme (black, yellow, and blue) was inspired by Street Fighter.
- **Card Flip Animation**: The magic happens here:
    - `transform-style: preserve-3d;`: Tells the browser that the card's child elements will be positioned in a 3D space.
    - `transition: transform .5s;`: Defines that any change in the `transform` property (like a rotation) should take 0.5 seconds.
    - `.memory-card.flip { transform: rotateY(180deg); }`: When the `.flip` class is added to a card, it rotates 180 degrees on the Y-axis.
    - `backface-visibility: hidden;`: Hides the back side of an element that is not facing the camera.
- **Face Styling**: The `.front-face` (character) and `.back-face` (logo) are positioned absolutely on top of each other. The `.front-face` starts rotated 180 degrees, so it is only visible when the entire card flips.
- **`object-fit`**: We use `object-fit: contain` on the character image to ensure it always appears whole, without being cropped, within the blue background.

### 3. JavaScript (`action.js`)

JavaScript is the brain of the game. It controls all the logic, from shuffling the cards to saving the high scores.

- **`DOMContentLoaded`**: The code only starts running when the entire HTML has been loaded, ensuring that all elements exist.
- **`generateCards()`**: This function dynamically creates the cards. It takes the list of characters, duplicates it to form pairs, shuffles it using the **Fisher-Yates Shuffle** algorithm (`shuffle()`), and creates the HTML for each card, adding them to the board.
- **`flipCard()`**: This is the main game function, executed every time a card is clicked.
    1.  It adds the `.flip` class to start the flip animation.
    2.  It controls whether it is the first or second card clicked.
    3.  If it is the second, it calls the `checkForMatch()` function.
- **`checkForMatch()`**: Compares the `data-framework` (character name) of the two flipped cards. If they are the same, it calls `disableCards()`; if not, it calls `unflipCards()`.
- **`unflipCards()`**: If the pair is incorrect, this function waits for a short period (`setTimeout`) and then removes the `.flip` class from both cards, flipping them back.
- **Leaderboard and `localStorage`**:
    - `loadLeaderboard()`: Reads the list of high scores from the browser's `localStorage` (which is a way to save data that persists even after closing the page), and displays the names and times on the screen.
    - `saveScore()`: When the player wins and enters their name, this function:
        1. Adds the new score to the list.
        2. Sorts the list to ensure the shortest times are at the top.
        3. Limits the list to the top 10 (`slice(0, 10)`).
        4. Saves the updated list back to `localStorage`.
        5. Calls `loadLeaderboard()` so that the new leaderboard appears immediately on the screen.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

MIT License

Copyright (c) 2025 Paulo Prado


Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.