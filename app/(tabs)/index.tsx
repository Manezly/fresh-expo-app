import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { height } = Dimensions.get('window'); // Get the device height

const SlidePicker = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current; // Start off-screen (bottom)

  // Function to slide in the picker
  const slideIn = () => {
    setModalVisible(true); // Open modal
    Animated.timing(slideAnim, {
      toValue: height * 0.5, // Move to 50% of the screen height (adjustable)
      duration: 300, // Slide-in duration
      useNativeDriver: false, // Set to false to use height animations
    }).start();
  };

  // Function to slide out and close the picker
  const slideOut = () => {
    Animated.timing(slideAnim, {
      toValue: height, // Move back off-screen
      duration: 300, // Slide-out duration
      useNativeDriver: false,
    }).start(() => setModalVisible(false)); // Close modal after animation
  };

  return (
    <View style={styles.container}>
      <Button title='Open Picker' onPress={slideIn} />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType='none' // Custom animation handled by Animated API
        onRequestClose={slideOut}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={slideOut}>
          {/* This is the area outside the picker */}
        </TouchableOpacity>

        <Animated.View style={[styles.pickerContainer, { top: slideAnim }]}>
          <View style={styles.pickerContent}>
            <Text style={styles.pickerTitle}>Select an Option</Text>

            {/* Picker or any other content */}
            <TouchableOpacity onPress={slideOut}>
              <Text style={styles.optionText}>Option 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={slideOut}>
              <Text style={styles.optionText}>Option 2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={slideOut}>
              <Text style={styles.optionText}>Option 3</Text>
            </TouchableOpacity>

            <Button title='Close' onPress={slideOut} />
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darken the background
  },
  pickerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: height * 0.5, // 50% of the screen height (adjustable)
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
    padding: 10,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
});

export default SlidePicker;
