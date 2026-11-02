import { fireEvent, render, screen } from '@testing-library/react-native';

import { ApiError } from '@/api/client';
import LoginScreen from '@/app/login';

const mockSignIn = jest.fn();
jest.mock('@/auth/AuthProvider', () => ({
  useAuth: () => ({ signIn: mockSignIn }),
}));

beforeEach(() => mockSignIn.mockReset());

async function fillIn(email: string, password: string) {
  await fireEvent.changeText(screen.getByPlaceholderText('Email'), email);
  await fireEvent.changeText(screen.getByPlaceholderText('Password'), password);
}

it('keeps Sign in disabled until both fields are filled', async () => {
  await render(<LoginScreen />);
  expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled();

  await fillIn('member@pentana.test', 'secret');
  expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled();
});

it('signs in with the trimmed email', async () => {
  mockSignIn.mockResolvedValue(undefined);
  await render(<LoginScreen />);

  await fillIn('  member@pentana.test ', 'secret');
  await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));

  expect(mockSignIn).toHaveBeenCalledWith('member@pentana.test', 'secret');
});

it('shows the server’s message when the credentials are wrong', async () => {
  mockSignIn.mockRejectedValue(new ApiError(401, 'The provided credentials are incorrect.'));
  await render(<LoginScreen />);

  await fillIn('member@pentana.test', 'wrong');
  await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));

  expect(await screen.findByText('The provided credentials are incorrect.')).toBeOnTheScreen();
});

it('shows a connection hint when the server cannot be reached', async () => {
  mockSignIn.mockRejectedValue(new TypeError('Network request failed'));
  await render(<LoginScreen />);

  await fillIn('member@pentana.test', 'secret');
  await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));

  expect(await screen.findByText('Could not reach the server. Check your connection.')).toBeOnTheScreen();
});
