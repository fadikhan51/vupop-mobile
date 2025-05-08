import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';
import useAuthController from '../../controllers/AuthController';
import AppTheme from '../../utils/Theme';

const { width } = Dimensions.get('window');

const SignInScreen = ({ navigation }) => {
  const {
    isLoading,
    isValidEmail,
    isHidePassword,
    setIsHidePassword,
    isUserExist,
    showOtherFields,
    termAndConditionAccepted,
    setTermAndConditionAccepted,
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    emailRules,
    passwordRules,
    usernameRules,
    validateEmail,
    validatePassword,
    validateUsername,
    handleEmailSubmit,
    loginUser,
    registerUser,
    launchTermsAndPrivacyUrl,
  } = useAuthController(navigation);

  const CustomCheckBox = ({ value, onValueChange }) => (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      style={[
        styles.customCheckbox,
        value ? { backgroundColor: AppTheme.primaryYellow } : { borderColor: AppTheme.primaryYellow }
      ]}
    >
      {value && <Icon name="check" size={16} color="black" />}
    </TouchableOpacity>
  );

  const ValidationRule = ({ label, isValid }) => (
    <View style={styles.validationRow}>
      <Icon
        name={isValid ? 'check-circle' : 'radio-button-unchecked'}
        size={16}
        color={isValid ? '#4CAF50' : '#9E9E9E'}
      />
      <Text style={[styles.validationText, { color: isValid ? '#4CAF50' : '#9E9E9E' }]}>
        {label}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
          />
          
          <Text style={styles.headerTitle}>
            {isUserExist ? 'Welcome Back' : showOtherFields ? 'Create Account' : 'Sign In'}
          </Text>
          
          <Text style={styles.subtitle}>
            {isUserExist ? 'Sign in to continue' : showOtherFields ? 'Fill your details to get started' : 'Enter your email to continue'}
          </Text>
          
          <View style={styles.formContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Icon name="email" size={20} color="#9E9E9E" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Type your email"
                placeholderTextColor="#9E9E9E"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  validateEmail(text);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            {emailRules.notEmpty && !emailRules.validFormat && (
              <View style={styles.validationContainer}>
                <ValidationRule label="Valid email format" isValid={emailRules.validFormat} />
              </View>
            )}

            {isUserExist ? (
              <View style={styles.formField}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Icon name="lock" size={20} color="#9E9E9E" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Type your password"
                    placeholderTextColor="#9E9E9E"
                    secureTextEntry={isHidePassword}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      validatePassword(text);
                    }}
                  />
                  <TouchableOpacity onPress={() => setIsHidePassword(!isHidePassword)} style={styles.visibilityIcon}>
                    <Icon
                      name={isHidePassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color="#9E9E9E"
                    />
                  </TouchableOpacity>
                </View>
                
                {password.length > 0 && (
                  <View style={styles.validationContainer}>
                    <Text style={styles.validationTitle}>Password Requirements</Text>
                    <View style={styles.validationGrid}>
                      <View style={styles.validationColumn}>
                        <ValidationRule label="8+ characters" isValid={passwordRules.minLength} />
                        <ValidationRule label="Uppercase letter" isValid={passwordRules.hasUpperCase} />
                        <ValidationRule label="Lowercase letter" isValid={passwordRules.hasLowerCase} />
                      </View>
                      <View style={styles.validationColumn}>
                        <ValidationRule label="Number" isValid={passwordRules.hasNumber} />
                        <ValidationRule label="Special character" isValid={passwordRules.hasSpecialChar} />
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ) : showOtherFields ? (
              <>
                <View style={styles.formField}>
                  <Text style={styles.label}>Username</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="person" size={20} color="#9E9E9E" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter username"
                      placeholderTextColor="#9E9E9E"
                      value={username}
                      onChangeText={(text) => {
                        setUsername(text);
                        validateUsername(text);
                      }}
                      autoCapitalize="none"
                    />
                  </View>
                  
                  {username.length > 0 && (
                    <View style={styles.validationContainer}>
                      <Text style={styles.validationTitle}>Username Requirements</Text>
                      <ValidationRule label="3-20 characters" isValid={usernameRules.minLength} />
                      <ValidationRule label="No spaces" isValid={usernameRules.noSpaces} />
                      <ValidationRule label="No special characters" isValid={usernameRules.noSpecialChars} />
                    </View>
                  )}
                </View>

                <View style={styles.formField}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color="#9E9E9E" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Type your password"
                      placeholderTextColor="#9E9E9E"
                      secureTextEntry={isHidePassword}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        validatePassword(text);
                      }}
                    />
                    <TouchableOpacity onPress={() => setIsHidePassword(!isHidePassword)} style={styles.visibilityIcon}>
                      <Icon
                        name={isHidePassword ? 'visibility-off' : 'visibility'}
                        size={20}
                        color="#9E9E9E"
                      />
                    </TouchableOpacity>
                  </View>
                  
                  {password.length > 0 && (
                    <View style={styles.validationContainer}>
                      <Text style={styles.validationTitle}>Password Requirements</Text>
                      <View style={styles.validationGrid}>
                        <View style={styles.validationColumn}>
                          <ValidationRule label="8+ characters" isValid={passwordRules.minLength} />
                          <ValidationRule label="Uppercase letter" isValid={passwordRules.hasUpperCase} />
                          <ValidationRule label="Lowercase letter" isValid={passwordRules.hasLowerCase} />
                        </View>
                        <View style={styles.validationColumn}>
                          <ValidationRule label="Number" isValid={passwordRules.hasNumber} />
                          <ValidationRule label="Special character" isValid={passwordRules.hasSpecialChar} />
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </>
            ) : null}
          </View>

          <View style={styles.termsContainer}>
            <CustomCheckBox
              value={termAndConditionAccepted}
              onValueChange={setTermAndConditionAccepted}
            />
            <Text style={styles.termsText}>
              By using our services you are agreeing to our{' '}
              <Text style={styles.link} onPress={launchTermsAndPrivacyUrl}>
                Terms
              </Text>{' '}
              and{' '}
              <Text style={styles.link} onPress={launchTermsAndPrivacyUrl}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { 
                backgroundColor: isValidEmail && termAndConditionAccepted 
                  ? AppTheme.primaryYellow 
                  : 'rgba(255, 193, 7, 0.5)' 
              },
            ]}
            onPress={async () => {
              if (!termAndConditionAccepted) {
                alert('Please accept terms and conditions.');
                return;
              }
              if (isUserExist) {
                if (validatePassword(password)) {
                  await loginUser();
                }
              } else if (showOtherFields) {
                if (validateUsername(username) && validatePassword(password)) {
                  await registerUser();
                }
              } else {
                if (validateEmail(email)) {
                  await handleEmailSubmit();
                }
              }
            }}
          >
            <Text style={styles.actionButtonText}>
              {isUserExist ? 'Sign In' : showOtherFields ? 'Create Account' : 'Continue'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="android" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="apple" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="facebook" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.switchAuthMode}>
            <Text style={styles.switchAuthText}>
              {isUserExist 
                ? "Don't have an account? " 
                : showOtherFields 
                  ? "Already have an account? " 
                  : "Need help? "}
              <Text style={styles.link}>
                {isUserExist 
                  ? "Sign Up" 
                  : showOtherFields 
                    ? "Sign In" 
                    : "Contact Support"}
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AppTheme.primaryYellow} />
            <Text style={styles.loadingText}>Please wait...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.primaryBlack,
  },
  innerContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    color: '#9E9E9E',
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5 * 0.5, // Adjust aspect ratio
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 32,
  },
  formContainer: {
    marginBottom: 24,
  },
  formField: {
    marginTop: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 45, 45, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 56,
    color: 'white',
    fontFamily: 'Poppins',
    fontSize: 15,
    paddingVertical: 12,
  },
  visibilityIcon: {
    paddingHorizontal: 12,
  },
  validationContainer: {
    marginTop: 12,
    backgroundColor: 'rgba(45, 45, 45, 0.5)',
    borderRadius: 8,
    padding: 12,
  },
  validationTitle: {
    color: '#9E9E9E',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  validationGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  validationColumn: {
    flex: 1,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  validationText: {
    marginLeft: 8,
    fontSize: 13,
    fontFamily: 'Poppins',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  customCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 10,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    color: '#9E9E9E',
    fontSize: 14,
    fontFamily: 'Poppins',
    flex: 1,
    lineHeight: 20,
  },
  link: {
    color: AppTheme.primaryYellow,
    fontWeight: '600',
  },
  actionButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppTheme.primaryYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: '#9E9E9E',
    fontSize: 14,
    fontFamily: 'Poppins',
    marginHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(45, 45, 45, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  switchAuthMode: {
    alignItems: 'center',
    marginBottom: 16,
  },
  switchAuthText: {
    color: '#9E9E9E',
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    color: AppTheme.primaryYellow,
    fontSize: 16,
    fontFamily: 'Poppins',
    marginTop: 16,
  },
});

export default SignInScreen;