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
