import { TextProps } from 'react-native';

export interface IoniconsProps extends TextProps {
  name: string;
  size?: number;
  color?: string;
}

// Create a namespace declaration for JSX
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'mock-ionicon': IoniconsProps;
    }
  }
}

export const mockIonicons = jest.fn((props: IoniconsProps) => {
  return <mock-ionicon {...props} />;
});