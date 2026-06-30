import React from 'react';
import { Typography, Button, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

export const MythicEmptyState = ({title, description, actionText, actionLink, icon, onAction}) => {
    const theme = useTheme();
    return (
        <Paper 
            elevation={0}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 24px',
                textAlign: 'center',
                backgroundColor: 'transparent',
                minHeight: '300px',
            }}
        >
            {icon && (
                <div style={{
                    fontSize: '48px',
                    marginBottom: '16px',
                    opacity: 0.5,
                    color: theme.palette.text.primary,
                }}>
                    {icon}
                </div>
            )}
            <Typography 
                variant="h6" 
                style={{
                    marginBottom: '8px',
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                }}
            >
                {title}
            </Typography>
            <Typography 
                variant="body2" 
                style={{
                    marginBottom: '24px',
                    color: theme.palette.text.primary,
                    opacity: 0.7,
                    maxWidth: '400px',
                }}
            >
                {description}
            </Typography>
            {actionText && actionLink && (
                <Button
                    component={Link}
                    to={actionLink}
                    variant="contained"
                    color="primary"
                    size="medium"
                >
                    {actionText}
                </Button>
            )}
            {actionText && onAction && !actionLink && (
                <Button
                    onClick={onAction}
                    variant="contained"
                    color="primary"
                    size="medium"
                >
                    {actionText}
                </Button>
            )}
        </Paper>
    );
};
