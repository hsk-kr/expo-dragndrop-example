import { DragndropContext } from '@/store/dragndrop';
import { useContext } from 'react';

export default function useDragndrop() {
	return useContext(DragndropContext);
}
