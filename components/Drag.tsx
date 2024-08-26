import useDragndrop from '@/hooks/useDragndrop';
import { DragndropDragContent } from '@/lib/dragndrop';
import { View } from 'react-native';

export function Drag() {
  const { data } = useDragndrop();

  return (
    <DragndropDragContent>
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: data?.color ?? '',
          borderColor: '#aaa',
          borderWidth: 3,
        }}
      ></View>
    </DragndropDragContent>
  );
}
