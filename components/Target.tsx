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
