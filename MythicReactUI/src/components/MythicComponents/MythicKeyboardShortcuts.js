import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, Typography, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const shortcuts = [
    { category: 'Navigation', items: [
        { keys: ['g', 'd'], description: 'Go to Dashboard' },
        { keys: ['g', 's'], description: 'Go to Active Sessions' },
        { keys: ['g', 'a'], description: 'Go to Manage Agents' },
        { keys: ['g', 'c'], description: 'Go to Create Agent' },
        { keys: ['g', 'o'], description: 'Go to Operations' },
        { keys: ['g', 'e'], description: 'Go to Automation' },
    ]},
    { category: 'Actions', items: [
        { keys: ['?'], description: 'Show keyboard shortcuts' },
        { keys: ['/', 'Ctrl+K'], description: 'Focus search' },
    ]},
];

export const MythicKeyboardShortcuts = () => {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const pendingKey = React.useRef(null);
    const timeoutRef = React.useRef(null);

    React.useEffect(() => {
        const handler = (e) => {
            const tag = e.target.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) {
                return;
            }

            if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                setOpen(prev => !prev);
                return;
            }

            if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
                e.preventDefault();
                navigate('/new/search?tab=tasks&searchField=Command+and+Parameters&search=&taskStatus=');
                return;
            }

            if (e.key === 'Escape') {
                setOpen(false);
                return;
            }

            if (pendingKey.current === 'g') {
                clearTimeout(timeoutRef.current);
                pendingKey.current = null;
                switch (e.key) {
                    case 'd': navigate('/new'); break;
                    case 's': navigate('/new/callbacks'); break;
                    case 'a': navigate('/new/payloads'); break;
                    case 'c': navigate('/new/createpayload'); break;
                    case 'o': navigate('/new/operations'); break;
                    case 'e': navigate('/new/eventing'); break;
                    default: break;
                }
                return;
            }

            if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
                pendingKey.current = 'g';
                timeoutRef.current = setTimeout(() => {
                    pendingKey.current = null;
                }, 1000);
                return;
            }
        };

        document.addEventListener('keydown', handler);
        return () => {
            document.removeEventListener('keydown', handler);
            clearTimeout(timeoutRef.current);
        };
    }, [navigate]);

    return (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogContent>
                {shortcuts.map((section) => (
                    <div key={section.category} style={{ marginBottom: '16px' }}>
                        <Typography variant="overline" style={{ opacity: 0.6, letterSpacing: '0.08em' }}>
                            {section.category}
                        </Typography>
                        <Divider style={{ marginBottom: '8px' }} />
                        {section.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                                <Typography variant="body2">{item.description}</Typography>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {item.keys.map((key, j) => (
                                        <kbd key={j} style={{
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            border: `1px solid ${theme.palette.divider}`,
                                            backgroundColor: theme.palette.background.paper,
                                            fontFamily: 'monospace',
                                            fontSize: '12px',
                                        }}>
                                            {key}
                                        </kbd>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </DialogContent>
        </Dialog>
    );
};
