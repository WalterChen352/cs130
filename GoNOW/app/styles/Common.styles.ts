export const Colors = {
    DEFAULT_BLUE: '#007AFF',
    LIGHT_BLUE: 'lightblue',
    BACKGROUND: '#F8F8F8',
    BORDER: '#DDD',
    TEXT: '#000',
    WHITE: '#FFF',
    RED: "#ffa5a5",
    DARK_GRAY: '#333'
  };
  
  export const Borders = {
    RADIUS_SMALL: 5,
    RADIUS_MEDIUM: 8,
    RADIUS_ROUND: 30, // For circular buttons
    WIDTH: 1,
    WIDTH_THICK: 4,
  };
  
  export const Spacing = {
    PADDING_SMALL: 8,
    PADDING_MEDIUM: 10,
    PADDING_LARGE: 15,
    EDGE_SPACING: '5%',
    BUTTON_SPACING: 20, // Standard button spacing from edges
  };
  
  export const FontSizes = {
    HEADER: 24,
    SUBHEADER: 18,
    REGULAR: 16,
    SMALL: 14,
  };
  
  export const Shadows = {
    BUTTON: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 }, // Even shadow (no bottom weighting)
      shadowOpacity: 0.25,
      shadowRadius: 3.75,
      elevation: 2.5, // For Android
    }
  };

  
  export const switchColors={
    trackColor:{false: Colors.BACKGROUND, true: Colors.DEFAULT_BLUE}
  }