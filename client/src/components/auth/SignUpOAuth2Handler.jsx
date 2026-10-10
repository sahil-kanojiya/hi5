import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo/hi5.svg';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { activateUser, checkUsername } from '../../services/api';
import { setToken } from '../../utils/localStorage';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/slices/authSlice';

const validationSchemas = [
  Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(15, 'Username must not exceed 15 characters')
      .matches(
        /^[a-z0-9_]+$/,
        'Username can only contain lowercase letters, numbers, and underscores'
      )
      .required('Username is required'),
  }),

  Yup.object({
    fullname: Yup.string()
      .min(3, 'Fullname must be at least 3 characters')
      .max(50, 'Fullname must not exceed 30 characters')
      .matches(/^[A-Za-z ]+$/, 'Full name can only contain letters and spaces')
      .required('Full name is required'),
    dob: Yup.date()
      .max(new Date(), 'Date of birth cannot be in the future')
      .required('Date of birth is required'),
    gender: Yup.string()
      .oneOf(['male', 'female', 'other', 'prefer_not_to_say'], 'Please select a valid gender')
      .required('Gender is required'),
  }),
];

const SignUpOAuth2Handler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [identificationToken, setIdentificationToken] = useState(null);

  const initialValues = {
    username: '',
    fullname: '',
    dob: '',
    gender: '',
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      console.log('IdentificationToken: ' + token);
      setIdentificationToken(token);
    } else {
      navigate('/signup');
    }
  }, [location.search, setIdentificationToken, navigate]);

  const submitStepData = async (values) => {
    if (step == 0) {
      setIsLoading(true);
      try {
        console.log('Form Value username:', values.username);
        const response = await checkUsername({ username: values.username });
        if (response.data?.isAvailable) {
          setStep(1);
        }
        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || 'Something went wrong, please try again.');
      } finally {
        setIsLoading(false);
      }
    } else if (step == 1) {
      setIsLoading(true);
      console.log('Form Values fullname:', values.fullname);
      console.log('Form Values dob:', values.dob);
      console.log('Form Values gender:', values.gender);
      try {
        const response = await activateUser(identificationToken, {
          username: values.username,
          fullname: values.fullname,
          dateOfBirth: values.dob,
          gender: values.gender.toUpperCase(),
        });

        if (response.data?.authToken) {
          setToken(response.data?.authToken);
          dispatch(
            setAuth({
              isAuthenticated: false,
              isInitializing: false,
              token: response.data?.authToken,
            })
          );
        }

        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || 'Something went wrong, please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <section className="mx-auto flex min-h-screen flex-col items-center justify-center bg-background px-6 py-8">
      <div className="relative w-full max-w-md rounded-lg border-gray-300 bg-card p-6 shadow-lg dark:border-gray-700 sm:p-8">
        <div className="my-4 flex items-center justify-center text-center">
          <a href="/">
            <img className="h-16 w-auto" src={logo} alt="Hi5" />
          </a>
        </div>

        <h1 className="mb-4 text-center text-xl font-bold">
          {step === validationSchemas.length ? 'Complete Your Profile' : 'Sign Up to Hi5'}
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[step]}
          onSubmit={(values) => submitStepData(values)}
        >
          {({ errors, touched }) => (
            <Form
              className={`space-y-6 transition-opacity duration-500 ${
                isLoading ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {/* Username Form Step */}
              {step === 0 && (
                <>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    Choose a unique username that will be displayed on your profile.
                  </p>
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                      Username
                    </label>
                    <Field
                      name="username"
                      type="text"
                      id="username"
                      placeholder="Choose a username"
                      className="mt-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600"
                      disabled={isLoading}
                    />
                    {touched.username && errors.username && (
                      <p className="ml-1 mt-2 text-sm text-red-700">{errors.username}</p>
                    )}
                  </div>
                </>
              )}

              {/* Full Name, DOB & Gender Form Step */}
              {step === 1 && (
                <>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    Please provide your full name, date of birth, and gender to complete your
                    profile. This information will help us personalize your experience.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullname" className="block text-sm font-medium text-gray-900">
                        Full Name
                      </label>
                      <Field
                        name="fullname"
                        type="text"
                        id="fullname"
                        placeholder="Enter your full name"
                        className="mt-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600"
                        disabled={isLoading}
                      />
                      {touched.fullname && errors.fullname && (
                        <p className="ml-1 mt-2 text-sm text-red-700">{errors.fullname}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="dob" className="block text-sm font-medium text-gray-900">
                        Date of Birth
                      </label>
                      <Field
                        name="dob"
                        type="date"
                        id="dob"
                        className="mt-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600"
                        disabled={isLoading}
                      />
                      {touched.dob && errors.dob && (
                        <p className="ml-1 mt-2 text-sm text-red-700">{errors.dob}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-900">
                        Gender
                      </label>
                      <Field
                        name="gender"
                        as="select"
                        id="gender"
                        className="mt-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600"
                        disabled={isLoading}
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </Field>
                      {touched.gender && errors.gender && (
                        <p className="ml-1 mt-2 text-sm text-red-700">{errors.gender}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Show error from backend if exists */}
              {error && <div className="ml-1 text-xs text-red-500">{error}</div>}

              {/* Submit or Next Button */}
              <div className="mt-4 flex items-center justify-between">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 p-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  disabled={isLoading}
                >
                  {step == 0 ? 'Continue' : 'Finish'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default SignUpOAuth2Handler;
