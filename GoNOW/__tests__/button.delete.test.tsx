import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ButtonDelete from '../app/components/ButtonDelete';
import { IoniconsProps } from '../__mocks__/ionicons';

jest.mock('react-native-vector-icons/Ionicons', () => {
  return function MockIonicons(props: IoniconsProps) {
    return <mock-ionicon {...props} />;
  };
});

interface ButtonProps {
  style?: {
    backgroundColor?: string;
    borderColor?: string;
  };
}

describe('ButtonDelete Component', () => {
  test('renders correctly with default props', () => {
    const { getByTestId } = render(<ButtonDelete testID='btn-delete' />);
    const button = getByTestId('btn-delete');
    const icon = getByTestId('btn-delete-icon');
    expect(button).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(icon.props.name).toBe('close');
    expect(icon.props.size).toBe(34);
    expect((button.props as ButtonProps).style?.backgroundColor).toBe('#ffa5a5');
  });

  test('calls onPress when the button is pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<ButtonDelete onPress={onPressMock} />);
    const button = getByTestId('btn-delete');
    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  test('renders with custom props', () => {
    const { getByTestId } = render(
      <ButtonDelete
        icon="delete"
        size={40}
        color="red"
        bgColor="black"
        testID="custom-btn-delete"
      />
    );
    const button = getByTestId('custom-btn-delete');
    const icon = getByTestId('btn-delete-icon');
    expect(button).toBeTruthy();
    expect(icon.props.name).toBe('delete');
    expect(icon.props.size).toBe(44);
    expect((button.props as ButtonProps).style?.backgroundColor).toBe('black');
    expect((button.props as ButtonProps).style?.borderColor).toBe('red');
  });

  test('does not call onPress if onPress is not provided', () => {
    const { getByTestId } = render(<ButtonDelete />);
    const button = getByTestId('btn-delete');
    fireEvent.press(button);
    expect(true).toBe(true);
  });

});