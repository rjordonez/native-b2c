import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { signIn, updateLoginForm, toggleLoginPasswordVisibility, resetLoginForm } from '../authSlice';
import { Button } from '../../../shared/components/layout/ui/button';
import AuthLogo from './AuthLogo';
import AuthHeader from './AuthHeader';
import ErrorMessage from './ErrorMessage';
import PasswordInput from './PasswordInput';
import GoogleSignInButton from './GoogleSignInButton';
import FormDivider from './FormDivider';

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error, loginForm } = useAppSelector((state) => state.auth);
  const { email, password, showPassword } = loginForm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(signIn({ email, password })).unwrap();
      dispatch(resetLoginForm());
    } catch (err) {
      console.error('Login failed:', err);
    }
  };



  return (
    <div className="w-full max-w-md mx-auto">
      <AuthLogo />
      
      <AuthHeader 
        title="Log in to your account."
        subtitle="Enter your email address and password to log in."
      />

      <ErrorMessage error={error} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => dispatch(updateLoginForm({ email: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <PasswordInput
          value={password}
          onChange={(value) => dispatch(updateLoginForm({ password: value }))}
          onToggleVisibility={() => dispatch(toggleLoginPasswordVisibility())}
          showPassword={showPassword}
          placeholder="Password"
          required
        />

        <div className="text-right">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot Password?
          </button>
        </div>

        <Button
          type="submit"
          variant="default"
          disabled={isLoading}
          className="w-full py-3"
        >
          {isLoading ? 'Signing in...' : 'Log In'}
        </Button>
      </form>

      <FormDivider />
      
      <GoogleSignInButton />

      <p className="text-center text-gray-600">
        Don't you have an account?{' '}
        <button
          onClick={onToggleMode}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default LoginForm;