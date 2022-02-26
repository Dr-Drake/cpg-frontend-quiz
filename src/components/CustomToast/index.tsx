import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React from 'react';

export interface CustomToastProps{
    errOpen?: boolean;
    onErrClose?: (arg: any) => any;
    errMessage?: string;
    successOpen?: boolean;
    onSuccessClose?: (arg: any) => any;
    successMessage?: string;
}

const CustomToast: React.FC<CustomToastProps> = ({
    errOpen = false, successOpen = false, onErrClose,
    onSuccessClose, errMessage, successMessage
}) =>{

    return(
        <>
        <Snackbar
            open={errOpen}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={onErrClose}
        >
            <Alert severity="error" onClose={onErrClose} >
                { errMessage }
            </Alert>
        </Snackbar>
        <Snackbar
            open={successOpen}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={onSuccessClose}
        >
            <Alert severity="success" onClose={onSuccessClose} >
                { successMessage }
            </Alert>
        </Snackbar>
        </>
    )
}

export default CustomToast;