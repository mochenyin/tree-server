import * as React from 'react';

interface Props {

}
interface State {

}
const pianoKey=[
    'A₂','B₂',
    'C₁','D₁','E₁','F₁','G₁','A₁','B₁',
    'C','D','E','F','G','A','B',
    'c','d','e','f','g','a','b',
    'C¹','D¹','E¹','F¹','G¹','A¹','B¹',
    'C²','D²','E²','F²','G²','A²','B²',
    'C³','D³','E³','F³','G³','A³','B³',
    'C⁴','D⁴','E⁴','F⁴','G⁴','A⁴','B⁴',
    'C⁵'
];
export default class GamePiano extends React.Component<Props,State> {
    constructor(props:Props) {
        super(props);
    }
    render() {
        return (
            <div id="pianoPanel">
                {pianoKey.map(item=> {
                    let po;
                    if(item.match(/a|c|d|f|g/gi)) {
                        if(item.match(/a|d/gi)) {
                             po='right';
                        }
                        else if(item.match(/g/gi)) {
                             po='center';
                        }
                        else {
                            if(item!=='C⁵') {
                                po='left';
                            }
                        }
                    }
                   return <span key='item' className='singleKeyItem'>
                       {po?<span className={'blackKey '+po}></span>:''}
                   </span>;
                })}
            </div>
        );
    }
}