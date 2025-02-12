import { StyleSheet , Dimensions} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const NavigatorStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: 'lightblue',
      height: 80,
      paddingBottom: 20,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    createButton: {
      backgroundColor: 'lightblue',
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      left: SCREEN_WIDTH / 2 - 28, // Centers button by offsetting by half its width
      top: -28,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      borderWidth: 4,
      borderColor: 'white',
    },
  });