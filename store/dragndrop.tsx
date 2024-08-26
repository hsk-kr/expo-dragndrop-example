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
