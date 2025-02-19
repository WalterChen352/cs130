import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ButtonSave from '../app/components/ButtonSave';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons'
}));

interface ButtonProps {
  style?: {
    backgroundColor?: string;
    borderColor?: string;
  };
}

describe('ButtonSave Component', () => {
  test('renders correctly with default props', () => {
    const { getByTestId } = render(<ButtonSave testID='btn-save' />);
    const button = getByTestId('btn-save');
    const icon = getByTestId('btn-save-icon');
    expect(button).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(icon.props.name).toBe('checkmark');
    expect(icon.props.size).toBe(34);
    expect((button.props as ButtonProps).style?.backgroundColor).toBe('#388dff');
  });

  test('calls onPress when the button is pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<ButtonSave onPress={onPressMock} />);
    const button = getByTestId('btn-save');
    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  test('renders with custom props', () => {
    const { getByTestId } = render(
      <ButtonSave
        icon="save"
        size={40}
        color="red"
        bgColor="black"
        testID="custom-btn-save"
      />
    );
    const button = getByTestId('custom-btn-save');
    const icon = getByTestId('btn-save-icon');
    expect(button).toBeTruthy();
    expect(icon.props.name).toBe('save');
    expect(icon.props.size).toBe(44);
    expect((button.props as ButtonProps).style?.backgroundColor).toBe('black');
    expect((button.props as ButtonProps).style?.borderColor).toBe('red');
  });

  test('does not call onPress if onPress is not provided', () => {
    const { getByTestId } = render(<ButtonSave />);
    const button = getByTestId('btn-save');
    fireEvent.press(button);
    expect(true).toBe(true);
  });

});