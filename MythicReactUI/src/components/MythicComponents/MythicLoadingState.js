import React from 'react';
import { CircularProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const MythicLoadingState = ({ message = 'Loading...', size = 40 }) => {
    const theme = useTheme();
    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={message}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 24px',
                minHeight: '200px',
            }}
        >
            <CircularProgress size={size} style={{ marginBottom: '16px' }} />
            <Typography
                variant="body2"
                style={{
                    color: theme.palette.text.primary,
                    opacity: 0.7,
                }}
            >
                {message}
            </Typography>
        </div>
    );
};
