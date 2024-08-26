import useDragndrop from '@/hooks/useDragndrop';
import { DragndropDragContent } from '@/lib/dragndrop';
import { View } from 'react-native';

export function Drag() {
	const { data } = useDragndrop();

	return (
		<DragndropDragContent>
			<View
				style={{ width: 100, height: 100, backgroundColor: data?.color ?? '' }}
			></View>
		</DragndropDragContent>
	);
}
