# Clear cache reload

npx expo start -c

# Fresh Expo App Steps

# Setup expo in current directory

npx create-expo-app@latest .

# Nativewind

npm install nativewind
npm install --save-dev tailwindcss@3.3.2

# Create tailwind css config file (tailwind.config.js)

npx tailwindcss init

# Setup paths inside (tailwind.config.js) with the following:

// tailwind.config.js

module.exports = {

content: ["./App.{js,jsx,ts,tsx}", "./<custom directory>/**/*.{js,jsx,ts,tsx}"],
theme: {
extend: {},
},
plugins: [],
}

# Change tailwind config content to target correct directories e.g (add more directories as required):

content: ["./app.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],

# Add babel plugin to babel.config.js:

// babel.config.js
module.exports = function (api) {
api.cache(true);
return {
presets: ["babel-preset-expo"],
plugins: ["nativewind/babel"],
};
};

# Setup typescript with nativewind:

# Create file nativewind-env.d.ts in root directory add:

/// <reference types="nativewind/types" />

# ESLint and Prettier:

npx expo lint

npx expo install -- --save-dev prettier eslint-config-prettier eslint-plugin-prettier

# To integrate Prettier with ESlint, update your .eslintrc.js:

module.exports = {
extends: ['expo', 'prettier'],
plugins: ['prettier'],
rules: {
'prettier/prettier': 'error',
},
};

# Main setup is done

# Extras:

# Wrapper which detects device and avoids going out of bounds

npm install react-native-safe-area-context
import { SafeAreaView } from 'react-native-safe-area-context'
