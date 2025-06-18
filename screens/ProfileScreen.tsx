import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Switch,
  StatusBar,
} from 'react-native';
import { Icons } from '../utils/icons';

const ProfileScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('John Doe');
  const [email] = useState('john@example.com');
  const [notificationPreferences, setNotificationPreferences] = useState({
    inApp: true,
    email: true,
    orderUpdates: true,
    marketing: false,
  });

  const handleSave = () => {
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {
          Alert.alert('Signed Out', 'You have been signed out');
        }},
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>{Icons.user}</Text>
          </View>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={email}
              editable={false}
            />
            <Text style={styles.helperText}>
              Email address cannot be changed
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>

          <View style={styles.preferenceItem}>
            <View>
              <Text style={styles.preferenceTitle}>In-App Notifications</Text>
              <Text style={styles.preferenceDescription}>
                Receive notifications within the app
              </Text>
            </View>
            <Switch
              value={notificationPreferences.inApp}
              onValueChange={(value) =>
                setNotificationPreferences({ ...notificationPreferences, inApp: value })
              }
              trackColor={{ false: '#333', true: '#00EEFF' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.preferenceItem}>
            <View>
              <Text style={styles.preferenceTitle}>Email Notifications</Text>
              <Text style={styles.preferenceDescription}>
                Receive notifications via email
              </Text>
            </View>
            <Switch
              value={notificationPreferences.email}
              onValueChange={(value) =>
                setNotificationPreferences({ ...notificationPreferences, email: value })
              }
              trackColor={{ false: '#333', true: '#00EEFF' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutIcon}>{Icons.logOut}</Text>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingTop: 60,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1A1A28',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarIcon: {
    fontSize: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1A1A28',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
  inputDisabled: {
    opacity: 0.7,
  },
  helperText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.5,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#00EEFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  preferenceTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A28',
    borderRadius: 12,
    padding: 16,
  },
  signOutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
