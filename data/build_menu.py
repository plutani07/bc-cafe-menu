"""
Builds menu.txt from the Perkins Management Services "College Dining Hall"
4-week menu cycle (PMSC-Menu-Cycle.pdf).

Transcribed by hand from the PDF. Obvious typos in the PDF were fixed
(e.g. "Chickejn" -> "Chicken", "Bulgoi" -> "Bulgogi", "Reman" -> "Ramen").

Run:  python3 data/build_menu.py   (writes menu.txt in the repo root)

menu.txt line format:
  Week|Day|Meal|Station|Name|Calories|Ingredients|Tags
    Week   1-4, or * for every week
    Day    Monday..Sunday, Daily, Weekdays, or Weekends
    Meal   Breakfast, Brunch, Lunch, or Dinner
    Calories  blank = not listed (the Perkins menu has no calorie info)
    Ingredients / Tags  comma-separated, may be blank
    Tags   side, rotating, vegetarian
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "menu.txt"
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

lines = []


def add(week, day, meal, station, name, ingredients=(), tags=(), calories=""):
    assert "|" not in name, name
    for field in (*ingredients, *tags):
        assert "|" not in field and "," not in field, field
    lines.append("|".join([str(week), day, meal, station, name, str(calories),
                           ",".join(ingredients), ",".join(tags)]))


def day_menu(week, station, meal, menu, extra_tags=()):
    """menu = {day: (entrees, sides)}; weekend 'Breakfast' pages are Brunch."""
    for day, (entrees, sides) in menu.items():
        m = "Brunch" if meal == "Breakfast" and day in ("Saturday", "Sunday") else meal
        for e in entrees:
            if isinstance(e, tuple):
                add(week, day, m, station, e[0], e[1], extra_tags)
            else:
                add(week, day, m, station, e, (), extra_tags)
        for s in sides:
            add(week, day, m, station, s, (), ("side", *extra_tags))


# ---------------------------------------------------------------- shared lists
BISC = "Buttermilk Biscuits"
MPG = "Mashed Potatoes with Gravy"
SGB = "Southern Green Beans"

LAURENES = "Laurene's"
ROOT = "Root & Vine"
HEARTH = "Hearth & Ladle"

# ================================================================== WEEK 1
day_menu(1, LAURENES, "Breakfast", {
    "Monday": (["Buttermilk Pancakes", "Southern Oatmeal with Brown Sugar"],
               ["Fresh Fruit Toppings", "Crisp Pork Bacon", "Crisp Turkey Bacon", "Scrambled Eggs", "Boiled Eggs", BISC]),
    "Tuesday": (["French Toast with Fresh Fruit Compote"],
                ["Grilled Pork Sausage Links", "Grilled Turkey Sausage Links", "Buttered Grits", "Scrambled Eggs", "Boiled Eggs", BISC]),
    "Wednesday": (["Roasted Vegetable Strata"],
                  ["Buttered Grits", "Grilled Pork Sausage Patties", "Grilled Turkey Sausage Patties", "Scrambled Eggs", "Boiled Eggs", BISC]),
    "Thursday": (["Spinach Quiche", "Southern Oatmeal with Brown Sugar"],
                 ["Fresh Fruit Toppings", "Crisp Pork Bacon", "Crisp Turkey Bacon", "Scrambled Eggs", "Boiled Eggs", BISC]),
    "Friday": (["Buttermilk Pancakes", "Blueberry Pancakes", "Corned Beef Hash"],
               ["Buttered Grits", "Grilled Turkey Sausage Links", "Scrambled Eggs", "Boiled Eggs", BISC]),
    "Saturday": (["French Toast with Fresh Fruit Compote", "Cream of Wheat", "Jerk Chicken", "Beef Lasagna with Marinara Sauce"],
                 ["Crisp Pork Bacon", "Crisp Turkey Bacon", "Oven Roasted Breakfast Potatoes", "Scrambled Eggs", "Boiled Eggs", BISC,
                  "Steamed Broccoli", "Green Beans", "Black Eye Peas", MPG, "Steamed Rice", "Spinach", "Buttered Corn", "Garlic Breadsticks"]),
    "Sunday": (["Grilled Country Ham", "Chicken Parmesan", "Eggplant Parmesan", "Spaghetti with Marinara Sauce"],
               ["Buttered Grits", "Grilled Turkey Sausage Links", "Scrambled Eggs", "Boiled Eggs", "Hash Brown Potatoes", BISC,
                "Green Beans", "Vegetable Medley", SGB, MPG, "Steamed Rice", "Green Peas", "Spinach", "Candied Yams", "Garlic Bread"]),
})
day_menu(1, LAURENES, "Lunch", {
    "Monday": (["Chili Rubbed Tilapia", "Grilled Chicken Breast Topped with Tomatoes, Garlic, and Basil"],
               ["Orzo Pasta with Lemon and Basil", "Grilled Zucchini with Yellow Squash and Onions", "Roasted Cauliflower",
                "Steamed Rice", MPG, SGB, "Spinach", "Buttered Corn", "Black Eye Peas", "Buttered Rolls"]),
    "Tuesday": (["Chicken and Sausage Jambalaya", "Blackened Tilapia with Cajun Cream Sauce"],
                ["Red Beans with Rice", "Cajun Corn on the Cob", "Steamed Broccoli", "Red Beans", "Steamed Rice", MPG,
                 "Candied Yams", SGB, "Spinach", "Buttered Corn", "Corn Bread Flap Jacks"]),
    "Wednesday": (["Southern Fried Chicken", "Herb Baked Chicken", "Spaghetti with Meat Sauce"],
                  ["Candied Yams", "Collard Greens", "Macaroni and Cheese", "Roasted Butternut Squash", "Yellow Rice",
                   "Buttered Carrots", "Baked Beans", SGB, "Mashed Sweet Potatoes", MPG, "Corn Bread"]),
    "Thursday": (["Salisbury Steak with Gravy and Onions", "Chicken Broccoli and Rice Casserole"],
                 ["Garlic Mashed Potatoes", "Sautéed Green Beans", "Candied Carrots", SGB, "Black Eye Peas", "Steamed Rice",
                  "Mashed Sweet Potatoes", MPG, "Buttered Corn", "Green Peas", "Buttered Rolls"]),
    "Friday": (["Southern Fried Fish", "Lemon Pepper Baked Fish"],
               ["Hushpuppies", "Skillet Cabbage", "Corn on the Cob", "Roasted Vegetables", "Macaroni and Cheese", "Candied Yams",
                "Steamed Rice", "Buttered Corn", "Spinach", "Pinto Beans", MPG, "Corn Bread Muffins"]),
})
day_menu(1, LAURENES, "Dinner", {
    "Monday": (["Sliced Roast Beef with Au Jus", "BBQ Chicken"],
               ["Steamed Rice Pilaf", "Steamed Baby Carrots", "Broccoli Casserole", "Spinach", SGB, "Green Peas",
                "Buttered Corn", "Mashed Sweet Potatoes", MPG, "Black Eye Peas", "Buttered Rolls"]),
    "Tuesday": (["Sliced Roasted Turkey Breast", "Sliced Ham"],
                ["Candied Yams", "Turnip Greens", "Corn Bread Dressing with Gravy", "Spinach", "Steamed Broccoli", SGB,
                 "Buttered Corn", MPG, "Green Peas", "Buttered Rolls"]),
    "Wednesday": (["Stewed Beef Tips with Gravy", "Teriyaki Pork Tips"],
                  ["Steamed Rice", "Sautéed Vegetable Medley", "Roasted Cauliflower", "Baby Carrots", "Spinach", "Baked Beans",
                   "Buttered Corn", MPG, "Candied Yams", "Green Peas", "Corn Bread Muffins"]),
    "Thursday": (["Fried Pork Chops", "Meatloaf"],
                 [MPG, "Stewed Okra with Tomatoes", "Creamed Corn", "Green Beans", "Green Peas", "Black Eye Peas",
                  "Steamed Rice", SGB, "Buttered Rolls"]),
    "Friday": (["BBQ Ribs", "Pulled BBQ Chicken"],
               ["Smokey Baked Beans", "Potato Salad", "Sautéed Green Beans", "Dirty Rice", "Candied Yams", "Steamed Rice",
                "Buttered Carrots", "Spinach", "Pinto Beans", SGB, "Buttered Rolls"]),
    "Saturday": (["Sliced Roast Pork with Apple Chutney", "Lemon Pepper Baked Fish"],
                 ["Steamed Rice with Gravy", "Candied Carrots", "Steamed Broccoli", "Black Eye Peas", "Spinach", MPG,
                  "Buttered Corn", "Collard Greens", "Buttered Rolls"]),
    "Sunday": (["Fried Chicken", "Baked Chicken"],
               ["Collard Greens", "Sweet Potato Casserole", "Macaroni and Cheese", MPG, SGB, "Green Peas", "Spinach",
                "Pinto Beans", "Buttered Corn", "Corn Bread"]),
})
day_menu(1, ROOT, "Lunch", {
    "Monday": (["Sautéed Sugar Snap Peas with Carrots over Soba Noodles"], []),
    "Tuesday": (["Sautéed Kale, Black Bean, and Avocado Burrito Bowl"], []),
    "Wednesday": (["Vegetable Pho"], []),
    "Thursday": (["Roasted Vegetable Ramen"], []),
    "Friday": ([("Bibimbap Bowl", ["Steamed Rice", "Roasted Mushrooms", "Spinach", "Cucumber", "Carrots", "Scallions", "Cilantro"])], []),
    "Saturday": (["Spicy Tofu Bowl with Quinoa and Sautéed Broccoli"], []),
    "Sunday": (["Roasted Eggplant", "Spicy Potato Hash", "Lemon Risotto"], []),
}, ("vegetarian",))
day_menu(1, ROOT, "Dinner", {
    "Monday": (["Sautéed Portobello Mushroom Stir Fry with Broccoli and Peppers"], []),
    "Tuesday": (["Spicy Portobello and Roasted Vegetable Tacos"], []),
    "Wednesday": (["Butternut, Sweet Potato, and Lentil Stew"], []),
    "Thursday": (["Sundried Tomato and Spinach Tofu Quiche"], []),
    "Friday": (["Maple Baked Sweet Potatoes with Lentils"], []),
    "Saturday": (["Roasted Seasonal Vegetables over Warm Quinoa with 3 Herb Sauce"], []),
    "Sunday": (["Grilled Tofu with Pineapple Salsa and Coconut Rice"], []),
}, ("vegetarian",))
SOUPS_W1 = ["Chicken and Rice Soup", "Vegetable Beef Soup", "Minestrone Soup", "Roasted Garlic and Tomato Soup", "Broccoli and Cheese Soup"]
SOUPS_W234 = ["Tomato and Basil Soup", "Creamy Squash Soup", "Chicken Noodle Soup", "Creamy Potato Soup", "Vegetable Beef Soup"]

# ================================================================== WEEK 2
day_menu(2, LAURENES, "Breakfast", {
    "Monday": (["Grilled Country Ham"],
               ["Buttered Grits", "Grilled Turkey Sausage Links", "Scrambled Eggs", "Boiled Eggs", "Hash Brown Potatoes", BISC]),
    "Tuesday": (["Roasted Vegetable Frittata"],
                ["Buttered Grits", "Grilled Pork Sausage Patties", "Grilled Turkey Sausage Patties", "Breakfast Potatoes",
                 "Scrambled Eggs", "Boiled Eggs", BISC]),
    "Wednesday": (["French Toast with Fresh Fruit Compote"],
                  ["Grilled Pork Sausage Links", "Grilled Turkey Sausage Links", "Buttered Grits", "Scrambled Eggs",
                   "Breakfast Potatoes", "Boiled Eggs", BISC]),
    "Thursday": (["Spinach Quiche", "Southern Oatmeal with Brown Sugar"],
                 ["Fresh Fruit Toppings", "Crisp Pork Bacon", "Crisp Turkey Bacon", "Scrambled Eggs", "Hash Brown Potatoes",
                  "Boiled Eggs", BISC]),
    "Friday": (["Buttermilk Pancakes", "Blueberry Pancakes", "Corned Beef Hash"],
               ["Buttered Grits", "Grilled Turkey Sausage Links", "Scrambled Eggs", "Hash Brown Potatoes", "Boiled Eggs", BISC]),
    "Saturday": (["French Toast with Fresh Fruit Compote", "Cream of Wheat", "Pulled Pork Tacos", "Pulled Chicken Tacos"],
                 ["Crisp Pork Bacon", "Crisp Turkey Bacon", "Oven Roasted Breakfast Potatoes", "Scrambled Eggs", "Boiled Eggs",
                  "Chile Roasted Corn", "Roasted Vegetable Medley", "Steamed Broccoli", MPG, "Steamed Rice", "Candied Yams",
                  SGB, "Baby Carrots", "Buttered Corn", "Buttered Rolls", BISC]),
    "Sunday": (["Buttermilk Pancakes", "Southern Oatmeal with Brown Sugar", "Jerk Chicken", "BBQ Chicken", "Carved Turkey",
                "Carved Top Round"],
               ["Fresh Fruit Toppings", "Crisp Pork Bacon", "Crisp Turkey Bacon", "Scrambled Eggs", "Boiled Eggs", "Yellow Rice",
                "Steamed Broccoli", "Spinach", SGB, "Buttered Corn", "Buttered Rolls", BISC]),
})
day_menu(2, LAURENES, "Lunch", {
    "Monday": (["Teriyaki Glazed Chicken Breast", "Sweet and Sour Pork Tips"],
               ["Fried Rice", "Lo Mein Noodles", "Asian Roasted Vegetables", "Egg Rolls", "Fresh Steamed Broccoli", MPG,
                "Steamed Rice", "Candied Yams", "Black Eye Peas", SGB, "Peas and Carrots", "Buttered Corn", "Buttered Rolls"]),
    "Tuesday": (["Glazed Meatloaf", "Spaghetti with Meatballs"],
                ["Oven Roasted Potatoes", "Vegetable Medley", "Fresh Steamed Broccoli", MPG, "Steamed Rice",
                 "Mashed Sweet Potatoes", "Pinto Beans", SGB, "Baby Carrots", "Buttered Corn", "Buttered Rolls"]),
    "Wednesday": (["Southern Fried Chicken", "Herb Baked Chicken", "Spaghetti with Meat Sauce"],
                  ["Candied Yams", "Collard Greens", "Macaroni and Cheese", "Peas", MPG, SGB, "Buttered Corn", "Steamed Rice",
                   "Baby Carrots", "Buttered Rolls"]),
    "Thursday": (["Spice Rubbed Pork Loin", "Pulled BBQ Chicken"],
                 ["Cajun Rice", "Corn on the Cob", "Steamed Broccoli", "Roasted Cauliflower", MPG, "Steamed Rice", SGB,
                  "Candied Yams", "Peas", "Baby Carrots", "Buttered Rolls"]),
    "Friday": (["Southern Fried Fish", "Blackened Tilapia"],
               ["Hushpuppies", "Skillet Cabbage", "Spinach", "Macaroni and Cheese", MPG, "Mashed Sweet Potatoes",
                "Steamed Rice", SGB, "Buttered Corn", "Baby Carrots", "Buttered Rolls"]),
})
day_menu(2, LAURENES, "Dinner", {
    "Monday": (["Chicken Fried Steak with Gravy"],
               ["Creamy Garlic Mashed Potatoes", "Roasted Yellow Squash", "Buttered Baby Carrots", "Steamed Broccoli", MPG,
                "Steamed Rice", "Candied Yams", "Black Eye Peas", SGB, "Peas and Carrots", "Buttered Corn", "Buttered Rolls"]),
    "Tuesday": (["Chipotle Pork", "Chicken Cacciatore"],
                ["Cilantro Lime Rice", "Spicy Collard Greens", "Buttered Corn", "Steamed Broccoli", MPG, "Pinto Beans", SGB,
                 "Baby Carrots", "Buttered Rolls"]),
    "Wednesday": (["Grilled BBQ Pork Chops", "Swedish Meatballs"],
                  ["Scalloped Potatoes", "Chef's Vegetable Blend", "Roasted Green Beans", MPG, SGB, "Buttered Corn",
                   "Steamed Rice", "Baby Carrots", "Buttered Rolls"]),
    "Thursday": (["Chicken and Sausage Jambalaya"],
                 ["Red Beans and Rice", "Stewed Okra with Tomatoes", "Creamed Corn", "Steamed Broccoli", "Roasted Cauliflower",
                  MPG, "Steamed Rice", SGB, "Candied Yams", "Peas", "Baby Carrots", "Buttered Rolls"]),
    "Friday": (["BBQ Ribs", "Roasted Chicken"],
               ["Smokey Baked Beans", "Potato Salad", "Sautéed Green Beans", "Dirty Rice", SGB, "Macaroni and Cheese", MPG,
                "Mashed Sweet Potatoes", "Buttered Corn", "Baby Carrots", "Peas", "Buttered Rolls"]),
    "Saturday": (["Moroccan Chicken", "Chile Roasted Tilapia"],
                 ["Scallion Jasmine Rice", "Ginger Snow Peas", "Roasted Butternut Squash", MPG, "Steamed Rice", "Candied Yams",
                  SGB, "Baby Carrots", "Buttered Corn", "Buttered Rolls"]),
    "Sunday": (["Chicken Fried Chicken", "Baked Chicken"],
               ["Collard Greens", "Sweet Potato Casserole", "Macaroni and Cheese", MPG, "Spinach", "Buttered Corn",
                "Baby Carrots", SGB, "Buttered Rolls"]),
})
day_menu(2, ROOT, "Lunch", {
    "Monday": ([("Veggie Burger Burrito Bowl", ["Mixed Greens", "Brown Rice", "Black Beans", "Avocado", "Pico de Gallo", "Veggie Burger"])], []),
    "Tuesday": (["Roasted Vegetable Lettuce Wraps"], []),
    "Wednesday": (["Tofu Thai Curry Pasta", "Mushroom Risotto"], []),
    "Thursday": (["Vegetable Pad Thai", "Mushroom Risotto"], []),
    "Friday": (["Portobello with Couscous", "Broccoli Lemon Pasta"], []),
    "Saturday": (["Quinoa Stuffed Tomatoes", "Griddled Black Eye Pea Cakes"], []),
    "Sunday": (["Bean and Tofu Burrito", "Red Quinoa, Corn, and Tomatoes", "Braised Cabbage"], []),
}, ("vegetarian",))
ROOT_DINNER_W2 = {
    "Monday": (["Vegetable Portobello Shiitake Stir Fry with Broccoli and Peppers"], ["Steamed Rice"]),
    "Tuesday": (["Whole Grain Spaghetti with Marinara and Squash"], []),
    "Wednesday": (["Creole Eggplant", "Polenta Stuffed Peppers"], []),
    "Thursday": (["Vegetable Pho"], []),
    "Friday": (["Quinoa with Sundried Tomatoes and Zucchini"], []),
    "Saturday": (["Curried Vegetable Pot Pie"], []),
    "Sunday": (["Black Bean Spinach Enchilada", "Almond Orzo Pilaf"], []),
}
day_menu(2, ROOT, "Dinner", ROOT_DINNER_W2, ("vegetarian",))

# ================================================================== WEEKS 3 & 4 (shared pages)
BREAKFAST_W34 = {
    "Monday": (["Grilled Country Ham"],
               ["Buttered Grits", "Grilled Turkey Sausage Links", "Scrambled Eggs", "Boiled Eggs", "Hash Brown Potatoes", BISC]),
    "Tuesday": (["French Toast with Fresh Fruit Compote"],
                ["Grilled Pork Sausage Links", "Grilled Turkey Sausage Links", "Buttered Grits", "Scrambled Eggs",
                 "Breakfast Potatoes", "Boiled Eggs", BISC]),
    "Wednesday": (["Roasted Vegetable Strata"],
                  ["Buttered Grits", "Grilled Pork Sausage Patties", "Grilled Turkey Sausage Patties", "Breakfast Potatoes",
                   "Scrambled Eggs", "Boiled Eggs", BISC]),
    "Thursday": (["Buttermilk Pancakes", "Blueberry Pancakes", "Corned Beef Hash"],
                 ["Buttered Grits", "Grilled Turkey Sausage Links", "Scrambled Eggs", "Hash Brown Potatoes", "Boiled Eggs", BISC]),
    "Friday": (["Vegetable Quiche", "Southern Oatmeal with Brown Sugar"],
               ["Fresh Fruit Toppings", "Crisp Pork Bacon", "Crisp Turkey Bacon", "Scrambled Eggs", "Hash Brown Potatoes",
                "Boiled Eggs", BISC]),
    "Saturday": (["Buttermilk Pancakes", "Southern Oatmeal with Brown Sugar", "Rosemary Chicken", "Chicken and Spinach Pasta Casserole"],
                 ["Fresh Fruit Toppings", "Crisp Pork Bacon", "Crisp Turkey Bacon", "Scrambled Eggs", "Boiled Eggs",
                  "Basmati Rice", "Spanish Squash", "Steamed Broccoli", MPG, "Mashed Sweet Potatoes", "Navy Beans", SGB,
                  "Spinach", "Baby Carrots", "Buttered Rolls"]),
    "Sunday": (["French Toast with Fresh Fruit Compote", "Cream of Wheat", "Chicken Fried Steak", "Rotisserie Chicken with Gravy"],
               ["Crisp Pork Bacon", "Crisp Turkey Bacon", "Oven Roasted Breakfast Potatoes", "Scrambled Eggs", "Boiled Eggs",
                "Garlic Mashed Potatoes", "Roasted Cauliflower", "Steamed Broccoli", SGB, "Buttered Corn", "Candied Yams",
                "Black Eye Peas", "Baby Carrots", "Buttered Rolls"]),
}
LUNCH_W34_SHARED = {
    "Wednesday": (["Southern Fried Chicken", "Herb Baked Chicken", "Spaghetti with Meat Sauce"],
                  ["Candied Yams", "Collard Greens", "Roasted Vegetables", "Macaroni and Cheese", MPG, "Steamed Rice",
                   "Buttered Corn", "Baby Carrots", "Spinach", "Corn Bread"]),
    "Friday": (["Southern Fried Fish", "Blackened Tilapia"],
               ["Hushpuppies", "Skillet Cabbage", "Corn on the Cob", "Macaroni and Cheese", MPG, "Steamed Rice",
                "Mashed Sweet Potatoes", SGB, "Green Peas", "Spinach", "Baby Carrots", "Corn Bread Muffins"]),
}
TUE_SIDES_W34 = ["Rice Pilaf", "Green Peas", "Baby Carrots", "Roasted Cauliflower", SGB, "Spinach", "Steamed Rice",
                 "Mashed Sweet Potatoes", MPG, "Buttered Corn", "Buttered Rolls"]
LUNCH_W3 = {
    "Monday": (["Italian Beef Top Round", "Italian Chicken Breast"],
               ["Italian Rice", "Green Beans", "Vegetable Medley", "Spinach", "Black Eye Peas", "Candied Yams", "Baby Carrots",
                "Buttered Corn", "Steamed Rice", MPG, "Buttered Rolls"]),
    "Tuesday": (["Sage Roasted Turkey Breast", "Honey Roasted Pork Loin"], TUE_SIDES_W34),
    "Wednesday": LUNCH_W34_SHARED["Wednesday"],
    "Thursday": (["Thai Grilled Beef", "Sweet and Sour Chicken", "Chicken Fried Chicken"],
                 ["Lo Mein Noodles", "Asian Vegetable Blend", "Fried Egg Rolls", SGB, "Spinach", "Black Eye Peas",
                  "Candied Yams", "Buttered Corn", "Baby Carrots", MPG, "Green Peas", "Buttered Rolls"]),
    "Friday": LUNCH_W34_SHARED["Friday"],
}
LUNCH_W4 = {
    "Monday": (["Stewed Beef Tips over Rice", "Jerk Chicken"],
               ["Green Beans", "Vegetable Medley", "Spinach", "Black Eye Peas", "Candied Yams", "Baby Carrots", "Buttered Corn",
                "Steamed Rice", MPG, "Buttered Rolls"]),
    "Tuesday": (["Lasagna with Meat Marinara", "Honey Roasted Pork Loin"], TUE_SIDES_W34),
    "Wednesday": LUNCH_W34_SHARED["Wednesday"],
    "Thursday": (["Stuffed Pork Chops with Gravy", "Meatloaf with Roasted Tomato Sauce"],
                 [SGB, "Spinach", "Black Eye Peas", "Candied Yams", "Buttered Corn", "Baby Carrots", MPG, "Green Peas",
                  "Buttered Rolls"]),
    "Friday": LUNCH_W34_SHARED["Friday"],
}
DINNER_W34 = {
    "Monday": (["Beef Bulgogi Rice Bowl", "General Tso's Chicken"],
               ["Asian Blend Vegetables", "Fried Rice", "Egg Rolls", "Vegetable Medley", SGB, MPG, "Steamed Rice",
                "Black Eye Peas", "Candied Yams", "Baby Carrots", "Buttered Rolls"]),
    "Tuesday": (["Jamaican Jerk Chicken", "Salisbury Steak with Gravy"],
                ["Fried Plantains", "Red Beans with Rice", "Sautéed Broccoli", "Buttered Corn", "Baby Carrots",
                 "Roasted Cauliflower", "Spinach", SGB, "Steamed Rice", MPG, "Mashed Sweet Potatoes", "Buttered Rolls"]),
    "Wednesday": (["Shepherd's Pie", "Chicken Broccoli and Rice Casserole"],
                  ["Sautéed Squash with Onions", "Roasted Vegetables", "Collard Greens", SGB, MPG, "Candied Yams",
                   "Steamed Rice", "Buttered Corn", "Baby Carrots", "Green Peas", "Buttered Rolls"]),
    "Thursday": (["Blackened Tilapia", "Blackened Chicken Breast"],
                 ["Dirty Rice", "Steamed Broccoli", SGB, "Spinach", "Black Eye Peas", "Candied Yams", "Buttered Corn",
                  "Baby Carrots", MPG, "Green Peas", "Buttered Rolls"]),
    "Friday": (["BBQ Chicken", "BBQ Pork Chops"],
               ["Garlic Mashed Potatoes", "Peas with Carrots", "Corn on the Cob", "Macaroni and Cheese", "Steamed Rice",
                "Mashed Sweet Potatoes", SGB, "Green Peas", "Spinach", "Buttered Rolls"]),
    "Saturday": (["Sweet and Sour Chicken Breast", "Jerk Chicken"],
                 ["Coconut Rice", "Black Beans", "Roasted Vegetable Blend", "Spanish Squash", "Steamed Broccoli", MPG,
                  "Spinach", "Navy Beans", "Baby Carrots", "Buttered Rolls"]),
    "Sunday": (["Fried Chicken", "Baked Chicken"],
               ["Collard Greens", "Sweet Potato Casserole", "Macaroni and Cheese", "Green Peas", "Spinach", SGB, MPG,
                "Baby Carrots", "Corn Bread"]),
}
for w, lunch in ((3, LUNCH_W3), (4, LUNCH_W4)):
    day_menu(w, LAURENES, "Breakfast", BREAKFAST_W34)
    day_menu(w, LAURENES, "Lunch", lunch)
    day_menu(w, LAURENES, "Dinner", DINNER_W34)

day_menu(3, ROOT, "Lunch", {
    "Monday": ([("Roasted Vegetable Salad", ["Roasted Corn", "Roasted Peppers", "Roasted Tomatoes", "Roasted Mushrooms"])], []),
    "Tuesday": (["Bulgur Pilaf with Lentil Stew"], []),
    "Wednesday": (["Fresh Kale and Quinoa Salad", "Hummus with Pita Chips"], []),
    "Thursday": (["Roasted Vegetable Pad Thai"], []),
    "Friday": (["Spaghetti Squash with Basil and Parmesan"], []),
    "Saturday": (["Vegetarian Lasagna", "Lemon and Herb Sautéed Green Beans"], []),
    "Sunday": (["Vegetable Pasta Salad"], []),
}, ("vegetarian",))
day_menu(3, ROOT, "Dinner", {**ROOT_DINNER_W2, "Thursday": (["Kidney Bean Stew over Brown Rice"], [])}, ("vegetarian",))
day_menu(4, ROOT, "Lunch", {
    "Monday": (["Roasted Vegetable Pho"], []),
    "Tuesday": (["Roasted Vegetable Ramen"], []),
    "Wednesday": (["Tofu Thai Curry", "Mushroom Risotto"], []),
    "Thursday": (["Roasted Vegetable Pad Thai"], []),
    "Friday": (["Wild Mushroom Couscous"], []),
    "Saturday": (["Vegetarian Lasagna", "Lemon and Herb Sautéed Green Beans"], []),
    "Sunday": (["Thai Vegetable Lettuce Wraps"], []),
}, ("vegetarian",))
day_menu(4, ROOT, "Dinner", {**ROOT_DINNER_W2,
                             "Wednesday": (["Creole Eggplant over Brown Rice"], []),
                             "Thursday": (["Kidney Bean Stew over Brown Rice"], [])}, ("vegetarian",))

# Hearth & Ladle soups: Monday-Friday, lunch and dinner
for w in (1, 2, 3, 4):
    soups = SOUPS_W1 if w == 1 else SOUPS_W234
    for day, soup in zip(DAYS[:5], soups):
        for meal in ("Lunch", "Dinner"):
            add(w, day, meal, HEARTH, soup)

# ================================================================== EVERY-DAY STATIONS (same all 4 weeks)
BOTH = ("Lunch", "Dinner")

# Rise & Shine: breakfast basics, Monday-Sunday
for day, meal in (("Weekdays", "Breakfast"), ("Weekends", "Brunch")):
    for name, ing in [
        ("Assorted Muffins", []), ("Assorted Danishes", []), ("Assorted Bagels", []),
        ("Breakfast Breads for Toast", []), ("Assorted Cereals", []), ("Assorted Spreads", []),
        ("Milk", ["Whole Milk", "2% Milk", "Almond Milk"]),
        ("Whole Fruit or Fresh Cut Fruit", []),
        ("Build Your Own Waffle Bar", []),
    ]:
        add("*", day, meal, "Rise & Shine", name, ing)

# Fresh Off the Grill: breakfast, lunch, dinner
GRILL = "Fresh Off the Grill"
BURGER_TOPS = ["Sliced Tomatoes", "Shredded Lettuce", "Sliced Onions", "Sliced Pickles", "American Cheese",
               "Provolone Cheese", "White American Cheese", "Bacon", "Mushrooms", "Chili Sauce", "Cheese Sauce"]
GRILL_SAUCES = ["Smokehouse BBQ", "Honey Mustard", "Ranch", "Ketchup", "Mustard", "Mayonnaise", "Chipotle Mayonnaise"]
for day, meal in (("Weekdays", "Breakfast"), ("Weekends", "Brunch")):
    add("*", day, meal, GRILL, "Cooked to Order Omelets")
    add("*", day, meal, GRILL, "Pancakes and/or French Toast")
    add("*", day, meal, GRILL, "Texas Toast Breakfast Sandwich",
        ["Texas Toast", "Pork Sausage Patties", "Smoked Sausage Links", "Ham", "Scrambled Eggs with Cheese"])
for meal in BOTH:
    add("*", "Daily", meal, GRILL, "Grilled Hamburger",
        ["Hamburger Bun or Sesame Seed Bun", *BURGER_TOPS, *GRILL_SAUCES])
    add("*", "Daily", meal, GRILL, "Grilled Veggie Burger",
        ["Hamburger Bun or Sesame Seed Bun", *BURGER_TOPS, *GRILL_SAUCES], ["vegetarian"])
    add("*", "Daily", meal, GRILL, "Grilled Beef Hot Dog", ["Hot Dog Bun", "Chili Sauce", "Cheese Sauce", "Sliced Onions", "Ketchup", "Mustard"])
    for name, ing in [("Beef Philly Steak", ["Sub Roll", "Provolone Cheese", "Sliced Onions", "Mushrooms"]),
                      ("Chicken Philly Steak", ["Sub Roll", "Provolone Cheese", "Sliced Onions", "Mushrooms"]),
                      ("Chicken Tenders", GRILL_SAUCES), ("Chicken Nuggets", GRILL_SAUCES)]:
        add("*", "Daily", meal, GRILL, name, ing, ["rotating"])
    add("*", "Daily", meal, GRILL, "Fresh Cut Fries", [], ["side"])
    add("*", "Daily", meal, GRILL, "Onion Rings", [], ["side", "rotating"])
    add("*", "Daily", meal, GRILL, "Tater Tots", [], ["side", "rotating"])

# Sapori: pasta & pizza, lunch and dinner
for meal in BOTH:
    add("*", "Daily", meal, "Sapori", "Build Your Own Pasta",
        ["Penne", "Linguine", "Fettuccine", "Spaghetti", "Bowtie", "Cavatappi",
         "Pesto", "Alfredo", "Marinara",
         "Diced Chicken", "Salad Shrimp", "Diced Tofu", "Italian Sausage",
         "Fresh Spinach", "Broccoli", "Zucchini", "Squash", "Mushrooms", "Diced Tomatoes", "Diced Onions",
         "Red Peppers", "Yellow Peppers", "Green Peppers", "Green Peas", "Fresh Basil", "Minced Garlic",
         "Italian Seasoning", "Crushed Red Pepper", "Grated Parmesan"])
    add("*", "Daily", meal, "Sapori", "Pizza",
        ["Prepared Dough", "Marinara Sauce", "Mozzarella Cheese", "Sliced Pepperoni", "Pork Topping", "Beef Topping", "Diced Chicken"])

# Stix & Bowls: Asian stir fry, lunch and dinner
for meal in BOTH:
    add("*", "Daily", meal, "Stix & Bowls", "Build Your Own Stir Fry",
        ["Lo Mein Noodles", "Steamed Rice",
         "Teriyaki Sauce", "Sweet and Sour Sauce", "Hoisin Sauce", "Duck Sauce", "Soy Sauce",
         "Diced Chicken", "Salad Shrimp", "Diced Tofu", "Strip Steak",
         "Broccoli", "Zucchini", "Squash", "Mushrooms", "Onions", "Red Peppers", "Yellow Peppers", "Green Peppers",
         "Snow Peas", "Shredded Carrots", "Bamboo Shoots", "Water Chestnuts", "Fresh Ginger", "Minced Garlic",
         "Crushed Red Pepper"])
    add("*", "Daily", meal, "Stix & Bowls", "Fortune Cookies", [], ["side"])

# Stack'd: deli, lunch and dinner
for meal in BOTH:
    add("*", "Daily", meal, "Stack'd", "Build Your Own Sandwich or Wrap",
        ["High Crown White", "High Crown Wheat", "Sub Roll", "Kaiser Roll", "Spinach Wrap", "Wheat Wrap", "Flour Wrap", "Tomato Wrap",
         "Honey Ham", "Roast Turkey", "Bologna", "Pepperoni", "Tuna Salad", "Chicken Salad",
         "Sliced Tomatoes", "Romaine", "Shredded Lettuce", "Sliced Onions", "Sliced Pickles", "Sliced Olives", "Spinach",
         "American Cheese", "Provolone Cheese", "White American Cheese",
         "Honey Mustard", "Ranch", "Mustard", "Mayonnaise", "Chipotle Mayonnaise", "Oil", "Vinegar"])

# Crisp: salad bar, lunch and dinner
for meal in BOTH:
    add("*", "Daily", meal, "Crisp", "Build Your Own Salad",
        ["Iceberg Mix", "Mesclun Mix", "Spinach", "Romaine",
         "Sliced Tomatoes", "Broccoli", "Cauliflower", "Zucchini", "Squash", "Purple Onions", "Cucumbers", "Beets",
         "Olives", "Mushrooms", "Chickpeas", "Shredded Carrots", "Dried Cranberries", "Raisins", "Sunflower Seeds",
         "Cantaloupe", "Honeydew Melon", "Peaches", "Mandarin Oranges", "Black Beans", "Kidney Beans", "Bacon Bits", "Croutons",
         "Ranch", "Caesar", "Bleu Cheese", "Italian", "Balsamic Vinaigrette", "Oil", "Vinegar"])

# Sugar & Spice: desserts, lunch and dinner
for meal in BOTH:
    for name, ing in [
        ("Cakes", ["Yellow Cake with Chocolate Frosting", "Devil's Food Cake", "Vanilla Cake with Vanilla Frosting",
                   "Red Velvet Cake", "Strawberry Cake with Buttercream Frosting", "Butter Pound Cake"]),
        ("Pies", ["Pecan Pie", "Sweet Potato Pie", "Apple Pie", "Lemon Meringue Pie"]),
        ("Cookies", ["Oatmeal Raisin", "Chocolate Chip", "White Chocolate Macadamia Nut", "Sugar"]),
        ("Cobblers", ["Apple", "Blueberry", "Peach"]),
        ("Parfaits", ["Jell-O Parfait", "Banana Pudding Parfait"]),
    ]:
        add("*", "Daily", meal, "Sugar & Spice", name, ing)

header = """# BC Cafe menu - Perkins College Dining Hall 4-week menu cycle
# Generated by data/build_menu.py - edit that file, then re-run it.
# Week|Day|Meal|Station|Name|Calories|Ingredients|Tags
#   Week: 1-4 or * (every week)   Day: Monday..Sunday, Daily, Weekdays, Weekends
#   Calories: blank = not listed  Tags: side, rotating, vegetarian
"""
OUT.write_text(header + "\n".join(lines) + "\n", encoding="utf-8")
print(f"wrote {len(lines)} lines to {OUT}")
