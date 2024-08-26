import { View } from 'react-native';
import Rect from './Rect';

export default function Selection() {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Rect color="red" />
      <Rect color="blue" />
      <Rect color="green" />
    </View>
  );
}
