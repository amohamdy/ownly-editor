import { makeStyles } from '@mui/styles';
import { landscapeOnly, mobileAndLandscape } from 'hooks/breakspoints';

export const useStyles = makeStyles((theme: any) => ({
  printingTypesWrraper: {
    width: '55vw',
    height: '95%',
    maxHeight: '545px',
    marginRight: '16px',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: '20px',
    border: '1px solid #4D4D4D',
    background: '#282729',
    backdropFilter: 'blur(25px)',
    [theme.breakpoints.down(700)]: {
      position: 'absolute',
      top: '60%',
      left: '50%',
      zIndex: 99,
      width: '450px',
      maxWidth: '90vw',
      maxHeight: '30vh',
      minHeight: '30vh',
      padding: '10px',
      transform: 'translate(-50%, -50%)'
    },
    [landscapeOnly]: {
      width: '690px',
      // minWidth: '330px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      minHeight: '90vh',
      padding: '10px',
      // margin: '0px 1vw',
      position: 'absolute',
      top: '50%',
      left: '50%',
      zIndex: 99,
      transform: 'translate(-50%, -50%)'
    }
  },
  bodyWrraper: {
    width: '100%',
    height: '85vh',
    display: 'flex',
  },
  leftBody: {
    width: '39%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftBodyImg: {
    width: '100%',
    height: '40%',
  },
  rightBody: {
    width: '100%',
    height: '100%',
    // padding: '8px 0px',
    display: 'flex',
    flexDirection: 'column',
  },
  printingTypesText: {
    color: '#CACCD2',
    fontFamily: 'Duplet Rounded',
    fontStyle: 'normal',
    lineHeight: 'normal',
  },
  printingTypesBut: {
    width: '132px',
    height: '40px',
    display: 'flex !important',
    flexDirection: 'column',
    justifyContent: 'center !important',
    flexWrap: 'wrap',
    borderRadius: '8.998px !important',
    border: '0.9px solid #4D4D4D !important',
    background: '#282729 !important',
    backdropFilter: 'blur(22.49452781677246px) !important',
    color: '#CACCD2 !important',
    margin: '8px !important',
    '&.selected': {
      background: 'rgba(135, 131, 225, 0.20) !important',
    },
  },
  printingTypesContent: {
    width: '100%',
    height: '100%',
    // padding: '8px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  printingTypesContentBlur: {
    width: '100%',
    height: '100%',
    background: `#ffffff24`,
    backgroundBlendMode: 'soft-light, normal',
    boxShadow: '0px 40px 80px 0px rgba(0, 0, 0, 0.10)',
    filter: 'blur(2px)',
  },
  printingTypesContentMsg: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  contentMsgBut: {
    borderRadius: '13px !important',
    border: '0.9px solid #4D4D4D !important',
    background: '#282729 !important',
    // width: '70px !important',
    // height: '35px',
    color: '#CACCD2 !important',
    flexShrink: 0,
  },
  contentMsgText: {
    borderRadius: '8.998px',
    border: '0.9px solid #4D4D4D',
    background: '#282729',
    backdropFilter: 'blur(22.49452781677246px)',
    width: '188px',
    flexShrink: 0,
    margin: '8px 16px !important',
    '& .MuiOutlinedInput-input': {
      color: '#CACCD2 !important',
      height: '24px',
    },
  },
  footerWrraper: {
    width: '100%',
    height: '15%',
    padding: '16px',
    display: 'flex',
  },
  divider: {
    borderColor: '#4D4D4D !important',

    '& .MuiDivider-root': {
      borderColor: '#4D4D4D',
    },
  },
}));