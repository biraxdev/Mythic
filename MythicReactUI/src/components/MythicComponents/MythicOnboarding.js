import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Stepper, Step, StepLabel, StepContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ONBOARDING_KEY = 'mythic_onboarding_completed';

const steps = [
    {
        label: 'Welcome to Mythic',
        description: 'Mythic is a command and control (C2) framework for managing remote operations. This guide will help you get started with the basics.',
    },
    {
        label: 'Set Up an Operation',
        description: 'Operations are workspaces that organize your sessions, agents, and data. Start by creating or selecting an operation from the Operations page.',
        action: { label: 'Go to Operations', path: '/new/operations' },
    },
    {
        label: 'Create Your First Agent',
        description: 'Agents (payloads) are the software that runs on target systems. Use the Create Agent page to build one with your desired settings and communication profiles.',
        action: { label: 'Create Agent', path: '/new/createpayload' },
    },
    {
        label: 'Monitor Active Sessions',
        description: 'Once an agent connects back, it appears in Active Sessions. From there you can interact with it, browse files, and run commands.',
        action: { label: 'View Sessions', path: '/new/callbacks' },
    },
    {
        label: 'Explore & Search',
        description: 'Use the search features to find sessions, commands, files, credentials, and more. Press "/" or Ctrl+K anywhere to jump to search. Press "?" to see all keyboard shortcuts.',
    },
];

export const MythicOnboarding = () => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [activeStep, setActiveStep] = React.useState(0);

    React.useEffect(() => {
        const completed = localStorage.getItem(ONBOARDING_KEY);
        if (!completed) {
            setOpen(true);
        }
    }, []);

    const handleNext = () => {
        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    const handleFinish = () => {
        localStorage.setItem(ONBOARDING_KEY, 'true');
        setOpen(false);
    };

    const handleSkip = () => {
        localStorage.setItem(ONBOARDING_KEY, 'true');
        setOpen(false);
    };

    const handleAction = (path) => {
        localStorage.setItem(ONBOARDING_KEY, 'true');
        setOpen(false);
        navigate(path);
    };

    return (
        <Dialog
            open={open}
            onClose={handleSkip}
            maxWidth="sm"
            fullWidth
            aria-labelledby="onboarding-dialog-title"
        >
            <DialogTitle id="onboarding-dialog-title">
                Getting Started
                <Typography variant="body2" style={{ opacity: 0.7, marginTop: '4px' }}>
                    Quick setup guide for new users
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel
                                sx={{
                                    '& .MuiStepLabel-root .Mui-completed': { color: 'success.main' },
                                    '& .MuiStepLabel-root .Mui-active': { color: 'info.main' },
                                }}
                            >
                                {step.label}
                            </StepLabel>
                            <StepContent>
                                <Typography variant="body2" style={{ marginBottom: '16px', lineHeight: 1.6 }}>
                                    {step.description}
                                </Typography>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {index > 0 && (
                                        <Button size="small" onClick={handleBack}>
                                            Back
                                        </Button>
                                    )}
                                    {step.action && (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="info"
                                            onClick={() => handleAction(step.action.path)}
                                        >
                                            {step.action.label}
                                        </Button>
                                    )}
                                    {index < steps.length - 1 ? (
                                        <Button size="small" variant="contained" onClick={handleNext}>
                                            Next
                                        </Button>
                                    ) : (
                                        <Button size="small" variant="contained" color="success" onClick={handleFinish}>
                                            Get Started
                                        </Button>
                                    )}
                                </div>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSkip} size="small" style={{ opacity: 0.7 }}>
                    Skip Guide
                </Button>
            </DialogActions>
        </Dialog>
    );
};
