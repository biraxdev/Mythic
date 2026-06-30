import { LoginForm } from './pages/Login/LoginForm';
import { Settings } from './pages/Settings/Settings';
import { PayloadTypesC2Profiles } from './pages/PayloadTypesC2Profiles/PayloadTypesC2Profiles';
import { CreatePayload } from './pages/CreatePayload/CreatePayload';
import { CreatePayloadWrapper } from './pages/CreateWrapper/CreatePayload';
import { EventFeed } from './pages/EventFeed/EventFeed';
import { Operations } from './pages/Operations/Operations';
import { BrowserScripts } from './pages/BrowserScripts/BrowserScripts';
import { Payloads } from './pages/Payloads/Payloads';
import { ExpandedCallback } from './pages/ExpandedCallback/ExpandedCallback';
import { Home } from './pages/Home/Home';
import { LoggedInRoute } from './utilities/LoggedInRoute';
import { Callbacks } from './pages/Callbacks/Callbacks';
import { Search } from './pages/Search/Search';
import React, {createContext} from 'react';
import { Typography } from '@mui/material';
import { useReactiveVar } from '@apollo/client';
import { useDarkMode } from './utilities/useDarkMode';
import { SingleTaskView } from './pages/SingleTaskView/SingleTaskView';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { GlobalStyles } from '../themes/GlobalStyles';
import CssBaseline from '@mui/material/CssBaseline';
import {FailedRefresh, mePreferences, meState, operatorSettingDefaults} from '../cache';
import { Reporting } from './pages/Reporting/Reporting';
import { MitreAttack } from './pages/MITRE_ATTACK/MitreAttack';
import {Tags} from './pages/Tags/Tags';
import { Tooltip } from 'react-tooltip';
import {useLazyQuery, gql } from '@apollo/client';
//background-color: #282c34;
import { Route, Routes } from 'react-router-dom';
import { useInterval } from './utilities/Time';
import { JWTTimeLeft, isJWTValid } from '../index';
import { RefreshTokenDialog } from './RefreshTokenDialog';
import { MythicDialog } from './MythicComponents/MythicDialog';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {Eventing} from "./pages/Eventing/Eventing";
import {InviteForm} from "./pages/Login/InviteForm";
import {snackActions} from "./utilities/Snackbar";
import {TopAppBarVertical} from "./TopAppBarVertical";
import {Jupyter} from "./pages/Jupyter/Jupyter";
import {Hasura} from "./pages/Hasura/Hasura";
import {MythicKeyboardShortcuts} from "./MythicComponents/MythicKeyboardShortcuts";
import {MythicBreadcrumbs} from "./MythicComponents/MythicBreadcrumbs";
import {MythicOnboarding} from "./MythicComponents/MythicOnboarding";

export const MeContext = createContext({});
export const userSettingsQuery = gql`
query getUserSettings {
    getOperatorPreferences {
        status
        error
        preferences
    }
}
`;

const resolveColor = (prefs, defaults, key, mode) => {
    const isDark = mode === 'dark';
    const prefVal = isDark ? prefs?.[key]?.dark : prefs?.[key]?.light;
    const defaultVal = isDark ? defaults[key].dark : defaults[key].light;
    return prefVal || defaultVal;
};

const buildThemeConfig = (mode, prefs, defaults, fontFamily) => ({
    transitions: {
        create: () => 'all 0.2s ease-in-out',
    },
    palette: {
        contrastThreshold: 4.5,
        primary: { main: resolveColor(prefs, defaults, 'primary', mode) },
        error: { main: resolveColor(prefs, defaults, 'error', mode) },
        success: { main: resolveColor(prefs, defaults, 'success', mode) },
        secondary: { main: resolveColor(prefs, defaults, 'secondary', mode) },
        info: { main: resolveColor(prefs, defaults, 'info', mode) },
        warning: { main: resolveColor(prefs, defaults, 'warning', mode) },
        mode,
        background: {
            contrast: mode === 'dark'
                ? (prefs?.background?.light || defaults.background.light)
                : (prefs?.background?.dark || defaults.background.dark),
            default: resolveColor(prefs, defaults, 'background', mode),
            paper: resolveColor(prefs, defaults, 'paper', mode),
            image: resolveColor(prefs, defaults, 'backgroundImage', mode),
        },
        text: {
            primary: resolveColor(prefs, defaults, 'text', mode),
            contrast: mode === 'dark' ? '#000' : '#fff',
        },
        graphGroupRGBA: mode === 'dark' ? 'rgba(57, 76, 93, 0.5)' : 'rgba(211, 215, 232, 0.5)',
        speedDialAction: mode === 'dark' ? '#495054' : '#ffffff',
    },
    folderColor: '#f1d592',
    tableHeader: resolveColor(prefs, defaults, 'tableHeader', mode),
    selectedCallbackColor: resolveColor(prefs, defaults, 'selectedCallbackColor', mode),
    selectedCallbackHierarchyColor: resolveColor(prefs, defaults, 'selectedCallbackHierarchyColor', mode),
    tableHover: resolveColor(prefs, defaults, 'tableHover', mode),
    navBarTextIconColor: resolveColor(prefs, defaults, 'navBarIcons', mode),
    navBarTextColor: resolveColor(prefs, defaults, 'navBarText', mode),
    pageHeader: { main: resolveColor(prefs, defaults, 'pageHeader', mode) },
    pageHeaderText: { main: 'white' },
    topAppBarColor: resolveColor(prefs, defaults, 'navBarColor', mode),
    topAppBarBottomColor: resolveColor(prefs, defaults, 'navBarBottomColor', mode),
    typography: { fontSize: 12, fontFamily },
    taskPromptTextColor: resolveColor(prefs, defaults, 'taskPromptTextColor', mode),
    taskPromptCommandTextColor: resolveColor(prefs, defaults, 'taskPromptCommandTextColor', mode),
    taskContextColor: resolveColor(prefs, defaults, 'taskContextColor', mode),
    taskContextImpersonationColor: resolveColor(prefs, defaults, 'taskContextImpersonationColor', mode),
    taskContextExtraColor: resolveColor(prefs, defaults, 'taskContextExtraColor', mode),
    emptyFolderColor: resolveColor(prefs, defaults, 'emptyFolderColor', mode),
    outputBackgroundColor: resolveColor(prefs, defaults, 'outputBackgroundColor', mode),
    outputTextColor: resolveColor(prefs, defaults, 'outputTextColor', mode),
    borderColor: resolveColor(prefs, defaults, 'borderColor', mode),
});

export function App(props) {
    const me = useReactiveVar(meState);
    const preferences = useReactiveVar(mePreferences);
    const [loadingPreference, setLoadingPreferences] = React.useState(true);
    const [themeMode, themeToggler] = useDarkMode();
    const theme = React.useMemo(
        () => {
            try{
                return createTheme(buildThemeConfig(themeMode, preferences?.palette, operatorSettingDefaults.palette, preferences?.fontFamily));
            }catch(error){
                snackActions.error(error.message);
                return createTheme(buildThemeConfig(themeMode, null, operatorSettingDefaults.palette, operatorSettingDefaults?.fontFamily));
            }
        },[themeMode, loadingPreference, preferences.fontSize, preferences.fontFamily, preferences.palette]
    );
    const mountedRef = React.useRef(true);
    const [openRefreshDialog, setOpenRefreshDialog] = React.useState(false);
    const [getUserPreferences] = useLazyQuery(userSettingsQuery, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            if(data.getOperatorPreferences.status === "success"){
                if(data.getOperatorPreferences.preferences !== null){
                    mePreferences({...preferences, ...data.getOperatorPreferences.preferences});
                }
            } else {
                snackActions.error(`Failed to get user preferences:\n${data.getOperatorPreferences.error}`);
            }
            setLoadingPreferences(false);
        },
        onError: (error) => {
            snackActions.error(error.message);
            setLoadingPreferences(false);
        }
    })
    useInterval( () => {
        // interval should run every 10 minutes (600000 milliseconds) to check JWT status
        let millisecondsLeft = JWTTimeLeft();
        // if we have 30min left of our token, prompt the user to extend. 30 min is 1,800,000 milliseconds
        if(millisecondsLeft <= 1800000 && !openRefreshDialog && me.loggedIn){
            if(isJWTValid()){
                setOpenRefreshDialog(true);
            }else{
                FailedRefresh();
            }
        }
    }, 600000, mountedRef, mountedRef);
    React.useEffect( () => {
        if(me.loggedIn){
            setLoadingPreferences(true);
            getUserPreferences();
        } else {
            setLoadingPreferences(false);
        }
    }, [me.loggedIn])
    if(loadingPreference){
        // make sure we've loaded preferences before loading actual app content
        return (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <GlobalStyles theme={theme} />
                    <CssBaseline />
                </ThemeProvider>
            </StyledEngineProvider>
        )
    }
    const background = theme.palette.background.image !== null ? {
        backgroundImage: "linear-gradient(" + theme.palette.background.default + "99" + "," + theme.palette.background.default + "99" + ")," + theme.palette.background.image ,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
    } : {
        backgroundColor: theme.palette.background.default
    };
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <GlobalStyles theme={theme} />
                <CssBaseline />
                <MeContext.Provider value={me}>
                    <Tooltip id={"my-tooltip"} style={{zIndex: 100000, wordBreak: "break-word", maxWidth: "80%", whiteSpace: "pre-wrap"}}/>
                    <ToastContainer limit={2} autoClose={3000}
                                    theme={themeMode}
                                    hideProgressBar={true}
                                    newestOnTop={true}
                                    stacked={false}
                                    style={{maxWidth: "100%", minWidth: "40%", display: "flex", flexWrap: "wrap",
                                    wordBreak: "break-all", flexDirection: "column", justifyContent: "center",}}
                                    pauseOnFocusLoss={false}
                    />
                    <div role="application" aria-label="Mythic Command and Control" style={{ maxHeight: '100%', height: '100%', display: 'flex', flexDirection: 'row', maxWidth: "100%", width:"100%",
                        ...background}}>
                        {openRefreshDialog &&
                            <MythicDialog fullWidth={true} maxWidth="sm" open={openRefreshDialog}
                                          onClose={()=>{setOpenRefreshDialog(false);}}
                                          innerDialog={<RefreshTokenDialog
                                              onClose={()=>{setOpenRefreshDialog(false);}} />}
                            />
                        }
                        {me.loggedIn && me.user !== undefined && me.user !== null &&
                            <TopAppBarVertical me={me} toggleTheme={themeToggler} />
                        }
                        {me.loggedIn && <MythicKeyboardShortcuts />}
                        {me.loggedIn && <MythicOnboarding />}
                        <main role="main" aria-label="Main content" style={{
                            maxHeight: '100%',
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: "hidden",
                        }}>
                            <div style={{height: "5px", width: "100%",  background: me.loggedIn ? `linear-gradient(25deg, ${theme.topAppBarColor}, ${theme.topAppBarBottomColor})` : ""}}/>
                            {me.loggedIn && me?.user?.current_operation_banner_text !== "" &&
                                <Typography style={{
                                    backgroundColor: me?.user?.current_operation_banner_color,
                                    width: "100%",
                                    textAlign: "center",
                                    fontWeight: "600",
                                    color: "white",
                                    border: `1px solid ${theme.topAppBarColor || "grey"}`
                                }}>
                                    {me?.user?.current_operation_banner_text}
                                </Typography>
                            }
                            {me.loggedIn && me?.badConnection
                                &&
                                <Typography style={{
                                    backgroundColor: theme.palette.error.main,
                                    width: "100%",
                                    textAlign: "center",
                                    fontWeight: "600",
                                    color: "white",
                                    border: `1px solid ${theme.topAppBarColor || "grey"}`
                                }}>
                                    {"Connection lost. Please check your network and refresh the page."}
                                </Typography>
                            }
                            <MythicBreadcrumbs />
                            <div style={{
                                margin: '0px 0px 0px 0px',
                                flexGrow: 1,
                                display: "flex",
                                flexDirection: 'column',
                                overflow:"hidden"
                            }}>
                                <Routes>
                                    <Route path='/new/login' element={<LoginForm me={me}/>}/>
                                    <Route path='/new/invite' element={<InviteForm me={me}/>}/>
                                    <Route path='/' element={<LoggedInRoute me={me}><Home me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new'
                                           element={<LoggedInRoute me={me}><Home me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/settings'
                                           element={<LoggedInRoute me={me}><Settings me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/payloadtypes'
                                           element={<LoggedInRoute me={me}><PayloadTypesC2Profiles
                                               me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/eventfeed'
                                           element={<LoggedInRoute me={me}><EventFeed me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/createpayload'
                                           element={<LoggedInRoute me={me}><CreatePayload me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/createwrapper'
                                           element={<LoggedInRoute me={me}><CreatePayloadWrapper
                                               me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/payloads'
                                           element={<LoggedInRoute me={me}><Payloads me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/c2profiles'
                                           element={<LoggedInRoute me={me}><PayloadTypesC2Profiles
                                               me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/services/'
                                           element={<LoggedInRoute me={me}><PayloadTypesC2Profiles
                                               me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/callbacks'
                                           element={<LoggedInRoute me={me}><Callbacks me={me}/></LoggedInRoute>}/>
                                    <Route path='/new/search'
                                           element={<LoggedInRoute me={me}><Search history={props.history}
                                                                                   me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/browserscripts'
                                           element={<LoggedInRoute me={me}><BrowserScripts me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/task/:taskId'
                                           element={<LoggedInRoute me={me}><SingleTaskView me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/tasks/by_range'
                                           element={<LoggedInRoute me={me}><SingleTaskView me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/operations'
                                           element={<LoggedInRoute me={me}><Operations me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/callbacks/:callbackDisplayId'
                                           element={<LoggedInRoute me={me}><ExpandedCallback
                                               me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/reporting'
                                           element={<LoggedInRoute me={me}><Reporting me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/mitre'
                                           element={<LoggedInRoute me={me}><MitreAttack me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/tagtypes'
                                           element={<LoggedInRoute me={me}><Tags me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/eventing'
                                           element={<LoggedInRoute me={me}><Eventing me={me}/></LoggedInRoute>}/>
                                    <Route exact path='/new/jupyter' element={<LoggedInRoute me={me}><Jupyter/></LoggedInRoute>}/>
                                    <Route exact path='/new/hasura' element={<LoggedInRoute me={me}><Hasura/></LoggedInRoute>}/>
                                </Routes>
                            </div>
                        </main>
                    </div>
                </MeContext.Provider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
