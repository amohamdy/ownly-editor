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
import Loading from '../../../../shared/components/loading/index';
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
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function EditorView() {
	const [selectedModelType, setSelectedModelType] = useState<any>(null);
	const [token, setToken] = useState('');
	const [productId, setProductId] = useState('');
	const [designId, setDesignId] = useState('');
	const [threeD, setThreeD] = useState('');
	const [show, setShow] = useState(false);
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
		loading,
		setLoading,
		error,
		setError,
		setOpen,
		open,
		onChangeBorderWight,
		onDraw,
		isDrawingMode,
		cancelDrawing,
		applyImageFromBE,
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
	// function to get product data on mount and we take the sides from here and the 3d model and set the states
	const getProductBySku = async (sku: string) => {
		const res = await fetch(
			'https://server.ownly.net/rest/V1/products?' +
				`searchCriteria[filter_groups][0][filters][0][field]=sku&` +
				`searchCriteria[filter_groups][0][filters][0][value]=${sku}&` +
				`searchCriteria[filter_groups][0][filters][0][condition_type]=eq`
		);
		if (res.status === 200) {
			const data = await res.json();
			if (data.items.length > 0) {
				setShow(true);
				setProductId(data.items[0].id);
				setSelectedModelType({
					id: data.items[0].sku,
					sides: data.items[0].extension_attributes.editor_data?.map((side: any) => {
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
			} else {
				setError('no product found');
				setOpen(true);
				setShow(false);
			}
		} else {
			const data = await res.json();
			setError(data.message);
			setOpen(true);
			setShow(false);
		}
		setLoading(false);
	};
	// function to get design by id on mount
	const getDesign = async (id: any, token: string) => {
		const res = await fetch(`https://server.ownly.net/rest/V1/productdesign/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (res.status === 200) {
			const data = await res.json();
			setDesignId(id);
			applyImageFromBE(JSON.parse(data.json));
			setShow(true);
		} else {
			const data = await res.json();
			setError(data.message);
			setOpen(true);
			setShow(false);
		}
	};

	const handleClose = () => {
		setOpen(false);
		setError('');
	};

	const action = (
		<React.Fragment>
			<IconButton size='small' aria-label='close' color='inherit' onClick={handleClose}>
				<CloseIcon fontSize='small' />
			</IconButton>
		</React.Fragment>
	);

	const getMount = async () => {
		setLoading(true);
		// get params from url and save them in states ( token , sku, design_id)

		if (location.search) {
			const [k, sku] = location.search.split('&')[0].split('=');
			await getProductBySku(sku);
			const [key, design] = location.search.split('&')[1].split('=');
			if (key === 'design') {
				await getDesign(design, location.search.split('&')[2]?.split('=')[1]);
				setToken(location.search.split('&')[2]?.split('=')[1]);
			} else {
				setToken(design);
			}
		}
		setLoading(false);
	};
	useEffect(() => {
		getMount();
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
					designId,
					selectedObjectsConfig,
					elementType,
					isFirstUse,
					canvasColor,
					bottomMenu,
					setLoading,
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
				{!loading && !show && (
					<p style={{ position: 'fixed', color: 'white', inset: 0, display: 'grid', placeContent: 'center' }}>Somethin went wrong please try again</p>
				)}
				{show && (
					<>
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
					</>
				)}
				{!isFirstUse && <Footer />}
				<Snackbar
					sx={{
						'& .MuiSnackbarContent-root': {
							backgroundColor: 'red',
							color: '#fff',
						},
					}}
					open={open}
					autoHideDuration={6000}
					onClose={handleClose}
					message={error}
					action={action}
				/>
				{loading && <Loading />}
			</EditorContext.Provider>
		</Box>
	);
}

export default EditorView;
