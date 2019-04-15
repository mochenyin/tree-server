import * as React from 'react';
import GameGobang from './game/game-gobang';
import GamePiano from './game/game-piano';
import {message,Button,Tabs} from 'antd';
import {UserInfoProtype} from "../../common/commonInterface";
const TabPane = Tabs.TabPane;
interface Props {
    userInfo: UserInfoProtype;
    changeContent:(pageKey:string)=>void;
}

interface State {
    initLeft:number;
}

export default class GamePage extends React.Component<Props,State> {
    private gamePageRef: React.RefObject<HTMLDivElement>;
    constructor(props:Props) {
        super(props);
        this.state= {
            initLeft:0,
        };
        this.gamePageRef=React.createRef();
    }
    componentDidMount() {
        this.setState({
            initLeft:this.gamePageRef.current.offsetLeft,
        });
    }
    render() {
        return (<div id="gamePage" ref={this.gamePageRef}>
            <Tabs tabPosition="left">
                <TabPane tab="五指棋" key="1">
                    <GameGobang {...this.props} initLeft={this.state.initLeft} />
                    </TabPane>
                <TabPane tab="钢琴" key="2">
                    <GamePiano />
                </TabPane>
            </Tabs>
        </div>);
    }
}