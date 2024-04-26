/* eslint-disable prettier/prettier */
import React, { useEffect, useContext, useMemo, useState } from 'react';
import { useStyles } from './styles';
import { Box, ClickAwayListener } from '@mui/material';
import { OuterId } from 'modules/Editor/definitions/types';
import EditorContext from '../../context/EditorContext';
import SidesFooter from '../../Footer/SidesFooter';
import useWindowDimensions from '../../../../../../hooks/useWindowDimensions';
import clsx from 'clsx';

function Editor2D() {
	const { fabricContainer, selectedCategory, selectedModelType, selectedSide, canvasColor, onSelectCategory, onInit2DEditor, onApplyImage } =
		useContext(EditorContext);
	const classes = useStyles();
	const { width, height } = useWindowDimensions();
	useEffect(() => {
		onInit2DEditor();
	}, []);

	const getRatio = useMemo(() => {
		const selectedConfig = selectedModelType as any;
		const sideConfigs = selectedConfig?.sides.find((side: any) => side.id === selectedSide);
		return sideConfigs?.configs.canvasRatio || '';
	}, [selectedModelType, selectedSide]);

	const targetImageSrc = useMemo(() => {}, []);

	return (
		<Box id={`${OuterId} wrrapper`} className={clsx(classes.wrrapper, { printingTypes: selectedCategory === 'PrintingTypes' })}>
			<ClickAwayListener
				onClickAway={(e: any) => {
					if (e && e.target && (e.target as EventTarget & { id: string }).id.includes(OuterId)) {
						onSelectCategory(undefined);
					}
				}}>
				<div className={classes.bkWrrapper}>
					<div className={classes.sideWrapper}>
						<SidesFooter />
					</div>
					{true && (
						<div
							id='canvas-container'
							className={classes.drawnWrrapper}
							style={{ aspectRatio: getRatio, backgroundColor: canvasColor, boxShadow: `0px 0px 15px 5px ${canvasColor}` }}>
							<canvas id='canvas' className={classes.canvasWrrapper} ref={fabricContainer}></canvas>
						</div>
					)}
					{selectedCategory !== 'PrintingTypes' && (
						<div className={classes.sideWrapper}>
							<Box style={{ position: 'absolute', bottom: 0, marginLeft: '16px' }}>
								<div style={{ position: 'relative', pointerEvents: 'none' }}>
									<img
										src={(selectedModelType as any)?.sides.find((side: any) => side.id === 'FRONT').iconSrc}
										width={'70px'}
										style={{ pointerEvents: 'none' }}></img>
									{selectedSide === 'FRONT' && <div className={clsx(classes.frontSide, { selected: selectedSide === 'FRONT' })}></div>}
									{selectedSide === 'LEFT' && <div className={clsx(classes.leftSleeve, { selected: selectedSide === 'LEFT' })}></div>}
									{selectedSide === 'RIGHT' && <div className={clsx(classes.rightSleeve, { selected: selectedSide === 'RIGHT' })}></div>}
								</div>
							</Box>
						</div>
					)}
				</div>
			</ClickAwayListener>
		</Box>

		// </>
	);
}

export default Editor2D;
