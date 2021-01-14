import React from 'react';
import {
  ColorValue,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface Props {
  onPress: () => void;
  icon: ImageSourcePropType;
  iconColor: ColorValue;
  iconSize?: number;
  iconStyle?: ImageStyle;
  buttonStyle?: ViewStyle;
  backgroundColor?: ColorValue;
}

const IconButton = ({
  onPress,
  icon,
  iconColor,
  iconSize = 30,
  backgroundColor = '#fff',
  buttonStyle = {},
  iconStyle = {},
  ...props
}: Props) => {
  return (
    <TouchableOpacity
      style={[styles.btn, {backgroundColor}, buttonStyle]}
      onPress={onPress}
      {...props}>
      <Image
        source={icon}
        style={[
          {tintColor: iconColor, height: iconSize, width: iconSize},
          iconStyle,
        ]}
      />
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  btn: {
    padding: 15,
    borderRadius: 99,
    alignSelf: 'center',
    marginHorizontal: 5,
    marginVertical: 8,
  },
});
