import * as BABYLON from 'babylonjs';
import {ModelConfig, SideTypes} from '../../../utilities';

//for controling sock Faces
export const faceTypeEnum = {
  frontFace: 'frontFace', //frontFace
  backFace: 'backFace', //backFace
  leftFace: 'leftFace', //leftFace
  rightFace: 'rightFace', //rightFace
};

export const getSideModelName = (
  modelConfing: any,
  selectedSideId: any,
) => {
  const {id, sides} = modelConfing;
  let meshName = '';
  switch (id) {
    default:
      const selectedSide = sides.find((side: any) => side.id === selectedSideId);
      if (!selectedSide) {
        return;
      }
      meshName = selectedSide.value;
      break;
  }
  return meshName;
};
