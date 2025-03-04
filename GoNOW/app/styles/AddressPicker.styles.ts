import { StyleSheet } from 'react-native';
import { Colors, Borders, Spacing, FontSizes } from './Common.styles';

export const AddressPickerStyles = StyleSheet.create({
  addressPanel: {
    position: 'absolute',
    top: 20,
    left: Spacing.EDGE_SPACING,
    right: Spacing.EDGE_SPACING,
    padding: Spacing.PADDING_MEDIUM,
    backgroundColor: Colors.WHITE,
    borderRadius: Borders.RADIUS_MEDIUM,
    opacity: 0.8,
  },
  addressPanelText: {
    textAlign: 'center',
    fontSize: FontSizes.REGULAR,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: Borders.RADIUS_MEDIUM,
    paddingHorizontal: Spacing.PADDING_MEDIUM,
    backgroundColor: Colors.WHITE,
  },
  textInput: {
    paddingVertical: Spacing.PADDING_SMALL,
    paddingRight: 40,
    borderRadius: Borders.RADIUS_SMALL,
    fontSize: FontSizes.REGULAR,
    flex: 1,
  },
  iconButton: {
    position: "absolute",
    right: 5,
    padding: Spacing.PADDING_SMALL,
  },
  listView: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: Colors.WHITE,
    borderRadius: Borders.RADIUS_SMALL,
    maxHeight: 200,
  },
  mapContainer: {
    flex: 1,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  mapView: {
    flex: 1,
  },
  resultItem: {
    padding: Spacing.PADDING_LARGE,
    borderBottomWidth: 1,
    borderColor: Colors.BORDER,
  },
  description: {
    fontWeight: 'bold',
    fontSize: FontSizes.REGULAR,
  },
});