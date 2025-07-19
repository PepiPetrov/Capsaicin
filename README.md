# 🌶️ Capsaicin - Recipe Management App

A modern, feature-rich recipe management application built with Tauri, React, and TypeScript. Organize, create, and plan your culinary adventures with an intuitive interface and powerful features.

## ✨ Current Features

### 📝 Recipe Management

- **Create & Edit Recipes**: Multi-step form with comprehensive recipe details
- **Rich Text Editor**: Format cooking instructions with TipTap editor
- **Image Upload**: Add recipe photos with drag-and-drop or paste support
- **Recipe Categories**: Organize recipes with custom categories
- **Rating System**: Rate recipes from 1-5 stars
- **Favorite Recipes**: Mark and filter favorite recipes
- **Recipe Scaling**: Automatically adjust ingredient quantities for different serving sizes

### 🔍 Search & Discovery

- **Advanced Search**: Filter recipes by multiple criteria
- **Smart Filtering**: Filter by name, category, rating, prep time, cook time, and more
- **Sorting Options**: Sort by any recipe attribute (ascending/descending)
- **Boolean Filters**: Filter favorites and other boolean properties

### 📊 Recipe Details

- **Comprehensive Information**: Name, category, prep/cook time, servings
- **Ingredients List**: Quantity, unit, and ingredient details with scaling
- **Step-by-step Instructions**: Numbered directions with rich text formatting
- **Equipment List**: Required cooking equipment with checkboxes
- **Nutrition Information**: Calories, fat, carbs, and protein per serving
- **Interactive Scaling**: Real-time ingredient quantity adjustment

### 📅 Meal Planning

- **Calendar Integration**: Visual calendar for meal planning
- **Daily Meal Plans**: Assign breakfast, lunch, and dinner for any date
- **Quick Navigation**: Jump directly to planned recipes
- **Flexible Planning**: Easy meal assignment and modification

### 📥 Import & Export

- **URL Import**: Import recipes directly from recipe websites
- **Batch Import**: Import multiple recipes at once
- **Auto-parsing**: Automatically extract recipe data from URLs

### 🎨 User Experience

- **Dark/Light Theme**: System-aware theme switching
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with Radix UI components
- **Type Safety**: Full TypeScript implementation for reliability

### 🗄️ Data Management

- **Local Database**: SQLite database for offline functionality
- **CRUD Operations**: Full create, read, update, delete capabilities
- **Data Integrity**: Robust validation and error handling

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: Tauri (Rust)
- **Database**: SQLite (via Tauri SQL plugin)
- **UI Components**: Radix UI + Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Rich Text**: TipTap editor
- **Icons**: Lucide React
- **Routing**: Wouter

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Rust (latest stable)
- Tauri CLI

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/PepiPetrov/Capsaicin.git
   cd Capsaicin
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run in development mode:

   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📋 TODO: Planned Features

### 🎯 High Priority

- [ ] **Recipe Collections/Cookbooks**: Group recipes into custom collections
- [ ] **Timer Integration**: Built-in cooking timers for recipe steps
- [ ] **Enhanced Search**: Ingredient-based search ("Find recipes with chicken and rice")
- [ ] **Recipe Export/Sharing**: Export recipes as PDF, images, or shareable links
- [ ] **Step-by-step Cooking Mode**: Full-screen cooking interface with large text

### 🎨 User Experience

- [ ] **Voice Commands**: Read recipes aloud or navigate hands-free
- [ ] **Unit Converter**: Convert between metric/imperial measurements
- [ ] **Recipe Notes**: Personal notes and modifications
- [ ] **Image Gallery**: Multiple images per recipe (process shots, final result)
- [ ] **Recipe Difficulty Ratings**: Easy, Medium, Hard classifications
- [ ] **Kitchen Display Mode**: Keep screen on while cooking

### 📦 Inventory & Shopping

- [ ] **Pantry Management**: Track ingredients you have at home
- [ ] **Shopping List Generator**: Auto-create shopping lists from selected recipes
- [ ] **Expiration Date Tracking**: Monitor ingredient freshness
- [ ] **Recipe Suggestions Based on Inventory**: Recommend recipes using available ingredients

### 🤝 Social & Sharing

- [ ] **Recipe Reviews & Comments**: Rate and comment on recipes
- [ ] **Recipe Exchange**: Import/export recipe collections
- [ ] **Print Formatting**: Clean, printer-friendly recipe layouts

### 📈 Advanced Meal Planning

- [ ] **Weekly/Monthly Meal Plans**: Extended planning beyond daily
- [ ] **Nutritional Goal Tracking**: Set and monitor daily nutrition targets
- [ ] **Meal Prep Suggestions**: Recipes suitable for batch cooking
- [ ] **Grocery Budget Estimation**: Estimate costs for meal plans

### 📊 Analytics & Insights

- [ ] **Recipe Statistics**: Most cooked, highest rated, cooking frequency
- [ ] **Nutritional Analytics**: Track nutritional intake over time
- [ ] **Cooking History**: Log when recipes were made with notes
- [ ] **Data Export/Backup**: Full data export for backup or migration

### 🔗 Integrations

- [ ] **Barcode Scanner**: Scan products to add to pantry
- [ ] **YouTube Recipe Import**: Extract recipes from cooking videos
- [ ] **Restaurant Menu Import**: Import favorite restaurant dishes to recreate
- [ ] **Google Assistant/Siri Integration**: Voice control for cooking

### 🏷️ Enhanced Organization

- [ ] **Advanced Tagging System**: Tags like "quick", "vegetarian", "gluten-free"
- [ ] **Recipe Recommendations**: Suggest recipes based on cooking history
- [ ] **Recently Viewed**: Track and display recently accessed recipes
- [ ] **Dietary Filters**: Vegan, keto, paleo, etc.
- [ ] **Cooking Method Filters**: Baking, grilling, slow cooker, etc.
- [ ] **Seasonal Suggestions**: Recipes based on current season/weather

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Built with modern web technologies and a focus on user experience. Special thanks to the Tauri, React, and open-source communities.
