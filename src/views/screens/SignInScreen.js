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
  CheckBox,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useAuthController from '../../controllers/AuthController';
import AppTheme from '../../utils/Theme';

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

  const ValidationRule = ({ label, isValid }) => (
    <View style={styles.validationRow}>
      <Icon
        name={isValid ? 'check-circle' : 'radio-button-unchecked'}
        size={16}
        color={isValid ? 'green' : 'gray'}
      />
      <Text style={[styles.validationText, { color: isValid ? 'green' : 'gray' }]}>
        {label}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>
          {isUserExist ? 'Sign In' : showOtherFields ? 'Sign Up' : 'Sign In'}
        </Text>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your email"
          placeholderTextColor="gray"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text);
          }}
        />
        <View style={styles.validationContainer}>
          <Text style={styles.validationTitle}>Email Rules</Text>
          <ValidationRule label="Valid email format" isValid={emailRules.validFormat} />
          <ValidationRule label="Email is required" isValid={emailRules.notEmpty} />
        </View>
        {isUserExist ? (
          <View>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Type your password"
                placeholderTextColor="gray"
                secureTextEntry={isHidePassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  validatePassword(text);
                }}
              />
              <TouchableOpacity onPress={() => setIsHidePassword(!isHidePassword)}>
                <Icon
                  name={isHidePassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.validationContainer}>
              <Text style={styles.validationTitle}>Password Rules</Text>
              <ValidationRule label="At least 8 characters" isValid={passwordRules.minLength} />
              <ValidationRule label="Contains uppercase letter" isValid={passwordRules.hasUpperCase} />
              <ValidationRule label="Contains lowercase letter" isValid={passwordRules.hasLowerCase} />
              <ValidationRule label="Contains number" isValid={passwordRules.hasNumber} />
              <ValidationRule label="Contains special character" isValid={passwordRules.hasSpecialChar} />
            </View>
          </View>
        ) : showOtherFields ? (
          <View>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              placeholderTextColor="gray"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                validateUsername(text);
              }}
            />
            <View style={styles.validationContainer}>
              <Text style={styles.validationTitle}>Username Rules</Text>
              <ValidationRule label="3-20 characters" isValid={usernameRules.minLength} />
              <ValidationRule label="No spaces" isValid={usernameRules.noSpaces} />
              <ValidationRule label="No special characters" isValid={usernameRules.noSpecialChars} />
            </View>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Type your password"
                placeholderTextColor="gray"
                secureTextEntry={isHidePassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  validatePassword(text);
                }}
              />
              <TouchableOpacity onPress={() => setIsHidePassword(!isHidePassword)}>
                <Icon
                  name={isHidePassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.validationContainer}>
              <Text style={styles.validationTitle}>Password Rules</Text>
              <ValidationRule label="At least 8 characters" isValid={passwordRules.minLength} />
              <ValidationRule label="Contains uppercase letter" isValid={passwordRules.hasUpperCase} />
              <ValidationRule label="Contains lowercase letter" isValid={passwordRules.hasLowerCase} />
              <ValidationRule label="Contains number" isValid={passwordRules.hasNumber} />
              <ValidationRule label="Contains special character" isValid={passwordRules.hasSpecialChar} />
            </View>
          </View>
        ) : null}
        <View style={styles.termsContainer}>
          <CheckBox
            value={termAndConditionAccepted}
            onValueChange={setTermAndConditionAccepted}
            tintColors={{ true: AppTheme.primaryYellow, false: AppTheme.primaryYellow }}
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
            { backgroundColor: isValidEmail ? AppTheme.primaryYellow : AppTheme.primaryYellow + '4D' },
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
            {isUserExist ? 'Sign In' : showOtherFields ? 'Sign Up' : 'Continue'}
          </Text>
        </TouchableOpacity>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or use</Text>
          <View style={styles.divider} />
        </View>
        {/* Google Sign-In button skipped due to complexity */}
      </ScrollView>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={AppTheme.primaryYellow} />
          <Text style={styles.loadingText}>Please wait...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.primaryBlack,
  },
  content: {
    padding: 20,
  },
  headerTitle: {
    color: AppTheme.primaryYellow,
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginVertical: 40,
  },
  label: {
    color: AppTheme.primaryYellow,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins',
    marginBottom: 8,
  },
  input: {
    backgroundColor: AppTheme.secondaryBlack + '80',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontFamily: 'Poppins',
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.secondaryBlack + '80',
    borderRadius: 8,
    padding: 12,
  },
  validationContainer: {
    marginTop: 8,
  },
  validationTitle: {
    color: 'gray',
    fontSize: 12,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  validationText: {
    marginLeft: 8,
    fontSize: 12,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    justifyContent: 'center',
  },
  termsText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  link: {
    color: AppTheme.primaryYellow,
    fontWeight: '600',
  },
  actionButton: {
    width: '100%',
    height: 55,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'white',
  },
  dividerText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins',
    marginHorizontal: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: AppTheme.primaryYellow,
    fontSize: 16,
    fontFamily: 'Poppins',
    marginTop: 16,
  },
});

export default SignInScreen;