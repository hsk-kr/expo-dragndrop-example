import useDragndrop from '@/hooks/useDragndrop';
import { Data } from '@/store/dragndrop';
import React, {
	Children,
	ReactNode,
	cloneElement,
	useEffect,
	useState,
} from 'react';
import { Animated, LayoutRectangle, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type Rect = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export const DragndropStartPoint = ({
	children,
	data,
}: {
	children: ReactNode;
	data: Data;
}) => {
	const { pos, onDragStart, onDragEnd } = useDragndrop();
	const dragGesture = Gesture.Pan()
		.onStart(() => {
			onDragStart(data);
		})
		.onUpdate((evt) => {
			const { absoluteX, absoluteY } = evt;
			pos.x.setValue(absoluteX);
			pos.y.setValue(absoluteY);
		})
		.onEnd(() => {
			const convert = (value: Animated.Value) => Number(JSON.stringify(value));
			onDragEnd({ x: convert(pos.x), y: convert(pos.y) });
		})
		.runOnJS(true);

	return <GestureDetector gesture={dragGesture}>{children}</GestureDetector>;
};

export const DragndropEndPoint = ({
	children,
	onDrop,
}: {
	children: ReactNode;
	onDrop?: (data: Data) => void;
}) => {
	const { dropPos, data } = useDragndrop();
	const [rect, setRect] = useState<Rect>();

	useEffect(() => {
		if (!dropPos || !rect || !onDrop || !data) return;

		const x2 = rect.x + rect.width;
		const y2 = rect.y + rect.height;

		if (
			dropPos.x >= rect.x &&
			dropPos.x <= x2 &&
			dropPos.y >= rect.y &&
			dropPos.y <= y2
		) {
			onDrop(data);
		}
	}, [dropPos]);

	const newChildren = Children.map(children, (child: any) =>
		cloneElement(child, {
			onLayout: (evt: any) => {
				evt.target.measure(
					(
						_x: number,
						_y: number,
						width: number,
						height: number,
						pageX: number,
						pageY: number
					) => {
						setRect({ x: pageX, y: pageY, width, height });
					}
				);
			},
		})
	);

	return newChildren;
};

export const DragndropDragContent = ({ children }: { children: ReactNode }) => {
	const { pos, dragging } = useDragndrop();
	const [contentLayout, setContentLayout] = useState<LayoutRectangle>();

	if (!dragging) return null;

	return (
		<Animated.View
			style={{
				position: 'absolute',
				left: pos.x,
				top: pos.y,
				zIndex: 1000,
			}}
		>
			<View
				onLayout={(layout) => setContentLayout(layout.nativeEvent.layout)}
				style={{
					transform: [
						{
							translateX: -((contentLayout?.width ?? 0) / 2),
						},
						{
							translateY: -((contentLayout?.height ?? 0) / 2),
						},
					],
				}}
			>
				{children}
			</View>
		</Animated.View>
	);
};
