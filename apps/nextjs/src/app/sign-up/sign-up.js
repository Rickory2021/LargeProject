'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordHovered, setConfirmPasswordHovered] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    specialCharacter: false
  });
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setError('Entered password does not meet validation requirements!');
      return;
    }

    try {
      const res = await fetch(
        'https://slicer-backend.vercel.app/api/auth/user/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName,
            lastName,
            username,
            password,
            email
          })
        }
      );
      if (res.ok) {
        router.push('/verify-email');
      } else if (res.status === 400) {
        const { error } = await res.json();
        setError(error);
      } else {
        const { error } = await res.json();
        setError(error);
      }
    } catch (error) {
      console.error('An unexpected error happened:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  const validatePassword = password => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[!@#$%^&*]).{8,}$/;
    const newPasswordRequirements = {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[01234567890]/.test(password),
      specialCharacter: /[!@#$%^&*]/.test(password),
      passwordLength: password.length
    };
    setPasswordRequirements(newPasswordRequirements);
    return passwordRegex.test(password);
  };

  const closeErrorPopup = () => {
    setError('');
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    // setShowPassword(false); // Hide the button when the password input is blurred
  };

  const handleConfirmPasswordHover = () => {
    setConfirmPasswordHovered(true);
  };

  const handleConfirmPasswordLeave = () => {
    setConfirmPasswordHovered(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const handlePasswordChange = e => {
    setPassword(e.target.value);
    if (passwordFocused) {
      validatePassword(e.target.value);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(e.target.value === password);
  };

  // ✓ vs ✅
  return (
    <div className="flex flex-col items-center justify-center h-screen pb-16">
      <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            className="p-2 border border-gray-300 rounded-md"
          />

          {!showPassword && (
            <button
              type="button"
              className="absolute top-3 right-2"
              onClick={togglePasswordVisibility}
            >
              <FaEye />
            </button>
          )}
          {showPassword && (
            <button
              type="button"
              className="absolute top-3 right-2"
              onClick={togglePasswordVisibility}
            >
              <FaEyeSlash />
            </button>
          )}
        </div>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          onFocus={handleConfirmPasswordHover}
          onBlur={handleConfirmPasswordLeave}
          className="p-2 border border-gray-300 rounded-md"
        />
        {(passwordRequirements && (passwordFocused || confirmPasswordHovered)) && (
          <div className="flex p-2 border border-gray-300 rounded-md">
            <ul>
              <li>
                {passwordRequirements.minLength ? '✅' : '-'} Password must be
                at least 8 characters long
              </li>
              <li>
                {passwordRequirements.uppercase ? '✅' : '-'} Contain at least
                one uppercase letter
              </li>
              <li>
                {passwordRequirements.lowercase ? '✅' : '-'} Contain at least
                one lowercase letter
              </li>
              <li>
                {passwordRequirements.specialCharacter ? '✅' : '-'} Contain
                at least one special character: !@#$%^&*
              </li>
              <li>
                {(passwordsMatch && password.length > 0)? '✅' : '-'} Passwords Match
              </li>
            </ul>
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={`p-2 border border-gray-300 rounded-md`}
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Sign Up
        </button>
      </form>
      <Link href="/sign-in">
        <button className="mt-4 text-blue-500">
          Have an account? Login here
        </button>
      </Link>

      {error && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md">
            <p className="text-red-500">{error}</p>
            <button
              onClick={closeErrorPopup}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
