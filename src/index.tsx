import {
  ButtonItem,
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
  TextField,
  Navigation,
} from "decky-frontend-lib";
import { useContext, useEffect, useState, VFC } from "react";
import { FaServer } from "react-icons/fa";
import { QRCodeSVG } from 'qrcode.react';
import Settings from './settings';
import { AppContext, AppContextProvider } from './utils/app-context';
import FileBrowserManager from './state/filebrowser-manager';

const Content: VFC = () => {
  const [ isLoading, setIsLoading ] = useState( false );
  const [ serverStatus, setServerStatus ] = useState( false );
  const [ serverIP, setServerIP ] = useState( "127.0.0.1" );
  const [ processPID, setProcessPID ] = useState( -1 );
  const [ port, setPort ] = useState( null );

  // @ts-ignore
  const { fileBrowserManager } = useContext(AppContext);
  const serverApi = fileBrowserManager.getServer();

  const isServerRunning = serverStatus && processPID > 0;

  const handleStartServer = async () => {
    if ( isServerRunning ) {
      console.log( 'Server is running, closing' );
      const result = await serverApi.callPluginMethod("stopFileBrowser", {
        pid: processPID
      });

      if (result.success) {
        setProcessPID( -1 );
        setServerStatus( false );
        console.log( 'Server closed' );
      } else {
        console.log( 'Failed to close the server' );
        console.error( result );
      }

      return;
    }

    const result = await serverApi.callPluginMethod("startFileBrowser", {
      port: fileBrowserManager.getPort()
    });

    if (result.success) {
      await fileBrowserManager.getFileBrowserStatus();
      setServerIP( fileBrowserManager.getIPV4Address() );
      setProcessPID( result.result as number )
      setServerStatus( true );
    } else {
      console.error( result );
    }
  }

  const handleGoToSettings = () => {
    Navigation.CloseSideMenus();
    Navigation.Navigate("/decky-filebrowser-settings")
  }

  useEffect( () => {
    const loadStatus = async () => {
      setIsLoading( true );
      await fileBrowserManager.getFileBrowserStatus();
      setPort( fileBrowserManager.getPort() );
      setIsLoading( false );
    }

    loadStatus();
  }, [] );

  return (
    <>
      <PanelSection title={ isServerRunning ? "Server ON" : "Server OFF" }>
        <PanelSectionRow>
          <ButtonItem layout="below"
            onClick={handleStartServer}
            disabled={ isLoading }
          >
            { isServerRunning ? "Stop Server" : "Start Server" }
          </ButtonItem>
        </PanelSectionRow>

        { isServerRunning ? (
          <>
            <PanelSectionRow>
              { `http://${serverIP}:${port}` }
            </PanelSectionRow>
            <PanelSectionRow>
                <QRCodeSVG
                  value={ `http://${serverIP}:${port}` }
                  size={256}
                />

            </PanelSectionRow>
          </>
        ) : (
          <>
            <PanelSectionRow>
              <ButtonItem
                layout="below"
                onClick={ handleGoToSettings }
                disabled={ isLoading }
              >
                Go to Settings
              </ButtonItem>
            </PanelSectionRow>
          </>
          )
        }
      </PanelSection>
      <PanelSection title={ "Current Settings" }>
        { isLoading ?
          "Loading..."
          : (
            <PanelSectionRow>
              Port: { port }
            </PanelSectionRow>
          )
        }
      </PanelSection>
    </>
  );
};



export default definePlugin((serverApi: ServerAPI) => {
  const fileBrowserManager = new FileBrowserManager( serverApi );

  serverApi.routerHook.addRoute("/decky-filebrowser-settings", () => (
      <AppContextProvider fileBrowserManager={fileBrowserManager}>
      <Settings />
    </AppContextProvider>
  ), {
    exact: true,
  });


  return {
    title: <div className={staticClasses.Title}>File Browser</div>,
    content: (
      <AppContextProvider fileBrowserManager={fileBrowserManager} >
        <Content />
      </AppContextProvider>
    ),
    icon: <FaServer />,
    onDismount: () => {
      serverApi.routerHook.removeRoute("/decky-filebrowser-settings");
    }
  };
});
