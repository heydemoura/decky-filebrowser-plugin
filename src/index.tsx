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

import logo from "../assets/logo.png";

// interface AddMethodArgs {
//   left: number;
//   right: number;
// }

const Content: VFC<{ serverAPI: ServerAPI }> = ({serverAPI}) => {
  // const [result, setResult] = useState<number | undefined>();

  // const onClick = async () => {
  //   const result = await serverAPI.callPluginMethod<AddMethodArgs, number>(
  //     "add",
  //     {
  //       left: 2,
  //       right: 2,
  //     }
  //   );
  //   if (result.success) {
  //     setResult(result.result);
  //   }
  // };

  const [ serverStatus, setServerStatus ] = useState( false );
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
      const result = await serverAPI.callPluginMethod("getFileBrowserStatus", {});

      console.log (result.result);
      if (result.result) {
        setProcessPID( result.result as number );
        setServerStatus( true );
      } else {
        setProcessPID( -1 );
        setServerStatus( false );
      }
    }
    loadStatus();
  } );

  return (
    <PanelSection title="Panel Section">
      <PanelSectionRow>
        <ButtonItem layout="below"
        onClick={handleStartServer}
        >
          { serverStatus ? "Stop Server" : "Start Server" }
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        Server status: { serverStatus ? 'ON' : 'OFF' }
        <br />
        { processPID > 0 ? `PID: ${processPID}` : null }
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={(e) =>
            showContextMenu(
              <Menu label="Menu" cancelText="CAAAANCEL" onCancel={() => {}}>
                <MenuItem onSelected={() => {}}>Item #1</MenuItem>
                <MenuItem onSelected={() => {}}>Item #2</MenuItem>
                <MenuItem onSelected={() => {}}>Item #3</MenuItem>
              </Menu>,
              e.currentTarget ?? window
            )
          }
        >
          Server says yolo
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={logo} />
        </div>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => {
            Navigation.CloseSideMenus();
            Navigation.Navigate("/decky-plugin-test");
          }}
        >
          Router
        </ButtonItem>
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
