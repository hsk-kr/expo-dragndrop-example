import { DragndropStartPoint } from '@/lib/dragndrop';
import { ComponentProps } from 'react';
import { View } from 'react-native';

interface RectProps extends ComponentProps<typeof View> {
	color: string;
}

export default function Rect({ color, style, ...attrs }: RectProps) {
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
}
