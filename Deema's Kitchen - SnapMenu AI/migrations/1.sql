
CREATE TABLE recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  photo_url TEXT,
  ingredients TEXT,
  recipe_title TEXT,
  recipe_description TEXT,
  cooking_time TEXT,
  difficulty TEXT,
  dietary_tags TEXT,
  instructions TEXT,
  dish_image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recipes_created_at ON recipes(created_at);
