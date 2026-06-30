import { makeVar } from '@apollo/client';
import {restartWebsockets} from "./index";
import {snackActions} from "./components/utilities/Snackbar";

export const meState = makeVar({loggedIn:false, user: null, access_token: null, refresh_token: null});
export const alertCount = makeVar(0);
export const taskTimestampDisplayFieldOptions = [
    {
        name: "timestamp",
        display: "Latest Timestamp for anything task related"
    },
    {
        name: "status_timestamp_preprocessing",
        display: "When Operator Submitted Task"
    },
    {
        name: "status_timestamp_processing",
        display: "When Agent Picked up Task",
    }
]
export const taskingContextFieldsOptions = ["impersonation_context", "cwd", "user", "host", "ip", "pid", "process_short_name", "extra_info", "architecture"].sort();
export const defaultShortcuts = [
    "ActiveCallbacks", "Payloads", "PayloadTypesAndC2",
    "Operations", "SearchFiles", "SearchProxies",
    "CreatePayload", "Eventing",
].sort();
export const operatorSettingDefaults =  {
    fontSize: 12,
    navBarOpen: false,
    fontFamily: "Verdana, Arial, sans-serif",
    showMedia: true,
    hideUsernames: false,
    showIP: false,
    showHostname: false,
    showOPSECBypassUsername: false,
    showCallbackGroups: false,
    useDisplayParamsForCLIHistory: true,
    interactType: "interactSplit",
    taskTimestampDisplayField: "timestamp",
    callbacks_table_columns: ["Interact", "Host", "Domain", "User", "Description", "Last Checkin", "Agent",  "IP", "PID"],
    callbacks_table_filters: {},
    autoTaskLsOnEmptyDirectories: false,
    hideBrowserTasking: false,
    hideTaskingContext: false,
    taskingContextFields: ["impersonation_context", "cwd"],
    ["experiment-responseStreamLimit"]: 200,
    sideShortcuts: defaultShortcuts,
    palette: {
        primary: {
            dark: "#75859b",
            light: "#75859b",
        },
        error: {
            dark: '#bd5142',
            light: '#c42c32'
        },
        success: {
            dark: '#85b089',
            light: '#0e7004',
        },
        secondary: {
            dark: '#bebebe',
            light: '#a6a5a5'
        },
        info: {
            dark: '#84b4dc',
            light: '#4990b2'
        },
        warning: {
            dark: "#dc8455",
            light: "#ffb74d",
        },
        background: {
            dark: '#282828',
            light: '#f6f6f6'
        },
        paper: {
            dark: '#282828',
            light: '#ececec'
        },
        tableHeader: {
            dark: '#484848',
            light: '#c4c4c4'
        },
        tableHover: {
            dark: "#3c3c3c",
            light: "#e8e8e8",
        },
        pageHeader: {
            dark: '#1b2025',
            light: '#706c6e'
        },
        text: {
            dark: "#e4e4e4",
            light: "#000000",
        },
        selectedCallbackColor: {
            dark: '#26456e',
            light: '#c6e5f6',
        },
        selectedCallbackHierarchyColor: {
            dark: '#273e5d',
            light: '#deeff8',
        },
        backgroundImage: {
            dark: null,
            light: null
        },
        navBarIcons: {
            dark: '#ffffff',
            light: '#ffffff'
        },
        navBarText: {
            dark: '#ffffff',
            light: '#ffffff'
        },
        navBarColor: {
            dark: "#194573",
            light: "#3b606d",
        },
        navBarBottomColor: {
            dark: "#330814",
            light: "#283581",
        },
        taskPromptTextColor: {
            dark: '#bebebe',
            light: '#a6a5a5'
        },
        taskPromptCommandTextColor: {
            dark: "#e4e4e4",
            light: "#000000",
        },
        taskContextColor: {
            dark: "#122848",
            light: "#acc0da",
        },
        taskContextImpersonationColor: {
            dark: "#641616",
            light: "#dec0c0",
        },
        taskContextExtraColor: {
            dark: "#2a5953",
            light: "#a7ce9d",
        },
        emptyFolderColor: {
            dark: '#bebebe',
            light: '#a6a5a5'
        },
        outputBackgroundColor: {
            dark: '#282828',
            light: '#f6f6f6'
        },
        outputTextColor: {
            dark: '#f6f6f6',
            light: '#282828',
        },
        borderColor: {
            dark: "#595858",
            light: "#c5c5c5"
        }
    },
}

export const themePresets = {
    "Default": operatorSettingDefaults.palette,
    "Midnight": {
        ...operatorSettingDefaults.palette,
        primary: { dark: "#6c8ebf", light: "#4a7ab5" },
        background: { dark: "#1a1a2e", light: "#f0f0ff" },
        paper: { dark: "#16213e", light: "#e8e8f5" },
        navBarColor: { dark: "#0f3460", light: "#2c3e8c" },
        navBarBottomColor: { dark: "#1a1a2e", light: "#1a1a4e" },
        pageHeader: { dark: "#0f3460", light: "#2c3e8c" },
        tableHeader: { dark: "#1e3a5f", light: "#b8c8e8" },
    },
    "Forest": {
        ...operatorSettingDefaults.palette,
        primary: { dark: "#6b9e6b", light: "#3a7a3a" },
        success: { dark: "#7cc47c", light: "#2d8a2d" },
        background: { dark: "#1a2e1a", light: "#f0f5f0" },
        paper: { dark: "#1e321e", light: "#e5ede5" },
        navBarColor: { dark: "#1a3a1a", light: "#2d5a2d" },
        navBarBottomColor: { dark: "#0d1f0d", light: "#1a4a1a" },
        pageHeader: { dark: "#1a3a1a", light: "#2d5a2d" },
        tableHeader: { dark: "#2a4a2a", light: "#b8d8b8" },
    },
    "Crimson": {
        ...operatorSettingDefaults.palette,
        primary: { dark: "#b85c5c", light: "#a03030" },
        error: { dark: "#d44040", light: "#c02020" },
        background: { dark: "#2e1a1a", light: "#f5f0f0" },
        paper: { dark: "#321e1e", light: "#ede5e5" },
        navBarColor: { dark: "#5c1a1a", light: "#8a2020" },
        navBarBottomColor: { dark: "#3a0d0d", light: "#601515" },
        pageHeader: { dark: "#5c1a1a", light: "#8a2020" },
        tableHeader: { dark: "#4a2a2a", light: "#d8b8b8" },
    },
    "High Contrast": {
        ...operatorSettingDefaults.palette,
        primary: { dark: "#ffffff", light: "#000000" },
        text: { dark: "#ffffff", light: "#000000" },
        background: { dark: "#000000", light: "#ffffff" },
        paper: { dark: "#1a1a1a", light: "#f0f0f0" },
        tableHeader: { dark: "#333333", light: "#cccccc" },
        navBarColor: { dark: "#1a1a1a", light: "#333333" },
        navBarBottomColor: { dark: "#000000", light: "#1a1a1a" },
    },
};

export const mePreferences = makeVar(operatorSettingDefaults);


export const successfulLogin = (data) => {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    let now = new Date();
    let serverNow = new Date(data.user.current_utc_time);
    const difference = (serverNow.getTime() - now.getTime());
    let me = {...data.user};
    me.server_skew = difference;
    me.login_time = now;
    meState({
        loggedIn: true,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: {
            ...me
        }
    });
    localStorage.setItem("user", JSON.stringify(me));
    restartWebsockets();
}
export const successfulRefresh = (data) => {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    let now = new Date();
    let serverNow = new Date(data.user.current_utc_time);
    const difference = (serverNow.getTime() - now.getTime()) ;
    let me = {...meState().user};
    me.server_skew = difference;
    me.login_time = now;
    meState({
        loggedIn: true,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: {
            ...me
        }
    });
    localStorage.setItem("user", JSON.stringify(me));
}
export const FailedRefresh = (restart_websockets) =>{
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    // retrieve all cookies
    let Cookies = document.cookie.split(';');
    // set past expiry to all cookies
    for (let i = 0; i < Cookies.length; i++) {
        document.cookie = Cookies[i] + "=; expires="+ new Date(0).toUTCString();
    }
    meState({
        loggedIn: false,
        access_token: null,
        refresh_token: null,
        user: null
    });
    mePreferences(operatorSettingDefaults);
    snackActions.clearAll();
    if(restart_websockets){
        restartWebsockets();
    }

}

