# Expo/React Native Drag and Drop Example

![rndragndropexample](https://github.com/user-attachments/assets/e38b378f-fbdd-4e4d-8741-aba2795511b2)

## How to Run - Dev

```
> npm install
> npm run start
```

---

## [Expo/React Native Drag and Drop Example - Dev.to](https://dev.to/lico/exporeact-native-drag-and-drop-example-4d3n)

![Preview](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kb0r3pyfeiz1tyyzn51b.gif)

In the project, I recently started working on where I had to implement a drag-and-drop feature. Even though this is my first project developing a mobile app with React Nactive, I thought it wouldn't be difficult to implement. However, it turned out to be different from what I expected.

The drag-and-drop packages I found didn't have enough installations to trust them fully, and many were no longer maintained. In web development, drag events are provided by default, but that's not the case in React Native. Eventually, I found the [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/) library, so that I was able to implement the drag-and-drop feature using [Pan gesture](https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture/).

Even after finding the library, it took me a while to implement it the way I wanted. To review what I have learned and share it with others facing the same challenges, I decided to write this post.

---

# Understanding the Logic

![Drawing to help explanation](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/erxlqhkb2ntsp4anms23.png)

The drawing provides a brief overview to help you understand the logic and the components used here.

- DragndropContext: A context that shares states between the components listed below.

- DragndropStartPoint: A component that wraps the component where the drag event starts. It receives a data prop, which is a color code in this example. The data will be passed to and used in the other two components.  

- DragndropEndPoint: A component that wraps the endpoint where the item will be dropped. It receives an `onDrop` function, and the data will be passed to this function.

- DragndropDragContent: A component that renders at the user's touch position during the drag.

---

# Implementation - Code

## DragndropContext

```typescript
import { ReactNode, createContext, useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';

export type Data = { color: string };

interface DragndropContextType {
	data?: Data;
	pos: {
		x: Animated.Value;
		y: Animated.Value;
	};
	dropPos?: {
		x: number;
		y: number;
	};
	dragging: boolean;
	onDragStart: (data: Data) => void;
	onDragEnd: (pos: { x: number; y: number }) => void;
}

export const DragndropContext = createContext<DragndropContextType>(
	{} as DragndropContextType
);

export const DragndropContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [data, setData] = useState<Data>();
	const [dragging, setDragging] = useState(false);
	const [dropPos, setDropPos] = useState<DragndropContextType['dropPos']>();
	const pos = useRef({
		x: new Animated.Value(0),
		y: new Animated.Value(0),
	}).current;

	const onDragStart = useCallback<DragndropContextType['onDragStart']>(
		(data) => {
			setData(data);
			setDragging(true);
		},
		[]
	);
	const onDragEnd = useCallback<DragndropContextType['onDragEnd']>((pos) => {
		setDropPos(pos);
		setDragging(false);
	}, []);

	const value = {
		data,
		pos,
		dropPos,
		dragging,
		onDragStart,
		onDragEnd,
	};

	return (
		<DragndropContext.Provider value={value}>
			{children}
		</DragndropContext.Provider>
	);
};
```

The type, `Data` can vary depending on your needs. In this example, since I only need color, the Data type has a color property.

dragging is used to determine whether a drag event is happening.

`pos` is used to render the content at the user's touch position during the drag. It's defined as an `Animated.Value` type so that i can be used in an `Animated.View`.

> [The Animated library is designed to make animations fluid, powerful, and painless to build and maintain.](https://reactnative.dev/docs/animated)

`dropPos` has the position where the drag event ends.

---

## DragndropStartPoint

```typescript
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
```

This component implements handlers for the [Pan Gesture](https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture/). When the drag starts, it stores the data from the props in the context and updates the position as the user moves. When it ends, it converts animated values to numbers and passes them to the `onDragEnd` function to store them in the `dropPos` state in the context.

---

## DragndropEndPoint

```typescript
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
```

The most challenging part was comparing positions to determine which element should be the drop target. The `onLayout` event doesn't provide absolute positions of an element. But then, I found that I could get them using the `measure` method.

This component overrides the `onLayout` event and gets the absolute positions of the child component. It then uses these positions to determine if the touch event ends over the child element. If it does, the component calls the `onDrop` function (passed as a prop) with the data.

---

## DragndropDragContent

```typescript
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
```

In my initial approach, I tried to copy the element that the drag starts because I wanted to drag the original element over the cursor's position, and I realized that storing the necessary data and rendering a new component with it was easier than copying the entire element. Looking back, this approach should have been obvious from the start.

The component renders its child at the `pos` position. To center the element at the drag position, I wrap the child in a View and apply a translation to move it left and up by half its size.

---

# Example

## Drag

```typescript
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
```

This component renders a rectangle over the cursor during the drag. The rectangle's color is from the context.

---

## Selection

```typescript
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
```

This component serves as the starting point where the user starts the drag.

---

## Target

```typescript
import { DragndropEndPoint } from '@/lib/dragndrop';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function Target() {
	return (
		<View style={{ flex: 1 }}>
			<DropPoint />
			<DropPoint />
			<DropPoint />
		</View>
	);
}

const DropPoint = () => {
	const [color, setColor] = useState('white');

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<DragndropEndPoint onDrop={(data) => setColor(data.color)}>
				<View
					style={{
						width: 100,
						height: 100,
						borderWidth: 1,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: color,
					}}
				>
					<Text style={{ fontWeight: 'bold', fontSize: 28 }}>Drop Here!</Text>
				</View>
			</DragndropEndPoint>
		</View>
	);
};
```

This component acts as the destination for the drag. When the user ends the pan gesture over a `DropPoint` component, the background color changes to match the dragged item's color.

---

## App

**_layout.tsx**

```typescript
import { Drag } from '@/components/Drag';
import { DragndropContextProvider } from '@/store/dragndrop';
import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<DragndropContextProvider>
				<SafeAreaView style={{ flex: 1 }}>
					<Slot />
					<Drag />
				</SafeAreaView>
			</DragndropContextProvider>
		</GestureHandlerRootView>
	);
}
```

**index.tsx**
```typescript
import Selection from '@/components/Selection';
import Target from '@/components/Target';
import { View } from 'react-native';

export default function Home() {
	return (
		<View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
			<Target />
			<Selection />
		</View>
	);
}
```

Where you place the code will depend on your project structure. In this example, I initialized the project using `Expo` and rendered the providers and the Drag component in `_layout.tsx`. The other components are rendered in `index.tsx`.

---

# Wrap Up

Finding exactly what we need isn't always easy. I spent many hours implementing it and came across many useful resources. Thanks to all the people sharing their knowledge in public. I learned a lot during the search and I managed to finish my task on time. 

When I completed it, I was excited that I was going to share this online as I think this implementation is not bad. It depends on how you want to implement though. 

Thank you for reading this article, and I hope you found it helpful.

Happy Coding!

---

You can find the full source code here, on [my Github Repository](https://github.com/hsk-kr/expo-dragndrop-example).
