import {
  ButtonItem,
  definePlugin,
  DialogButton,
  Menu,
  MenuItem,
  Navigation,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  showContextMenu,
  staticClasses,
} from "decky-frontend-lib";
import { useEffect, useState, VFC } from "react";
import { FaShip } from "react-icons/fa";
import QRCode from 'qrcode.react';

import logo from "../assets/logo.png";

interface GetFileBrowserStatusResult { result: { pid: string | number, ipv4_address: string }, success: boolean };

const Content: VFC<{ serverAPI: ServerAPI }> = ({serverAPI}) => {
  const [ serverStatus, setServerStatus ] = useState( false );
  const [ serverIP, setServerIP ] = useState( "127.0.0.1" );
  const [ processPID, setProcessPID ] = useState( -1 );

  const handleStartServer = async () => {
    if ( serverStatus && processPID > 0 ) {
      console.log( 'Server is running, closing' );
      const result = await serverAPI.callPluginMethod("stopFileBrowser", {
        pid: processPID
      });

      console.log( result );

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

    const result = await serverAPI.callPluginMethod("startFileBrowser", {})

    if (result.success) {
      setProcessPID( result.result as number )
      setServerStatus( true );
    } else {
      console.error( result );
    }

  }

  useEffect( () => {
    const loadStatus = async () => {
      const result = await serverAPI.callPluginMethod("getFileBrowserStatus", {}) as GetFileBrowserStatusResult;

      if (result.result) {
        setProcessPID( result.result.pid as number );
        setServerStatus( true );
        setServerIP( result.result.ipv4_address );
      } else {
        setProcessPID( -1 );
        setServerStatus( false );
      }
    }
    loadStatus();
  } );

  return (
    <PanelSection title={ serverStatus ? "Server ON" : "Server OFF" }>
      <PanelSectionRow>
        <ButtonItem layout="below"
          onClick={handleStartServer}
        >
          { serverStatus ? "Stop Server" : "Start Server" }
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        { processPID > 0 && serverStatus ?
          <QRCode value={ `http://${serverIP}:8082` } />
          : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img src={logo} />
            </div>
          )
        }
      </PanelSectionRow>
    </PanelSection>
  );
};

const DeckyPluginRouterTest: VFC = () => {
  return (
    <div style={{ marginTop: "50px", color: "white" }}>
      Hello World!
      <DialogButton onClick={() => Navigation.NavigateToLibraryTab()}>
        Go to Library
      </DialogButton>
    </div>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  serverApi.routerHook.addRoute("/decky-plugin-test", DeckyPluginRouterTest, {
    exact: true,
  });

  return {
    title: <div className={staticClasses.Title}>Example Plugin</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaShip />,
    onDismount() {
      serverApi.routerHook.removeRoute("/decky-plugin-test");
    },
  };
});
