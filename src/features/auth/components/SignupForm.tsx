import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { signUp, updateSignupForm, toggleSignupPasswordVisibility, toggleSignupConfirmPasswordVisibility, resetSignupForm } from '../authSlice';
import { Button } from '../../../shared/components/layout/ui/button';
import AuthLogo from './AuthLogo';
import AuthHeader from './AuthHeader';
import ErrorMessage from './ErrorMessage';
import PasswordInput from './PasswordInput';
import GoogleSignInButton from './GoogleSignInButton';
import FormDivider from './FormDivider';

interface SignupFormProps {
  onToggleMode: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggleMode }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, signupForm } = useAppSelector((state) => state.auth);
  const { email, password, confirmPassword, fullName, showPassword, showConfirmPassword } = signupForm;

  const passwordsMatch = useMemo(() => password === confirmPassword, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordsMatch) {
      return;
    }

    try {
      await dispatch(signUp({
        email,
        password,
        fullName
      })).unwrap();
      dispatch(resetSignupForm());
      
      // New users always need onboarding
      navigate('/onboarding');
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };



  return (
    <div className="w-full max-w-md mx-auto">
      <AuthLogo />
      
      <AuthHeader 
        title="Create your account."
        subtitle="Enter your details to create a new account."
      />

      <ErrorMessage error={error} />

      {/* TODO: Manual signup form - temporarily commented out
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => dispatch(updateSignupForm({ fullName: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => dispatch(updateSignupForm({ email: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <PasswordInput
          value={password}
          onChange={(value) => dispatch(updateSignupForm({ password: value }))}
          onToggleVisibility={() => dispatch(toggleSignupPasswordVisibility())}
          showPassword={showPassword}
          placeholder="Password"
          required
        />

        <PasswordInput
          value={confirmPassword}
          onChange={(value) => dispatch(updateSignupForm({ confirmPassword: value }))}
          onToggleVisibility={() => dispatch(toggleSignupConfirmPasswordVisibility())}
          showPassword={showConfirmPassword}
          placeholder="Confirm Password"
          className={confirmPassword && !passwordsMatch ? 'border-red-300 bg-red-50' : ''}
          required
        />

        {confirmPassword && !passwordsMatch && (
          <p className="text-red-500 text-sm">Passwords do not match</p>
        )}

        <Button
          type="submit"
          variant="default"
          disabled={isLoading || !passwordsMatch}
          className="w-full py-3"
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <FormDivider />
      */}
      
      <GoogleSignInButton />

      <p className="text-center text-gray-600">
        Already have an account?{' '}
        <button
          onClick={onToggleMode}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Log In
        </button>
      </p>
    </div>
  );
};

export default SignupForm;