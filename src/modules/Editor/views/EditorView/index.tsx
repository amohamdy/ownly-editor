import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import useEditorActions from '../../actions/useEditorActions';
import { RenderMode, Categories, BottomMenuType } from 'modules/Editor/definitions/types';
import { useStyles } from './styles';
import Header from 'shared/components/Header';
import EditorContext from './context/EditorContext';
import Footer from './Footer';
import RenderSwitch from './RenderSwitch';
import LeftSide from './LeftSide';
import Editor from './Editor';
import { LeftArcMenu, RightArcMenu } from './ArcMenus';
import { GameManager } from './Editor/3D';
import { ModelType } from './Editor/utilities';
import clsx from 'clsx';
import { ReactComponent as IconLeftArrow } from 'shared/assets/images/icons/leftArrow.svg';
import { ReactComponent as IconRightArrow } from 'shared/assets/images/icons/rightArrow.svg';
import { Canvas } from 'fabric/fabric-impl';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';

function EditorView() {
	const [selectedModelType, setSelectedModelType] = useState<any>(null);
	const [token, setToken] = useState('');
	const [productId, setProductId] = useState('');
	const [threeD, setThreeD] = useState('');
	const [leftArcMenuState, setLeftArcMenuState] = useState(true);
	const [rightArcMenuState, setRightArcMenuState] = useState(true);
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();
	const { width, height } = useWindowDimensions();

	const {
		container,
		fabricCanvas,
		gameManager,
		selectedCategory,
		selectedSubCategory,
		selectedObjectsConfig,
		selectedSide,
		elementType,
		isFirstUse,
		selectedRenderMode,
		canvasColor,
		bottomMenu,
		showRightMenu,
		setShowRightMenu,
		onSelectSvgIcon,
		onChangeCanvasColor,
		setSelectedRenderMode,
		onSelectFistSide,
		onInit2DEditor,
		discardActiveObjects,
		getSelectedObjects,
		selectedElementType,
		setSelectedSide,
		setSelectedCategory,
		setBottomMenu,
		setSelectedSubCategory,
		removeImageBackground,
		onAddText,
		onChangeOpacity,
		setGameManager,
		onBold,
		onItalic,
		onChangeFontSize,
		onChangeFontFamily,
		onChangeLineHeight,
		onUploadImage,
		onChangeFontAligment,
		onChangeColor,
		onChangeBorderColor,
		onChangeBorderStyle,
		onChangeBorderRadius,
		onChangeBorderWight,
		onDraw,
		isDrawingMode,
		cancelDrawing,
		getImagesFilters,
		applyImageFilter,
		drawShapeById,
		onApplyImage,
		onSubmitData,
	} = useEditorActions();

	const renderLeftSideMenu = useMemo(() => {
		switch (selectedCategory) {
			case 'Templates':
			case 'Uploads':
			case 'Texts':
			case 'Elements':
			case 'Graphics':
			case 'Filters':
				return <LeftSide />;
			// return <></>;
			default:
			case 'Draw':
				return (width ?? 0) > 700 && (height ?? 0) > 450 ? <LeftArcMenu onChangeCanvasColor={onChangeCanvasColor} /> : null;
		}
	}, [onChangeCanvasColor, selectedCategory]);
	const removeQueryParam = (paramName: string) => {
		const searchParams = new URLSearchParams(location.search);
		searchParams.delete(paramName);

		history.replace({
			pathname: location.pathname,
			search: searchParams.toString(),
		});
	};
	const renderRightSideMenu = useMemo(() => {
		switch (selectedCategory) {
			case 'Templates':
			case 'Elements':
				return <></>;
			case 'Draw':
			case 'Uploads':
			case 'Texts':
			case 'Graphics':
				return <RightArcMenu />;
			case 'Filters':
			default:
				return <RightArcMenu />;
		}
	}, [selectedCategory]);
	const handleClickLeftCollapse = useCallback(() => {
		if (selectedCategory) {
			setSelectedCategory(undefined);
			setLeftArcMenuState(!leftArcMenuState);
		}
	}, [leftArcMenuState, selectedCategory, setSelectedCategory]);

	const handleClickRightCollapse = () => {
		setRightArcMenuState(!rightArcMenuState);
	};

	const getProductBySku = async (sku: string) => {
		const res = await fetch(
			'https://server.ownly.net/rest/V1/products?' +
				`searchCriteria[filter_groups][0][filters][0][field]=sku&` +
				`searchCriteria[filter_groups][0][filters][0][value]=${sku}&` +
				`searchCriteria[filter_groups][0][filters][0][condition_type]=eq`
		);
		const data = await res.json();
		console.log('data', data.items[0]);
		setProductId(data.items[0].id);
		setSelectedModelType({
			id: data.items[0].sku,
			sides: data.items[0].extension_attributes.editor_data.map((side: any) => {
				return {
					id: side.id.toUpperCase(),
					name: side.id,
					iconSrc: side.filename,
					configs: {
						alpha: 1.5,
						beta: 1.4,
						radius: 31,
						canvasRatio: '1/1.14',
					},
					value: `Photo${side.id.substring(0, 1).toUpperCase() + side.id.substring(1)}`,
				};
			}),
		});
		setThreeD(data.items[0].custom_attributes.find((attr: any) => attr.attribute_code === 'model_3d_filename')?.value);
	};

	useEffect(() => {
		if (location.search) {
			setToken(location.search.split('&')[1]?.split('=')[1]);
			removeQueryParam('token');
			const [key, sku] = location.search.split('&')[0].split('=');
			getProductBySku(sku);
		}
	}, []);

	return (
		<Box>
			<EditorContext.Provider
				value={{
					fabricContainer: container,
					gameManager,
					fabricCanvas,
					selectedRenderMode,
					selectedCategory,
					selectedSubCategory,
					selectedModelType,
					selectedSide,
					token,
					productId,
					selectedObjectsConfig,
					elementType,
					isFirstUse,
					canvasColor,
					bottomMenu,
					showRightMenu,
					setShowRightMenu,
					onSelectSvgIcon,
					onSelectFistSide,
					threeD,
					onInit2DEditor,
					getSelectedObjects,
					onSetSelectedModelType(modelType) {
						setSelectedModelType(modelType);
					},
					onSetSelectedSide(side) {
						if (selectedRenderMode === '2DMODE' && selectedModelType) {
							onApplyImage();
						}
						if (gameManager) {
							gameManager.studioSceneManager.changeSide(side);
						}
						setSelectedSide(side);
					},
					onSelectedRenderMode: (newRenderMode: RenderMode) => {
						setSelectedRenderMode(newRenderMode);
						setSelectedCategory(undefined);
						selectedElementType(undefined);
					},
					onSelectBottomMenuType: (newType: BottomMenuType | undefined) => {
						setBottomMenu(newType);
					},
					onSelectCategory: (newCategory: Categories | undefined) => {
						setSelectedRenderMode('2DMODE');
						setSelectedCategory(newCategory);
						setSelectedSubCategory(undefined);
						if (newCategory !== 'Filters') {
							discardActiveObjects();
						}
						if (isDrawingMode()) {
							cancelDrawing();
						}
						if (fabricCanvas) {
							(fabricCanvas as any)['category'] = newCategory;
						}
					},
					onSelectSubCategory(newCategory) {
						setSelectedSubCategory(newCategory);
					},
					onSetGameManager: (gameManager: GameManager) => {
						setGameManager(gameManager);
					},
					removeImageBackground,
					onAddText,
					onBold,
					onItalic,
					onChangeColor,
					onChangeBorderColor,
					onChangeFontSize,
					onChangeFontFamily,
					onChangeLineHeight,
					onChangeFontAligment,
					onChangeOpacity,
					onChangeBorderStyle,
					onChangeBorderRadius,
					onChangeBorderWight,
					isDrawingMode,
					onDraw,
					cancelDrawing,
					getImagesFilters,
					applyImageFilter,
					drawShapeById,
					onUploadImage,
					onApplyImage,
					onSubmitData,
				}}>
				<Header onChangeCanvasColor={onChangeCanvasColor}>{!isFirstUse && <RenderSwitch />}</Header>
				{((width ?? 0) <= 700 || (height ?? 0) <= 450) && !isFirstUse && <RenderSwitch />}
				<Box className={clsx(classes.editorWrraper, { isFirstUse: isFirstUse })}>
					<>
						{selectedCategory !== 'PrintingTypes' && true && (
							<Box
								height={(width ?? 0) > 700 && (height ?? 0) > 450 ? '100%' : 0}
								display={'flex'}
								alignItems={'center'}
								justifyContent={'flex-start'}
								minWidth={'360px'}>
								{true && renderLeftSideMenu}
								{!isFirstUse && (width ?? 0) > 700 && (height ?? 0) > 450 && (
									<Box display={'flex'} alignItems={'center'} paddingLeft={'15px'} zIndex={111}>
										<Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'65px'} onClick={handleClickLeftCollapse}>
											<IconLeftArrow className={leftArcMenuState ? clsx(classes.rotateLeft) : clsx(classes.normal)} />
											<Box color={'#CACCD2'} fontSize={'12px'}>
												{leftArcMenuState ? 'Menu' : 'Arc'}
											</Box>
										</Box>
									</Box>
								)}
							</Box>
						)}
					</>
					<>
						<Editor />
						{selectedCategory !== 'PrintingTypes' && !isFirstUse && (width ?? 0) > 700 && (height ?? 0) > 450 && (
							<Box display={'flex'} alignItems={'center'}>
								<Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'65px'} onClick={handleClickRightCollapse}>
									<IconRightArrow className={rightArcMenuState ? clsx(classes.rotateRight) : clsx(classes.normal)} />
									<Box color={'#CACCD2'} fontSize={'12px'}>
										{rightArcMenuState ? 'Collapse' : 'Expand'}
									</Box>
								</Box>
							</Box>
						)}
					</>

					{selectedCategory !== 'PrintingTypes' && !isFirstUse && (
						<Box
							height={(width ?? 0) > 700 && (height ?? 0) < 450 ? 0 : '100%'}
							display={'flex'}
							alignItems={'center'}
							justifyContent={(width ?? 0) > 700 && (height ?? 0) > 450 ? 'flex-end' : 'center'}
							minWidth={'360px'}>
							{rightArcMenuState && renderRightSideMenu}
						</Box>
					)}
				</Box>
				{!isFirstUse && <Footer />}
			</EditorContext.Provider>
		</Box>
	);
}

export default EditorView;
