# BC Cafe Menu

**CSC 138 · Team 4** — a C++ program that shows what the Benedict College cafe is serving today, on any day, or all week, with search by ingredient and a calorie filter.

**Website:** https://plutani07.github.io/bc-cafe-menu/

## How it works

Three classes, each one holding the next:

| Class | What it does |
|---|---|
| `MenuItem` | One food item: name, ingredients (`vector<string>`), calories (10–1000) |
| `DailyMenu` | One day's breakfast, lunch, and dinner (`vector<MenuItem>` each) |
| `WeeklySchedule` | Seven `DailyMenu`s; loads/saves `menu.txt` and knows what day it is |

The menu lives in `menu.txt`, one item per line:

```
Day|Meal|Name|Calories|ingredient1,ingredient2,...
Monday|Lunch|Turkey Sandwich|500|Bread,Turkey
```

Both the C++ program and the website read this same file, so updating it updates both.

## Build and run

```
make            # builds ./cafe and ./run_tests
./cafe          # the menu program
make test       # runs the test cases
```

Without `make`:

```
g++ -std=c++17 -Isrc src/main.cpp src/MenuItem.cpp src/DailyMenu.cpp src/WeeklySchedule.cpp -o cafe
```

**Visual Studio:** add every `.cpp` in `src/` to the project, and put `menu.txt` in the project folder (the folder the program runs from).

## Website

`site/` is the website (HTML/CSS/JS, Manrope font in `site/fonts/`). It reads `menu.txt` and shows today's menu, any day, or the whole week, with ingredient search, a calorie filter, and a detail view for each item. GitHub Actions publishes it to GitHub Pages on every push to `main`.

To add food photos, see `site/img/README.md`.

To preview locally: copy `menu.txt` into `site/`, then run `python3 -m http.server` inside `site/` and open http://localhost:8000.

## Program options

1. What's being served today
2. Menu for a specific day
3. Full week
4. Search by ingredient
5. Items under a calorie limit
6. Add a menu item (saves to `menu.txt`)
7. Quit

## Tests

`tests/tests.cpp` covers the kickoff worksheet's test cases plus the new classes:

| Case | Input | Expected |
|---|---|---|
| Normal | Steak, `setCalories(500)` | calories = 500 |
| Boundary | `setCalories(10)`, `setCalories(1000)` | both accepted |
| Invalid | Steak, `setCalories(1001)` | "Invalid value", calories unchanged |

Tests run automatically on GitHub on every push — see the **Actions** tab for the results.

## Project layout

```
src/        C++ classes and main.cpp
tests/      test cases
menu.txt    the menu data
site/       the website (HTML/CSS/JS, fonts, photos)
```
