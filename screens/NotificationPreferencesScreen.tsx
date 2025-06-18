
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { notificationStore } from '../stores/notificationStore';
import { supabase } from '../lib/supabase';
import { colors } from '../theme/colors';
import { showMessage } from 'react-native-flash-message';

const NotificationPreferencesScreen = () => {
  const navigation = useNavigation();
  const [preferences, setPreferences] = useState({
    in_app: true,
    email: true,
    push: true,
    order_updates: true,
    payment_updates: true,
    editor_assignments: true,
    marketing: false,
    custom_sound: 'default',
    silent_mode: false,
    silent_start: new Date(),
    silent_end: new Date(new Date().setHours(new Date().getHours() + 8)),
    group_by_property: true,
    interactive_actions: true,
  });
  
  const [loading, setLoading] = useState(true);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  const notificationSounds = [
    { label: 'Default', value: 'default' },
    { label: 'Chime', value: 'chime' },
    { label: 'Bell', value: 'bell' },
    { label: 'Digital', value: 'digital' },
    { label: 'Subtle', value: 'subtle' },
    { label: 'None', value: 'none' },
  ];
  
  useEffect(() => {
    fetchPreferences();
  }, []);
  
  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        // Convert time strings to Date objects
        const updatedPrefs = {
          ...data,
          silent_start: data.silent_start ? new Date(data.silent_start) : new Date(),
          silent_end: data.silent_end ? new Date(data.silent_end) : new Date(new Date().setHours(new Date().getHours() + 8)),
        };
        setPreferences(updatedPrefs);
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      showMessage({
        message: 'Failed to load preferences',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const savePreferences = async () => {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          ...preferences,
          // Convert Date objects to ISO strings for database
          silent_start: preferences.silent_start.toISOString(),
          silent_end: preferences.silent_end.toISOString(),
          updated_at: new Date().toISOString(),
        });
        
      if (error) throw error;
      
      showMessage({
        message: 'Preferences saved successfully',
        type: 'success',
      });
      
      // Update the notification store
      notificationStore.getState().updatePreferences(preferences);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      showMessage({
        message: 'Failed to save preferences',
        type: 'danger',
      });
    }
  };
  
  const toggleSwitch = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  const formatTimeString = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleStartTimeChange = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setPreferences(prev => ({
        ...prev,
        silent_start: selectedDate,
      }));
    }
  };
  
  const handleEndTimeChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setPreferences(prev => ({
        ...prev,
        silent_end: selectedDate,
      }));
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Preferences</Text>
        <TouchableOpacity onPress={savePreferences} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Channels</Text>
          <View style={styles.option}>
            <Text style={styles.optionText}>In-App Notifications</Text>
            <Switch
              value={preferences.in_app}
              onValueChange={() => toggleSwitch('in_app')}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={preferences.in_app ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.option}>
            <Text style={styles.optionText}>Email Notifications</Text>
            <Switch
              value={preferences.email}
              onValueChange={() => toggleSwitch('email')}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={preferences.email ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.option}>
            <Text style={styles.optionText}>Push Notifications</Text>
            <Switch
              value={preferences.push}
              onValueChange={() => toggleSwitch('push')}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={preferences.push ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          <View style={styles.option}>
            <Text style={styles.optionText}>Order Updates</Text>
            <Switch
              value={preferences.order_updates}
              onValueChange={() => toggleSwitch('order_updates')}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={preferences.order_updates ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.option}>
            <Text style={styles.optionText}>Payment Updates</Text>
            <Switch
              value={preferences.payment_updates}
              onValueChange={() => toggleSwitch('payment_updates')}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={preferences.payment_updates ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.option}>
            <Text style={styles.optionText}>Editor Assignments</Text>
            <Switch
              value={preferences.editor_assignments}
              onValueChange={() => toggleSwitch('editor_assignments')}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={preferences.editor_assignments ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.option}>
            <Text style={styles.optionText}>Marketing & Promos</Text>
            <Switch
              value={preferences.marketing}
              onValueChange={() => toggleSwitch('marketing')}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={preferences.marketing ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Sound</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={preferences.custom_sound}
              style={styles.picker}
              dropdownIconColor="#fff"
              onValueChange={(itemValue) => 
                setPreferences(prev => ({ ...prev, custom_sound: itemValue }))
              }
            >
              {notificationSounds.map((sound) => (
                <Picker.Item key={sound.value} label={sound.label} value={sound.value} />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Silent Hours</Text>
          <View style={styles.option}>
            <Text style={styles.optionText}>Enable Silent Mode</Text>
            <Switch
              value={preferences.silent_mode}
              onValueChange={() => toggleSwitch('silent_mode')}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={preferences.silent_mode ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          {preferences.silent_mode && (
            <>
              <View style={styles.timePickerRow}>
                <Text style={styles.optionText}>Start Time:</Text>
                <TouchableOpacity 
                  style={styles.timeButton}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text style={styles.timeButtonText}>
                    {formatTimeString(preferences.silent_start)}
                  </Text>
                </TouchableOpacity>
                
                {showStartPicker && (
                  <DateTimePicker
                    value={preferences.silent_start}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={handleStartTimeChange}
                  />
                )}
              </View>
              
              <View style={styles.timePickerRow}>
                <Text style={styles.optionText}>End Time:</Text>
                <TouchableOpacity 
                  style={styles.timeButton}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text style={styles.timeButtonText}>
                    {formatTimeString(preferences.silent_end)}
                  </Text>
                </TouchableOpacity>
                
                {showEndPicker && (
                  <DateTimePicker
                    value={preferences.silent_end}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={handleEndTimeChange}
                  />
                )}
              </View>
            </>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced Settings</Text>
          <View style={styles.option}>
            <Text style={styles.optionText}>Group by Property/Job</Text>
            <Switch
              value={preferences.group_by_property}
              onValueChange={() => toggleSwitch('group_by_property')}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={preferences.group_by_property ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.option}>
            <Text style={styles.optionText}>Interactive Actions</Text>
            <Switch
              value={preferences.interactive_actions}
              onValueChange={() => toggleSwitch('interactive_actions')}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={preferences.interactive_actions ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
        
        <View style={styles.infoBox}>
          <Icon name="info" size={20} color={colors.primary} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Interactive actions allow you to approve or reject changes directly from notifications.
            Silent mode will suppress notifications during the specified hours.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  saveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  saveButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginTop: 8,
  },
  picker: {
    color: '#fff',
    height: 50,
  },
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  timeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 238, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default NotificationPreferencesScreen;
