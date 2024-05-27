import StudioSceneManager from './StudioScene/studioSceneManager';

export default function GameManger(props) {
	const { canvas, engine, onFinish, configData, threeD, setLoading } = props;
	//Define Canvas
	this.canvas = canvas;

	//Define Engine
	this.engine = engine;
	this.engine.enableOfflineSupport = true;

	//Create StudioScene Instacne (StudioScene Manager)
	this.studioSceneManager = new StudioSceneManager(this);
	this.currentScene = this.studioSceneManager.createScene(onFinish, configData, threeD, setLoading);

	// The render function
	this.engine.runRenderLoop(() => {
		this.currentScene.render();
	});

	// Resize the babylon engine when the window is resized
	window.addEventListener(
		'resize',
		() => {
			this.engine.resize();
		},
		false
	);
}

GameManger.prototype = {};
