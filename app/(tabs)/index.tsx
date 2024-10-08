import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';

const SlidePicker = () => {
  // Notes for biometric Auth:
  // Add NSFaceIDUsageDescription into app.json:
  //  "ios": {
  //       "supportsTablet": true,
  //       "infoPlist": {
  //         "NSFaceIDUsageDescription": "This app uses Face ID to allow easy and secure login."
  //       }
  //  },

  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [storedEmail, setStoredEmail] = useState<string | null>(null);

  const fallBackToDefaultAuth = () => {
    console.log('Fall back to password authentication');
  };

  const alertComponent = (
    title: string,
    message: string,
    btnText: string,
    btnFunc: () => void
  ) => {
    return Alert.alert(title, message, [
      {
        text: btnText,
        onPress: btnFunc,
      },
    ]);
  };

  const TwoButtonAlert = (email: string) => {
    Alert.alert('You are logged in', `Logged in as: ${email}`, [
      {
        text: 'Back',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'PROCEED', onPress: () => console.log('Ok Pressed') },
    ]);
  };

  // Biometric Authentication handler
  const handleBiometricAuth = async () => {
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
    console.log('Biometric availability:', isBiometricAvailable);
    if (!isBiometricAvailable) {
      return alertComponent(
        'Biometric Auth not supported',
        'Please enter your password',
        'OK',
        () => fallBackToDefaultAuth()
      );
    }

    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    console.log('Biometrics are enrolled:', savedBiometrics);
    if (!savedBiometrics) {
      return alertComponent(
        'No Biometric record found',
        'Please login with your password',
        'OK',
        () => fallBackToDefaultAuth()
      );
    }

    console.log('Email found:', storedEmail);

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login to Audiesafe app with biometrics',
      cancelLabel: 'Cancel',
      disableDeviceFallback: true,
    });

    console.log('Biometric Auth Result:', biometricAuth);

    if (biometricAuth.success) {
      if (storedEmail) {
        TwoButtonAlert(storedEmail);
      } else {
        alertComponent(
          'No Email Found',
          'Please log in manually to save your email',
          'OK',
          () => fallBackToDefaultAuth()
        );
      }
    } else {
      alertComponent(
        'Biometric authentication failed',
        'Please try again or use password login.',
        'OK',
        () => fallBackToDefaultAuth()
      );
    }
  };

  // Fetch email from AsyncStorage on component mount
  useEffect(() => {
    const checkEmailInStorage = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (email) {
          setStoredEmail(email);
        } else {
          console.log('No email found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching email from AsyncStorage:', error);
      }
    };

    const checkBiometricCompatability = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    };

    checkEmailInStorage();
    checkBiometricCompatability();
  }, []);

  // Save email manually (for testing)
  useEffect(() => {
    const saveEmailToStorage = async () => {
      const email = 'leslie.leung@audiebant.co.uk';
      try {
        await AsyncStorage.setItem('userEmail', email);
        console.log('Email saved:', email);
      } catch (error) {
        console.error('Error saving email to AsyncStorage:', error);
      }
    };

    if (!storedEmail) {
      saveEmailToStorage();
    }
  }, [storedEmail]);

  return (
    <SafeAreaView className='flex-1'>
      <View className='items-center justify-center flex-1 gap-4'>
        <Text>Welcome</Text>
        <View className='flex-row gap-2'>
          <TouchableOpacity className='bg-black/60 items-center justify-center p-4 rounded-lg'>
            <Text className='text-white'>Login with Password</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBiometricAuth}>
            <Entypo name='fingerprint' size={50} color='black' />
          </TouchableOpacity>
        </View>

        <Text>
          {isBiometricSupported
            ? 'Your device is compatible with biometrics'
            : 'Face or Fingerprint scanner is available on this device'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SlidePicker;

// GPS

// expo install expo-location

// {
//   "expo": {
//     "name": "your-app-name",
//     "slug": "your-app-slug",
//     "ios": {
//       "infoPlist": {
//         "NSLocationWhenInUseUsageDescription": "This app needs access to your location to send your distress signal to the university security team."
//       }
//     },
//     "android": {
//       "permissions": [
//         "ACCESS_FINE_LOCATION"
//       ]
//     }
//   }
// }
// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import * as Location from 'expo-location';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const DistressButton = () => {
//   const [location, setLocation] = useState<Location.LocationObject | null>(null);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);
//   const [storedEmail, setStoredEmail] = useState<string | null>(null);

//   // Request location permissions when the app starts
//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setErrorMsg('Permission to access location was denied');
//         return;
//       }

//       // Fetch the user's location
//       let currentLocation = await Location.getCurrentPositionAsync({});
//       setLocation(currentLocation);
//     })();

//     // Fetch stored email from AsyncStorage
//     const fetchEmail = async () => {
//       const email = await AsyncStorage.getItem('userEmail');
//       setStoredEmail(email);
//     };

//     fetchEmail();
//   }, []);

//   // Handle sending distress signal
//   const sendDistressSignal = async () => {
//     if (!location) {
//       Alert.alert('Location not available', 'Unable to get your location.');
//       return;
//     }

//     const distressData = {
//       email: storedEmail || 'Unknown user',
//       latitude: location.coords.latitude,
//       longitude: location.coords.longitude,
//       timestamp: new Date().toISOString(),
//     };

//     console.log('Distress data:', distressData);

//     // You can either send the distress data via:
//     // 1. Email using a third-party service (e.g., SendGrid, SMTP)
//     // 2. A POST request to your university's security system if they have an API
//     // Example:
//     // fetch('https://university-security-api.com/alert', {
//     //   method: 'POST',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify(distressData),
//     // });

//     Alert.alert('Distress Signal Sent', `Your location and details were sent to university security.`);
//   };

//   return (
//     <SafeAreaView className='flex-1'>
//       <View className='items-center justify-center flex-1 gap-4'>
//         <Text>Your Location: {errorMsg || `${location?.coords.latitude}, ${location?.coords.longitude}`}</Text>

//         <TouchableOpacity
//           onPress={sendDistressSignal}
//           className='bg-red-500 items-center justify-center p-4 rounded-lg'
//         >
//           <Text className='text-white'>Send Distress Signal</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default DistressButton;

// @Override
// public void onMessageReceived(RemoteMessage remoteMessage) {
//   if (remoteMessage.getData().size() > 0) {
//     Log.d(TAG, "Message data payload: " + remoteMessage.getData());

//     // Check if message contains a notification payload.
//     if (remoteMessage.getNotification() != null) {
//       Log.d(TAG, "Message Notification Body: " + remoteMessage.getNotification().getBody());
//     }
//   }
// }

// How to Use It:
// Integrating FCM in Your Android App:

// First, ensure you have Firebase integrated into your Android project. You need to include the Firebase Cloud Messaging SDK in your project:

// Add Firebase dependencies to your build.gradle:

// implementation 'com.google.firebase:firebase-messaging:23.0.0'
// Set up Firebase in your app by creating a google-services.json file and placing it in your app directory.

// Modifying Your FirebaseMessagingService:

// In your app, create or extend the FirebaseMessagingService class to handle the messages. The onMessageReceived method is part of this service.

// Implement the code like this:

// java
// Copy code
// import android.util.Log;
// import com.google.firebase.messaging.FirebaseMessagingService;
// import com.google.firebase.messaging.RemoteMessage;

// public class MyFirebaseMessagingService extends FirebaseMessagingService {

//     private static final String TAG = "MyFirebaseMsgService";

//     @Override
//     public void onMessageReceived(RemoteMessage remoteMessage) {
//         // Check if message contains a data payload.
//         if (remoteMessage.getData().size() > 0) {
//             Log.d(TAG, "Message data payload: " + remoteMessage.getData());
//             // Process the custom data payload here.
//         }

//         // Check if message contains a notification payload.
//         if (remoteMessage.getNotification() != null) {
//             Log.d(TAG, "Message Notification Body: " + remoteMessage.getNotification().getBody());
//             // Show or handle the notification.
//         }
//     }
// }
// Processing Notifications:

// When a message with data is received, the data is logged. You can use this data in your app to trigger certain actions, such as navigating to a specific screen or processing background tasks.
// If there’s a notification payload, you can show the notification in a custom way or handle its content (like displaying the notification body).
// Registering the Service:

// You must register the FirebaseMessagingService in your AndroidManifest.xml:

// xml
// Copy code
// <service
//     android:name=".MyFirebaseMessagingService"
//     android:exported="true">
//     <intent-filter>
//         <action android:name="com.google.firebase.MESSAGING_EVENT" />
//     </intent-filter>
// </service>
// Receiving Notifications:

// The code in onMessageReceived will now be triggered whenever your app receives a push notification (data or notification payload) from Firebase Cloud Messaging.
// Debugging:

// Use Log.d(TAG, ...) for debugging by checking the logcat to see the payload data and notification body when a message is received.
// Example Usage:
// You can modify this to perform actions based on the data received. For example, if a notification contains a specific action (e.g., alertType: emergency), you could display an alert to the user.

// java
// Copy code
// if (remoteMessage.getData().containsKey("alertType") && remoteMessage.getData().get("alertType").equals("emergency")) {
//     // Trigger an emergency alert
// }
// This code allows you to customize how your app handles push notifications, especially when it comes to handling data payloads or showing notifications when the app is open or in the background.

// https://www.youtube.com/watch?v=2PVO__A9Xx0

// async function createNotificationChannel() {
//   if (Device.isDevice) {
//     await Notifications.setNotificationChannelAsync('high_priority', {
//       name: 'High Priority Notifications',
//       importance: Notifications.AndroidImportance.MAX,
//       sound: 'default', // Use default sound
//       vibrationPattern: [0, 500, 1000, 500], // Custom vibration pattern
//       lightColor: '#FF0000', // Red light
//       description: 'Notifications that require immediate attention',
//       showBadge: true, // Show badge on app icon
//       lockscreenVisibility: Notifications.AndroidVisibility.PUBLIC, // Visible on lock screen
//     });
//   }
// }
