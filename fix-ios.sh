#!/bin/bash

echo "🧹 Cleaning old caches..."
watchman watch-del-all || true
rm -rf node_modules
rm -rf /tmp/metro-*
rm -rf ios/Pods ios/Podfile.lock ios/build
rm -rf ~/Library/Developer/Xcode/DerivedData/*

echo "📦 Installing Node modules..."
npm install

echo "📦 Installing CocoaPods..."
cd ios
pod deintegrate
pod install --repo-update
cd ..

echo "✅ Clean complete! Now open Xcode and build:"
echo "open ios/RentEasy.xcworkspace"
echo "Then do: Product → Clean Build Folder (Shift + Cmd + K) and Run (Cmd + R)"
