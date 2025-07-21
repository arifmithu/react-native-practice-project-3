import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import { Formik } from 'formik';
import BouncyCheckBox from 'react-native-bouncy-checkbox';

const passwordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(4, 'Password must be at least 4 characters')
    .max(20, 'Password cannot exceed 20 characters')
    .required('Password length is required'),
});

export default function App() {
  const [password, setPassword] = useState('');
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
  const [lowerCase, setLowerCase] = useState(true);
  const [upperCase, setUpperCase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);

  const generatePasswordString = (passwordLength: number) => {
    let charactersList = '';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (upperCase) {
      charactersList += upperCaseChars;
    }
    if (lowerCase) {
      charactersList += lowerCaseChars;
    }
    if (numbers) {
      charactersList += numberChars;
    }
    if (symbols) {
      charactersList += symbolChars;
    }
    if (charactersList.length === 0) {
      charactersList =
        lowerCaseChars + upperCaseChars + numberChars + symbolChars;
    }
    const passwordResult = createPassword(charactersList, passwordLength);
    setPassword(passwordResult);
    setIsPasswordGenerated(true);
  };

  const createPassword = (characters: string, passwordLength: number) => {
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  };

  const resetPasswordState = () => {
    setPassword('');
    setIsPasswordGenerated(false);
    setLowerCase(true);
    setUpperCase(false);
    setNumbers(false);
    setSymbols(false);
  };
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.headerText}>Password Generator</Text>
          <Formik
            initialValues={{ passwordLength: '' }}
            validationSchema={passwordSchema}
            onSubmit={values => {
              console.log('values', values);
              generatePasswordString(+values.passwordLength);
            }}
          >
            {({
              values,
              errors,
              touched,
              isValid,
              handleChange,
              handleSubmit,
              handleReset,
            }) => (
              <>
                <View>
                  <View style={styles.inputColumn}>
                    <Text style={styles.label}>Password Length</Text>
                    {touched.passwordLength && errors.passwordLength && (
                      <Text style={styles.errorText}>
                        {errors.passwordLength}
                      </Text>
                    )}
                  </View>
                  <TextInput
                    style={styles.inputStyle}
                    value={values.passwordLength}
                    onChangeText={handleChange('passwordLength')}
                    placeholder="Password Length"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.typeText}>Include lowercase</Text>
                  <View style={{ flexShrink: 1 }}>
                    <BouncyCheckBox
                      useBuiltInState={false}
                      isChecked={lowerCase}
                      onPress={() => setLowerCase(!lowerCase)}
                      fillColor="#0ff54c"
                    />
                  </View>
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.typeText}>Include uppercase</Text>
                  <View style={{ flexShrink: 1 }}>
                    <BouncyCheckBox
                      useBuiltInState={false}
                      isChecked={upperCase}
                      onPress={() => setUpperCase(!upperCase)}
                      fillColor="#0ff54c"
                    />
                  </View>
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.typeText}>Include numbers</Text>
                  <View style={{ flexShrink: 1 }}>
                    <BouncyCheckBox
                      useBuiltInState={false}
                      isChecked={numbers}
                      onPress={() => setNumbers(!numbers)}
                      fillColor="#0ff54c"
                    />
                  </View>
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.typeText}>Include symbols</Text>
                  <View style={{ flexShrink: 1 }}>
                    <BouncyCheckBox
                      useBuiltInState={false}
                      isChecked={symbols}
                      onPress={() => setSymbols(!symbols)}
                      fillColor="#0ff54c"
                    />
                  </View>
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity
                    disabled={!isValid}
                    style={[
                      styles.submitButton,
                      !isValid && styles.generatePasswordButtonDisabled,
                    ]}
                    onPress={() => handleSubmit()}
                  >
                    <Text>Generate Password</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={!isValid}
                    style={[
                      styles.resetButton,
                      !isValid && styles.resetButtonDisabled,
                    ]}
                    onPress={() => {
                      handleReset();
                      resetPasswordState();
                    }}
                  >
                    <Text>Reset</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
        {isPasswordGenerated && (
          <View style={styles.generatedPasswordContainer}>
            <Text style={styles.label}>Generated Password</Text>
            <View style={styles.passwordBox}>
              <Text style={styles.passwordText} selectable>
                {password}
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    // paddingHorizontal: 24,
  },
  headerText: {
    backgroundColor: '#0ff54c',
    padding: 10,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    // borderRadius: 8,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formContainer: {},
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 20,
    flex: 1,
    color: '#333',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  typeText: {
    fontSize: 18,
    color: '#333',
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 10,
  },
  inputColumn: {},
  inputStyle: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: 20,
    marginHorizontal: 10,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#0ff54c',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  resetButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  generatePasswordButtonDisabled: {
    backgroundColor: '#ccc',
  },
  resetButtonDisabled: {
    backgroundColor: '#ccc',
  },
  generatedPasswordContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  passwordBox: {
    fontSize: 18,
    color: '#333',
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: '100%',
    marginTop: 10,
  },
  passwordText: {
    fontSize: 18,
    color: '#333',
  },
});
