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
