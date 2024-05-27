import * as BABYLON from 'babylonjs';
import GameManger from './gameManager';

export default function BabylonManager(canvasRef, onFinish, editorData, threeD, setLoading) {
	if (!canvasRef) {
		throw new Error('Canvas is not provided!');
	}
	const engine = new BABYLON.Engine(canvasRef, true);
	const GManger = new GameManger({ canvas: canvasRef, engine, onFinish, configData: editorData, threeD, setLoading });

	return {
		GManger,
	};
}
