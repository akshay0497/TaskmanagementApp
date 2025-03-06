---

# Grocery App

This is a grocery shopping application built using React Native. The app allows users to view, create, and manage grocery items in an intuitive interface. This repository contains the source code for both Android and iOS platforms. 

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Clone the repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Run the App](#run-the-app)
- [Directory Structure](#directory-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Grocery App provides users with a seamless experience in managing grocery items. It has the following functionalities:

- **View All Items**: A screen to view all grocery items available in the app.
- **Create New Item**: A screen to create new grocery items and add them to the list.
- **Home Screen**: The main landing screen providing navigation to other screens.

The app is built using modern tools and frameworks like React Native, TypeScript, and Jest for testing.

## Features

- **Cross-Platform**: Available for both Android and iOS.
- **User-Friendly Interface**: Easy to navigate with clear sections for managing grocery items.
- **Testing**: Unit and integration tests using Jest.
- **Customizable Styles**: Styled with the flexibility to adapt to different screen sizes and orientations.

## Technologies Used

- **React Native**: Framework for building the app.
- **TypeScript**: For better type safety and development experience.
- **Jest**: For unit testing.
- **React Navigation**: For navigating between different screens.
- **ESLint & Prettier**: For code linting and formatting.
- **Gradle & CocoaPods**: For dependency management in Android and iOS.
- **Xcode & Android Studio**: For building and running the application.

## Installation

To run the app locally, follow the steps below.

### Prerequisites

- Node.js (version 14 or higher)
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)
- Watchman (macOS only)

### Clone the Repository

Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/your-username/akshay0497-grocery-app.git
cd akshay0497-grocery-app
```

### Install Dependencies

Run the following commands to install the required dependencies for both Android and iOS:

1. **Install Node modules**:

```bash
npm install
```

2. **Install iOS dependencies** (for macOS users only):

```bash
cd ios
pod install
cd ..
```

### Run the App

To run the app on an Android or iOS emulator or connected device, use the following commands:

- **For Android**:

```bash
npx react-native run-android
```

- **For iOS** (macOS only):

```bash
npx react-native run-ios
```

## Directory Structure

The directory structure is organized as follows:

```
akshay0497-grocery-app/
│
├── README.md                 
├── App.tsx                   
├── Gemfile                   
├── app.json                  
├── babel.config.js           
├── global.d.ts               
├── index.js                  
├── jest.config.js            
├── metro.config.js           
├── package.json              
├── tsconfig.json             
├── .eslintrc.js              
├── .prettierrc.js            
├── .watchmanconfig           
│
├── __tests__/                
│   └── App.test.tsx          
│
├── android/                  
│   ├── gradle.properties     
│   ├── gradlew               
│   ├── gradlew.bat           
│   ├── app/                  
│   │   ├── src/              
│   │   │   ├── debug/        
│   │   │   └── main/         
│   │   └── res/              
│   └── gradle/               
│
├── ios/                    
│   ├── Podfile               
│   ├── QuickTeck/            
│   ├── QuickTeck.xcodeproj/  
│   └── QuickTeckTests/
│
└── src/                      
    ├── screens/              
    │   ├── AllItemsScreen.jsx   
    │   ├── CreateItemsScreen.jsx 
    │   └── HomeScreen.jsx    
    └── utils/                 
        └── data.jsx           
```

## Contributing

We welcome contributions to the Grocery App! If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
