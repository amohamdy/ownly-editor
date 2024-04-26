/* eslint-disable prettier/prettier */
import React, { useEffect, useContext, useMemo } from 'react';
import { useStyles } from './styles';
import { Box, ClickAwayListener, Typography } from '@mui/material';
import { OuterId } from 'modules/Editor/definitions/types';
import EditorContext from '../../context/EditorContext';
import { modelsConfigs } from '../configs';
import { ModelConfig, Side } from '../utilities';
import clsx from 'clsx';
import useWindowDimensions from '../../../../../../hooks/useWindowDimensions';

function StartCanvas() {
	const { selectedModelType, selectedSide, onSelectFistSide } = useContext(EditorContext);
	const classes = useStyles();

	console.log('selectedModelType', selectedModelType);

	const getRatio = useMemo(() => {
		const selectedConfig = selectedModelType;
		const sideConfigs = (selectedConfig as any)?.sides.find((side: any) => side.id === selectedSide);
		return sideConfigs?.configs.canvasRatio || '';
	}, [selectedModelType, selectedSide]);

	const { width } = useWindowDimensions();

	return (
		<Box id={`pop`} className={classes.wrrapper}>
			<div className={classes.bkWrrapper}>
				<div className={classes.sideWrapper}></div>
				{true && (
					<div id='canvas-container' className={classes.drawnWrrapper} style={{ aspectRatio: getRatio }}>
						<div style={{ position: 'relative' }}>
							<img
								src={(selectedModelType as any)?.sides.find((side: any) => side.id === 'FRONT').iconSrc}
								className={classes.shirtImage}
								style={{ pointerEvents: 'none' }}></img>
							<div
								className={clsx(classes.frontSide, { selected: false })}
								onClick={() => {
									onSelectFistSide('FRONT');
								}}>
								<Typography
									style={{
										lineHeight: 1.2,
										marginLeft: '5px',
									}}
									variant='subtitle1'
									display='block'
									className={classes.textColor}>
									{'edit here'}
								</Typography>
							</div>
							<div
								className={clsx(classes.leftSleeve, { selected: false })}
								onClick={() => {
									onSelectFistSide('LEFT');
								}}>
								<Typography
									style={{
										lineHeight: 1.2,
										marginLeft: '5px',
									}}
									variant='subtitle1'
									display='block'
									className={classes.textColor}>
									{'edit here'}
								</Typography>
							</div>
							<div
								className={clsx(classes.rightSleeve, { selected: false })}
								onClick={() => {
									onSelectFistSide('RIGHT');
								}}>
								<Typography
									style={{
										lineHeight: 1.2,
										marginLeft: '5px',
									}}
									variant='subtitle1'
									display='block'
									className={classes.textColor}>
									{'edit here'}
								</Typography>
							</div>
						</div>
					</div>
				)}
				<div className={classes.sideWrapper}></div>
			</div>
		</Box>

		// </>
	);
}

export default StartCanvas;
