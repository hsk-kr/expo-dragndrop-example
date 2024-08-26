import { View } from 'react-native';
import { DragndropStartPoint } from '@/lib/dragndrop';
import { ComponentProps } from 'react';

interface RectProps extends ComponentProps<typeof View> {
  color: string;
}

export default function Selection() {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Rect color="red" />
      <Rect color="blue" />
      <Rect color="green" />
    </View>
  );
}

const Rect = ({ color, style, ...attrs }: RectProps) => {
  return (
    <DragndropStartPoint data={{ color }}>
      <View
        {...attrs}
        style={[
          {
            flex: 1,
            height: '100%',
            backgroundColor: color,
          },
          style,
        ]}
      ></View>
    </DragndropStartPoint>
  );
};
