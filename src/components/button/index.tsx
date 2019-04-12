import * as React from 'react';
import './style.less';
const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
function isString(str: any) {
    return typeof str === 'string';
}
// Insert one space between two chinese characters automatically.
function insertSpace(child: React.ReactChild, needInserted: boolean) {
    // Check the child if is undefined or null.
    if (child == null) {
        return;
    }
    const SPACE = needInserted ? ' ' : '';
    // strictNullChecks oops.
    if (
        typeof child !== 'string' &&
        typeof child !== 'number' &&
        isString(child.type) &&
        isTwoCNChar(child.props.children)
    ) {
        return React.cloneElement(child, {}, child.props.children.split('').join(SPACE));
    }
    if (typeof child === 'string') {
        if (isTwoCNChar(child)) {
            child = child.split('').join(SPACE);
        }
        return <span>{child}</span>;
    }
    return child;
}

interface ButtonProps {
    size?:string;
    type?:string;
    style?: React.CSSProperties;
    className?:string;
    onClick:(e: React.MouseEvent<HTMLButtonElement |  HTMLAnchorElement>,...props:any)=>void;
    icon?:React.ReactNode;
}

class Button extends React.Component<ButtonProps,{}> {
    static defaultProps={
        size:'middle',
        type:'primary',
    };
    size:string;
    type:string;
    constructor(props:ButtonProps) {
        super(props);
        this.size=Button.defaultProps.size;
        this.type=Button.defaultProps.type;
    }
    isNeedInserted() {
        const { icon, children } = this.props;
        return React.Children.count(children) === 1 && !icon;
    }
    handleClick: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement> = e => {
        const { onClick } = this.props;
        if (onClick) {
            (onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)(e);
        }
    }
    render() {
       const {size,type,style,className,children}=this.props;
       const prefixCls:string=`button button-${type||this.type}-${size||this.size}`;
       return (
          <button
              className={prefixCls+(className?' '+className:'')}
              onClick={this.handleClick}
              style={style}>
              {React.Children.map(children, child => <span>{child}</span>)}
          </button>
       );
    }
}

export default Button;

