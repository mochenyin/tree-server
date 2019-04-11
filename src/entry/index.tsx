import * as React from 'react';
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";
import App from '../app';
const HTMLElement=document.getElementById('root');
render(
    <AppContainer>
        <App />
    </AppContainer>
  ,
  HTMLElement
);

declare let module: { hot: any };

if (module.hot) {
    module.hot.accept('../app', () => {
        const NewApp = require('../app').default;
        render(
            <AppContainer>
                <NewApp/>
            </AppContainer>,
            HTMLElement
        );
    });
}