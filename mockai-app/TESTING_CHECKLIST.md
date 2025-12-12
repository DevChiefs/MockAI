# Testing Checklist - Updated Authentication Forms

## Pre-Testing Setup

- [ ] Install required dependencies:
  ```bash
  npm install react-hook-form zod @hookform/resolvers @radix-ui/react-label
  ```
- [ ] Restart dev server: `npm run dev`
- [ ] Ensure Convex is running: `npx convex dev`
- [ ] Clear browser cache and localStorage

## Visual Testing

### Landing Page (`/`)

- [ ] Terminal background animation is running
- [ ] Navigation shows "Sign In" and "Sign Up" buttons when logged out
- [ ] Navigation shows user name and "Sign Out" button when logged in
- [ ] Blue/cyan gradient colors are consistent
- [ ] All buttons and links work

### Login Page (`/login`)

- [ ] Terminal background matches landing page
- [ ] Logo and "MockAI" text in navigation
- [ ] "Welcome Back" heading has blue/cyan gradient
- [ ] Form has dark gray background with border
- [ ] Email input has correct styling
- [ ] Password input has correct styling
- [ ] Submit button has gradient background
- [ ] "Sign up" link works
- [ ] Overall design matches landing page theme

### Register Page (`/register`)

- [ ] Terminal background matches landing page
- [ ] Logo and "MockAI" text in navigation
- [ ] "Create Account" heading has blue/cyan gradient
- [ ] Form has dark gray background with border
- [ ] Name input has correct styling
- [ ] Email input has correct styling
- [ ] Password input has correct styling
- [ ] Confirm Password input has correct styling
- [ ] Submit button has gradient background
- [ ] "Sign in" link works
- [ ] Overall design matches landing page theme

## Functional Testing

### Login Form Validation

- [ ] Empty email shows error: "Please enter a valid email address"
- [ ] Invalid email format shows error
- [ ] Empty password shows error: "Password must be at least 6 characters"
- [ ] Password < 6 chars shows error
- [ ] Form validates on blur (when field loses focus)
- [ ] Form validates on submit
- [ ] Errors appear below respective fields
- [ ] Errors have red color

### Register Form Validation

- [ ] Empty name shows error: "Name must be at least 2 characters"
- [ ] Name < 2 chars shows error
- [ ] Empty email shows error: "Please enter a valid email address"
- [ ] Invalid email format shows error
- [ ] Empty password shows error: "Password must be at least 6 characters"
- [ ] Password < 6 chars shows error
- [ ] Empty confirm password shows error
- [ ] Non-matching passwords show error: "Passwords do not match"
- [ ] Form validates on blur
- [ ] Form validates on submit
- [ ] Errors appear below respective fields
- [ ] Errors have red color

### Authentication Flow

- [ ] **New User Registration**
  - [ ] Navigate to `/register`
  - [ ] Fill in: Name, Email, Password, Confirm Password
  - [ ] Click "Sign Up"
  - [ ] Button shows "Creating account..." during submission
  - [ ] Redirects to home page on success
  - [ ] User name appears in navigation
  - [ ] Can see "Sign Out" button

- [ ] **Sign Out**
  - [ ] Click "Sign Out" button
  - [ ] Redirects to home page
  - [ ] Navigation shows "Sign In" and "Sign Up" buttons
  - [ ] User is logged out

- [ ] **Existing User Login**
  - [ ] Navigate to `/login`
  - [ ] Enter email and password used in registration
  - [ ] Click "Sign In"
  - [ ] Button shows "Signing in..." during submission
  - [ ] Redirects to home page on success
  - [ ] User name appears in navigation
  - [ ] Can see "Sign Out" button

- [ ] **Invalid Login**
  - [ ] Navigate to `/login`
  - [ ] Enter incorrect email/password
  - [ ] Click "Sign In"
  - [ ] Error message appears: "Invalid email or password"
  - [ ] Error has red background
  - [ ] Form is still usable

- [ ] **Duplicate Registration**
  - [ ] Try registering with existing email
  - [ ] Error message appears: "User with this email already exists"
  - [ ] Error has red background
  - [ ] Form is still usable

## Accessibility Testing

### Keyboard Navigation

- [ ] Can tab through all form fields
- [ ] Can tab to submit button
- [ ] Can submit form with Enter key
- [ ] Focus states are visible
- [ ] Tab order is logical

### Screen Reader Testing

- [ ] Labels are announced
- [ ] Error messages are announced
- [ ] Button states are announced
- [ ] Form structure is clear

### Visual Accessibility

- [ ] Text has sufficient contrast
- [ ] Focus indicators are visible
- [ ] Error messages are clear
- [ ] Button states are distinguishable

## Responsive Design Testing

### Desktop (1920x1080)

- [ ] Form is centered
- [ ] Terminal animation covers full screen
- [ ] Text is readable
- [ ] Spacing is appropriate

### Laptop (1440x900)

- [ ] Layout adjusts properly
- [ ] No horizontal scroll
- [ ] Text is readable

### Tablet (768x1024)

- [ ] Form is responsive
- [ ] Navigation adjusts
- [ ] Terminal animation works
- [ ] Touch targets are large enough

### Mobile (375x667)

- [ ] Form is fully responsive
- [ ] Navigation is usable
- [ ] Text is readable
- [ ] Inputs are easy to tap
- [ ] No horizontal scroll

## Browser Testing

### Chrome

- [ ] All features work
- [ ] Animations are smooth
- [ ] Forms submit correctly
- [ ] No console errors

### Firefox

- [ ] All features work
- [ ] Animations are smooth
- [ ] Forms submit correctly
- [ ] No console errors

### Safari

- [ ] All features work
- [ ] Animations are smooth
- [ ] Forms submit correctly
- [ ] No console errors

### Edge

- [ ] All features work
- [ ] Animations are smooth
- [ ] Forms submit correctly
- [ ] No console errors

## Performance Testing

- [ ] Initial page load < 3 seconds
- [ ] Form validation is instant
- [ ] No lag when typing
- [ ] Smooth animations
- [ ] No memory leaks (check DevTools)

## Convex Integration Testing

### Database Operations

- [ ] New user creates record in `users` table
- [ ] Session creates record in `sessions` table
- [ ] Email index works (duplicate detection)
- [ ] Session token is stored in localStorage
- [ ] Session persists on page refresh

### Convex Dashboard

- [ ] Open Convex dashboard
- [ ] Navigate to Data > users
- [ ] Verify new user appears
- [ ] Check email, name, passwordHash fields
- [ ] Navigate to Data > sessions
- [ ] Verify session appears
- [ ] Check userId, token, expiresAt fields

## Error Handling Testing

- [ ] Network error during registration
- [ ] Network error during login
- [ ] Convex server down
- [ ] Invalid Convex URL in .env.local
- [ ] Expired session (wait 30 days or modify database)

## Edge Cases

- [ ] Very long email address
- [ ] Very long name
- [ ] Special characters in name
- [ ] Email with + character
- [ ] Email with subdomain
- [ ] Copy/paste password
- [ ] Browser autofill
- [ ] Multiple rapid form submissions
- [ ] Submitting with Enter key
- [ ] Submitting by clicking button

## Security Testing

- [ ] Passwords are not visible in HTML
- [ ] Passwords are hashed in database
- [ ] Session tokens are random
- [ ] Session tokens are not visible in URL
- [ ] No sensitive data in console logs
- [ ] No sensitive data in localStorage (only token)

## Cleanup Testing

- [ ] Sign out removes token from localStorage
- [ ] Expired sessions are handled gracefully
- [ ] Error states clear when form is corrected
- [ ] Form resets after successful submission

## Issues Found

Document any issues found during testing:

| Issue | Severity | Steps to Reproduce | Expected | Actual |
| ----- | -------- | ------------------ | -------- | ------ |
|       |          |                    |          |        |

## Test Results

- **Total Tests**: \_\_\_
- **Passed**: \_\_\_
- **Failed**: \_\_\_
- **Blocked**: \_\_\_
- **Pass Rate**: \_\_\_%

## Sign-off

- [ ] All critical tests pass
- [ ] All visual checks complete
- [ ] All functional tests complete
- [ ] Documentation is accurate
- [ ] Ready for production

**Tested by**: ******\_\_\_\_******
**Date**: ******\_\_\_\_******
**Build**: ******\_\_\_\_******
