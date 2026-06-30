import React from 'react';
import { Breadcrumbs, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const routeLabels = {
    'new': 'Home',
    'callbacks': 'Active Sessions',
    'payloads': 'Manage Agents',
    'createpayload': 'Create Agent',
    'createwrapper': 'Create Wrapper',
    'payloadtypes': 'Installed Services',
    'operations': 'Operations',
    'browserscripts': 'Agent Scripts',
    'search': 'Search',
    'settings': 'Settings',
    'mitre': 'MITRE ATT&CK',
    'reporting': 'Reports',
    'tagtypes': 'Tags',
    'eventing': 'Automation',
    'eventfeed': 'Event Feed',
    'task': 'Task Details',
    'tasks': 'Tasks',
    'c2profiles': 'Connection Types',
    'services': 'Services',
};

export const MythicBreadcrumbs = () => {
    const location = useLocation();
    const theme = useTheme();
    const pathnames = location.pathname.split('/').filter(x => x && x !== 'new');

    if (pathnames.length === 0) {
        return null;
    }

    return (
        <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" style={{color: theme.palette.text.primary, opacity: 0.5}} />}
            aria-label="breadcrumb"
            style={{
                padding: '4px 16px',
                fontSize: '0.75rem',
            }}
        >
            <Link
                to="/new"
                style={{
                    color: theme.palette.text.primary,
                    opacity: 0.7,
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                }}
            >
                Dashboard
            </Link>
            {pathnames.map((value, index) => {
                const to = `/new/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const label = routeLabels[value] || value;

                if (isLast) {
                    return (
                        <Typography
                            key={to}
                            style={{
                                color: theme.palette.text.primary,
                                fontSize: '0.75rem',
                                fontWeight: 500,
                            }}
                        >
                            {label}
                        </Typography>
                    );
                }

                return (
                    <Link
                        key={to}
                        to={to}
                        style={{
                            color: theme.palette.text.primary,
                            opacity: 0.7,
                            textDecoration: 'none',
                            fontSize: '0.75rem',
                        }}
                    >
                        {label}
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
};
