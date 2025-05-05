// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_sql::{Migration, MigrationKind};

fn main() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_recipe_table",
            sql: "CREATE TABLE IF NOT EXISTS recipes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                title_image TEXT NOT NULL,
                rating INTEGER,
                favorite BOOLEAN DEFAULT 0,
                category TEXT,
                prep_time INTEGER,
                cook_time INTEGER,
                servings INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_ingredients_table",
            sql: "CREATE TABLE ingredients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                recipe_id INTEGER,
                ingredient TEXT NOT NULL,
                quantity NUMERIC,  -- Include quantity
                unit TEXT,  -- Unit of measurement
                FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_equipment_table",
            sql: "CREATE TABLE equipment (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                recipe_id INTEGER,
                equipment TEXT NOT NULL,
                FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create_directions_table",
            sql: "CREATE TABLE directions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                recipe_id INTEGER,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "create_nutrition_table",
            sql: "CREATE TABLE nutrition (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                recipe_id INTEGER,
                calories NUMERIC,
                fat NUMERIC,
                carbs NUMERIC,
                protein NUMERIC,
                FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 6,
            description: "add daily plan entry",
            sql: "CREATE TABLE daily_meal_plan (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                day DATE UNIQUE NOT NULL,
                breakfast_id INTEGER REFERENCES recipes(id) ON DELETE SET NULL,
                lunch_id INTEGER REFERENCES recipes(id) ON DELETE SET NULL,
                dinner_id INTEGER REFERENCES recipes(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );",
            kind: MigrationKind::Up,
        },
    ];

    // .setup(|app| {
    //     if cfg!(debug_assertions) {
    //         app.handle().plugin(
    //             tauri_plugin_log::Builder::default()
    //                 .level(log::LevelFilter::Info)
    //                 .build(),
    //         )?;
    //     }
    //     let _ = app.handle().plugin(
    //         tauri_plugin_sql::Builder::default()
    //             .add_migrations("sqlite:capsaicin.db", migrations)
    //             .build(),
    //     );
    //     Ok(())
    // })
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:capsaicin.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
